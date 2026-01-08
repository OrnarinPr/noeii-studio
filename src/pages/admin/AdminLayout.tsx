import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { adminLogout } from "@/services/adminAuth";

const linkClass = (isActive: boolean) =>
  [
    "block w-full rounded-md px-3 py-2 text-sm transition-colors",
    isActive ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
  ].join(" ");

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const onLogout = () => {
    adminLogout();
    navigate("/admin/login", { replace: true });
  };

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      <div className="flex items-start justify-between gap-3 p-6 border-b border-border">
        <div>
          <h1 className="font-serif text-xl leading-none">NOEII Admin</h1>
          <p className="text-xs text-muted-foreground mt-2">Manage content</p>
        </div>

        <button
          onClick={onLogout}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Logout
        </button>
      </div>

      <nav className="p-4 space-y-2">
        <NavLink to="/admin" end className={({ isActive }) => linkClass(isActive)}>
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/projects"
          className={({ isActive }) => linkClass(isActive)}
        >
          Projects
        </NavLink>

        <NavLink
          to="/admin/products"
          className={({ isActive }) => linkClass(isActive)}
        >
          Shop Products
        </NavLink>
      </nav>

      <div className="mt-auto p-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} NOEII
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="inline-flex items-center justify-center border border-border px-3 py-2 text-xs"
            aria-label="Open menu"
          >
            Menu
          </button>

          <div className="text-sm font-medium">Admin</div>

          <button
            onClick={onLogout}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-72 border-r border-border">
          <SidebarContent />
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 md:p-10">
          <Outlet />
        </main>
      </div>

      {/* Mobile drawer */}
      <div
        className={[
          "md:hidden fixed inset-0 z-50",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        ].join(" ")}
        aria-hidden={!mobileOpen}
      >
        {/* Overlay */}
        <div
          className={[
            "absolute inset-0 bg-black/40 transition-opacity",
            mobileOpen ? "opacity-100" : "opacity-0",
          ].join(" ")}
          onClick={() => setMobileOpen(false)}
        />

        {/* Panel */}
        <div
          className={[
            "absolute left-0 top-0 h-full w-[78vw] max-w-[320px] bg-background border-r border-border",
            "transition-transform duration-200",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="font-serif text-lg">NOEII Admin</div>
            <button
              onClick={() => setMobileOpen(false)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close menu"
            >
              Close
            </button>
          </div>

          <SidebarContent />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
