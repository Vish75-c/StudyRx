import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, FolderOpen, MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getStats, getCollections, getChatHistory } from "@/utils/api";
import useCollectionStore from "@/stores/collectionStore";
import useChatStore from "@/stores/chatStore";
import useAuthStore from "@/stores/authStore";
import { useState } from "react";
import { CATEGORY_COLORS } from "@/utils/constants";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { stats, setStats, collections, setCollections } = useCollectionStore();
  const { chats, setChats } = useChatStore();
  const [loading, setLoading] = useState(true);

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
  }, []);

  const statCards = [
    { label: "Collections", value: stats.totalCollections, icon: <FolderOpen className="w-5 h-5 text-blue-600" />, bg: "bg-blue-50" },
    { label: "Documents", value: stats.totalDocuments, icon: <FileText className="w-5 h-5 text-green-600" />, bg: "bg-green-50" },
    { label: "Chats", value: stats.totalChats, icon: <MessageSquare className="w-5 h-5 text-purple-600" />, bg: "bg-purple-50" },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name?.split(" ")[0]} 👋</h1>
        <p className="text-gray-500 mt-1">Here's an overview of your medical knowledge base</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {loading ? (
          Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
        ) : (
          statCards.map((s, i) => (
            <Card key={i} className="p-6 flex items-center gap-4 border-gray-100">
              <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center`}>{s.icon}</div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Recent Collections */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Collections</h2>
          <Button onClick={() => navigate("/collections")} variant="outline" size="sm">View All</Button>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
          </div>
        ) : collections.length === 0 ? (
          <Card className="p-8 text-center border-dashed border-gray-200">
            <FolderOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">No collections yet</p>
            <Button onClick={() => navigate("/collections")} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" /> Create Collection
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.slice(0, 6).map((col) => (
              <Card
                key={col._id}
                className="p-5 border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/collections/${col._id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 truncate">{col.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${CATEGORY_COLORS[col.category] || "bg-gray-100 text-gray-600"}`}>
                    {col.category}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{col.documentCount} documents</p>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Recent Chats */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Chats</h2>
          <Button onClick={() => navigate("/chats")} variant="outline" size="sm">View All</Button>
        </div>
        {chats.length === 0 ? (
          <Card className="p-6 text-center border-dashed border-gray-200">
            <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No chats yet. Start by opening a collection and chatting.</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {chats.slice(0, 5).map((chat) => (
              <Card
                key={chat._id}
                className="p-4 border-gray-100 hover:shadow-sm transition-shadow cursor-pointer flex items-center gap-3"
                onClick={() => navigate(`/chats/${chat._id}`)}
              >
                <MessageSquare className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700 truncate flex-1">{chat.title}</span>
                <span className="text-xs text-gray-400">{new Date(chat.createdAt).toLocaleDateString()}</span>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}