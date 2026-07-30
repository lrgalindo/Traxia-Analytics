"""Add 'sync_error' to users.status and partners.status CHECK constraints.

Required by the F-10 reconciliation job (cloud/backoffice/reconciler.py):
rows detected as orphaned (local DB record with no corresponding Supabase Auth
account, older than 10 minutes) are marked 'sync_error' for manual review.

Alters the existing CHECK constraints in-place — DROP + re-ADD is the only
portable approach because PostgreSQL does not support ALTER CONSTRAINT for
CHECK constraints.
"""

revision = "0016"
down_revision = "0015"


def upgrade() -> None:
    from alembic import op

    # users.status: was ('active','invited','disabled') per production constraint
    op.execute("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_status_check")
    op.execute(
        "ALTER TABLE users ADD CONSTRAINT users_status_check "
        "CHECK (status IN ('active','invited','disabled','sync_error'))"
    )

    # partners.status: was ('active','inactive')
    op.execute("ALTER TABLE partners DROP CONSTRAINT IF EXISTS partners_status_check")
    op.execute(
        "ALTER TABLE partners ADD CONSTRAINT partners_status_check "
        "CHECK (status IN ('active','inactive','sync_error'))"
    )


def downgrade() -> None:
    from alembic import op

    op.execute("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_status_check")
    op.execute(
        "ALTER TABLE users ADD CONSTRAINT users_status_check "
        "CHECK (status IN ('active','invited','disabled'))"
    )

    op.execute("ALTER TABLE partners DROP CONSTRAINT IF EXISTS partners_status_check")
    op.execute(
        "ALTER TABLE partners ADD CONSTRAINT partners_status_check "
        "CHECK (status IN ('active','inactive'))"
    )
