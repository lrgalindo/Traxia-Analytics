# Rescue Commit Audit — Open Findings

Branch audited: `claude/recover-untracked-source` (rescue commit `cfee689`)
Audit date: 2026-07-24/25
Scope: all modules in `edge/` and `cloud/` (14 files, 4 test suites)

Findings are ordered by the priority established at the close of the audit session.
"Lote de cierre" = the batch of fixes to land before this branch can merge.

---

## Tier 1 — Fixes required before merge (real gaps, not missing tests)

### F-1: Gateway re-approval does not revoke the existing refresh token

**File:** `cloud/lifecycle/router.py` — `approve_tenant()`, the `ON CONFLICT DO UPDATE` clause  
**Severity:** High — active security gap  
**Status:** Open

When `POST /v1/superadmin/tenants/{id}/approve` is called with a `gateway_id` that already
exists (the hardware-replacement scenario described in SDD §8.7 Flow 7), the
`ON CONFLICT (id) DO UPDATE` only rotates the activation code:

```sql
ON CONFLICT (id) DO UPDATE
   SET activation_code_hash       = EXCLUDED.activation_code_hash,
       activation_code_expires_at = EXCLUDED.activation_code_expires_at,
       status                     = 'offline'
```

`refresh_token_hash`, `refresh_token_prev_hash`, `refresh_token_expires_at`, and
`refresh_token_prev_expires_at` are **not touched**. A gateway that was `'online'` before
re-approval keeps its live refresh token — and `/refresh` only blocks
`status NOT IN ('revoked', 'decommissioned')`, so `'offline'` does not block it.
The compromised or replaced device retains valid access for up to 90 days.

**Fix:** Add to the `DO UPDATE`:
```sql
refresh_token_hash            = NULL,
refresh_token_prev_hash       = NULL,
refresh_token_expires_at      = NULL,
refresh_token_prev_expires_at = NULL,
```
Same pattern already used by `deactivate_tenant()` in the same file.

---

### F-2: `GET /cameras` and `GET /cameras/{id}/snapshot` reference columns that do not exist

**File:** `cloud/analytics/router.py` — `list_cameras()` line 108, `get_snapshot()` line 122  
**Severity:** High — runtime crash on any call to these endpoints  
**Status:** Open — design decision required

`list_cameras()` selects `stream_url` from `cameras`; `get_snapshot()` selects
`snapshot_url`. Neither column exists in any migration in any branch. The schema
has only `rtsp_url_ciphertext BYTEA` and `rtsp_url_key_id TEXT`.

This is not a missing migration — it is code written against a model of the
`cameras` table that was never designed. Both endpoints throw
`psycopg2.errors.UndefinedColumn` at runtime.

**Correct approach (established at audit close):**
- `list_cameras()`: return safe metadata only (id, name, site_id, status). No URL field.
  Live stream access is a separate design conversation.
- `get_snapshot()`: rewrite to follow the R2 pre-signed URL pattern already implemented
  in `findings/router.py::_presign_snapshot()`. A snapshot is an on-demand fetch from
  object storage, not a static column on the cameras row.

---

### F-3: Migration 0011 (`usa_write`/`usa_delete` fix) — verify runs clean post-renumber

**File:** `alembic/versions/0011_fix_usa_user_tenant_check.py`  
**Severity:** Medium — fix exists and is correct; needs runtime confirmation  
**Status:** Pending verification

The cross-tenant user assignment bug (Gap 7 from the initial audit) was fixed in migration
`0010`, then renumbered to `0011` after discovering that `fase-a-hardening` already has a
`0010_superadmin_password_hash.py`. The fix content is correct; `down_revision = "0010"`
correctly points to the superadmin migration as predecessor.

Before declaring this closed: run `alembic upgrade head` against a local DB that has
both branches' migrations applied in order (fase-a-hardening first) and confirm
`alembic current` shows `0011` with no errors.

pgTAP regression tests are already written (tests 14 and 15 in
`tests/backoffice/01_rls_backoffice.sql`).

---

## Tier 2 — Tests required before merge (mechanisms are correct; no regression guard)

### F-4: Grace-window retry path has no regression test

**File:** `cloud/auth/router.py` — `refresh()` endpoint, `refresh_token_prev_hash` logic  
**Severity:** High (mechanism complexity warrants coverage)  
**Status:** Open

The grace-window is the most complex invariant in the token system and the one most
likely to break under future refactors. No test exercises the full sequence:

1. First `/refresh` with token T₀ → succeeds, issues T₁, saves T₀ in `prev_hash`
2. Simulated lost response: retry `/refresh` with T₀ again → must succeed (grace window active)
3. Third attempt with T₀ → must fail (prev_hash consumed on step 2)

Test location: create `tests/lifecycle/test_refresh_grace.py` (requires real DB).

---

### F-5: `meta_cost_usd` correctness has no regression test

**File:** `cloud/actions/channels.py`, `cloud/actions/engine.py`  
**Severity:** High (financial audit trail — silent breakage has billing consequences)  
**Status:** Open

The mechanism that populates `action_log.meta_cost_usd` only for WhatsApp (never for
Slack/Telegram/Email) is correct today but unguarded. If `channels.py` is modified
and the cost accidentally propagates to other channel types (or stops propagating for
WhatsApp), no test will catch it until billing reconciliation with Meta fails.

Tests needed:
- `dispatch("slack", ...)` → returns `(bool, None)`
- `dispatch("telegram", ...)` → returns `(bool, None)`
- `dispatch("email", ...)` → returns `(bool, None)`
- `dispatch("whatsapp", ..., cost=0.045)` on success → returns `(True, 0.045)`
- `dispatch("whatsapp", ..., cost=0.045)` on HTTP error → returns `(False, None)`
- `POST /v1/actions/channels` with `channel_type="whatsapp"` and no cost → 422
- `action_log.meta_cost_usd IS NULL` for Slack dispatch, `= cost` for WhatsApp dispatch

---

### F-6: Cross-site ingest injection has no regression test

**File:** `cloud/telemetry/router.py`, `alembic/versions/0004_ingest_sec_definer.py`  
**Severity:** High (core isolation invariant)  
**Status:** Open

The `tracking_coordinates_ingest` RLS policy (via `sec_camera_on_ingest_site()`) correctly
blocks an Edge Gateway from injecting events with a `camera_id` belonging to a different
site. This is verified in code but not in any automated test.

Test needed: attempt `POST /v1/telemetry/ingest` with a valid gateway JWT for site A but
a `camera_id` belonging to site B. Expected: the INSERT is silently blocked by the DB
(`ON CONFLICT DO NOTHING` semantics from the RLS rejection), resulting in 0 new rows for
that `camera_id` in `tracking_coordinates`.

---

### F-7: `_require_gateway_token` duplicated in three routers — unify in `deps.py`

**Files:** `cloud/actions/router.py` (also has `_require_admin`), `cloud/models/router.py`,
`cloud/telemetry/router.py`  
**Severity:** Medium-High (divergence risk; token type validation absent)  
**Status:** Open

Three routers implement their own `jwt.decode()` instead of importing from `cloud/auth/deps.py`.
This is not just a DRY violation: none of the three verify that the token is actually a
gateway token (i.e., `"sid"` present, `"tid"` absent). A user JWT signed with the same
`JWT_SECRET` would pass `_require_gateway_token()` in all three.

**Fix:** Add to `deps.py`:
```python
def require_gateway_token(creds=Security(_bearer)) -> dict:
    payload = _decode(creds)          # existing decode logic
    if "sid" not in payload or "tid" in payload:
        raise HTTPException(401, "not_a_gateway_token")
    return payload
```
Then replace the three local decoders with `Depends(require_gateway_token)`.
`cloud/actions/router.py::_require_admin` (which duplicates user token decode) should
also be replaced with `Depends(require_tenant_admin)` from `deps.py`.
All four fixes land in one PR.

---

## Tier 3 — Low priority; fix when touching the file for another reason

### F-8: `edge/auth_client.py` missing unit tests for retry-after-401 and proactive refresh

**File:** `edge/auth_client.py`  
**Status:** Open  
**Note:** Gap 2 (gateway.py accesses `_auth._refresh_token` directly as a public attribute)
is related — the correct fix is to add a `has_valid_tokens` property to `AuthClient` and
update `gateway.py` line 114 to use it instead of the private attribute.

---

### F-9: Bootstrap site name hardcoded as "Sucursal Principal"

**File:** `cloud/lifecycle/router.py` — `approve_tenant()` line 151  
**Severity:** Product quality (not security)  
**Status:** Open — fix when the approval flow is extended for production

In the full onboarding flow (SDD §3.1), the Asset Owner should name their first branch
themselves, not inherit a generic placeholder. Low cost to fix: add `site_name: str` to
`ApproveRequest` and thread it through the INSERT.

---

## Already fixed in this branch

| Fix | Commit | Description |
|-----|--------|-------------|
| `usa_write`/`usa_delete` cross-tenant user_id check | `ca6aaf6` | Migration 0011 + pgTAP tests 14-15 |
| Migration renumber 0010 → 0011 | `9266c1d` | Avoids collision with `fase-a-hardening`'s 0010 |
| `audit.py` placeholder lazy-load | `ca6aaf6` | `_get_placeholder_b64()` function, not module-level load |
| `prompt.py` dead `zone_name` key | `ca6aaf6` | `z['name']` only |
| `tests/isolation/00_seed.sql` recovered | `ca6aaf6` | Was referenced by `run_tests.sh` but missing |
| `tests/backoffice/00_seed.sql` created | `ca6aaf6` | New, uuid-prefixed to avoid collision |
| `tests/run_tests.sh` wired backoffice suite | `ca6aaf6` | Was orphaned; now runs in CI |
| `lifecycle/router.py` dead imports removed | staged | `psycopg2`, `config`, `Any`, `Dict`, `Optional` |

---

## Branch dependency note

`cloud/config.py`, `cloud/auth/superadmin.py`, and `alembic/versions/0010_superadmin_password_hash.py`
exist only in `claude/fase-a-hardening`. This branch (`claude/recover-untracked-source`)
depends on `fase-a-hardening` merging first. The following are broken until then:

- `tests/lifecycle/test_lifecycle_api.py` (imports `cloud.auth.superadmin`)
- `cloud/lifecycle/router.py` at startup (imports `cloud.auth.superadmin`)
- Any module that imports `cloud.config` (all cloud modules)

Merge order: `fase-a-hardening` → `claude/recover-untracked-source` → remaining feature branches.
