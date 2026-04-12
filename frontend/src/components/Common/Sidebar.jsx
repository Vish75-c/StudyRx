import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, LayoutDashboard, FolderOpen, MessageSquare,
  User, LogOut, X, Plus, Trash2, Sparkles,
  GraduationCap, History,
} from "lucide-react";
import useAuthStore from "@/stores/authStore";
import useChatStore from "@/stores/chatStore";
import useCollectionStore from "@/stores/collectionStore";
import { createChat, deleteChat, getChatHistory, getCollections } from "@/utils/api";
import toast from "react-hot-toast";
import { cn } from "../../utils/cn";

const navItems = [
  { icon: <LayoutDashboard className="h-4.5 w-4.5" />, label: "Dashboard", path: "/dashboard" },
  { icon: <FolderOpen className="h-4.5 w-4.5" />, label: "Collections", path: "/collections" },
  { icon: <MessageSquare className="h-4.5 w-4.5" />, label: "Chats", path: "/chats" },
  { icon: <GraduationCap className="h-4.5 w-4.5" />, label: "Quizzes", path: "/quiz" },
  { icon: <History className="h-4.5 w-4.5" />, label: "Quiz History", path: "/quiz/history" },
  { icon: <User className="h-4.5 w-4.5" />, label: "Profile", path: "/profile" },
];

export default function Sidebar({ open, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { chats, setChats, addChat, removeChat, setActiveChat } = useChatStore();
  const collections = useCollectionStore((s) => s.collections);
  const isChatRoute = location.pathname.startsWith("/chats");

  const setCollections = useCollectionStore((s) => s.setCollections);

  // Fetch chat history and collections — re-fetch when navigating to chat pages
  useEffect(() => {
    getChatHistory()
      .then((res) => setChats(res.data))
      .catch(() => {});
    getCollections()
      .then((res) => setCollections(res.data))
      .catch(() => {});
  }, [setChats, setCollections, location.pathname]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    onClose();
    navigate("/");
  };

  const isActive = (path) => {
    if (path === "/quiz") return location.pathname === "/quiz";
    if (path === "/quiz/history") return location.pathname === "/quiz/history";
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleNewChat = async (collectionId) => {
    try {
      const res = await createChat({ collectionId });
      const chat = res.data?.chat ?? res.data;
      addChat(chat);
      setActiveChat(chat);
      navigate(`/chats/${chat._id}`);
      onClose();
      toast.success("Chat created");
    } catch {
      toast.error("Failed to create chat");
    }
  };

  const handleOpenChat = (chat) => {
    setActiveChat(chat);
    navigate(`/chats/${chat._id}`);
    onClose();
  };

  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation();
    try {
      await deleteChat(chatId);
      removeChat(chatId);
      if (location.pathname === `/chats/${chatId}`) navigate("/chats");
      toast.success("Chat deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex h-screen w-64 flex-col overflow-hidden border-r border-slate-100 bg-white/95 backdrop-blur-xl shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:shadow-none",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-200/50 group-hover:shadow-violet-300/50 transition-shadow">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 font-[Syne]">Medic.AI</span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 lg:hidden transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 border-b border-slate-100 p-3">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-linear-to-r from-violet-50 to-indigo-50 text-violet-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-linear-to-b from-violet-500 to-indigo-500 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className={active ? "text-violet-600" : ""}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Chat section */}
        {isChatRoute && (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="border-b border-slate-100 p-3">
              <p className="px-2 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <Plus className="h-3 w-3" /> New chat from
              </p>
              <div className="max-h-36 space-y-0.5 overflow-y-auto pr-1 no-scrollbar">
                {collections.map((col) => (
                  <button
                    key={col._id}
                    onClick={() => handleNewChat(col._id)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-slate-500 transition-colors hover:bg-violet-50 hover:text-violet-700 font-medium"
                  >
                    <FolderOpen className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{col.name}</span>
                  </button>
                ))}
                {collections.length === 0 && (
                  <p className="px-3 py-2 text-xs text-slate-400 italic">No collections found</p>
                )}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-2 no-scrollbar">
              <p className="px-2 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" /> Recent chats
              </p>
              <div className="space-y-0.5">
                {chats.map((chat) => (
                  <div
                    key={chat._id}
                    onClick={() => handleOpenChat(chat)}
                    className={cn(
                      "group flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                      isActive(`/chats/${chat._id}`)
                        ? "bg-violet-50 text-violet-700"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                    )}
                  >
                    <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                    <span className="min-w-0 flex-1 truncate text-xs font-medium">{chat.title}</span>
                    <button
                      onClick={(e) => handleDeleteChat(e, chat._id)}
                      className="rounded p-1 text-slate-300 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 transition-all"
                      aria-label="Delete chat"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                {chats.length === 0 && (
                  <p className="px-2 py-2 text-xs text-slate-400 italic">No recent chats yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* User & Logout */}
        <div className="mt-auto border-t border-slate-100 bg-white p-3">
          <div className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2.5 bg-slate-50/80">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white shadow-sm">
              {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">{user?.name ?? "User"}</p>
              <p className="truncate text-[11px] text-slate-400">{user?.email ?? ""}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}