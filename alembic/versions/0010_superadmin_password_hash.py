"""Add password_hash column to platform_admins (SuperAdmin login endpoint).

SDD §3.1 decision 11b — POST /v1/superadmin/login requires credentials
stored in the DB.  Uses bcrypt (cost factor 12).

Revision ID: 0010
Revises: 0009
"""

revision = "0010"
down_revision = "0009"

from alembic import op


def upgrade() -> None:
    op.execute("ALTER TABLE platform_admins ADD COLUMN password_hash TEXT NOT NULL DEFAULT '';")
    op.execute("ALTER TABLE platform_admins ALTER COLUMN password_hash DROP DEFAULT;")


def downgrade() -> None:
    op.execute("ALTER TABLE platform_admins DROP COLUMN IF EXISTS password_hash;")
