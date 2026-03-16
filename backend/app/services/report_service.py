from io import BytesIO
from datetime import datetime

import pandas as pd

from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors

from app.repositories.report_repository import (
    get_franchise_report,
    get_ticket_report,
    get_document_report,
)


def _normalize_value(value):
    if isinstance(value, datetime):
        return value.replace(tzinfo=None)
    return value


def _normalize_rows(rows):
    normalized = []
    for row in rows:
        normalized.append([_normalize_value(v) for v in row])
    return normalized


# =========================
# XLSX EXPORT
# =========================

def generate_xlsx(data, columns):

    data = _normalize_rows(data)

    df = pd.DataFrame(data, columns=columns)

    output = BytesIO()

    with pd.ExcelWriter(output, engine="openpyxl") as writer:
        df.to_excel(writer, index=False, sheet_name="Relatorio")

    output.seek(0)

    return output


# =========================
# PDF EXPORT (TABLE)
# =========================

def generate_pdf(title, data, columns):

    data = _normalize_rows(data)

    buffer = BytesIO()

    styles = getSampleStyleSheet()

    elements = []

    elements.append(Paragraph(title, styles["Title"]))
    elements.append(Spacer(1, 20))

    table_data = [columns] + data

    table = Table(table_data)

    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1f2937")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("ALIGN", (0, 0), (-1, -1), "LEFT"),
            ]
        )
    )

    elements.append(table)

    doc = SimpleDocTemplate(buffer, pagesize=A4)

    doc.build(elements)

    buffer.seek(0)

    return buffer


# =========================
# DATA BUILDERS
# =========================

def franchise_report_data(db):

    rows = get_franchise_report(db)

    data = []

    for f in rows:
        data.append(
            [
                f.id,
                f.trade_name,
                f.city,
                f.state,
                f.status,
                f.contact_name,
                f.created_at,
            ]
        )

    columns = [
        "ID",
        "Franquia",
        "Cidade",
        "Estado",
        "Status",
        "Responsável",
        "Criado em",
    ]

    return data, columns


def ticket_report_data(db):

    rows = get_ticket_report(db)

    data = []

    for t, franchise_name in rows:
        data.append(
            [
                t.id,
                t.subject,
                franchise_name,
                t.status,
                t.priority,
                t.created_at,
                t.updated_at,
            ]
        )

    columns = [
        "ID",
        "Assunto",
        "Franquia",
        "Status",
        "Prioridade",
        "Criado em",
        "Atualizado em",
    ]

    return data, columns


def document_report_data(db):

    rows = get_document_report(db)

    data = []

    for d, franchise_name in rows:
        data.append(
            [
                d.id,
                d.title,
                d.category,
                d.scope,
                franchise_name,
                d.created_at,
            ]
        )

    columns = [
        "ID",
        "Título",
        "Categoria",
        "Escopo",
        "Franquia",
        "Criado em",
    ]

    return data, columns