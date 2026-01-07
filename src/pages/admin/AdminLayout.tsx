import { Outlet, NavLink } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border p-6">
        <h1 className="font-serif text-xl mb-10">NOEII Admin</h1>

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

      {/* Main */}
      <main className="flex-1 p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
