import { useEffect, useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

export default function AdminBar() {
  const { isAdmin, editMode, setEditMode, login, logout } = useAdmin();

  const [open, setOpen] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset modal state when closed
  useEffect(() => {
    if (!open) {
      setPasscode("");
      setLoading(false);
    }
  }, [open]);

  const onLogin = async () => {
    if (!passcode.trim()) {
      toast({ title: "Missing passcode", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      await login(passcode.trim());
      setOpen(false);
      toast({ title: "Admin unlocked" });
    } catch (e: any) {
      toast({
        title: "Login failed",
        description: e?.message || "Invalid passcode",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Bottom bar */}
      <div className="fixed left-0 right-0 bottom-0 z-[60] border-t border-border bg-background/85 backdrop-blur">
        <div className="container-custom py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="text-caption text-muted-foreground">
            {isAdmin ? "Admin" : "Viewer"}
            {isAdmin ? (editMode ? " • Edit mode ON" : " • Edit mode OFF") : ""}
          </div>

          <div className="flex items-center gap-3">
            {isAdmin ? (
              <>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="text-caption border-thin px-3 py-2 hover:bg-accent transition-colors"
                >
                  {editMode ? "Disable Edit" : "Enable Edit"}
                </button>

                <button
                  onClick={logout}
                  className="text-caption border-thin px-3 py-2 hover:bg-accent transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setOpen(true)}
                className="text-caption border-thin px-3 py-2 hover:bg-accent transition-colors"
              >
                Admin Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Responsive modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="
            w-[92vw] max-w-md sm:max-w-lg
            p-6 sm:p-8
            border border-border
            bg-background
            shadow-xl
          "
        >
          <DialogHeader className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <DialogTitle className="font-serif text-xl sm:text-2xl font-light">
                  Admin Login
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter passcode to enable editing.
                </p>
              </div>

              <DialogClose className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Close
              </DialogClose>
            </div>
          </DialogHeader>

          <div className="mt-4">
            <div className="text-caption mb-2">Passcode</div>

            <input
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onLogin();
              }}
              className="w-full border border-border bg-background px-4 py-3 outline-none"
              placeholder="••••••••"
              type="password"
              autoFocus
            />

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="text-caption border-thin px-4 py-3 hover:bg-accent transition-colors"
                disabled={loading}
              >
                Cancel
              </button>

              <button
                onClick={onLogin}
                disabled={loading}
                className="text-caption border-thin px-4 py-3 hover:bg-accent transition-colors disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
