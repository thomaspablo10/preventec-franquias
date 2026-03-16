import { apiRequest } from "./api";
import { getToken } from "./auth";
import type { Franchise } from "./franchises";

export async function getMyFranchise(): Promise<Franchise> {
  const token = getToken();

  return apiRequest<Franchise>("/api/v1/portal/my-franchise", {
    method: "GET",
    token,
  });
}