"""create documents table

Revision ID: 0005_create_documents
Revises: 0004_add_franchise_id_to_users
Create Date: 2026-03-11 02:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = "0005_create_documents"
down_revision: Union[str, None] = "0004_add_franchise_id_to_users"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


document_scope_enum = postgresql.ENUM(
    "global",
    "franchise",
    name="document_scope",
    create_type=False,
)


def upgrade() -> None:
    document_scope_enum.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "documents",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=150), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("category", sa.String(length=100), nullable=True),
        sa.Column("file_url", sa.Text(), nullable=False),
        sa.Column("scope", document_scope_enum, server_default="global", nullable=False),
        sa.Column("franchise_id", sa.Integer(), nullable=True),
        sa.Column("is_active", sa.Boolean(), server_default=sa.text("true"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["franchise_id"], ["franchises.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(op.f("ix_documents_id"), "documents", ["id"], unique=False)
    op.create_index(op.f("ix_documents_title"), "documents", ["title"], unique=False)
    op.create_index(op.f("ix_documents_category"), "documents", ["category"], unique=False)
    op.create_index(op.f("ix_documents_franchise_id"), "documents", ["franchise_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_documents_franchise_id"), table_name="documents")
    op.drop_index(op.f("ix_documents_category"), table_name="documents")
    op.drop_index(op.f("ix_documents_title"), table_name="documents")
    op.drop_index(op.f("ix_documents_id"), table_name="documents")
    op.drop_table("documents")
    document_scope_enum.drop(op.get_bind(), checkfirst=True)