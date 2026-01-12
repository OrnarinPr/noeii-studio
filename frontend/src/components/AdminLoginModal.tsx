import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "@/components/ui/use-toast";

type Props = {
  open: boolean;
  onClose: () => void;
};

const AdminLoginModal = ({ open, onClose }: Props) => {
  const { login } = useAdmin();
  const [passcode, setPasscode] = useState("");

  if (!open) return null;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const ok = login(passcode.trim());
    if (!ok) {
      toast({
        title: "Login failed",
        description: "Incorrect passcode.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Welcome",
      description: "Admin mode enabled.",
    });
    setPasscode("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-background border border-border p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="font-serif text-xl">Admin Login</div>
            <div className="text-sm text-muted-foreground mt-1">
              Enter passcode to edit content.
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Close
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Passcode"
            className="w-full border border-border bg-background px-4 py-3 outline-none"
            autoFocus
          />

          <button
            type="submit"
            disabled={passcode.trim().length === 0}
            className="w-full border-thin px-4 py-3 text-caption hover:bg-accent transition-colors disabled:opacity-50"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginModal;
