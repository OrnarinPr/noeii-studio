const STORAGE_KEY = "noeii_admin_authed";

export function isAdminAuthed(): boolean {
  return localStorage.getItem(STORAGE_KEY) === "true";
}

export function adminLogin(passcode: string): boolean {
  // Temporary passcode (change later or move to env)
  const OK = passcode === "noeii-admin";

  if (OK) localStorage.setItem(STORAGE_KEY, "true");
  return OK;
}

export function adminLogout() {
  localStorage.removeItem(STORAGE_KEY);
}
