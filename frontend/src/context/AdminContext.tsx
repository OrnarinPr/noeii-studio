import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { adminLogin, adminLogout, isAdminAuthed } from "@/services/adminAuth";

type AdminContextValue = {
  isAdmin: boolean;
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  login: (passcode: string) => boolean;
  logout: () => void;
};

const AdminContext = createContext<AdminContextValue | null>(null);

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setIsAdmin(isAdminAuthed());
  }, []);

  useEffect(() => {
    if (!isAdmin) setEditMode(false);
  }, [isAdmin]);

  const value = useMemo<AdminContextValue>(() => {
    return {
      isAdmin,
      editMode,
      setEditMode,
      login: (passcode: string) => {
        const ok = adminLogin(passcode);
        setIsAdmin(ok);
        return ok;
      },
      logout: () => {
        adminLogout();
        setIsAdmin(false);
      },
    };
  }, [isAdmin, editMode]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
};
