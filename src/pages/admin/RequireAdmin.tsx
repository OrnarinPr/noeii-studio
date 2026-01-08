import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAdminAuthed } from "@/services/adminAuth";

const RequireAdmin = () => {
  const location = useLocation();

  if (!isAdminAuthed()) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default RequireAdmin;
