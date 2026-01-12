import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { adminLogin } from "@/services/admin";

type AdminContextValue = {
  isAdmin: boolean;
  editMode: boolean;
  token: string | null;
  login: (passcode: string) => Promise<void>;
  logout: () => void;
  setEditMode: (v: boolean) => void;
};

const AdminContext = createContext<AdminContextValue | null>(null);

const TOKEN_KEY = "noeii_admin_token_v1";

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) setToken(stored);
  }, []);

  const isAdmin = !!token;

  const login = async (passcode: string) => {
    const res = await adminLogin(passcode);
    localStorage.setItem(TOKEN_KEY, res.token);
    setToken(res.token);
    setEditMode(true);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setEditMode(false);
  };

  const value = useMemo(
    () => ({ isAdmin, editMode, token, login, logout, setEditMode }),
    [isAdmin, editMode, token]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
