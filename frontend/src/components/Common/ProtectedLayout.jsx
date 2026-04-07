import { Navigate, Outlet } from "react-router-dom";
import { useState } from "react";
import { Menu } from "lucide-react";
import useAuthStore from "@/stores/authStore";
import Sidebar from "./Sidebar";

export default function ProtectedLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-gray-200 bg-white/90 px-4 backdrop-blur lg:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 p-2 text-gray-700 hover:bg-gray-100 lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">MediQuery</p>
          </div>
        </header>
 <div className="flex min-h-[calc(100vh-3.5rem)] flex-col">
          <div className="flex-1 p-4 lg:p-6">
            <Outlet />
          </div></div>
         <footer className="border-t border-gray-200 bg-white px-4 py-4 text-sm text-gray-500 lg:px-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p>© 2026 MediQuery. All rights reserved.</p>
              <p className="text-xs sm:text-sm">Built for secure internal workflows.</p>
            </div>
          </footer>
      </main>
    </div>
  );
}