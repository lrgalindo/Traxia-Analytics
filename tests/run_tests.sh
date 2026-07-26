#!/usr/bin/env bash
set -euo pipefail

DB_URL="${DATABASE_URL:-postgresql://postgres:postgres@localhost:5432/traxia}"
ISOLATION_DIR="$(cd "$(dirname "$0")/isolation" && pwd)"
BACKOFFICE_DIR="$(cd "$(dirname "$0")/backoffice" && pwd)"
GATEWAY_DIR="$(cd "$(dirname "$0")/gateway" && pwd)"
LIFECYCLE_DIR="$(cd "$(dirname "$0")/lifecycle" && pwd)"
FAILURES=0
PASSED=0

run_test() {
  local file="$1"
  local name
  name="$(basename "$file")"
  printf "  %-55s " "$name"

  local out
  # -v ON_ERROR_STOP=1 makes psql exit non-zero on SQL errors, which we capture
  # in the exit-code check below alongside the "not ok" TAP grep.
  out="$(psql "$DB_URL" -v ON_ERROR_STOP=1 -f "$file" -A -t -q 2>&1)"
  local psql_exit=$?

  if [ $psql_exit -ne 0 ] || echo "$out" | grep -q '^not ok'; then
    echo "FAIL"
    echo "$out" | grep '^not ok' | sed 's/^/    /'
    FAILURES=$((FAILURES + 1))
  else
    echo "OK"
    PASSED=$((PASSED + 1))
  fi
}

echo ""
echo "=== Ensuring pgTAP extension is available ==="
psql "$DB_URL" -v ON_ERROR_STOP=1 -c "CREATE EXTENSION IF NOT EXISTS pgtap;" -q
echo "  pgtap ready."

echo ""
echo "=== Loading isolation seed data ==="
psql "$DB_URL" -v ON_ERROR_STOP=1 -f "$ISOLATION_DIR/00_seed.sql" -q
echo "  isolation seed loaded."

echo ""
echo "=== Running isolation tests (Section 8.4) ==="
run_test "$ISOLATION_DIR/01_tenant_isolation.sql"
run_test "$ISOLATION_DIR/02_site_scoped_isolation.sql"
run_test "$ISOLATION_DIR/03_partner_isolation.sql"
run_test "$ISOLATION_DIR/04_tenant_keeps_visibility_of_ceded_zones.sql"

echo ""
echo "=== Loading backoffice seed data ==="
# 00_seed.sql:          bb-prefixed rows for RLS policy tests (01_rls_backoffice.sql)
# 00_backoffice_seed.sql: extended rows incl. reseller + site_a2 for analytics tests
# Both are ON CONFLICT DO NOTHING — safe to load sequentially.
psql "$DB_URL" -v ON_ERROR_STOP=1 -f "$BACKOFFICE_DIR/00_seed.sql" -q
psql "$DB_URL" -v ON_ERROR_STOP=1 -f "$BACKOFFICE_DIR/00_backoffice_seed.sql" -q
echo "  backoffice seed loaded."

echo ""
echo "=== Running backoffice RLS tests (Fase 2 / migration 0011) ==="
run_test "$BACKOFFICE_DIR/01_rls_backoffice.sql"
run_test "$BACKOFFICE_DIR/02_rls_analytics.sql"

echo ""
echo "=== Loading gateway seed data ==="
psql "$DB_URL" -v ON_ERROR_STOP=1 -f "$GATEWAY_DIR/00_gateway_seed.sql" -q
echo "  gateway seed loaded."

echo ""
echo "=== Running gateway tests (Section 8.7) ==="
run_test "$GATEWAY_DIR/01_activation.sql"
run_test "$GATEWAY_DIR/02_refresh.sql"
run_test "$GATEWAY_DIR/03_revocation.sql"
run_test "$GATEWAY_DIR/04_invalid_tokens.sql"
run_test "$GATEWAY_DIR/05_activation_reuse.sql"
run_test "$GATEWAY_DIR/06_grace_window.sql"
run_test "$GATEWAY_DIR/07_ingest_isolation.sql"

echo ""
echo "=== Loading lifecycle seed data ==="
psql "$DB_URL" -v ON_ERROR_STOP=1 -f "$LIFECYCLE_DIR/00_lifecycle_seed.sql" -q
echo "  lifecycle seed loaded."

echo ""
echo "=== Running lifecycle RLS tests (Section 3.1 / Fase A) ==="
run_test "$LIFECYCLE_DIR/01_rls_lifecycle.sql"

echo ""
echo "Results: ${PASSED} passed, ${FAILURES} failed"
if [ "$FAILURES" -gt 0 ]; then
  exit 1
fi
