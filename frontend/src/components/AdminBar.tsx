import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import AdminLoginModal from "@/components/AdminLoginModal";

const AdminBar = () => {
  const { isAdmin, editMode, setEditMode, logout } = useAdmin();
  const [open, setOpen] = useState(false);

  if (!isAdmin) {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 left-6 z-50 border border-border bg-background/90 backdrop-blur px-4 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Admin
        </button>
        <AdminLoginModal open={open} onClose={() => setOpen(false)} />
      </>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2 border border-border bg-background/90 backdrop-blur px-3 py-2">
      <span className="text-xs text-muted-foreground">Admin</span>

      <button
        onClick={() => setEditMode(!editMode)}
        className="text-xs border border-border px-3 py-1 hover:bg-accent transition-colors"
      >
        Edit Mode: {editMode ? "ON" : "OFF"}
      </button>

      <button
        onClick={logout}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminBar;
