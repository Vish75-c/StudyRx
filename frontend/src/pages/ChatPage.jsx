import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { 
  Send, 
  Download, 
  AlertCircle, 
  MessageSquare, 
  Loader2, 
  FileText,
  User
} from "lucide-react";
import { getChatById, sendMessage, exportChat } from "@/utils/api";
import useChatStore from "@/stores/chatStore";
import toast from "react-hot-toast";

/** * STANDALONE UI COMPONENTS
 */
const Button = ({ children, onClick, variant = "primary", size = "md", disabled, className = "" }) => {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300",
    outline: "border border-slate-200 text-slate-600 hover:bg-slate-50",
    ghost: "text-slate-500 hover:bg-slate-100",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200"
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    icon: "p-2 w-10 h-10"
  };
  return (
    <button 
      disabled={disabled}
      onClick={onClick} 
      className={`${variants[variant]} ${sizes[size]} font-medium rounded-lg transition-all flex items-center justify-center disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
};

const Badge = ({ children, className = "" }) => (
  <span className={`inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-100 uppercase tracking-tighter ${className}`}>
    {children}
  </span>
);

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />
);

/**
 * PAGE COMPONENT
 */
export default function ChatPage() {
  const { id } = useParams();
  
  // Logic from your Store
  const {
    activeChat,
    setActiveChat,
    messages,
    addMessage,
    isLoading,
    setLoading,
  } = useChatStore();

  const [input, setInput] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch Chat Logic
  useEffect(() => {
    if (!id) {
      setActiveChat(null);
      return;
    }

    setLoadingChat(true);
    getChatById(id)
      .then((r) => setActiveChat(r.data?.chat ?? r.data))
      .catch(() => setActiveChat(null))
      .finally(() => setLoadingChat(false));
  }, [id, setActiveChat]);

  // Scroll Logic
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send Message Logic
  const handleSend = async () => {
    if (!input.trim() || isLoading || !activeChat?._id) return;

    const question = input.trim();
    setInput("");
    addMessage({ role: "user", content: question, sources: [] });
    setLoading(true);

    try {
      const res = await sendMessage(activeChat._id, { question });
      addMessage({
        role: "assistant",
        content: res.data.answer,
        sources: res.data.sources,
      });
    } catch {
      toast.error("Failed to get response");
    } finally {
      setLoading(false);
    }
  };

  // Export Logic
  const handleExport = async () => {
    if (!activeChat?._id) return;

    try {
      const res = await exportChat(activeChat._id);
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `chat-${activeChat._id}.pdf`;
      a.click();
      toast.success("Chat exported!");
    } catch {
      toast.error("Export failed");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 w-full text-left">
      {!activeChat && !loadingChat ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="mx-auto h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-slate-300" />
            </div>
            <div>
                <p className="text-lg font-bold text-slate-900">No chat selected</p>
                <p className="text-sm text-slate-500 max-w-xs mx-auto">
                    Open a chat from the sidebar or create a new one to start your medical research.
                </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm z-10">
            <div className="flex items-center gap-3 overflow-hidden">
                <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <h2 className="text-sm font-bold text-slate-900 truncate">
                {activeChat?.title ?? "Loading Research Chat..."}
                </h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="gap-2 shrink-0"
            >
              <Download className="h-3.5 w-3.5" />
              Export PDF
            </Button>
          </header>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 md:px-10 py-8 space-y-8">
            {loadingChat ? (
              <div className="max-w-4xl mx-auto space-y-6">
                <Skeleton className="h-16 w-3/4 ml-auto" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-20 w-2/3 ml-auto" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-slate-400 text-sm font-medium">
                  Ask a question about your uploaded medical documents...
                </p>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-8">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex gap-4 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                        {/* Avatar */}
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 border ${
                            msg.role === "user" 
                            ? "bg-blue-600 border-blue-700 text-white" 
                            : "bg-white border-slate-200 text-slate-600"
                        }`}>
                            {msg.role === "user" ? <User size={14} /> : <MessageSquare size={14} />}
                        </div>

                        {/* Content Bubble */}
                        <div
                        className={`rounded-2xl px-5 py-4 shadow-sm ${
                            msg.role === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-white border border-slate-200 text-slate-800"
                        }`}
                        >
                            <p className="text-sm leading-relaxed whitespace-pre-line font-medium">
                                {msg.content}
                            </p>

                            {/* Sources Section */}
                            {msg.sources && msg.sources.length > 0 && (
                                <div className="mt-4 pt-3 border-t border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Sources Found</p>
                                    <div className="flex flex-wrap gap-2">
                                        {msg.sources.map((src, j) => (
                                        <div
                                            key={j}
                                            className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-md px-2 py-1"
                                        >
                                            <AlertCircle className="h-3 w-3 text-blue-500" />
                                            <span className="text-[11px] font-bold text-slate-600 truncate max-w-[120px]">{src.source}</span>
                                            {src.page && src.page !== "N/A" && (
                                                <Badge>Pg. {src.page}</Badge>
                                            )}
                                        </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Medical Disclaimer */}
                            {msg.role === "assistant" && (
                                <div className="mt-4 flex items-start gap-2 text-[10px] text-slate-400 italic">
                                    <span className="shrink-0">⚠️</span>
                                    <span>For informational purposes only. This AI insight is derived from your documents and should be verified by a licensed professional.</span>
                                </div>
                            )}
                        </div>
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isLoading && (
                  <div className="flex justify-start max-w-4xl mx-auto">
                    <div className="flex gap-4">
                        <div className="h-8 w-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
                            <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                        </div>
                        <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm">
                            <div className="flex gap-1.5 pt-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce [animation-delay:-0.3s]" />
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce [animation-delay:-0.15s]" />
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" />
                            </div>
                        </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <footer className="border-t border-slate-200 bg-white p-4 px-2 md:p-6 pb-8">
            <div className="max-w-6xl mx-auto flex gap-3 relative">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about medications, symptoms, or research data..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-50"
                disabled={isLoading || !activeChat?._id}
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim() || !activeChat?._id}
                size="icon"
                className="rounded-xl shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
          </footer>
        </>
      )}
    </div>
  );
}