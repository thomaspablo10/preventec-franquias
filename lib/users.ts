import { apiRequest } from "./api";
import { getToken } from "./auth";

export type UserRole = "admin" | "franchisee";

export type AppUser = {
  id: number;
  full_name: string;
  email: string;
  role: UserRole;
  franchise_id: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateUserPayload = {
  full_name: string;
  email: string;
  password: string;
  role?: UserRole;
  franchise_id?: number | null;
  is_active?: boolean;
};

export async function listUsers(): Promise<AppUser[]> {
  const token = getToken();

  return apiRequest<AppUser[]>("/api/v1/users", {
    method: "GET",
    token,
  });
}

export async function createUser(payload: CreateUserPayload): Promise<AppUser> {
  const token = getToken();

  return apiRequest<AppUser>("/api/v1/users", {
    method: "POST",
    token,
    body: JSON.stringify({
      ...payload,
      role: payload.role ?? "franchisee",
      is_active: payload.is_active ?? true,
    }),
  });
}