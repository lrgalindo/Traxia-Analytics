"""Fix usa_write and usa_delete: add user tenant membership check.

Both policies previously validated only that `site_id` belongs to the calling
admin's tenant, but did not validate that `user_id` also belongs to that tenant.
A row where user and site belong to different tenants could be inserted or deleted
by a tenant admin who knows the foreign user's UUID.

The fix adds an EXISTS subquery on `users` to both policies, making them
structurally symmetric: site_id tenant check + user_id tenant check.

Revision ID: 0010
Revises: 0009
Create Date: 2026-07-25
"""

revision = "0010"
down_revision = "0009"
branch_labels = None
depends_on = None

from alembic import op


def upgrade() -> None:
    # Drop both policies before replacing them — ALTER POLICY does not support
    # changing WITH CHECK / USING expressions; DROP + recreate is the canonical path.
    op.execute("DROP POLICY IF EXISTS usa_write  ON user_site_assignments;")
    op.execute("DROP POLICY IF EXISTS usa_delete ON user_site_assignments;")

    op.execute("""
CREATE POLICY usa_write ON user_site_assignments
  FOR INSERT WITH CHECK (
    app_current_partner_id() IS NULL
    AND app_current_role() = 'admin'
    AND sec_tenant_owns_site(user_site_assignments.site_id, app_current_tenant_id())
    AND EXISTS (
      SELECT 1 FROM users u
       WHERE u.id = user_site_assignments.user_id
         AND u.tenant_id = app_current_tenant_id()
    )
  );
""")

    op.execute("""
CREATE POLICY usa_delete ON user_site_assignments
  FOR DELETE USING (
    app_current_partner_id() IS NULL
    AND app_current_role() = 'admin'
    AND sec_tenant_owns_site(user_site_assignments.site_id, app_current_tenant_id())
    AND EXISTS (
      SELECT 1 FROM users u
       WHERE u.id = user_site_assignments.user_id
         AND u.tenant_id = app_current_tenant_id()
    )
  );
""")


def downgrade() -> None:
    op.execute("DROP POLICY IF EXISTS usa_write  ON user_site_assignments;")
    op.execute("DROP POLICY IF EXISTS usa_delete ON user_site_assignments;")

    # Restore the defective originals so downgrade is reversible.
    op.execute("""
CREATE POLICY usa_write ON user_site_assignments
  FOR INSERT WITH CHECK (
    app_current_partner_id() IS NULL AND app_current_role() = 'admin'
    AND sec_tenant_owns_site(user_site_assignments.site_id, app_current_tenant_id())
  );
""")
    op.execute("""
CREATE POLICY usa_delete ON user_site_assignments
  FOR DELETE USING (
    app_current_partner_id() IS NULL AND app_current_role() = 'admin'
    AND sec_tenant_owns_site(user_site_assignments.site_id, app_current_tenant_id())
  );
""")
