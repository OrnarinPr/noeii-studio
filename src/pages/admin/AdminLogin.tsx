import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "@/services/adminAuth";
import { toast } from "@/components/ui/use-toast";

const AdminLogin = () => {
  const [passcode, setPasscode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const ok = adminLogin(passcode.trim());

    if (!ok) {
      toast({
        title: "Login failed",
        description: "Incorrect passcode.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    toast({
      title: "Welcome",
      description: "You are now signed in as admin.",
    });
    navigate("/admin", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md border border-border p-8">
        <h1 className="font-serif text-2xl mb-2">NOEII Admin</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Enter passcode to continue.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
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
            disabled={isSubmitting || passcode.trim().length === 0}
            className="w-full border-thin px-4 py-3 text-caption hover:bg-accent transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-xs text-muted-foreground mt-6">
          Temporary auth for development. Replace with real auth later.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
