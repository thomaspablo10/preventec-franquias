"use client";

import { Download } from "lucide-react";

type InvitationRow = {
  id: string;
  name: string;
  phone: string;
  company: string;
  companionName: string | null;
  createdAt: string;
};

type InvitationsExportActionsProps = {
  title?: string;
  rows: InvitationRow[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function InvitationsExportActions({
  title = "Evento",
  rows,
}: InvitationsExportActionsProps) {
  async function exportXlsx() {
    const XLSX = await import("xlsx");

    const worksheet = XLSX.utils.json_to_sheet(
      rows.map((row) => ({
        Nome: row.name,
        Telefone: row.phone,
        Empresa: row.company,
        Acompanhante: row.companionName || "-",
        "Data de envio": formatDate(row.createdAt),
      })),
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Convites");
    XLSX.writeFile(workbook, `${title}.xlsx`);
  }

  async function exportPdf() {
    const jsPDFModule = await import("jspdf");
    const autoTableModule = await import("jspdf-autotable");

    const jsPDF = jsPDFModule.jsPDF;
    const autoTable =
      autoTableModule.default || autoTableModule.autoTable || autoTableModule;

    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(16);
    doc.text(`Lista de confirmações - ${title}`, 14, 16);

    autoTable(doc, {
      startY: 24,
      head: [["Nome", "Telefone", "Empresa", "Acompanhante", "Data"]],
      body: rows.map((row) => [
        row.name,
        row.phone,
        row.company,
        row.companionName || "-",
        formatDate(row.createdAt),
      ]),
      styles: {
        fontSize: 9,
        cellPadding: 2.5,
      },
      headStyles: {
        fillColor: [33, 79, 181],
      },
    });

    doc.save(`${title}.pdf`);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={exportPdf}
        className="inline-flex h-11 items-center gap-2 rounded-2xl border border-[#d8e7f5] bg-white px-4 text-sm font-semibold text-[#16324f] shadow-sm transition hover:bg-[#f8fbff]"
      >
        <Download className="h-4 w-4" />
        Exportar PDF
      </button>

      <button
        type="button"
        onClick={exportXlsx}
        className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[#4169E1] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3157c8]"
      >
        <Download className="h-4 w-4" />
        Exportar XLSX
      </button>
    </div>
  );
}