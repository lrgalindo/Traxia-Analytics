"""Backoffice API — tenant admin endpoints (Fase 2).

All endpoints require a tenant admin JWT (require_tenant_admin dependency).
All DB operations run as traxia_app through RLS via user_conn() — no query
bypasses the row-level security policies.

Endpoints:
  POST /v1/backoffice/users               — create user + assign to sites
  GET  /v1/backoffice/users               — list tenant users
  DELETE /v1/backoffice/users/{id}/sites/{site_id} — remove site assignment
  POST /v1/backoffice/partners            — one-step partner creation + admin account
  POST /v1/backoffice/partners/{id}/revoke — manual partner revocation
"""

import logging
from typing import List, Optional

import httpx
import psycopg2
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr

from cloud import config
from cloud.auth.deps import require_tenant_admin
from cloud.backoffice.scheduler import revoke_partner
from cloud.db import user_conn

log = logging.getLogger(__name__)
router = APIRouter(prefix="/v1/backoffice")


def _create_supabase_auth_user(email: str, password: str) -> None:
    """Create a confirmed user in Supabase Auth via the Admin API.

    Uses SUPABASE_SERVICE_ROLE_KEY (server-side only). email_confirm=True so
    the account is immediately active without an email round-trip.

    If Supabase is not configured, logs a warning and returns without error.
    The user will not be able to log in until both env vars are set.
    """
    if not (config.SUPABASE_URL and config.SUPABASE_SERVICE_ROLE_KEY):
        log.warning(
            "Supabase not configured — skipping Auth account creation for %s. "
            "User will not be able to log in until SUPABASE_URL and "
            "SUPABASE_SERVICE_ROLE_KEY are set.",
            email,
        )
        return

    url = f"{config.SUPABASE_URL.rstrip('/')}/auth/v1/admin/users"
    headers = {
        "apikey": config.SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {config.SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json",
    }
    with httpx.Client(timeout=10.0) as client:
        resp = client.post(url, headers=headers, json={
            "email": email,
            "password": password,
            "email_confirm": True,
        })

    if resp.status_code == 422:
        log.info("Supabase Auth user already exists for %s", email)
        return

    if not resp.is_success:
        log.error(
            "Failed to create Supabase Auth user for %s: HTTP %s",
            email, resp.status_code,
        )
        raise HTTPException(
            status_code=502,
            detail="supabase_auth_create_failed",
        )


def _compensate_delete_user(user_id: str) -> None:
    """Delete an orphaned user row after a failed Supabase Auth call.

    Uses a raw psycopg2 connection (session owner = postgres / BYPASSRLS) because
    traxia_app and traxia_service have no DELETE policy on the users table.
    user_site_assignments cascades automatically on delete.
    """
    try:
        conn = psycopg2.connect(config.DATABASE_URL)
        conn.autocommit = True
        with conn.cursor() as cur:
            cur.execute("DELETE FROM users WHERE id = %s", (user_id,))
        conn.close()
        log.info("Compensation: deleted orphaned user row %s", user_id)
    except Exception as exc:
        log.error(
            "COMPENSATION FAILED — orphaned user row id=%s needs manual cleanup: %s",
            user_id, exc,
        )


def _compensate_delete_partner(partner_id: str) -> None:
    """Delete an orphaned partner row after a failed Supabase Auth call.

    Runs as postgres / BYPASSRLS. Cascades to the partner admin user and zones.
    """
    try:
        conn = psycopg2.connect(config.DATABASE_URL)
        conn.autocommit = True
        with conn.cursor() as cur:
            cur.execute("DELETE FROM partners WHERE id = %s", (partner_id,))
        conn.close()
        log.info(
            "Compensation: deleted orphaned partner row %s (cascades to user + zones)",
            partner_id,
        )
    except Exception as exc:
        log.error(
            "COMPENSATION FAILED — orphaned partner row id=%s needs manual cleanup: %s",
            partner_id, exc,
        )


# ── Request / Response models ──────────────────────────────────────────────────

class CreateUserRequest(BaseModel):
    email: EmailStr
    password: str        # initial password; Supabase Auth account is created immediately
    role: str            # 'operator' | 'viewer'
    site_ids: List[str]  # UUIDs of sites to assign (≥1 for operator/viewer)

    model_config = {"json_schema_extra": {"example": {
        "email": "operator@tienda.com",
        "password": "TempPass123!",
        "role": "operator",
        "site_ids": ["c3e20000-0000-0000-0000-000000000001"],
    }}}


class UserResponse(BaseModel):
    user_id: str
    email: str
    role: str
    site_ids: List[str]


class UserListItem(BaseModel):
    user_id: str
    email: str
    role: str
    status: str


class ZoneSpec(BaseModel):
    camera_id: str
    name: str
    zone_type: str = "shelf"
    coordinates: dict


class CreatePartnerRequest(BaseModel):
    name: str
    admin_email: EmailStr
    admin_password: str                     # initial password for the Supabase Auth account
    access_expires_at: Optional[str] = None  # ISO-8601 or None for no expiry
    zones: List[ZoneSpec] = []

    model_config = {"json_schema_extra": {"example": {
        "name": "Proveedor Lácteos SA",
        "admin_email": "admin@lacteos.com",
        "admin_password": "TempPass123!",
        "access_expires_at": "2027-01-01T00:00:00Z",
        "zones": [{
            "camera_id": "d4e2e000-0000-0000-0000-000000000001",
            "name": "Refrigerador Lácteos",
            "zone_type": "shelf",
            "coordinates": {"type": "polygon", "points": [[0,0],[100,0],[100,100],[0,100]]},
        }],
    }}}


class PartnerResponse(BaseModel):
    partner_id: str
    name: str
    admin_user_id: str
    zones_created: int


# ── User management ────────────────────────────────────────────────────────────

@router.post("/users", response_model=UserResponse, status_code=201)
def create_user(
    body: CreateUserRequest,
    token: dict = Depends(require_tenant_admin),
) -> UserResponse:
    """Create an operator or viewer user, assign to sites, and provision Supabase Auth.

    Steps:
    1. DB INSERT in its own transaction (commits when `with` exits).
    2. Supabase Auth account created AFTER the transaction is closed — never inside it.
    3. If Supabase fails: compensate by deleting the local row, then re-raise 502.
       Note: if the process crashes between step 1 commit and step 2 completion,
       the orphaned row is not cleaned up automatically. See docs/AUDIT_FINDINGS.md F-10.
    """
    if body.role not in ("operator", "viewer"):
        raise HTTPException(status_code=422, detail="role must be 'operator' or 'viewer'")
    if not body.site_ids:
        raise HTTPException(status_code=422, detail="at least one site_id is required")

    tenant_id = token["tid"]

    # Step 1: DB transaction — commits when this block exits.
    with user_conn(token) as cur:
        cur.execute(
            """
            INSERT INTO users (tenant_id, email, role, status)
            VALUES (%s, %s, %s, 'active')
            RETURNING id::text AS user_id
            """,
            (tenant_id, body.email, body.role),
        )
        row = cur.fetchone()
        if row is None:
            raise HTTPException(status_code=409, detail="user already exists or RLS denied insert")
        user_id = row["user_id"]

        assigned: List[str] = []
        for site_id in body.site_ids:
            try:
                cur.execute(
                    """
                    INSERT INTO user_site_assignments (user_id, site_id)
                    VALUES (%s, %s)
                    ON CONFLICT DO NOTHING
                    """,
                    (user_id, site_id),
                )
                assigned.append(site_id)
            except Exception as exc:
                log.warning("Site assignment failed for site %s: %s", site_id, exc)
                raise HTTPException(
                    status_code=403,
                    detail=f"site {site_id} not accessible in this tenant or RLS denied",
                )

    # Step 2: Supabase Auth — called after the transaction has committed.
    # On failure: compensate by deleting the local row, then re-raise.
    try:
        _create_supabase_auth_user(body.email, body.password)
    except HTTPException:
        _compensate_delete_user(user_id)
        raise

    return UserResponse(
        user_id=user_id,
        email=body.email,
        role=body.role,
        site_ids=assigned,
    )


@router.get("/users", response_model=List[UserListItem])
def list_users(
    token: dict = Depends(require_tenant_admin),
) -> List[UserListItem]:
    """List all users belonging to this tenant (excluding partner users)."""
    with user_conn(token) as cur:
        cur.execute(
            """
            SELECT id::text AS user_id, email, role, status
            FROM users
            WHERE partner_id IS NULL
            ORDER BY created_at
            """
        )
        rows = cur.fetchall()
    return [
        UserListItem(
            user_id=r["user_id"],
            email=r["email"],
            role=r["role"],
            status=r["status"],
        )
        for r in rows
    ]


@router.delete("/users/{user_id}/sites/{site_id}", status_code=204)
def remove_site_assignment(
    user_id: str,
    site_id: str,
    token: dict = Depends(require_tenant_admin),
) -> None:
    """Remove a site assignment from a user."""
    with user_conn(token) as cur:
        cur.execute(
            "DELETE FROM user_site_assignments WHERE user_id = %s AND site_id = %s",
            (user_id, site_id),
        )


# ── Partner management ─────────────────────────────────────────────────────────

@router.post("/partners", response_model=PartnerResponse, status_code=201)
def create_partner(
    body: CreatePartnerRequest,
    token: dict = Depends(require_tenant_admin),
) -> PartnerResponse:
    """Create a partner, its admin user, and zones — then provision Supabase Auth.

    Flow:
    1. DB transaction: partner + admin user (status='active') + zones — commits.
    2. Supabase Auth account for admin_email — called after the transaction closes.
    3. If Supabase fails: compensate by deleting the partner row (cascades to
       admin user + zones). Re-raise 502.
       Note: crash between step 1 commit and step 2 completion leaves orphaned rows.
       See docs/AUDIT_FINDINGS.md F-10.
    """
    tenant_id = token["tid"]

    with user_conn(token) as cur:
        # 1. Create partner
        if body.access_expires_at:
            cur.execute(
                """
                INSERT INTO partners (tenant_id, name, access_expires_at)
                VALUES (%s, %s, %s::timestamptz)
                RETURNING id::text AS partner_id, name
                """,
                (tenant_id, body.name, body.access_expires_at),
            )
        else:
            cur.execute(
                """
                INSERT INTO partners (tenant_id, name)
                VALUES (%s, %s)
                RETURNING id::text AS partner_id, name
                """,
                (tenant_id, body.name),
            )
        partner_row = cur.fetchone()
        if partner_row is None:
            raise HTTPException(status_code=403, detail="RLS denied partner creation")
        partner_id = partner_row["partner_id"]

        # 2. Create partner admin user (status='active' — Supabase call follows)
        cur.execute(
            """
            INSERT INTO users (tenant_id, partner_id, email, role, status)
            VALUES (%s, %s, %s, 'admin', 'active')
            RETURNING id::text AS user_id
            """,
            (tenant_id, partner_id, body.admin_email),
        )
        user_row = cur.fetchone()
        if user_row is None:
            raise HTTPException(status_code=409, detail="admin user could not be created")
        admin_user_id = user_row["user_id"]

        # 3. Create zones (zones_provision policy: sec_tenant_owns_camera)
        cur.execute("SET LOCAL app.provision_tenant_id = %s", (tenant_id,))
        zones_created = 0
        for z in body.zones:
            try:
                cur.execute(
                    """
                    INSERT INTO zones (camera_id, owner_type, owner_partner_id,
                                       name, zone_type, coordinates)
                    VALUES (%s, 'PARTNER', %s, %s, %s, %s)
                    """,
                    (z.camera_id, partner_id, z.name, z.zone_type,
                     __import__("json").dumps(z.coordinates)),
                )
                zones_created += 1
            except Exception as exc:
                raise HTTPException(
                    status_code=403,
                    detail=f"zone creation denied for camera {z.camera_id}: {exc}",
                )

    # Step 2 of 2: Supabase Auth — after the transaction has committed.
    # On failure: compensate by deleting the partner row (cascades to user + zones).
    try:
        _create_supabase_auth_user(body.admin_email, body.admin_password)
    except HTTPException:
        _compensate_delete_partner(partner_id)
        raise

    log.info(
        "Partner created: id=%s name=%r admin=%s zones=%d tenant=%s",
        partner_id, body.name, body.admin_email, zones_created, tenant_id,
    )

    return PartnerResponse(
        partner_id=partner_id,
        name=body.name,
        admin_user_id=admin_user_id,
        zones_created=zones_created,
    )


@router.post("/partners/{partner_id}/revoke", status_code=200)
def revoke_partner_endpoint(
    partner_id: str,
    token: dict = Depends(require_tenant_admin),
) -> dict:
    """Manually revoke a partner's access (same path as the auto-scheduler).

    Sets partners.status = 'inactive'.  The auto-revocation scheduler calls
    the same revoke_partner() function when access_expires_at is passed.
    """
    tenant_id = token["tid"]
    revoke_partner(partner_id, tenant_id)
    return {"revoked": partner_id}
