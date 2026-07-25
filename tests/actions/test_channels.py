"""F-5 regression: meta_cost_usd correctness for channel dispatch().

The invariant: dispatch() returns (bool, None) for every channel type EXCEPT
WhatsApp.  For WhatsApp, it returns (True, cost) on success and (False, None)
on HTTP failure.  Any accidental propagation of cost to Slack/Telegram/Email
would corrupt the billing audit trail.

These are unit tests — HTTP calls are mocked with pytest-monkeypatch so no
external network or DB is needed.

Running:
    pytest tests/actions/test_channels.py -v
"""

import pytest

from cloud.actions.channels import dispatch


# ── Helpers ───────────────────────────────────────────────────────────────────

class _FakeResponse:
    status_code = 200

    def raise_for_status(self):
        pass


class _FakeFailResponse:
    status_code = 500

    def raise_for_status(self):
        raise Exception("HTTP 500")


# ── Non-WhatsApp channels always return (bool, None) ──────────────────────────

def test_slack_dispatch_returns_none_cost(monkeypatch):
    monkeypatch.setattr("httpx.post", lambda *a, **kw: _FakeResponse())
    ok, cost = dispatch("slack", {"webhook_url": "https://hooks.slack.com/x"}, "msg")
    assert ok is True
    assert cost is None, f"Slack must never return a cost; got {cost}"


def test_telegram_dispatch_returns_none_cost(monkeypatch):
    monkeypatch.setattr("httpx.post", lambda *a, **kw: _FakeResponse())
    ok, cost = dispatch(
        "telegram",
        {"bot_token": "tok", "chat_id": "123"},
        "msg",
    )
    assert ok is True
    assert cost is None, f"Telegram must never return a cost; got {cost}"


def test_email_dispatch_returns_none_cost(monkeypatch):
    import smtplib

    class _FakeSMTP:
        def __init__(self, *a, **kw): pass
        def __enter__(self): return self
        def __exit__(self, *a): pass
        def starttls(self): pass
        def login(self, *a): pass
        def sendmail(self, *a): pass

    monkeypatch.setattr(smtplib, "SMTP", _FakeSMTP)
    ok, cost = dispatch(
        "email",
        {
            "smtp_host": "smtp.example.com",
            "smtp_user": "u",
            "smtp_password": "p",
            "to_addresses": ["dest@example.com"],
        },
        "msg",
    )
    assert ok is True
    assert cost is None, f"Email must never return a cost; got {cost}"


# ── WhatsApp: cost propagated on success, None on failure ─────────────────────

def test_whatsapp_success_returns_cost(monkeypatch):
    monkeypatch.setattr("httpx.post", lambda *a, **kw: _FakeResponse())
    channel_cost = 0.045
    ok, cost = dispatch(
        "whatsapp",
        {
            "access_token": "tok",
            "phone_number_id": "12345",
            "to_phone": "+521234567890",
        },
        "msg",
        whatsapp_cost_per_conversation=channel_cost,
    )
    assert ok is True
    assert cost == channel_cost, (
        f"WhatsApp success must return the declared cost; got {cost}"
    )


def test_whatsapp_http_error_returns_none_cost(monkeypatch):
    monkeypatch.setattr("httpx.post", lambda *a, **kw: _FakeFailResponse())
    ok, cost = dispatch(
        "whatsapp",
        {
            "access_token": "tok",
            "phone_number_id": "12345",
            "to_phone": "+521234567890",
        },
        "msg",
        whatsapp_cost_per_conversation=0.045,
    )
    assert ok is False
    assert cost is None, (
        f"WhatsApp failure must return None cost (not propagate); got {cost}"
    )


def test_unknown_channel_returns_false_none(monkeypatch):
    ok, cost = dispatch("carrier_pigeon", {}, "msg")
    assert ok is False
    assert cost is None
