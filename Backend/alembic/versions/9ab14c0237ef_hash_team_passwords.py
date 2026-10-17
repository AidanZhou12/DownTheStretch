"""Hash existing team passwords and rename the storage column.

Revision ID: 9ab14c0237ef
Revises: f86114c7d773
"""

import hashlib

from alembic import op
import sqlalchemy as sa

revision = "9ab14c0237ef"
down_revision = "f86114c7d773"
branch_labels = None
depends_on = None


def upgrade() -> None:
    connection = op.get_bind()
    teams = sa.table("teams", sa.column("id", sa.Integer), sa.column("password", sa.String(100)))
    for team in connection.execute(sa.select(teams.c.id, teams.c.password)).mappings().all():
        password_hash = hashlib.sha256(team["password"].encode("utf-8")).hexdigest()
        connection.execute(
            teams.update().where(teams.c.id == team["id"]).values(password=password_hash)
        )
    op.alter_column("teams", "password", new_column_name="password_hash", existing_type=sa.String(100), existing_nullable=False)


def downgrade() -> None:
    raise RuntimeError("Password hashing is irreversible; restore a pre-migration backup to recover plaintext passwords.")
