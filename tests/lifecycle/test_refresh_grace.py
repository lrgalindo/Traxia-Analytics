"""F-4 regression: 3-step grace-window sequence for refresh token rotation.

The grace-window allows a client that lost the HTTP response from /refresh to
retry with the old token once.  The sequence must be exactly:

  Step 1: /refresh with T0 → succeeds, issues T1, saves T0 in prev_hash
  Step 2: /refresh with T0 again (simulated lost response) → succeeds (grace),
          issues T2, clears prev_hash (consumed)
  Step 3: /refresh with T0 again → fails (prev_hash is NULL now, grace consumed)

This test is additive (no DB schema changes) and requires a real PostgreSQL DB.

Running:
    DATABASE_URL=postgresql://rodrigogalindo@localhost:5432/traxia \\
    pytest tests/lifecycle/test_refresh_grace.py -v
"""

import os
import uuid
from typing import Generator

import psycopg2
import psycopg2.extras
import pytest
from fastapi.testclient import TestClient

from cloud.auth.tokens import new_opaque_token, sha256_hex
from cloud.main import app

_DB_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://rodrigogalindo@localhost:5432/traxia",
)

client = TestClient(app, raise_server_exceptions=False)


def _uid() -> str:
    return str(uuid.uuid4())


@pytest.fixture(scope="module")
def db() -> Generator[psycopg2.extras.RealDictCursor, None, None]:
    conn = psycopg2.connect(_DB_URL, cursor_factory=psycopg2.extras.RealDictCursor)
    conn.autocommit = False
    cur = conn.cursor()
    yield cur
    conn.rollback()
    conn.close()


@pytest.fixture(scope="module")
def grace_seed(db: psycopg2.extras.RealDictCursor):
    """Committed rows: active tenant + site + online gateway with T0 refresh token."""
    reseller_id = _uid()
    tenant_id = _uid()
    site_id = _uid()
    gw_id = f"gw-grace-{_uid()[:8]}"
    t0_plain, t0_hash = new_opaque_token()

    db.execute(
        "INSERT INTO resellers (id, name, status) VALUES (%s, %s, 'active')",
        (reseller_id, f"Grace Reseller {reseller_id[:8]}"),
    )
    db.execute(
        "INSERT INTO tenants (id, reseller_id, name, vertical_type, status, contact_email) "
        "VALUES (%s, %s, 'Grace Tenant', 'retail', 'active', 'grace@test.com')",
        (tenant_id, reseller_id),
    )
    db.execute(
        "INSERT INTO sites (id, tenant_id, name, status) VALUES (%s, %s, 'Grace Site', 'active')",
        (site_id, tenant_id),
    )
    db.execute(
        """
        INSERT INTO edge_gateways
            (id, site_id, vertical_type, status,
             refresh_token_hash, refresh_token_expires_at)
        VALUES (%s, %s, 'retail', 'online', %s, now() + interval '90 days')
        """,
        (gw_id, site_id, t0_hash),
    )
    db.connection.commit()

    yield {"gw_id": gw_id, "t0_plain": t0_plain, "t0_hash": t0_hash}

    db.execute("DELETE FROM edge_gateways WHERE id = %s", (gw_id,))
    db.execute("DELETE FROM sites WHERE id = %s", (site_id,))
    db.execute("DELETE FROM tenants WHERE id = %s", (tenant_id,))
    db.execute("DELETE FROM resellers WHERE id = %s", (reseller_id,))
    db.connection.commit()


def test_grace_window_three_step_sequence(
    db: psycopg2.extras.RealDictCursor,
    grace_seed: dict,
):
    """Full 3-step grace-window regression (F-4).

    All three steps run in sequence inside one test so intermediate state
    (T1_plain, prev_hash) is passed between steps without shared mutable state.
    """
    gw_id = grace_seed["gw_id"]
    t0_plain = grace_seed["t0_plain"]

    # ── Step 1: normal refresh with T0 → issues T1, T0 saved as prev_hash ────
    resp1 = client.post(
        "/v1/edge/token/refresh",
        json={"gateway_id": gw_id, "refresh_token": t0_plain},
    )
    assert resp1.status_code == 200, f"Step 1 failed: {resp1.text}"
    t1_plain = resp1.json()["refresh_token"]

    db.execute(
        "SELECT refresh_token_prev_hash FROM edge_gateways WHERE id = %s",
        (gw_id,),
    )
    row = db.fetchone()
    assert row["refresh_token_prev_hash"] == sha256_hex(t0_plain), \
        "After step 1: T0 hash must be saved as refresh_token_prev_hash"

    # ── Step 2: retry with T0 (simulated lost response) → grace, issues T2 ──
    resp2 = client.post(
        "/v1/edge/token/refresh",
        json={"gateway_id": gw_id, "refresh_token": t0_plain},
    )
    assert resp2.status_code == 200, (
        f"Step 2 (grace retry) failed: {resp2.text} — "
        "prev_hash should still match T0 within grace window"
    )
    t2_plain = resp2.json()["refresh_token"]
    assert t2_plain != t1_plain, "Step 2 must issue a new token (T2 != T1)"

    db.execute(
        "SELECT refresh_token_prev_hash FROM edge_gateways WHERE id = %s",
        (gw_id,),
    )
    row = db.fetchone()
    assert row["refresh_token_prev_hash"] is None, \
        "After step 2: prev_hash must be NULL (grace window consumed)"

    # ── Step 3: third attempt with T0 → must fail (grace consumed) ───────────
    resp3 = client.post(
        "/v1/edge/token/refresh",
        json={"gateway_id": gw_id, "refresh_token": t0_plain},
    )
    assert resp3.status_code == 401, (
        f"Step 3 must fail (grace consumed); got {resp3.status_code}"
    )
