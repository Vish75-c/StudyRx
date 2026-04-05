import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Send, Download, Trash2, Plus, MessageSquare, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getChatHistory, getChatById, sendMessage, createChat, deleteChat, exportChat, getCollections } from "@/utils/api";
import useChatStore from "@/stores/chatStore";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { chats, setChats, activeChat, setActiveChat, messages, addMessage, isLoading, setLoading, addChat, removeChat } = useChatStore();
  const [input, setInput] = useState("");
  const [collections, setCollections] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    getChatHistory().then((r) => setChats(r.data));
    getCollections().then((r) => setCollections(r.data));
  }, []);

  useEffect(() => {
    if (id) {
      setLoadingChat(true);
      getChatById(id).then((r) => { setActiveChat(r.data); setLoadingChat(false); });
    }
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const question = input.trim();
    setInput("");
    addMessage({ role: "user", content: question, sources: [] });
    setLoading(true);
    try {
      const res = await sendMessage(activeChat._id, { question });
      addMessage({ role: "assistant", content: res.data.answer, sources: res.data.sources });
    } catch {
      toast.error("Failed to get response");
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = async (collectionId) => {
    try {
      const res = await createChat({ collectionId });
      addChat(res.data);
      navigate(`/chats/${res.data._id}`);
    } catch { toast.error("Failed to create chat"); }
  };

  const handleDelete = async (e, chatId) => {
    e.stopPropagation();
    try {
      await deleteChat(chatId);
      removeChat(chatId);
      if (id === chatId) navigate("/chats");
      toast.success("Chat deleted");
    } catch { toast.error("Failed to delete"); }
  };

  const handleExport = async () => {
    try {
      const res = await exportChat(activeChat._id);
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `chat-${activeChat._id}.pdf`;
      a.click();
      toast.success("Chat exported!");
    } catch { toast.error("Export failed"); }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-100 flex flex-col bg-white">
        <div className="p-4 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-700 mb-3">Start New Chat</p>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {collections.map((col) => (
              <button
                key={col._id}
                onClick={() => handleNewChat(col._id)}
                className="w-full text-left text-xs px-3 py-2 rounded-lg hover:bg-blue-50 text-gray-600 hover:text-blue-700 flex items-center gap-2 transition-colors"
              >
                <Plus className="w-3 h-3" /> {col.name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <p className="text-xs text-gray-400 px-2 py-1 font-medium">Recent Chats</p>
          {chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => navigate(`/chats/${chat._id}`)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer group text-sm transition-colors",
                id === chat._id ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50 text-gray-600"
              )}
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0" />
              <span className="flex-1 truncate text-xs">{chat.title}</span>
              <button onClick={(e) => handleDelete(e, chat._id)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {!activeChat ? (
          <div className="flex-1 flex items-center justify-center text-center p-8">
            <div>
              <MessageSquare className="w-14 h-14 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No chat selected</h3>
              <p className="text-gray-500 text-sm">Select a collection on the left to start a new chat</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between bg-white">
              <h2 className="font-semibold text-gray-900 truncate">{activeChat.title}</h2>
              <Button onClick={handleExport} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" /> Export PDF
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
              {loadingChat ? (
                Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)
              ) : messages.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-sm">Ask your first question about the documents in this collection</p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                    <div className={cn("max-w-2xl", msg.role === "user" ? "items-end" : "items-start")}>
                      <div className={cn(
                        "rounded-2xl px-4 py-3 text-sm",
                        msg.role === "user"
                          ? "bg-blue-600 text-white rounded-br-sm"
                          : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm shadow-sm"
                      )}>
                        {msg.content}
                      </div>
                      {/* Sources */}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {msg.sources.map((src, j) => (
                            <div key={j} className="flex items-center gap-1.5 text-xs text-gray-500">
                              <AlertCircle className="w-3 h-3 text-blue-500" />
                              <span>{src.source}</span>
                              {src.page !== "N/A" && <Badge variant="outline" className="text-xs py-0">Page {src.page}</Badge>}
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Disclaimer */}
                      {msg.role === "assistant" && (
                        <p className="text-xs text-gray-400 mt-1">⚠️ For informational purposes only. Consult a medical professional.</p>
                      )}
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-100 px-6 py-4 bg-white">
              <div className="flex gap-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask a medical question..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button onClick={handleSend} disabled={isLoading || !input.trim()} className="bg-blue-600 hover:bg-blue-700 px-4">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}