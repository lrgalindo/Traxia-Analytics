"""F-10 reconciliation scheduler — detects orphaned users/partners.

An 'orphaned' row is one where status='active' was committed to our DB (step 1
of the create_user/create_partner flow) but the corresponding Supabase Auth
account was never created — because the process crashed between step 1 and
step 2, or because step 2 failed silently without triggering the compensation.

See docs/AUDIT_FINDINGS.md F-10 for the full description of this failure mode.

Resolution strategy:
  - Users/partners older than ORPHAN_AGE_MINUTES with status='active' are
    cross-referenced against Supabase Auth (GET /auth/v1/admin/users?email=).
  - If no Supabase account is found: status is set to 'sync_error'.
  - Rows marked 'sync_error' are excluded from future scans and must be
    resolved manually (re-provision the Supabase account or delete the row).

If SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not configured, the scheduler
starts but skips the Supabase check (logs a warning on each run).

Same horizontal-scale caveat as backoffice/scheduler.py: multiple replicas
will each run the scan independently. The UPDATE WHERE status='active' is
idempotent, so duplicate runs produce the same result.
"""

import logging
import threading
import time

import httpx
import psycopg2
import psycopg2.extras

from cloud import config

log = logging.getLogger(__name__)

CHECK_INTERVAL_SECONDS: int = 60
ORPHAN_AGE_MINUTES: int = 10


# ── Supabase Auth check ───────────────────────────────────────────────────────

def _supabase_user_exists(email: str) -> bool:
    """Return True if a Supabase Auth account exists for this email.

    On any API error, returns True (conservative: do not false-positive mark
    a row as sync_error when we cannot confirm the absence).
    """
    if not config.SUPABASE_URL or not config.SUPABASE_SERVICE_ROLE_KEY:
        log.warning(
            "reconciler: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set — "
            "skipping Supabase Auth check for %s (assuming exists)",
            email,
        )
        return True

    url = f"{config.SUPABASE_URL.rstrip('/')}/auth/v1/admin/users"
    headers = {
        "apikey": config.SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {config.SUPABASE_SERVICE_ROLE_KEY}",
    }
    try:
        with httpx.Client(timeout=10.0) as client:
            resp = client.get(url, headers=headers, params={"email": email, "page": 1, "per_page": 1})
        if not resp.is_success:
            log.warning(
                "reconciler: Supabase Auth API returned HTTP %s for %s — assuming exists",
                resp.status_code, email,
            )
            return True
        return len(resp.json().get("users", [])) > 0
    except Exception as exc:
        log.warning("reconciler: Supabase Auth check failed for %s: %s — assuming exists", email, exc)
        return True


# ── DB helpers ────────────────────────────────────────────────────────────────

def _find_orphaned_users() -> list:
    """SELECT users with status='active' older than ORPHAN_AGE_MINUTES.

    Runs as the DB owner (BYPASSRLS) to see all tenants. Returns a list of
    dicts with id, email, tenant_id.
    """
    conn = psycopg2.connect(config.DATABASE_URL)
    try:
        with conn:
            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                cur.execute(
                    """
                    SELECT id::text AS id, email, tenant_id::text AS tenant_id
                    FROM users
                    WHERE status = 'active'
                      AND created_at < now() - interval '%s minutes'
                    """,
                    (ORPHAN_AGE_MINUTES,),
                )
                return list(cur.fetchall())
    finally:
        conn.close()


def _find_orphaned_partners() -> list:
    """SELECT partners with status='active' older than ORPHAN_AGE_MINUTES.

    Joins to the partner admin user to get the email for Supabase Auth lookup.
    Returns dicts with partner_id, admin_email, tenant_id.
    """
    conn = psycopg2.connect(config.DATABASE_URL)
    try:
        with conn:
            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                cur.execute(
                    """
                    SELECT p.id::text AS partner_id,
                           p.tenant_id::text AS tenant_id,
                           u.email AS admin_email
                    FROM partners p
                    JOIN users u ON u.partner_id = p.id AND u.role = 'admin'
                    WHERE p.status = 'active'
                      AND p.created_at < now() - interval '%s minutes'
                    """,
                    (ORPHAN_AGE_MINUTES,),
                )
                return list(cur.fetchall())
    finally:
        conn.close()


def _mark_sync_error_user(user_id: str) -> None:
    """SET users.status = 'sync_error' for the given user_id."""
    conn = psycopg2.connect(config.DATABASE_URL)
    conn.autocommit = True
    try:
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE users SET status = 'sync_error' WHERE id = %s AND status = 'active'",
                (user_id,),
            )
        log.warning(
            "reconciler: user %s marked sync_error — no Supabase Auth account found after %d min",
            user_id, ORPHAN_AGE_MINUTES,
        )
    finally:
        conn.close()


def _mark_sync_error_partner(partner_id: str) -> None:
    """SET partners.status = 'sync_error' for the given partner_id."""
    conn = psycopg2.connect(config.DATABASE_URL)
    conn.autocommit = True
    try:
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE partners SET status = 'sync_error' WHERE id = %s AND status = 'active'",
                (partner_id,),
            )
        log.warning(
            "reconciler: partner %s marked sync_error — admin has no Supabase Auth account after %d min",
            partner_id, ORPHAN_AGE_MINUTES,
        )
    finally:
        conn.close()


# ── Main reconciliation cycle ─────────────────────────────────────────────────

def _run_reconciliation() -> None:
    """Single reconciliation cycle: scan users then partners."""
    # Users
    try:
        candidates = _find_orphaned_users()
    except Exception as exc:
        log.error("reconciler: user scan failed: %s", exc)
        candidates = []

    for row in candidates:
        try:
            if not _supabase_user_exists(row["email"]):
                _mark_sync_error_user(row["id"])
        except Exception as exc:
            log.error("reconciler: error processing user %s: %s", row["id"], exc)

    # Partners (checked independently via their admin user's email)
    try:
        partner_candidates = _find_orphaned_partners()
    except Exception as exc:
        log.error("reconciler: partner scan failed: %s", exc)
        partner_candidates = []

    for row in partner_candidates:
        try:
            if not _supabase_user_exists(row["admin_email"]):
                _mark_sync_error_partner(row["partner_id"])
        except Exception as exc:
            log.error("reconciler: error processing partner %s: %s", row["partner_id"], exc)

    if candidates or partner_candidates:
        log.info(
            "reconciler: scanned %d user(s) and %d partner(s) older than %d min",
            len(candidates), len(partner_candidates), ORPHAN_AGE_MINUTES,
        )


def start_reconciliation_scheduler() -> None:
    """Start the background F-10 reconciliation thread.

    Daemonized — does not block process shutdown. Runs once per
    CHECK_INTERVAL_SECONDS (same cadence as the revocation scheduler).
    """
    def _loop() -> None:
        log.info(
            "F-10 reconciliation scheduler started (interval=%ds, orphan_age=%dmin)",
            CHECK_INTERVAL_SECONDS, ORPHAN_AGE_MINUTES,
        )
        while True:
            time.sleep(CHECK_INTERVAL_SECONDS)
            _run_reconciliation()

    t = threading.Thread(target=_loop, daemon=True, name="f10-reconciler")
    t.start()
