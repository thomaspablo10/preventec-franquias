import { apiRequest } from "./api";
import { getToken } from "./auth";

export type FranchiseStatus = "active" | "pending" | "inactive";

export type Franchise = {
  id: number;
  corporate_name: string;
  trade_name: string;
  cnpj: string | null;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  city: string;
  state: string;
  status: FranchiseStatus;
  join_date: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateFranchisePayload = {
  corporate_name: string;
  trade_name: string;
  cnpj?: string | null;
  contact_name: string;
  contact_email: string;
  contact_phone?: string | null;
  city: string;
  state: string;
  status?: FranchiseStatus;
  join_date?: string | null;
  notes?: string | null;
  is_active?: boolean;
};

export type UpdateFranchisePayload = Partial<CreateFranchisePayload>;

export async function listFranchises(): Promise<Franchise[]> {
  const token = getToken();

  return apiRequest<Franchise[]>("/api/v1/franchises", {
    method: "GET",
    token,
  });
}

export async function createFranchise(
  payload: CreateFranchisePayload
): Promise<Franchise> {
  const token = getToken();

  return apiRequest<Franchise>("/api/v1/franchises", {
    method: "POST",
    token,
    body: JSON.stringify({
      ...payload,
      status: payload.status ?? "pending",
      is_active: payload.is_active ?? true,
    }),
  });
}

export async function updateFranchise(
  franchiseId: number,
  payload: UpdateFranchisePayload
): Promise<Franchise> {
  const token = getToken();

  return apiRequest<Franchise>(`/api/v1/franchises/${franchiseId}`, {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });
}

export async function deleteFranchise(franchiseId: number): Promise<Franchise> {
  const token = getToken();

  return apiRequest<Franchise>(`/api/v1/franchises/${franchiseId}`, {
    method: "DELETE",
    token,
  });
}