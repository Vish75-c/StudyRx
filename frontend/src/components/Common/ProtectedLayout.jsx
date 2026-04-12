import { Navigate, Outlet, useLocation, useMatch } from "react-router-dom";
import { useState } from "react";
import { Menu, Brain } from "lucide-react";
import useAuthStore from "@/stores/authStore";
import Sidebar from "./Sidebar";

export default function ProtectedLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const isChatPage = useMatch('/chats/:id');

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="min-h-screen lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-slate-100 glass px-4 lg:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200 transition-all lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0 flex items-center gap-2">
            <Brain className="h-4 w-4 text-violet-500 hidden lg:block" />
            <p className="text-sm font-semibold text-slate-900 font-[Syne]">StudyRx</p>
          </div>
        </header>

        <div className="flex min-h-[calc(100vh-3.5rem)] flex-col">
          <div className={`flex-1 ${!isChatPage ? "p-4 lg:p-6" : ""}`}>
            <Outlet />
          </div>
        </div>

        {!isChatPage && (
          <footer className="border-t border-slate-100 bg-white/80 backdrop-blur-sm px-4 py-4 text-sm text-slate-400 lg:px-6">
            <div className="flex font-medium text-xs flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p>© 2026 StudyRx. All rights reserved.</p>
              <p className="text-xs text-slate-400">~Vishal</p>
            </div>
          </footer>
        )}
      </main>
    </div>
  );
}