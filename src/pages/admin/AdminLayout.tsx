import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { adminLogout } from "@/services/adminAuth";

const AdminLayout = () => {
  const navigate = useNavigate();

  const onLogout = () => {
    adminLogout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 border-r border-border p-6">
        <div className="flex items-start justify-between gap-3 mb-10">
          <h1 className="font-serif text-xl">NOEII Admin</h1>
          <button
            onClick={onLogout}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Logout
          </button>
        </div>

        <nav className="space-y-4">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              isActive ? "font-medium" : "text-muted-foreground"
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/projects"
            className={({ isActive }) =>
              isActive ? "font-medium" : "text-muted-foreground"
            }
          >
            Projects
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              isActive ? "font-medium" : "text-muted-foreground"
            }
          >
            Shop Products
          </NavLink>
        </nav>
      </aside>

      <main className="flex-1 p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
