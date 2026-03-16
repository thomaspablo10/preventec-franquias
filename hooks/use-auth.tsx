"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  getCurrentUser,
  getStoredUser,
  isAuthenticated,
  login as loginRequest,
  logout as logoutRequest,
  type AuthUser,
} from "@/lib/auth";

type LoginPayload = {
  access_code: string;
  username: string;
  password: string;
};

type AuthContextData = {
  user: AuthUser | null;
  loading: boolean;
  isLoggedIn: boolean;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } finally {
      setLoading(false);
    }
  }

  async function login({ access_code, username, password }: LoginPayload): Promise<AuthUser> {
    const response = await loginRequest(access_code, username, password);
    setUser(response.user);
    return response.user;
  }

  function logout() {
    logoutRequest();
    setUser(null);
  }

  useEffect(() => {
    async function bootstrap() {
      const storedUser = getStoredUser();

      if (storedUser && isAuthenticated()) {
        setUser(storedUser);
      }

      await refreshUser();
    }

    bootstrap();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isLoggedIn: !!user,
      login,
      logout,
      refreshUser,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }

  return context;
}