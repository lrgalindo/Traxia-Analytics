#!/usr/bin/env bash
set -euo pipefail

DB_URL="${DATABASE_URL:-postgresql://postgres:postgres@localhost:5432/traxia}"
ISOLATION_DIR="$(cd "$(dirname "$0")/isolation" && pwd)"
BACKOFFICE_DIR="$(cd "$(dirname "$0")/backoffice" && pwd)"
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
psql "$DB_URL" -v ON_ERROR_STOP=1 -f "$BACKOFFICE_DIR/00_seed.sql" -q
echo "  backoffice seed loaded."

echo ""
echo "=== Running backoffice RLS tests (Fase 2 / migration 0010) ==="
run_test "$BACKOFFICE_DIR/01_rls_backoffice.sql"

echo ""
echo "Results: ${PASSED} passed, ${FAILURES} failed"
if [ "$FAILURES" -gt 0 ]; then
  exit 1
fi
