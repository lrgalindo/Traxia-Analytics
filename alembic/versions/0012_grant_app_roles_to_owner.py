"""Grant traxia_app and traxia_service to the connection owner.

On managed Postgres (Supabase), the connection user (postgres.xxxxx) is not a
superuser and cannot SET ROLE without explicit membership. The cloud API does
SET ROLE traxia_app / traxia_service on every connection via db.py, so this
GRANT is required for the API to function.

Revision ID: 0012
Revises: 0011
"""

revision = "0012"
down_revision = "0011"

from alembic import op


def upgrade() -> None:
    op.execute("""
DO $$ BEGIN
  EXECUTE format('GRANT traxia_app TO %I', current_user);
  EXECUTE format('GRANT traxia_service TO %I', current_user);
END $$;
""")


def downgrade() -> None:
    op.execute("""
DO $$ BEGIN
  EXECUTE format('REVOKE traxia_app FROM %I', current_user);
  EXECUTE format('REVOKE traxia_service FROM %I', current_user);
END $$;
""")
