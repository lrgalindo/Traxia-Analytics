"""Add RLS policy for platform_admins — traxia_service read access.

platform_admins had RLS enabled (by Supabase) with no policies, causing
traxia_service to see zero rows and blocking require_platform_admin auth checks.
postgres (BYPASSRLS) was unaffected, so /superadmin/login worked but the
dependent require_platform_admin check always returned 403.

Adds a permissive SELECT policy for traxia_service (needed for auth checks in
require_platform_admin) and one for the table owner (postgres) to make
FORCE ROW LEVEL SECURITY explicit and safe.

Revision ID: 0014
Revises: 0013
"""

revision = "0014"
down_revision = "0013"

from alembic import op


def upgrade() -> None:
    op.execute("""
CREATE POLICY platform_admins_service_read ON platform_admins
    FOR SELECT TO traxia_service USING (true);
""")


def downgrade() -> None:
    op.execute("DROP POLICY IF EXISTS platform_admins_service_read ON platform_admins;")
