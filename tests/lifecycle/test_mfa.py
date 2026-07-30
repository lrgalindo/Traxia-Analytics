"""MFA relay tests (Sección 3.1 decisión 11d).

MFA is delegated entirely to Supabase Auth — no custom TOTP code.
These tests mock the Supabase HTTP calls with httpx mock transport so they
run without a live Supabase project.

Running:
    pytest tests/lifecycle/test_mfa.py -v

Coverage:
  - Login when MFA is enrolled → 401 with code=mfa_required
  - Successful TOTP verify → session returned to client
  - Wrong TOTP code → 401 from Supabase propagated to client
  - SUPABASE_URL not set → 503 service unavailable
"""

import json
from typing import Optional
from unittest.mock import MagicMock, patch

import httpx
import pytest
from fastapi.testclient import TestClient

from cloud.main import app

client = TestClient(app, raise_server_exceptions=False)


# ── httpx mock helpers ────────────────────────────────────────────────────────

def _make_response(status_code: int, body: dict) -> httpx.Response:
    return httpx.Response(
        status_code=status_code,
        content=json.dumps(body).encode(),
        headers={"Content-Type": "application/json"},
        request=httpx.Request("POST", "https://mock.supabase.co/auth/v1/token"),
    )


# ── Supabase env patching ─────────────────────────────────────────────────────

_SUPABASE_ENV = {
    "SUPABASE_URL": "https://mock.supabase.co",
    "SUPABASE_ANON_KEY": "mock-anon-key",
}


# ── Tests: POST /v1/auth/login ────────────────────────────────────────────────

def test_login_mfa_required_returns_401():
    """When Supabase returns mfa_required, relay must respond with 401."""
    supabase_resp = _make_response(
        200,
        {
            "error_code": "mfa_required",
            "message": "MFA challenge required",
            "data": {
                "factors": [{"id": "factor-123", "type": "totp"}],
                "amr_challenge": {"id": "challenge-abc"},
            },
        },
    )
    with patch("cloud.auth.mfa.config") as mock_cfg, \
         patch("cloud.auth.mfa.httpx.Client") as mock_client_cls:
        mock_cfg.SUPABASE_URL = "https://mock.supabase.co"
        mock_cfg.SUPABASE_ANON_KEY = "mock-anon-key"
        mock_instance = MagicMock()
        mock_instance.__enter__ = MagicMock(return_value=mock_instance)
        mock_instance.__exit__ = MagicMock(return_value=False)
        mock_instance.post.return_value = supabase_resp
        mock_client_cls.return_value = mock_instance

        resp = client.post(
            "/v1/auth/login",
            json={"email": "user@test.com", "password": "password123"},
        )

    assert resp.status_code == 401
    body = resp.json()
    # FastAPI wraps HTTPException detail in {"detail": ...}
    detail = body.get("detail", {})
    assert detail.get("code") == "mfa_required"


def test_login_success_without_mfa():
    """Supabase validates password; we issue our own JWT with tenant context."""
    import jwt as pyjwt
    session = {
        "access_token": "sb-access-token",
        "refresh_token": "sb-refresh-token",
        "user": {"id": "sb-user-id", "email": "user@test.com"},
    }
    supabase_resp = _make_response(200, session)

    mock_user_row = {
        "id": "00000000-0000-0000-0000-000000000001",
        "tenant_id": "00000000-0000-0000-0000-000000000002",
        "role": "admin",
        "partner_id": None,
        "site_ids": None,
    }

    with patch("cloud.auth.mfa.config") as mock_cfg, \
         patch("cloud.auth.mfa.httpx.Client") as mock_client_cls, \
         patch("cloud.auth.mfa.service_conn") as mock_conn:
        mock_cfg.SUPABASE_URL = "https://mock.supabase.co"
        mock_cfg.SUPABASE_ANON_KEY = "mock-anon-key"
        mock_cfg.JWT_SECRET = "test-secret"
        mock_cfg.JWT_ALGORITHM = "HS256"
        mock_cfg.ACCESS_TOKEN_TTL_HOURS = 24

        mock_instance = MagicMock()
        mock_instance.__enter__ = MagicMock(return_value=mock_instance)
        mock_instance.__exit__ = MagicMock(return_value=False)
        mock_instance.post.return_value = supabase_resp
        mock_client_cls.return_value = mock_instance

        mock_cur = MagicMock()
        mock_cur.fetchone.return_value = mock_user_row
        mock_ctx = MagicMock()
        mock_ctx.__enter__ = MagicMock(return_value=mock_cur)
        mock_ctx.__exit__ = MagicMock(return_value=False)
        mock_conn.return_value = mock_ctx

        resp = client.post(
            "/v1/auth/login",
            json={"email": "user@test.com", "password": "password123"},
        )

    assert resp.status_code == 200
    body = resp.json()
    # We issue our JWT, not Supabase's
    assert "access_token" in body
    assert body.get("token_type") == "bearer"
    # The Supabase token must NOT be returned
    assert body.get("access_token") != "sb-access-token"


def test_login_wrong_password_propagates_error():
    """Supabase 400 for wrong password is propagated as 400."""
    supabase_resp = _make_response(
        400,
        {"message": "Invalid login credentials", "error": "invalid_grant"},
    )
    with patch("cloud.auth.mfa.config") as mock_cfg, \
         patch("cloud.auth.mfa.httpx.Client") as mock_client_cls:
        mock_cfg.SUPABASE_URL = "https://mock.supabase.co"
        mock_cfg.SUPABASE_ANON_KEY = "mock-anon-key"
        mock_instance = MagicMock()
        mock_instance.__enter__ = MagicMock(return_value=mock_instance)
        mock_instance.__exit__ = MagicMock(return_value=False)
        mock_instance.post.return_value = supabase_resp
        mock_client_cls.return_value = mock_instance

        resp = client.post(
            "/v1/auth/login",
            json={"email": "user@test.com", "password": "wrongpass"},
        )

    assert resp.status_code == 400


def test_login_503_when_supabase_not_configured():
    """Without SUPABASE_URL/ANON_KEY, endpoint returns 503 with an unambiguous config-gap message."""
    with patch("cloud.auth.mfa.config") as mock_cfg:
        mock_cfg.SUPABASE_URL = ""
        mock_cfg.SUPABASE_ANON_KEY = ""

        resp = client.post(
            "/v1/auth/login",
            json={"email": "user@test.com", "password": "password123"},
        )

    assert resp.status_code == 503
    body = resp.json()
    detail = body.get("detail", {})
    # Must be clearly "not configured" (deployment gap), not generic "unavailable"
    assert detail.get("code") == "mfa_not_configured"
    assert "SUPABASE_URL" in detail.get("message", "")


# ── Tests: OAuth social login ─────────────────────────────────────────────────

def test_oauth_authorize_returns_supabase_url_for_google():
    """GET /oauth/authorize?provider=google returns a Supabase authorize URL."""
    with patch("cloud.auth.mfa.config") as mock_cfg:
        mock_cfg.SUPABASE_URL = "https://mock.supabase.co"
        mock_cfg.SUPABASE_ANON_KEY = "mock-anon-key"

        resp = client.get(
            "/v1/auth/oauth/authorize",
            params={"provider": "google", "redirect_to": "https://app.example.com/callback"},
        )

    assert resp.status_code == 200
    body = resp.json()
    assert "url" in body
    assert "mock.supabase.co/auth/v1/authorize" in body["url"]
    assert "provider=google" in body["url"]
    assert "redirect_to=" in body["url"]


def test_oauth_authorize_maps_microsoft_to_azure():
    """Microsoft provider must be sent to Supabase as 'azure'."""
    with patch("cloud.auth.mfa.config") as mock_cfg:
        mock_cfg.SUPABASE_URL = "https://mock.supabase.co"
        mock_cfg.SUPABASE_ANON_KEY = "mock-anon-key"

        resp = client.get(
            "/v1/auth/oauth/authorize",
            params={"provider": "microsoft", "redirect_to": "https://app.example.com/callback"},
        )

    assert resp.status_code == 200
    body = resp.json()
    assert "provider=azure" in body["url"]
    assert "provider=microsoft" not in body["url"]


def test_oauth_authorize_rejects_unknown_provider():
    """Unknown provider → 422."""
    with patch("cloud.auth.mfa.config") as mock_cfg:
        mock_cfg.SUPABASE_URL = "https://mock.supabase.co"
        mock_cfg.SUPABASE_ANON_KEY = "mock-anon-key"

        resp = client.get(
            "/v1/auth/oauth/authorize",
            params={"provider": "github", "redirect_to": "https://app.example.com/callback"},
        )

    assert resp.status_code == 422


def test_oauth_exchange_issues_our_jwt_not_supabase_token():
    """Successful PKCE exchange → our JWT with tenant context, Supabase token discarded."""
    import jwt as pyjwt

    supabase_session = {
        "access_token": "sb-oauth-access-token",
        "refresh_token": "sb-oauth-refresh-token",
        "user": {"id": "sb-user-id", "email": "user@test.com"},
    }
    supabase_resp = _make_response(200, supabase_session)

    mock_user_row = {
        "id": "00000000-0000-0000-0000-000000000001",
        "tenant_id": "00000000-0000-0000-0000-000000000002",
        "role": "admin",
        "partner_id": None,
        "site_ids": None,
    }

    with patch("cloud.auth.mfa.config") as mock_cfg, \
         patch("cloud.auth.mfa.httpx.Client") as mock_client_cls, \
         patch("cloud.auth.mfa.service_conn") as mock_conn:
        mock_cfg.SUPABASE_URL = "https://mock.supabase.co"
        mock_cfg.SUPABASE_ANON_KEY = "mock-anon-key"
        mock_cfg.JWT_SECRET = "test-secret"
        mock_cfg.JWT_ALGORITHM = "HS256"
        mock_cfg.ACCESS_TOKEN_TTL_HOURS = 24

        mock_instance = MagicMock()
        mock_instance.__enter__ = MagicMock(return_value=mock_instance)
        mock_instance.__exit__ = MagicMock(return_value=False)
        mock_instance.post.return_value = supabase_resp
        mock_client_cls.return_value = mock_instance

        mock_cur = MagicMock()
        mock_cur.fetchone.return_value = mock_user_row
        mock_ctx = MagicMock()
        mock_ctx.__enter__ = MagicMock(return_value=mock_cur)
        mock_ctx.__exit__ = MagicMock(return_value=False)
        mock_conn.return_value = mock_ctx

        resp = client.post(
            "/v1/auth/oauth/exchange",
            json={"code": "auth-code-from-supabase", "code_verifier": "pkce-verifier"},
        )

    assert resp.status_code == 200
    body = resp.json()
    assert "access_token" in body
    assert body.get("token_type") == "bearer"
    # Supabase's own token must not be returned
    assert body.get("access_token") != "sb-oauth-access-token"
    # Decode claims without verifying signature — make_user_token uses the real
    # JWT_SECRET from cloud.auth.tokens.config (not the patched mfa.config).
    # We care that the right claims are present, not about the signing key here.
    payload = pyjwt.decode(
        body["access_token"], options={"verify_signature": False}
    )
    assert payload["sub"] == "00000000-0000-0000-0000-000000000001"
    assert payload["tid"] == "00000000-0000-0000-0000-000000000002"
    assert payload["role"] == "admin"


def test_oauth_exchange_403_when_user_not_provisioned():
    """OAuth succeeds with Supabase but user has no row in our users table → 403."""
    supabase_session = {
        "access_token": "sb-token",
        "user": {"id": "sb-user-id", "email": "unknown@test.com"},
    }
    supabase_resp = _make_response(200, supabase_session)

    with patch("cloud.auth.mfa.config") as mock_cfg, \
         patch("cloud.auth.mfa.httpx.Client") as mock_client_cls, \
         patch("cloud.auth.mfa.service_conn") as mock_conn:
        mock_cfg.SUPABASE_URL = "https://mock.supabase.co"
        mock_cfg.SUPABASE_ANON_KEY = "mock-anon-key"

        mock_instance = MagicMock()
        mock_instance.__enter__ = MagicMock(return_value=mock_instance)
        mock_instance.__exit__ = MagicMock(return_value=False)
        mock_instance.post.return_value = supabase_resp
        mock_client_cls.return_value = mock_instance

        mock_cur = MagicMock()
        mock_cur.fetchone.return_value = None  # not in our DB
        mock_ctx = MagicMock()
        mock_ctx.__enter__ = MagicMock(return_value=mock_cur)
        mock_ctx.__exit__ = MagicMock(return_value=False)
        mock_conn.return_value = mock_ctx

        resp = client.post(
            "/v1/auth/oauth/exchange",
            json={"code": "some-code", "code_verifier": "some-verifier"},
        )

    assert resp.status_code == 403
    assert resp.json().get("detail") == "user_not_provisioned"


def test_oauth_exchange_propagates_supabase_error():
    """Supabase PKCE exchange failure is propagated to the client."""
    error_resp = _make_response(400, {"message": "invalid_grant", "error": "bad_oauth_state"})

    with patch("cloud.auth.mfa.config") as mock_cfg, \
         patch("cloud.auth.mfa.httpx.Client") as mock_client_cls:
        mock_cfg.SUPABASE_URL = "https://mock.supabase.co"
        mock_cfg.SUPABASE_ANON_KEY = "mock-anon-key"

        mock_instance = MagicMock()
        mock_instance.__enter__ = MagicMock(return_value=mock_instance)
        mock_instance.__exit__ = MagicMock(return_value=False)
        mock_instance.post.return_value = error_resp
        mock_client_cls.return_value = mock_instance

        resp = client.post(
            "/v1/auth/oauth/exchange",
            json={"code": "bad-code", "code_verifier": "bad-verifier"},
        )

    assert resp.status_code == 400


# ── Tests: POST /v1/auth/mfa/verify ──────────────────────────────────────────

def test_mfa_verify_valid_totp_returns_session():
    """Valid TOTP code → Supabase session is returned to the client."""
    session = {
        "access_token": "sb-mfa-access-token",
        "refresh_token": "sb-mfa-refresh-token",
        "user": {"id": "user-id"},
    }
    supabase_resp = _make_response(200, session)
    supabase_resp = httpx.Response(
        status_code=200,
        content=json.dumps(session).encode(),
        headers={"Content-Type": "application/json"},
        request=httpx.Request(
            "POST",
            "https://mock.supabase.co/auth/v1/factors/factor-123/verify",
        ),
    )

    with patch("cloud.auth.mfa.config") as mock_cfg, \
         patch("cloud.auth.mfa.httpx.Client") as mock_client_cls:
        mock_cfg.SUPABASE_URL = "https://mock.supabase.co"
        mock_cfg.SUPABASE_ANON_KEY = "mock-anon-key"
        mock_instance = MagicMock()
        mock_instance.__enter__ = MagicMock(return_value=mock_instance)
        mock_instance.__exit__ = MagicMock(return_value=False)
        mock_instance.post.return_value = supabase_resp
        mock_client_cls.return_value = mock_instance

        resp = client.post(
            "/v1/auth/mfa/verify",
            json={
                "factor_id": "factor-123",
                "challenge_id": "challenge-abc",
                "code": "123456",
            },
        )

    assert resp.status_code == 200
    body = resp.json()
    assert body.get("access_token") == "sb-mfa-access-token"


def test_mfa_verify_wrong_code_returns_401():
    """Wrong TOTP code → Supabase 401 is propagated to client."""
    error_resp = httpx.Response(
        status_code=401,
        content=json.dumps({"message": "Invalid TOTP code"}).encode(),
        headers={"Content-Type": "application/json"},
        request=httpx.Request(
            "POST",
            "https://mock.supabase.co/auth/v1/factors/factor-123/verify",
        ),
    )

    with patch("cloud.auth.mfa.config") as mock_cfg, \
         patch("cloud.auth.mfa.httpx.Client") as mock_client_cls:
        mock_cfg.SUPABASE_URL = "https://mock.supabase.co"
        mock_cfg.SUPABASE_ANON_KEY = "mock-anon-key"
        mock_instance = MagicMock()
        mock_instance.__enter__ = MagicMock(return_value=mock_instance)
        mock_instance.__exit__ = MagicMock(return_value=False)
        mock_instance.post.return_value = error_resp
        mock_client_cls.return_value = mock_instance

        resp = client.post(
            "/v1/auth/mfa/verify",
            json={
                "factor_id": "factor-123",
                "challenge_id": "challenge-abc",
                "code": "000000",
            },
        )

    assert resp.status_code == 401
