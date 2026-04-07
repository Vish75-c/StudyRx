import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  Brain,
  LayoutDashboard,
  FolderOpen,
  MessageSquare,
  User,
  LogOut,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import useAuthStore from "@/stores/authStore";
import useChatStore from "@/stores/chatStore";
import useCollectionStore from "@/stores/collectionStore";
import { createChat, deleteChat } from "@/utils/api";
import toast from "react-hot-toast";
import { cn } from "../../utils/cn";

const navItems = [
  { icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard", path: "/dashboard" },
  { icon: <FolderOpen className="h-5 w-5" />, label: "Collections", path: "/collections" },
  { icon: <MessageSquare className="h-5 w-5" />, label: "Chats", path: "/chats" },
  { icon: <User className="h-5 w-5" />, label: "Profile", path: "/profile" },
];

export default function Sidebar({ open, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const { chats, setChats, addChat, removeChat, setActiveChat } = useChatStore();
  const collections = useCollectionStore((s) => s.collections);

  const isChatRoute = location.pathname.startsWith("/chats");

  useEffect(() => {
    // chats are still loaded from API/store here
    // collections come from useCollectionStore
  }, [setChats]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    onClose();
    navigate("/");
  };

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

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
      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/40 transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex h-screen w-64 flex-col overflow-hidden border-r border-gray-100 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:shadow-none",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between border-b border-gray-100 p-6">
          <div className="flex items-center gap-2">
            <Brain className="h-7 w-7 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">MediQuery</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1 border-b border-gray-100 p-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive(item.path)
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {isChatRoute && (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="border-b border-gray-100 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Create chat
              </p>

              <div className="max-h-40 space-y-1 overflow-y-auto pr-1">
                {collections.map((col) => (
                  <button
                    key={col._id}
                    onClick={() => handleNewChat(col._id)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Plus className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{col.name}</span>
                  </button>
                ))}

                {collections.length === 0 && (
                  <p className="px-3 py-2 text-xs text-gray-400">
                    No collections found
                  </p>
                )}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-2">
              <p className="px-2 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Recent chats
              </p>

              <div className="space-y-1">
                {chats.map((chat) => (
                  <div
                    key={chat._id}
                    onClick={() => handleOpenChat(chat)}
                    className={cn(
                      "group flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive(`/chats/${chat._id}`)
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                    <span className="min-w-0 flex-1 truncate text-xs">
                      {chat.title}
                    </span>

                    <button
                      onClick={(e) => handleDeleteChat(e, chat._id)}
                      className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                      aria-label="Delete chat"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}

                {chats.length === 0 && (
                  <p className="px-2 py-2 text-xs text-gray-400">
                    No recent chats yet
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-auto border-t border-gray-100 bg-white p-4">
          <div className="mb-3 flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
              {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">
                {user?.name ?? "User"}
              </p>
              <p className="truncate text-xs text-gray-500">
                {user?.email ?? ""}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}