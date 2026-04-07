import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, FolderOpen, MessageSquare, Plus } from "lucide-react";

// API & Stores (Your original logic)
import { getStats, getCollections, getChatHistory } from "@/utils/api";
import useCollectionStore from "@/stores/collectionStore";
import useChatStore from "@/stores/chatStore";
import useAuthStore from "@/stores/authStore";
import { CATEGORY_COLORS } from "@/utils/constants";

// --- Template UI Components ---
const Card = ({ children, className, onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white border border-slate-200 rounded-xl shadow-sm ${className}`}
  >
    {children}
  </div>
);

const Button = ({ children, onClick, variant = "primary", size = "md", className = "" }) => {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-slate-200 text-slate-600 hover:bg-slate-50",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
  };
  return (
    <button 
      onClick={onClick} 
      className={`${variants[variant]} ${sizes[size]} ${className} font-medium rounded-lg transition-colors flex items-center justify-center`}
    >
      {children}
    </button>
  );
};

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />
);

// --- Main Component ---
export default function DashboardPage() {
  const navigate = useNavigate();
  
  // Logic: Original Store Hooks
  const { user } = useAuthStore();
  const { stats, setStats, collections, setCollections } = useCollectionStore();
  const { chats, setChats } = useChatStore();
  const [loading, setLoading] = useState(true);

  // Logic: Original Data Fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, collectionsRes, chatsRes] = await Promise.all([
          getStats(), getCollections(), getChatHistory(),
        ]);
        setStats(statsRes.data);
        setCollections(collectionsRes.data);
        setChats(chatsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [setStats, setCollections, setChats]);

  // Logic: Original Stat Cards Mapping
  const statCards = [
    { label: "Collections", value: stats.totalCollections, icon: <FolderOpen className="h-6 w-6 text-blue-600" />, bg: "bg-blue-50" },
    { label: "Documents", value: stats.totalDocuments, icon: <FileText className="h-6 w-6 text-emerald-600" />, bg: "bg-emerald-50" },
    { label: "Chats", value: stats.totalChats, icon: <MessageSquare className="h-6 w-6 text-violet-600" />, bg: "bg-violet-50" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 text-slate-900">
      <div className="max-w-6xl mx-auto space-y-8 text-left">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {user?.name?.split(" ")[0] || "User"} 👋
          </h1>
          <p className="text-slate-500 mt-1">
            Here's an overview of your medical knowledge base
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {loading ? (
            Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-24" />)
          ) : (
            statCards.map((s, i) => (
              <Card key={i} className="flex items-center gap-4 p-5">
                <div className={`rounded-xl p-3 ${s.bg}`}>{s.icon}</div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                  <p className="text-sm text-slate-500 font-medium">{s.label}</p>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Recent Collections Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Recent Collections</h2>
            <Button onClick={() => navigate("/collections")} variant="outline" size="sm">
              View All
            </Button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-32" />)}
            </div>
          ) : collections.length === 0 ? (
            <Card className="p-10 text-center border-dashed border-slate-300 bg-transparent">
              <FolderOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 mb-4">No collections yet</p>
              <Button onClick={() => navigate("/collections")} className="mx-auto">
                <Plus className="w-4 h-4 mr-2" /> Create Collection
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {collections.slice(0, 6).map((col) => (
                <Card
                  key={col._id}
                  className="p-5 cursor-pointer hover:border-blue-300 transition-all"
                  onClick={() => navigate(`/collections/${col._id}`)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-slate-900 truncate pr-2">{col.name}</h3>
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold whitespace-nowrap ${CATEGORY_COLORS[col.category] || "bg-slate-100 text-slate-600"}`}>
                      {col.category}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">{col.documentCount} documents</p>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Recent Chats Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Recent Chats</h2>
            <Button onClick={() => navigate("/chats")} variant="outline" size="sm">
              View All
            </Button>
          </div>
          
          {chats.length === 0 && !loading ? (
             <Card className="p-8 text-center border-dashed border-slate-300 bg-transparent">
               <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
               <p className="text-slate-500 text-sm">No chats yet. Start by opening a collection.</p>
             </Card>
          ) : (
            <Card className="overflow-hidden">
              <div className="divide-y divide-slate-100">
                {loading ? (
                  Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-14 m-2" />)
                ) : (
                  chats.slice(0, 5).map((chat) => (
                    <div
                      key={chat._id}
                      className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors"
                      onClick={() => navigate(`/chats/${chat._id}`)}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <MessageSquare className="h-4 w-4 text-slate-400 flex-shrink-0" />
                        <span className="text-sm font-medium text-slate-700 truncate">{chat.title}</span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono ml-4 flex-shrink-0">
                        {new Date(chat.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </Card>
          )}
        </div>
        
      </div>
    </div>
  );
}