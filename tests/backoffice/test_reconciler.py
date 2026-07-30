"""Tests for the F-10 reconciliation scheduler.

Scenario reproduced: a user or partner row was committed to the DB (step 1 of
create_user/create_partner) but the process crashed before Supabase Auth was
called (step 2). The row has status='active', is older than ORPHAN_AGE_MINUTES,
and has no Supabase Auth account.

The reconciler should detect these rows and mark them status='sync_error'.
"""

from unittest.mock import MagicMock, call, patch

import pytest

from cloud.backoffice.reconciler import (
    ORPHAN_AGE_MINUTES,
    _run_reconciliation,
    _supabase_user_exists,
)


# ── Helpers ───────────────────────────────────────────────────────────────────

def _supabase_found(email: str) -> MagicMock:
    """Mock Supabase response: account EXISTS for this email."""
    resp = MagicMock()
    resp.is_success = True
    resp.json.return_value = {"users": [{"email": email, "id": "sb-uuid"}]}
    return resp


def _supabase_not_found() -> MagicMock:
    """Mock Supabase response: NO account found."""
    resp = MagicMock()
    resp.is_success = True
    resp.json.return_value = {"users": []}
    return resp


def _make_http_client(response: MagicMock) -> MagicMock:
    instance = MagicMock()
    instance.__enter__ = MagicMock(return_value=instance)
    instance.__exit__ = MagicMock(return_value=False)
    instance.get.return_value = response
    return instance


# ── _supabase_user_exists unit tests ─────────────────────────────────────────

def test_supabase_user_exists_returns_true_when_found():
    with patch("cloud.backoffice.reconciler.config") as mock_cfg, \
         patch("cloud.backoffice.reconciler.httpx.Client") as mock_cls:
        mock_cfg.SUPABASE_URL = "https://mock.supabase.co"
        mock_cfg.SUPABASE_SERVICE_ROLE_KEY = "mock-key"
        mock_cls.return_value = _make_http_client(_supabase_found("user@test.com"))

        assert _supabase_user_exists("user@test.com") is True


def test_supabase_user_exists_returns_false_when_not_found():
    with patch("cloud.backoffice.reconciler.config") as mock_cfg, \
         patch("cloud.backoffice.reconciler.httpx.Client") as mock_cls:
        mock_cfg.SUPABASE_URL = "https://mock.supabase.co"
        mock_cfg.SUPABASE_SERVICE_ROLE_KEY = "mock-key"
        mock_cls.return_value = _make_http_client(_supabase_not_found())

        assert _supabase_user_exists("orphan@test.com") is False


def test_supabase_user_exists_returns_true_on_api_error():
    """Conservative: assume exists when we cannot confirm absence."""
    with patch("cloud.backoffice.reconciler.config") as mock_cfg, \
         patch("cloud.backoffice.reconciler.httpx.Client") as mock_cls:
        mock_cfg.SUPABASE_URL = "https://mock.supabase.co"
        mock_cfg.SUPABASE_SERVICE_ROLE_KEY = "mock-key"
        error_resp = MagicMock()
        error_resp.is_success = False
        error_resp.status_code = 503
        mock_cls.return_value = _make_http_client(error_resp)

        assert _supabase_user_exists("user@test.com") is True


def test_supabase_user_exists_returns_true_when_supabase_not_configured():
    """If Supabase creds absent, treat as 'exists' — no false-positive marking."""
    with patch("cloud.backoffice.reconciler.config") as mock_cfg:
        mock_cfg.SUPABASE_URL = ""
        mock_cfg.SUPABASE_SERVICE_ROLE_KEY = ""

        assert _supabase_user_exists("anyone@test.com") is True


# ── F-10 full reconciliation scenario ────────────────────────────────────────

def test_reconciler_marks_user_sync_error_when_no_supabase_account():
    """Core F-10 scenario: user committed to DB, Supabase Auth missing → sync_error."""
    orphaned_user = {
        "id": "aaaaaaaa-0000-0000-0000-000000000001",
        "email": "orphan@tenant.com",
        "tenant_id": "bbbbbbbb-0000-0000-0000-000000000001",
    }

    with patch("cloud.backoffice.reconciler._find_orphaned_users", return_value=[orphaned_user]), \
         patch("cloud.backoffice.reconciler._find_orphaned_partners", return_value=[]), \
         patch("cloud.backoffice.reconciler._supabase_user_exists", return_value=False) as mock_exists, \
         patch("cloud.backoffice.reconciler._mark_sync_error_user") as mock_mark:

        _run_reconciliation()

        mock_exists.assert_called_once_with("orphan@tenant.com")
        mock_mark.assert_called_once_with("aaaaaaaa-0000-0000-0000-000000000001")


def test_reconciler_does_not_mark_user_when_supabase_account_exists():
    """User with Supabase account must NOT be marked sync_error."""
    healthy_user = {
        "id": "cccccccc-0000-0000-0000-000000000001",
        "email": "healthy@tenant.com",
        "tenant_id": "bbbbbbbb-0000-0000-0000-000000000001",
    }

    with patch("cloud.backoffice.reconciler._find_orphaned_users", return_value=[healthy_user]), \
         patch("cloud.backoffice.reconciler._find_orphaned_partners", return_value=[]), \
         patch("cloud.backoffice.reconciler._supabase_user_exists", return_value=True), \
         patch("cloud.backoffice.reconciler._mark_sync_error_user") as mock_mark:

        _run_reconciliation()

        mock_mark.assert_not_called()


def test_reconciler_marks_partner_sync_error_when_admin_has_no_supabase_account():
    """F-10 for create_partner: partner + admin user committed, Supabase call never made."""
    orphaned_partner = {
        "partner_id": "dddddddd-0000-0000-0000-000000000001",
        "tenant_id": "bbbbbbbb-0000-0000-0000-000000000001",
        "admin_email": "admin@partner.com",
    }

    with patch("cloud.backoffice.reconciler._find_orphaned_users", return_value=[]), \
         patch("cloud.backoffice.reconciler._find_orphaned_partners", return_value=[orphaned_partner]), \
         patch("cloud.backoffice.reconciler._supabase_user_exists", return_value=False) as mock_exists, \
         patch("cloud.backoffice.reconciler._mark_sync_error_partner") as mock_mark:

        _run_reconciliation()

        mock_exists.assert_called_once_with("admin@partner.com")
        mock_mark.assert_called_once_with("dddddddd-0000-0000-0000-000000000001")


def test_reconciler_handles_multiple_orphaned_rows():
    """All orphaned rows in a single scan are individually processed."""
    users = [
        {"id": f"user-{i}", "email": f"orphan{i}@test.com", "tenant_id": "t1"}
        for i in range(3)
    ]

    with patch("cloud.backoffice.reconciler._find_orphaned_users", return_value=users), \
         patch("cloud.backoffice.reconciler._find_orphaned_partners", return_value=[]), \
         patch("cloud.backoffice.reconciler._supabase_user_exists", return_value=False), \
         patch("cloud.backoffice.reconciler._mark_sync_error_user") as mock_mark:

        _run_reconciliation()

        assert mock_mark.call_count == 3
        marked_ids = {c.args[0] for c in mock_mark.call_args_list}
        assert marked_ids == {"user-0", "user-1", "user-2"}


def test_reconciler_continues_after_individual_error():
    """Error processing one row must not abort the rest of the scan."""
    users = [
        {"id": "good-user", "email": "good@test.com", "tenant_id": "t1"},
        {"id": "bad-user", "email": "bad@test.com", "tenant_id": "t1"},
    ]
    call_count = 0

    def exists_side_effect(email):
        nonlocal call_count
        call_count += 1
        if email == "bad@test.com":
            raise RuntimeError("simulated transient error")
        return False

    with patch("cloud.backoffice.reconciler._find_orphaned_users", return_value=users), \
         patch("cloud.backoffice.reconciler._find_orphaned_partners", return_value=[]), \
         patch("cloud.backoffice.reconciler._supabase_user_exists", side_effect=exists_side_effect), \
         patch("cloud.backoffice.reconciler._mark_sync_error_user") as mock_mark:

        _run_reconciliation()  # must not raise

        # good-user was processed; bad-user's error was caught and skipped
        mock_mark.assert_called_once_with("good-user")
        assert call_count == 2


def test_reconciler_skips_scan_when_db_unavailable():
    """DB scan failure must not crash the scheduler loop."""
    with patch("cloud.backoffice.reconciler._find_orphaned_users", side_effect=Exception("db down")), \
         patch("cloud.backoffice.reconciler._find_orphaned_partners", side_effect=Exception("db down")), \
         patch("cloud.backoffice.reconciler._mark_sync_error_user") as mock_mark:

        _run_reconciliation()  # must not raise

        mock_mark.assert_not_called()
