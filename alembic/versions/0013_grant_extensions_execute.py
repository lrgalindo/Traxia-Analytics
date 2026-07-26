"""Grant EXECUTE on extensions schema functions to app roles.

On Supabase, pgcrypto is installed in the 'extensions' schema rather than
'public'. Migration 0001 only granted EXECUTE on public schema functions.
Without this grant, traxia_app and traxia_service cannot call digest(),
gen_random_bytes(), etc. after SET ROLE.

Revision ID: 0013
Revises: 0012
"""

revision = "0013"
down_revision = "0012"

from alembic import op


def upgrade() -> None:
    op.execute("GRANT USAGE ON SCHEMA extensions TO traxia_app, traxia_service;")
    op.execute("GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA extensions TO traxia_app, traxia_service;")


def downgrade() -> None:
    op.execute("REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA extensions FROM traxia_app, traxia_service;")
    op.execute("REVOKE USAGE ON SCHEMA extensions FROM traxia_app, traxia_service;")
