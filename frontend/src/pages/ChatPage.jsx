import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Send, Download, AlertCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getChatById, sendMessage, exportChat } from "@/utils/api";
import useChatStore from "@/stores/chatStore";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const { id } = useParams();
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
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col">
      {!activeChat ? (
        <div className="flex flex-1 items-center justify-center p-8 text-center">
          <div>
            <MessageSquare className="mx-auto mb-4 h-14 w-14 text-gray-200" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              No chat selected
            </h3>
            <p className="text-sm text-gray-500">
              Open a chat from the sidebar or create a new one.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
            <h2 className="truncate font-semibold text-gray-900">
              {activeChat.title}
            </h2>
            <Button onClick={handleExport} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto bg-gray-50 p-6 space-y-6">
            {loadingChat ? (
              Array(3)
                .fill(0)
                .map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)
            ) : messages.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-gray-400">
                  Ask your first question about the documents in this collection
                </p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-2xl",
                      msg.role === "user" ? "items-end" : "items-start"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-3 text-sm",
                        msg.role === "user"
                          ? "rounded-br-sm bg-blue-600 text-white"
                          : "rounded-bl-sm border border-gray-100 bg-white text-gray-800 shadow-sm"
                      )}
                    >
                      {msg.content}
                    </div>

                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {msg.sources.map((src, j) => (
                          <div key={j} className="flex items-center gap-1.5 text-xs text-gray-500">
                            <AlertCircle className="h-3 w-3 text-blue-500" />
                            <span>{src.source}</span>
                            {src.page !== "N/A" && (
                              <Badge variant="outline" className="py-0 text-xs">
                                Page {src.page}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {msg.role === "assistant" && (
                      <p className="mt-1 text-xs text-gray-400">
                        ⚠️ For informational purposes only. Consult a medical professional.
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-300" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-300" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-300" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-100 bg-white px-6 py-4">
            <div className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask a medical question..."
                className="flex-1"
                disabled={isLoading || !activeChat?._id}
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim() || !activeChat?._id}
                className="bg-blue-600 px-4 hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}