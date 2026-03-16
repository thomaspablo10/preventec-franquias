"""add franchise_id to users

Revision ID: 0004_add_franchise_id_to_users
Revises: 0003_create_franchises
Create Date: 2026-03-11 01:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "0004_add_franchise_id_to_users"
down_revision: Union[str, None] = "0003_create_franchises"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("users", sa.Column("franchise_id", sa.Integer(), nullable=True))
    op.create_index(op.f("ix_users_franchise_id"), "users", ["franchise_id"], unique=False)
    op.create_foreign_key(
        "fk_users_franchise_id_franchises",
        "users",
        "franchises",
        ["franchise_id"],
        ["id"],
        ondelete="SET NULL",
    )


def downgrade() -> None:
    op.drop_constraint("fk_users_franchise_id_franchises", "users", type_="foreignkey")
    op.drop_index(op.f("ix_users_franchise_id"), table_name="users")
    op.drop_column("users", "franchise_id")