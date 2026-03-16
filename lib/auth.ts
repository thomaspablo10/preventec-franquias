import { apiRequest } from "./api";

export type UserRole = "admin" | "franchisee";

export type AuthUser = {
  id: number;
  access_code: string;
  username: string;
  full_name: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  cpf: string | null;
  birth_date: string | null;
  gender: string | null;
  phone: string | null;
  whatsapp: string | null;
  job_title: string | null;
  profile_photo_path: string | null;
  role: UserRole;
  franchise_id: number | null;
  is_primary: boolean;
  first_login_completed: boolean;
  must_change_password: boolean;
  must_complete_profile: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
  profile_completion_required: boolean;
  user: AuthUser;
};

const TOKEN_KEY = "preventec_token";
const USER_KEY = "preventec_user";

export async function login(
  accessCode: string,
  username: string,
  password: string
): Promise<LoginResponse> {
  const data = await apiRequest<LoginResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({
      access_code: accessCode,
      username,
      password,
    }),
  });

  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, data.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    document.cookie = `preventec_token=${data.access_token}; path=/; max-age=86400; samesite=lax`;
    document.cookie = `preventec_role=${data.user.role}; path=/; max-age=86400; samesite=lax`;
  }

  return data;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  try {
    const user = await apiRequest<AuthUser>("/api/v1/auth/me", {
      method: "GET",
      token,
    });

    localStorage.setItem(USER_KEY, JSON.stringify(user));
    document.cookie = `preventec_role=${user.role}; path=/; max-age=86400; samesite=lax`;

    return user;
  } catch {
    logout();
    return null;
  }
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const userRaw = localStorage.getItem(USER_KEY);
  if (!userRaw) return null;

  try {
    return JSON.parse(userRaw) as AuthUser;
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function logout(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);

  document.cookie = "preventec_token=; path=/; max-age=0; samesite=lax";
  document.cookie = "preventec_role=; path=/; max-age=0; samesite=lax";
}