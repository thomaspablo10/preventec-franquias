import { apiRequest } from "./api"
import { getToken } from "./auth"

export async function getFranchiseReport() {

  const token = getToken()

  return apiRequest("/api/v1/reports/franchises", {
    method: "GET",
    token
  })
}

export function downloadReport(path: string) {

  window.open(`${process.env.NEXT_PUBLIC_API_URL}${path}`)
}