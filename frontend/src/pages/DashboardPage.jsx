import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, FolderOpen, MessageSquare, Plus, ArrowRight, Sparkles } from "lucide-react";

import { getStats, getCollections, getChatHistory } from "@/utils/api";
import useCollectionStore from "@/stores/collectionStore";
import useChatStore from "@/stores/chatStore";
import useAuthStore from "@/stores/authStore";
import { CATEGORY_COLORS } from "@/utils/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] } }),
};
const stagger = { visible: { transition: { staggerChildren: 0.06 } } };

/* ── Animated counter ── */
function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const target = Number(value) || 0;
    if (target === 0) { setDisplay(0); return; }
    let start = 0;
    const duration = 800;
    const startTime = performance.now();
    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target));
      if (progress < 1) ref.current = requestAnimationFrame(tick);
    };
    ref.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(ref.current);
  }, [value]);
  return <span>{display}</span>;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

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
  }, [setStats, setCollections, setChats]);

  const statCards = [
    { label: "Collections", value: stats.totalCollections, icon: <FolderOpen className="h-5 w-5" />, gradient: "from-blue-500 to-indigo-600", bg: "bg-blue-50", ring: "ring-blue-100" },
    { label: "Documents", value: stats.totalDocuments, icon: <FileText className="h-5 w-5" />, gradient: "from-emerald-500 to-teal-600", bg: "bg-emerald-50", ring: "ring-emerald-100" },
    { label: "Chats", value: stats.totalChats, icon: <MessageSquare className="h-5 w-5" />, gradient: "from-violet-500 to-purple-600", bg: "bg-violet-50", ring: "ring-violet-100" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 text-slate-900">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="max-w-6xl mx-auto space-y-8 text-left"
      >
        {/* Header */}
        <motion.div variants={fadeUp}>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-violet-500" />
            <span className="text-sm text-violet-600 font-medium">{getGreeting()}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-[Syne]">
            Welcome back, {user?.name?.split(" ")[0] || "User"} 👋
          </h1>
          <p className="text-slate-500 mt-1">
            Here's an overview of your medical knowledge base
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-28 animate-pulse bg-white rounded-2xl border border-slate-100" />
            ))
          ) : (
            statCards.map((s, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-100 card-glow-hover transition-all cursor-default"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${s.gradient} text-white shadow-lg shadow-slate-200/50`}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    <AnimatedNumber value={s.value} />
                  </p>
                  <p className="text-sm text-slate-500 font-medium">{s.label}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Recent Collections */}
        <motion.div variants={fadeUp} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 font-[Syne]">Recent Collections</h2>
            <button
              onClick={() => navigate("/collections")}
              className="text-sm font-medium text-violet-600 hover:text-violet-700 flex items-center gap-1 group"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(3).fill(0).map((_, i) => <div key={i} className="h-32 animate-pulse bg-white rounded-2xl border border-slate-100" />)}
            </div>
          ) : collections.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-10 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white"
            >
              <div className="mx-auto w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                <FolderOpen className="w-7 h-7 text-slate-300" />
              </div>
              <p className="text-slate-500 mb-4">No collections yet</p>
              <button
                onClick={() => navigate("/collections")}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-violet-200/50 hover:from-violet-700 hover:to-indigo-700 transition-all"
              >
                <Plus className="w-4 h-4" /> Create Collection
              </button>
            </motion.div>
          ) : (
            <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {collections.slice(0, 6).map((col, i) => (
                <motion.div
                  key={col._id}
                  variants={fadeUp}
                  custom={i}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className="p-5 bg-white rounded-2xl border border-slate-100 cursor-pointer card-glow-hover transition-all group"
                  onClick={() => navigate(`/collections/${col._id}`)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-slate-900 truncate pr-2 group-hover:text-violet-700 transition-colors">{col.name}</h3>
                    <span className={`text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap ${CATEGORY_COLORS[col.category] || "bg-slate-100 text-slate-600"}`}>
                      {col.category}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">{col.documentCount} documents</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Recent Chats */}
        <motion.div variants={fadeUp} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 font-[Syne]">Recent Chats</h2>
            <button
              onClick={() => navigate("/chats")}
              className="text-sm font-medium text-violet-600 hover:text-violet-700 flex items-center gap-1 group"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {chats.length === 0 && !loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white"
            >
              <MessageSquare className="w-7 h-7 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">No chats yet. Start by opening a collection.</p>
            </motion.div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden card-glow">
              <div className="divide-y divide-slate-50">
                {loading ? (
                  Array(3).fill(0).map((_, i) => <div key={i} className="h-14 animate-pulse bg-slate-50 m-2 rounded-lg" />)
                ) : (
                  chats.slice(0, 5).map((chat, i) => (
                    <motion.div
                      key={chat._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-violet-50/40 transition-colors group"
                      onClick={() => navigate(`/chats/${chat._id}`)}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="h-8 w-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0 group-hover:bg-violet-100 transition-colors">
                          <MessageSquare className="h-3.5 w-3.5 text-violet-500" />
                        </div>
                        <span className="text-sm font-medium text-slate-700 truncate group-hover:text-violet-700 transition-colors">{chat.title}</span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono ml-4 shrink-0">
                        {new Date(chat.createdAt).toLocaleDateString()}
                      </span>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}