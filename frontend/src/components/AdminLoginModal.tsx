import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitPasscode: (passcode: string) => Promise<void> | void;
};

export default function AdminLoginModal({ open, onOpenChange, onSubmitPasscode }: Props) {
  const [passcode, setPasscode] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setPasscode("");
      setLoading(false);
    }
  }, [open]);

  const onSubmit = async () => {
    if (!passcode.trim()) {
      toast({
        title: "Missing passcode",
        description: "Please enter passcode.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await onSubmitPasscode(passcode.trim());
      onOpenChange(false);
    } catch (e: any) {
      toast({
        title: "Login failed",
        description: e?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSubmit();
            }}
            className="w-full border border-border bg-background px-4 py-3 outline-none"
            placeholder="••••••••"
            autoFocus
          />

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              onClick={() => onOpenChange(false)}
              className="text-caption border-thin px-4 py-3 hover:bg-accent transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              className="text-caption border-thin px-4 py-3 hover:bg-accent transition-colors"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
