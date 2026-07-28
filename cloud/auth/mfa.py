"""MFA relay — Supabase Auth integration (Sección 3.1 decisión 11d).

MFA is NOT implemented as custom TOTP code — it is delegated entirely to
Supabase Auth.  This module provides a thin relay that:

  1. POST /v1/auth/login  — proxies email+password to Supabase Auth.
     If MFA is required Supabase returns {"error": "mfa_required"} and we
     forward a 401 with {"detail": "mfa_required", "amr_challenge": ...}
     so the client knows to prompt for the second factor.

  2. POST /v1/auth/mfa/verify — proxies the TOTP code verification to
     Supabase Auth (/auth/v1/factors/{factor_id}/verify).
     On success Supabase returns a full session; we return it to the client.

Both endpoints are intentionally stateless — no MFA state is stored here.
Supabase Auth owns the MFA enrollment, TOTP validation, and session issuance.

Configuration:
  SUPABASE_URL         — e.g. https://xxxx.supabase.co
  SUPABASE_ANON_KEY    — public anon key for user-facing calls

Test strategy (tests/lifecycle/test_mfa.py):
  The tests mock the Supabase HTTP responses with httpx.MockTransport so
  they run without a live Supabase project.  They verify that:
  - A password-only login when MFA is enrolled returns 401 mfa_required
  - A successful MFA verification returns the session
"""
import logging
from typing import Any, Dict, Optional

import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

from cloud import config
from cloud.auth.tokens import make_user_token
from cloud.db import service_conn

log = logging.getLogger(__name__)
router = APIRouter(prefix="/v1/auth", tags=["auth-mfa"])


# ── Request / Response models ─────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class MfaVerifyRequest(BaseModel):
    factor_id: str
    challenge_id: str
    code: str          # 6-digit TOTP code


# ── Helpers ───────────────────────────────────────────────────────────────────

def _supabase_headers() -> Dict[str, str]:
    if not config.SUPABASE_URL or not config.SUPABASE_ANON_KEY:
        # Hard fail with an unambiguous message — this is a deployment misconfiguration,
        # NOT a transient service outage.  503 intentional: MFA is unavailable until
        # SUPABASE_URL and SUPABASE_ANON_KEY are set.
        log.error(
            "MFA endpoint called but Supabase is not configured. "
            "Set SUPABASE_URL and SUPABASE_ANON_KEY environment variables. "
            "MFA will remain non-functional until both are present."
        )
        raise HTTPException(
            status_code=503,
            detail={
                "code": "mfa_not_configured",
                "message": (
                    "MFA is not available: SUPABASE_URL or SUPABASE_ANON_KEY is not set. "
                    "This is a deployment configuration gap, not a temporary outage. "
                    "Contact your platform administrator."
                ),
            },
        )
    return {
        "apikey": config.SUPABASE_ANON_KEY,
        "Content-Type": "application/json",
    }


def _supabase_url(path: str) -> str:
    return f"{config.SUPABASE_URL.rstrip('/')}{path}"


# ── (1) Password login — may return mfa_required ─────────────────────────────

@router.post("/login")
def login(body: LoginRequest) -> Dict[str, Any]:
    """Validate email+password via Supabase Auth, then issue our own JWT.

    Supabase handles password validation and MFA. On success we look up the
    user in our users table and sign a JWT with our JWT_SECRET containing
    the tenant context (tid, role, sids) that protected endpoints require.

    Supabase's JWT is intentionally discarded after validation — clients
    receive our JWT, which carries RLS context (tid/role/sids) that Supabase's
    generic JWT cannot provide without a custom claims hook.

    If MFA is enrolled Supabase returns mfa_required; we surface 401 so the
    client can proceed with POST /v1/auth/mfa/verify.
    """
    headers = _supabase_headers()
    with httpx.Client() as client:
        resp = client.post(
            _supabase_url("/auth/v1/token?grant_type=password"),
            headers=headers,
            json={"email": body.email, "password": body.password},
            timeout=10.0,
        )

    data = resp.json()

    # Supabase MFA challenge: HTTP 200 with mfa_required error_code
    # (or HTTP 4xx depending on Supabase version)
    if data.get("error_code") == "mfa_required" or (
        resp.status_code in (400, 401)
        and "mfa" in str(data.get("message", "")).lower()
    ):
        raise HTTPException(
            status_code=401,
            detail={
                "code": "mfa_required",
                "amr_challenge": data.get("data", {}).get("amr_challenge"),
                "factors": data.get("data", {}).get("factors", []),
            },
        )

    if not resp.is_success:
        raise HTTPException(
            status_code=resp.status_code,
            detail=data.get("message") or data.get("error_description") or "login_failed",
        )

    # Supabase validated the password. Exchange for our JWT that carries
    # the tenant context protected endpoints need (tid, role, sids).
    with service_conn() as cur:
        cur.execute(
            """
            SELECT u.id::text, u.tenant_id::text, u.role, u.partner_id::text,
                   array_agg(a.site_id::text) FILTER (WHERE a.site_id IS NOT NULL) AS site_ids
            FROM users u
            LEFT JOIN user_site_assignments a ON a.user_id = u.id
            WHERE u.email = %s AND u.status = 'active'
            GROUP BY u.id, u.tenant_id, u.role, u.partner_id
            """,
            (body.email,),
        )
        user_row = cur.fetchone()

    if user_row is None:
        log.warning("Supabase auth succeeded for %s but user not found or inactive in our DB", body.email)
        raise HTTPException(status_code=403, detail="user_not_provisioned")

    access_token = make_user_token(
        user_id=user_row["id"],
        tenant_id=user_row["tenant_id"],
        role=user_row["role"],
        partner_id=user_row["partner_id"],
        site_ids=user_row["site_ids"] or None,
    )

    return {"access_token": access_token, "token_type": "bearer"}


# ── (2) MFA second-factor verification ───────────────────────────────────────

@router.post("/mfa/verify")
def mfa_verify(body: MfaVerifyRequest) -> Dict[str, Any]:
    """Submit a TOTP code to Supabase Auth and receive the full session.

    The client must first call POST /auth/v1/factors/{factor_id}/challenge
    (directly against Supabase, or through a future /mfa/challenge endpoint)
    to obtain the challenge_id.
    """
    headers = _supabase_headers()
    with httpx.Client() as client:
        resp = client.post(
            _supabase_url(f"/auth/v1/factors/{body.factor_id}/verify"),
            headers=headers,
            json={"challenge_id": body.challenge_id, "code": body.code},
            timeout=10.0,
        )

    data = resp.json()

    if not resp.is_success:
        raise HTTPException(
            status_code=resp.status_code,
            detail=data.get("message") or "mfa_verification_failed",
        )

    return data
