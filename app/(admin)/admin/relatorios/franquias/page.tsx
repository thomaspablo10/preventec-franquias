"use client"

import { useEffect, useState } from "react"
import { getFranchiseReport, downloadReport } from "@/lib/reports"

export default function FranchiseReportPage() {

  const [report, setReport] = useState<any>(null)

  useEffect(() => {

    async function load() {
      const data = await getFranchiseReport()
      setReport(data)
    }

    load()

  }, [])

  if (!report) return <p>Carregando...</p>

  return (

    <div className="p-8">

      <h1 className="text-2xl font-bold mb-6">
        Relatório de Franquias
      </h1>

      <div className="mb-6">

        <button
          onClick={() => downloadReport("/api/v1/reports/franchises/xlsx")}
          className="mr-3 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Exportar XLSX
        </button>

        <button
          onClick={() => downloadReport("/api/v1/reports/franchises/pdf")}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Exportar PDF
        </button>

      </div>

      <table className="w-full border">

        <thead>
          <tr>
            {report.columns.map((c: string) => (
              <th key={c} className="border p-2 bg-gray-100">
                {c}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>

          {report.rows.map((row: any, i: number) => (

            <tr key={i}>

              {row.map((cell: any, j: number) => (

                <td key={j} className="border p-2">
                  {String(cell)}
                </td>

              ))}

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  )
}