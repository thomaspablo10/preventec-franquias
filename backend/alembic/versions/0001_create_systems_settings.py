"""create system_settings table

Revision ID: 0001_create_system_settings
Revises: None
Create Date: 2026-03-10 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "0001_create_system_settings"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "system_settings",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("key", sa.String(length=100), nullable=False),
        sa.Column("value", sa.Text(), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("is_active", sa.Boolean(), server_default=sa.text("true"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_system_settings_id"), "system_settings", ["id"], unique=False)
    op.create_index(op.f("ix_system_settings_key"), "system_settings", ["key"], unique=True)


def downgrade() -> None:
    op.drop_index(op.f("ix_system_settings_key"), table_name="system_settings")
    op.drop_index(op.f("ix_system_settings_id"), table_name="system_settings")
    op.drop_table("system_settings")