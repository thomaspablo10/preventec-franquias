"use client"

import { downloadReport } from "@/lib/reports"

export default function ReportsPage() {

  return (

    <div className="p-8 max-w-5xl">

      <h1 className="text-2xl font-bold mb-6">
        Relatórios
      </h1>

      <div className="space-y-6">

        <div>

          <h2 className="font-bold mb-2">
            Franquias
          </h2>

          <button
            onClick={() => downloadReport("/api/v1/reports/franchises/xlsx")}
            className="mr-3 bg-blue-600 text-white px-4 py-2 rounded"
          >
            XLSX
          </button>

          <button
            onClick={() => downloadReport("/api/v1/reports/franchises/pdf")}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            PDF
          </button>

        </div>

        <div>

          <h2 className="font-bold mb-2">
            Tickets
          </h2>

          <button
            onClick={() => downloadReport("/api/v1/reports/tickets/xlsx")}
            className="mr-3 bg-blue-600 text-white px-4 py-2 rounded"
          >
            XLSX
          </button>

          <button
            onClick={() => downloadReport("/api/v1/reports/tickets/pdf")}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            PDF
          </button>

        </div>

        <div>

          <h2 className="font-bold mb-2">
            Documentos
          </h2>

          <button
            onClick={() => downloadReport("/api/v1/reports/documents/xlsx")}
            className="mr-3 bg-blue-600 text-white px-4 py-2 rounded"
          >
            XLSX
          </button>

          <button
            onClick={() => downloadReport("/api/v1/reports/documents/pdf")}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            PDF
          </button>

        </div>

      </div>

    </div>

  )
}