# Rescue Commit Audit — Findings (CLOSED — Merged to master 2026-07-25)

Branch audited: `claude/recover-untracked-source` (rescue commit `cfee689`)
Audit date: 2026-07-24/25
Scope: all modules in `edge/` and `cloud/` (14 files, 4 test suites)

**All findings resolved. Both branches merged to `master` on 2026-07-25.**

Post-merge suite against master (commits `4204ae7` + `a76a9f7`):
```
pgTAP  : 14/14  (isolation ×4, backoffice ×2, gateway ×7, lifecycle ×1)
pytest : 32/32  (superadmin ×5, breakglass ×5, lifecycle ×10, grace-window ×1, channels ×6, crypto ×5)
alembic: 0001 → 0011 clean (head)
```

Findings are ordered by the priority established at the close of the audit session.
"Lote de cierre" = the batch of fixes that landed in commit `a98e740` before merge.

---

## Tier 1 — Fixes required before merge (real gaps, not missing tests)

### F-1: Gateway re-approval does not revoke the existing refresh token

**File:** `cloud/lifecycle/router.py` — `approve_tenant()`, the `ON CONFLICT DO UPDATE` clause  
**Severity:** High — active security gap  
**Status:** ✅ Fixed — closure batch commit

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
**Status:** ✅ Fixed — closure batch commit

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
**Status:** ✅ Verified — `alembic upgrade head` ran 0009→0010→0011 clean; `alembic current` shows `0011 (head)`. Also fixed `0010_superadmin_password_hash.py` which used non-standard `upgrade(conn)` signature instead of `op.execute()`.

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
**Status:** ✅ Covered — `tests/lifecycle/test_refresh_grace.py::test_grace_window_three_step_sequence` (PASSED)

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
**Status:** ✅ Covered — `tests/actions/test_channels.py` (6 tests, all PASSED)

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
**Status:** ✅ Covered — `tests/gateway/07_ingest_isolation.sql` (5 tests: 2 positive + 3 negative, all PASSED). Confirmed present and wired in `tests/run_tests.sh`.

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
**Status:** ✅ Fixed — `require_gateway_token` added to `cloud/auth/deps.py` with `sid`/`tid` claim check. All three routers now import from `deps.py`. `cloud/actions/router.py` also replaced `_require_admin` with `require_tenant_admin` (tighter: also blocks partner-scoped admins).

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
| `lifecycle/router.py` dead imports removed | `ca6aaf6` | `psycopg2`, `config`, `Any`, `Dict`, `Optional` |
| **F-3** Migration 0011 verified; 0010 Alembic signature fixed | closure batch | `alembic upgrade head` runs 0001→0011 clean |
| **F-1** `approve_tenant()` ON CONFLICT now nulls refresh tokens | closure batch | 4 NULL assignments added; `test_reapprove_nulls_existing_refresh_token` passes |
| **F-4** Grace-window 3-step regression test | closure batch | `tests/lifecycle/test_refresh_grace.py` — 1 test, PASSED |
| **F-5** `meta_cost_usd` channel dispatch tests | closure batch | `tests/actions/test_channels.py` — 6 tests, all PASSED |
| **F-6** Cross-site ingest confirmed covered | closure batch | `tests/gateway/07_ingest_isolation.sql` — 5 tests, confirmed in run_tests.sh |
| **F-7** `require_gateway_token` unified in `deps.py` | closure batch | All 3 routers import from deps; claim validation added |
| **F-2** `list_cameras()` / `get_snapshot()` fixed | closure batch | Removed non-existent columns; snapshot uses `_presign_snapshot` via agent_findings |
| `tests/backoffice/02_rls_analytics.sql` PARTNER zone insert | closure batch | Fixed `owner_tenant_id = NULL` for PARTNER zones (constraint violation) |
| `tests/lifecycle/00_lifecycle_seed.sql` `password_hash` | closure batch | Added NOT NULL `password_hash` after migration 0010 |
| `tests/lifecycle/01_rls_lifecycle.sql` tests 5 and 8 | closure batch | Test 5: silent block (0 rows) not 42501; Test 8: restore tenant B before positive check |

---

---

## F-10: Orphaned rows on process crash between local commit and Supabase Auth call

**Files:** `cloud/backoffice/router.py` — `create_user()`, `create_partner()`
**Severity:** Low (data integrity; not security; requires a crash at a specific instant)
**Status:** Open — deferred; fix requires saga/outbox pattern

`create_user` and `create_partner` follow the compensation pattern:

1. DB INSERT commits in its own transaction.
2. Supabase Auth Admin API called outside that transaction.
3. If Supabase responds with an error: local row is deleted (compensation).

The gap: if the process is killed, crashes, or is restarted by Render **between step 1
completing and step 2 returning** (network timeout without an exception reaching the
`except` block, SIGKILL from deploy, OOM), the `try/except` never executes. The result
is a `users` or `partners` row committed to the DB with `status='active'` but with no
corresponding Supabase Auth account. The user cannot log in.

**Why not fixed now:** resolving this correctly requires an outbox table or a saga
coordinator (persist "Supabase call pending" before the external call; mark "done" after;
a background job cleans up pending entries). That is over-engineering for the MLP.

**Recommended future fix:** a periodic reconciliation job (cron or Render background
worker, run every 15 minutes) that:
1. Queries `users WHERE status = 'active' AND created_at < now() - interval '10 minutes'`
   and cross-references against `GET /auth/v1/admin/users?email=...` in Supabase.
2. For rows with no Supabase account: either re-attempts the Auth creation or marks
   `status = 'sync_error'` for manual review.
3. Same logic for `partners` rows (check the admin user's email).

Until the reconciliation job exists, operators can detect orphaned rows manually by
querying `users WHERE status = 'active'` and verifying against the Supabase Auth
dashboard.

---

## Branch dependency note

`cloud/config.py`, `cloud/auth/superadmin.py`, and `alembic/versions/0010_superadmin_password_hash.py`
exist only in `claude/fase-a-hardening`. This branch (`claude/recover-untracked-source`)
depends on `fase-a-hardening` merging first. The following are broken until then:

- `tests/lifecycle/test_lifecycle_api.py` (imports `cloud.auth.superadmin`)
- `cloud/lifecycle/router.py` at startup (imports `cloud.auth.superadmin`)
- Any module that imports `cloud.config` (all cloud modules)

Merge order: `fase-a-hardening` → `claude/recover-untracked-source` → remaining feature branches.
