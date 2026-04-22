import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Download, AlertCircle, MessageSquare,
  Loader2, FileText, User, Brain, Sparkles
} from "lucide-react";
import { getChatById, sendMessage, exportChat } from "@/utils/api";
import useChatStore from "@/stores/chatStore";
import toast from "react-hot-toast";

export default function ChatPage() {
  const { id } = useParams();
  const {
    activeChat, setActiveChat,
    messages, addMessage,
    isLoading, setLoading,
  } = useChatStore();

  const [input, setInput] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!id) { setActiveChat(null); return; }
    setLoadingChat(true);
    getChatById(id)
      .then((r) => setActiveChat(r.data?.chat ?? r.data))
      .catch(() => setActiveChat(null))
      .finally(() => setLoadingChat(false));
  }, [id, setActiveChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !activeChat?._id) return;
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
    <div className="flex flex-col h-[calc(100vh-3.5rem)] w-full bg-slate-50 text-left overflow-hidden">
      {!activeChat && !loadingChat ? (
        /* ── Empty state ── */
        <div className="flex-1 mt-55 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4 max-w-sm w-full"
          >
            <div className="mx-auto h-20 w-20 bg-linear-to-br from-violet-50 to-indigo-50 rounded-2xl flex items-center justify-center border border-violet-100/50">
              <MessageSquare className="h-9 w-9 text-violet-300" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 font-[Syne]">No chat selected</p>
              <p className="text-sm text-slate-500 mx-auto max-w-xs mt-1">
                Open a chat from the sidebar or create a new one to start your  research.
              </p>
            </div>
          </motion.div>
        </div>
      ) : (
        <>
          {/* ── Header ── */}
          <header className="shrink-0 flex items-center justify-between border-b border-slate-100 glass px-4 sm:px-6 py-3 sm:py-4 z-10">
            <div className="flex items-center gap-3 overflow-hidden min-w-0">
              <div className="h-9 w-9 bg-linear-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-violet-200/40">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-slate-900 truncate max-w-[50vw] sm:max-w-[60vw]">
                  {activeChat?.title ?? "Loading Research Chat..."}
                </h2>
                <p className="text-[11px] text-slate-400 font-medium">AI  Research Assistant</p>
              </div>
            </div>
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200 transition-all shrink-0"
            >
              <Download className="h-3.5 w-3.5" />
              Export PDF
            </button>
          </header>

          {/* ── Messages ── */}
          <div className="flex-1 overflow-y-scroll no-scrollbar min-h-0 px-3 sm:px-4 md:px-8 lg:px-10 py-6 sm:py-8 space-y-6">
            {loadingChat ? (
              <div className="max-w-4xl mx-auto w-full space-y-6">
                <div className="h-16 w-3/4 ml-auto animate-pulse bg-violet-50 rounded-2xl" />
                <div className="h-32 w-full animate-pulse bg-white rounded-2xl border border-slate-100" />
                <div className="h-20 w-2/3 ml-auto animate-pulse bg-violet-50 rounded-2xl" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full px-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center space-y-3"
                >
                  <Sparkles className="h-8 w-8 text-violet-300 mx-auto" />
                  <p className="text-slate-400 text-sm font-medium max-w-md">
                    Ask a question about your uploaded  documents...
                  </p>
                </motion.div>
              </div>
            ) : (
              <div className="max-w-3xl lg:max-w-4xl mx-auto w-full space-y-5 sm:space-y-6">
                <AnimatePresence initial={false}>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex gap-3 sm:gap-3.5 max-w-[92%] sm:max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                        {/* Avatar */}
                        <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                          msg.role === "user"
                            ? "bg-linear-to-br from-violet-600 to-indigo-600 text-white"
                            : "bg-white border border-slate-200 text-violet-600"
                        }`}>
                          {msg.role === "user" ? <User size={14} /> : <Brain size={14} />}
                        </div>

                        {/* Bubble */}
                        <div className={`rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 max-w-full ${
                          msg.role === "user"
                            ? "bg-linear-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200/30"
                            : "bg-white border border-slate-100 text-slate-800 shadow-sm card-glow"
                        }`}>
                          <p className="text-sm leading-relaxed whitespace-pre-line font-medium wrap-break-words">
                            {msg.content}
                          </p>

                          {/* Sources */}
                          {msg.sources && msg.sources.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-slate-100/50">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Sources Found</p>
                              <div className="flex flex-wrap gap-2">
                                {msg.sources.map((src, j) => (
                                  <div
                                    key={j}
                                    className="flex items-center gap-1.5 bg-violet-50 border border-violet-100/50 rounded-lg px-2.5 py-1 max-w-full"
                                  >
                                    <AlertCircle className="h-3 w-3 text-violet-500 shrink-0" />
                                    <span className="text-[11px] font-bold text-slate-600 truncate max-w-30 sm:max-w-40">{src.source}</span>
                                    {src.page && src.page !== "N/A" && (
                                      <span className="inline-flex items-center rounded-md bg-violet-100 px-1.5 py-0.5 text-[9px] font-bold text-violet-700 border border-violet-200/50 uppercase">
                                        Pg. {src.page}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Disclaimer */}
                          {msg.role === "assistant" && (
                            <div className="mt-4 flex items-start gap-2 text-[10px] text-slate-400 italic">
                              <span className="shrink-0">⚠️</span>
                              <span>For informational purposes only. Verify with a licensed professional.</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start max-w-4xl mx-auto"
                  >
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                        <Loader2 className="h-4 w-4 text-violet-500 animate-spin" />
                      </div>
                      <div className="bg-white border border-slate-100 rounded-2xl px-5 py-4 shadow-sm">
                        <div className="flex gap-1.5 pt-1">
                          <span className="w-2 h-2 rounded-full bg-violet-300 animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-2 h-2 rounded-full bg-violet-300 animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-2 h-2 rounded-full bg-violet-300 animate-bounce" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* ── Input ── */}
          <footer className="border-t border-slate-100 glass px-3 sm:px-4 md:px-6 py-3 sm:py-4 pb-4 sm:pb-4">
            <div className="max-w-5xl mx-auto w-full flex gap-3 items-end">
              <textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask about medications, symptoms, or research data..."
                rows={1}
                className="flex-1 min-w-0 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm
                focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400
                transition-all disabled:opacity-50 resize-none overflow-hidden leading-relaxed shadow-sm"
                disabled={isLoading || !activeChat?._id}
              />

              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim() || !activeChat?._id}
                className="rounded-xl h-10.5 w-10.5 flex items-center justify-center bg-linear-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200/40 hover:from-violet-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                <Send size={16} />
              </button>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}