import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/stores/authStore";
import Sidebar from "./Sidebar";

export default function ProtectedLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 flex-1 min-h-screen bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}