"""create franchises table

Revision ID: 0003_create_franchises
Revises: 0002_create_users
Create Date: 2026-03-10 23:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = "0003_create_franchises"
down_revision: Union[str, None] = "0002_create_users"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


franchise_status_enum = postgresql.ENUM(
    "active",
    "pending",
    "inactive",
    name="franchise_status",
    create_type=False,
)


def upgrade() -> None:
    franchise_status_enum.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "franchises",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("corporate_name", sa.String(length=150), nullable=False),
        sa.Column("trade_name", sa.String(length=150), nullable=False),
        sa.Column("cnpj", sa.String(length=18), nullable=True),
        sa.Column("contact_name", sa.String(length=150), nullable=False),
        sa.Column("contact_email", sa.String(length=255), nullable=False),
        sa.Column("contact_phone", sa.String(length=20), nullable=True),
        sa.Column("city", sa.String(length=100), nullable=False),
        sa.Column("state", sa.String(length=2), nullable=False),
        sa.Column("status", franchise_status_enum, server_default="pending", nullable=False),
        sa.Column("join_date", sa.Date(), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("is_active", sa.Boolean(), server_default=sa.text("true"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("cnpj"),
    )

    op.create_index(op.f("ix_franchises_id"), "franchises", ["id"], unique=False)
    op.create_index(op.f("ix_franchises_corporate_name"), "franchises", ["corporate_name"], unique=False)
    op.create_index(op.f("ix_franchises_trade_name"), "franchises", ["trade_name"], unique=False)
    op.create_index(op.f("ix_franchises_contact_email"), "franchises", ["contact_email"], unique=False)
    op.create_index(op.f("ix_franchises_city"), "franchises", ["city"], unique=False)
    op.create_index(op.f("ix_franchises_state"), "franchises", ["state"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_franchises_state"), table_name="franchises")
    op.drop_index(op.f("ix_franchises_city"), table_name="franchises")
    op.drop_index(op.f("ix_franchises_contact_email"), table_name="franchises")
    op.drop_index(op.f("ix_franchises_trade_name"), table_name="franchises")
    op.drop_index(op.f("ix_franchises_corporate_name"), table_name="franchises")
    op.drop_index(op.f("ix_franchises_id"), table_name="franchises")
    op.drop_table("franchises")
    franchise_status_enum.drop(op.get_bind(), checkfirst=True)