import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PublicRoute() {
  const { user } = useSelector((state) => state.auth);

  const token = localStorage.getItem("accessToken");

  if (user || token) {
    return <Navigate to="/projects" replace />;
  }

  return <Outlet />;
}