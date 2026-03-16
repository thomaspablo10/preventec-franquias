from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services.report_service import (
    franchise_report_data,
    ticket_report_data,
    document_report_data,
    generate_xlsx,
    generate_pdf,
)

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("/franchises/xlsx")
def export_franchise_xlsx(db: Session = Depends(get_db)):

    data, columns = franchise_report_data(db)

    file = generate_xlsx(data, columns)

    return StreamingResponse(
        file,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=franquias.xlsx"},
    )


@router.get("/franchises/pdf")
def export_franchise_pdf(db: Session = Depends(get_db)):

    data, columns = franchise_report_data(db)

    file = generate_pdf("Relatório de Franquias", data, columns)

    return StreamingResponse(
        file,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=franquias.pdf"},
    )


@router.get("/tickets/xlsx")
def export_ticket_xlsx(db: Session = Depends(get_db)):

    data, columns = ticket_report_data(db)

    file = generate_xlsx(data, columns)

    return StreamingResponse(
        file,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=tickets.xlsx"},
    )


@router.get("/tickets/pdf")
def export_ticket_pdf(db: Session = Depends(get_db)):

    data, columns = ticket_report_data(db)

    file = generate_pdf("Relatório de Tickets", data, columns)

    return StreamingResponse(
        file,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=tickets.pdf"},
    )


@router.get("/documents/xlsx")
def export_document_xlsx(db: Session = Depends(get_db)):

    data, columns = document_report_data(db)

    file = generate_xlsx(data, columns)

    return StreamingResponse(
        file,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=documentos.xlsx"},
    )


@router.get("/documents/pdf")
def export_document_pdf(db: Session = Depends(get_db)):

    data, columns = document_report_data(db)

    file = generate_pdf("Relatório de Documentos", data, columns)

    return StreamingResponse(
        file,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=Documentos.pdf"},
    )

@router.get("/franchises")
def get_franchise_report_view(db: Session = Depends(get_db)):

    data, columns = franchise_report_data(db)

    return {
        "columns": columns,
        "rows": data
    }