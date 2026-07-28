"""Grant traxia_service SELECT access to users table for login lookup.

login() in cloud/auth/mfa.py uses service_conn() (SET ROLE traxia_service) to
look up the user by email after Supabase validates the password. Without a
SELECT grant and an RLS policy, traxia_service gets InsufficientPrivilege.

A permissive USING (true) policy is correct here: the security boundary for
login is Supabase Auth (password validation) + the JWT we issue (which carries
tenant context). The RLS row-level isolation is not needed for the login lookup
itself — all active users are valid targets of an email+password lookup.

Applied directly via psycopg2 with RESET ROLE (postgres / BYPASSRLS) because
traxia_service cannot run DDL and alembic_version is inaccessible to it.
"""

revision = "0015"
down_revision = "0014"


def upgrade() -> None:
    from alembic import op
    op.execute("GRANT SELECT ON users TO traxia_service;")
    op.execute("GRANT SELECT ON user_site_assignments TO traxia_service;")
    op.execute("""
CREATE POLICY users_service_read ON users
    FOR SELECT TO traxia_service
    USING (true);
""")


def downgrade() -> None:
    from alembic import op
    op.execute("DROP POLICY IF EXISTS users_service_read ON users;")
    op.execute("REVOKE SELECT ON user_site_assignments FROM traxia_service;")
    op.execute("REVOKE SELECT ON users FROM traxia_service;")
