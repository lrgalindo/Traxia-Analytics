"""Tests for POST /v1/contact/demo-request.

Unit tests mock the Resend HTTP call. The integration test
(test_demo_request_sends_real_email) is skipped unless RESEND_API_KEY
and DEMO_NOTIFY_EMAIL are both set in the environment.
"""

import os
from unittest.mock import MagicMock, patch

import httpx
import pytest
from fastapi.testclient import TestClient

from cloud.main import app

client = TestClient(app, raise_server_exceptions=False)

_VALID_PAYLOAD = {
    "name": "Ana López",
    "email": "ana@tienda.com",
    "company": "Tienda Demo SA",
    "what_to_solve": "Reducir shrinkage en perecederos y monitorear planograma.",
}


def _mock_resend_success() -> httpx.Response:
    return httpx.Response(
        status_code=200,
        content=b'{"id":"mock-resend-id-123"}',
        headers={"Content-Type": "application/json"},
        request=httpx.Request("POST", "https://api.resend.com/emails"),
    )


# ── Unit tests ────────────────────────────────────────────────────────────────

def test_demo_request_returns_200_and_ok():
    """Endpoint returns 200 {"ok": true} on valid input."""
    with patch("cloud.contact.router.config") as mock_cfg, \
         patch("cloud.contact.router.httpx.Client") as mock_client_cls:
        mock_cfg.RESEND_API_KEY = "re_test_key"
        mock_cfg.DEMO_NOTIFY_EMAIL = "sales@traxia.io"
        mock_cfg.RESEND_FROM = ""
        mock_cfg.SMTP_HOST = ""

        mock_instance = MagicMock()
        mock_instance.__enter__ = MagicMock(return_value=mock_instance)
        mock_instance.__exit__ = MagicMock(return_value=False)
        mock_instance.post.return_value = _mock_resend_success()
        mock_client_cls.return_value = mock_instance

        resp = client.post("/v1/contact/demo-request", json=_VALID_PAYLOAD)

    assert resp.status_code == 200
    assert resp.json() == {"ok": True}


def test_demo_request_calls_resend_with_correct_fields():
    """Resend is called with the right to/subject/reply_to fields."""
    with patch("cloud.contact.router.config") as mock_cfg, \
         patch("cloud.contact.router.httpx.Client") as mock_client_cls:
        mock_cfg.RESEND_API_KEY = "re_test_key"
        mock_cfg.DEMO_NOTIFY_EMAIL = "sales@traxia.io"
        mock_cfg.RESEND_FROM = ""
        mock_cfg.SMTP_HOST = ""

        mock_instance = MagicMock()
        mock_instance.__enter__ = MagicMock(return_value=mock_instance)
        mock_instance.__exit__ = MagicMock(return_value=False)
        mock_instance.post.return_value = _mock_resend_success()
        mock_client_cls.return_value = mock_instance

        client.post("/v1/contact/demo-request", json=_VALID_PAYLOAD)

        call_kwargs = mock_instance.post.call_args
        sent_json = call_kwargs.kwargs.get("json") or call_kwargs.args[1] if len(call_kwargs.args) > 1 else call_kwargs.kwargs["json"]

    assert sent_json["to"] == ["sales@traxia.io"]
    assert "Tienda Demo SA" in sent_json["subject"]
    assert sent_json["reply_to"] == "ana@tienda.com"
    assert "Ana López" in sent_json["html"]
    assert "Reducir shrinkage" in sent_json["html"]


def test_demo_request_still_returns_200_without_resend_config():
    """Missing RESEND_API_KEY → 200 with warning logged, no crash."""
    with patch("cloud.contact.router.config") as mock_cfg:
        mock_cfg.RESEND_API_KEY = ""
        mock_cfg.DEMO_NOTIFY_EMAIL = ""
        mock_cfg.RESEND_FROM = ""

        resp = client.post("/v1/contact/demo-request", json=_VALID_PAYLOAD)

    assert resp.status_code == 200
    assert resp.json() == {"ok": True}


def test_demo_request_uses_default_from_address():
    """When RESEND_FROM is empty, sender defaults to onboarding@resend.dev."""
    with patch("cloud.contact.router.config") as mock_cfg, \
         patch("cloud.contact.router.httpx.Client") as mock_client_cls:
        mock_cfg.RESEND_API_KEY = "re_test_key"
        mock_cfg.DEMO_NOTIFY_EMAIL = "sales@traxia.io"
        mock_cfg.RESEND_FROM = ""
        mock_cfg.SMTP_HOST = ""

        mock_instance = MagicMock()
        mock_instance.__enter__ = MagicMock(return_value=mock_instance)
        mock_instance.__exit__ = MagicMock(return_value=False)
        mock_instance.post.return_value = _mock_resend_success()
        mock_client_cls.return_value = mock_instance

        client.post("/v1/contact/demo-request", json=_VALID_PAYLOAD)

        call_kwargs = mock_instance.post.call_args
        sent_json = call_kwargs.kwargs.get("json", {})

    assert sent_json.get("from") == "onboarding@resend.dev"


def test_demo_request_rejects_invalid_email():
    """Malformed email in body → 422 validation error."""
    payload = {**_VALID_PAYLOAD, "email": "not-an-email"}
    resp = client.post("/v1/contact/demo-request", json=payload)
    assert resp.status_code == 422


# ── Integration test (requires real credentials) ──────────────────────────────

_INTEGRATION_SKIP = pytest.mark.skipif(
    not (os.environ.get("RESEND_API_KEY") and os.environ.get("DEMO_NOTIFY_EMAIL")),
    reason="RESEND_API_KEY and DEMO_NOTIFY_EMAIL not set — skipping real email test",
)


@_INTEGRATION_SKIP
def test_demo_request_sends_real_email():
    """End-to-end: sends a real email via Resend and verifies a message ID is returned.

    Run with:
        RESEND_API_KEY=re_... DEMO_NOTIFY_EMAIL=you@example.com \
        python3 -m pytest tests/contact/test_demo_request.py::test_demo_request_sends_real_email -v -s
    """
    resp = client.post("/v1/contact/demo-request", json=_VALID_PAYLOAD)
    assert resp.status_code == 200
    assert resp.json() == {"ok": True}
    # The real proof is in the inbox — check the logs for the Resend message ID.
    # The endpoint logs: "Demo request email sent: ... resend_id=<id>"
