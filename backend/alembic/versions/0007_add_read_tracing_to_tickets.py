"""add read tracking to tickets

Revision ID: 0007_read_tracking
Revises: 0006_create_tickets
Create Date: 2026-03-12 03:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "0007_read_tracking"
down_revision: Union[str, None] = "0006_create_tickets"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "tickets",
        sa.Column("franchisee_last_read_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.add_column(
        "tickets",
        sa.Column("admin_last_read_at", sa.DateTime(timezone=True), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("tickets", "admin_last_read_at")
    op.drop_column("tickets", "franchisee_last_read_at")