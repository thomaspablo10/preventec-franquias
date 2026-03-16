"""create tickets and ticket_messages

Revision ID: 0006_create_tickets
Revises: 0005_create_documents
Create Date: 2026-03-12 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = "0006_create_tickets"
down_revision: Union[str, None] = "0005_create_documents"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


ticket_status_enum = postgresql.ENUM(
    "open",
    "in_progress",
    "resolved",
    "closed",
    name="ticket_status",
    create_type=False,
)

ticket_priority_enum = postgresql.ENUM(
    "low",
    "medium",
    "high",
    name="ticket_priority",
    create_type=False,
)


def upgrade() -> None:
    ticket_status_enum.create(op.get_bind(), checkfirst=True)
    ticket_priority_enum.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "tickets",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("subject", sa.String(length=150), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("status", ticket_status_enum, server_default="open", nullable=False),
        sa.Column("priority", ticket_priority_enum, server_default="medium", nullable=False),
        sa.Column("franchise_id", sa.Integer(), nullable=False),
        sa.Column("created_by_user_id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["franchise_id"], ["franchises.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["created_by_user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_tickets_id"), "tickets", ["id"], unique=False)
    op.create_index(op.f("ix_tickets_subject"), "tickets", ["subject"], unique=False)
    op.create_index(op.f("ix_tickets_franchise_id"), "tickets", ["franchise_id"], unique=False)
    op.create_index(op.f("ix_tickets_created_by_user_id"), "tickets", ["created_by_user_id"], unique=False)

    op.create_table(
        "ticket_messages",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("ticket_id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["ticket_id"], ["tickets.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_ticket_messages_id"), "ticket_messages", ["id"], unique=False)
    op.create_index(op.f("ix_ticket_messages_ticket_id"), "ticket_messages", ["ticket_id"], unique=False)
    op.create_index(op.f("ix_ticket_messages_user_id"), "ticket_messages", ["user_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_ticket_messages_user_id"), table_name="ticket_messages")
    op.drop_index(op.f("ix_ticket_messages_ticket_id"), table_name="ticket_messages")
    op.drop_index(op.f("ix_ticket_messages_id"), table_name="ticket_messages")
    op.drop_table("ticket_messages")

    op.drop_index(op.f("ix_tickets_created_by_user_id"), table_name="tickets")
    op.drop_index(op.f("ix_tickets_franchise_id"), table_name="tickets")
    op.drop_index(op.f("ix_tickets_subject"), table_name="tickets")
    op.drop_index(op.f("ix_tickets_id"), table_name="tickets")
    op.drop_table("tickets")

    ticket_priority_enum.drop(op.get_bind(), checkfirst=True)
    ticket_status_enum.drop(op.get_bind(), checkfirst=True)