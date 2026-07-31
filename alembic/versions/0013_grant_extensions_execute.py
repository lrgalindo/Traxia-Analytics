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
    # Supabase installs pgcrypto in the 'extensions' schema; vanilla Postgres
    # does not have this schema.  Skip silently when it is absent (CI / local dev).
    op.execute("""
        DO $$
        BEGIN
            IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'extensions') THEN
                GRANT USAGE ON SCHEMA extensions TO traxia_app, traxia_service;
                GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA extensions TO traxia_app, traxia_service;
            END IF;
        END $$;
    """)


def downgrade() -> None:
    op.execute("""
        DO $$
        BEGIN
            IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'extensions') THEN
                REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA extensions FROM traxia_app, traxia_service;
                REVOKE USAGE ON SCHEMA extensions FROM traxia_app, traxia_service;
            END IF;
        END $$;
    """)
