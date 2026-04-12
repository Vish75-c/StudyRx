import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, FolderOpen, Trash2, MessageSquare, X, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

import { getCollections, createCollection, deleteCollection } from "@/utils/api";
import useCollectionStore from "@/stores/collectionStore";
import { COLLECTION_CATEGORIES } from "@/utils/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] } }),
};
const stagger = { visible: { transition: { staggerChildren: 0.06 } } };

const CATEGORY_STYLES = {
  Reports: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
  Research: "bg-rose-50 text-rose-700 border border-rose-200/60",
  "Drug Manuals": "bg-purple-50 text-purple-700 border border-purple-200/60",
  "Clinical Guidelines": "bg-blue-50 text-blue-700 border border-blue-200/60",
  Other: "bg-slate-50 text-slate-700 border border-slate-200/60",
};

const ICON_GRADIENTS = {
  Reports: "from-emerald-500 to-teal-600",
  Research: "from-rose-500 to-pink-600",
  "Drug Manuals": "from-purple-500 to-violet-600",
  "Clinical Guidelines": "from-blue-500 to-indigo-600",
  Other: "from-slate-400 to-slate-500",
};

export default function CollectionPage() {
  const navigate = useNavigate();
  const { collections, setCollections, addCollection, removeCollection } = useCollectionStore();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Other");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    getCollections()
      .then((res) => { setCollections(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [setCollections]);

  const handleCreate = async () => {
    if (!name.trim()) return toast.error("Collection name is required");
    setCreating(true);
    try {
      await createCollection({ name, category });
      const res = await getCollections();
      setCollections(res.data);
      toast.success("Collection created!");
      setOpen(false);
      setName("");
      setCategory("Other");
    } catch {
      toast.error("Failed to create collection");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteCollection(id);
      removeCollection(id);
      toast.success("Collection deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl py-10 text-left">

        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8"
        >
          <motion.div variants={fadeUp}>
            <h1 className="text-2xl font-bold text-slate-900 font-[Syne]">Collections</h1>
            <p className="mt-1 text-slate-500">Organise your medical documents by topic</p>
          </motion.div>
          <motion.div variants={fadeUp}>
            <button
              onClick={() => setOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-linear-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-violet-200/50 hover:from-violet-700 hover:to-indigo-700 transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" /> New Collection
            </button>
          </motion.div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-52 w-full animate-pulse bg-white rounded-2xl border border-slate-100" />
            ))}
          </div>
        ) : collections.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center px-4"
          >
            <div className="bg-slate-50 p-6 rounded-2xl mb-4 border border-slate-100">
              <FolderOpen className="h-12 w-12 text-slate-300" />
            </div>
            <p className="text-lg font-bold text-slate-900 font-[Syne]">No collections yet</p>
            <p className="mt-1 text-sm text-slate-500">Create your first collection</p>
            <button
              onClick={() => setOpen(true)}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-violet-200/50 hover:from-violet-700 hover:to-indigo-700 transition-all"
            >
              <Plus className="w-4 h-4" /> Create Collection
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          >
            {collections.map((col, i) => (
              <motion.div
                key={col._id}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                onClick={() => navigate(`/collections/${col._id}`)}
                className="group relative p-6 cursor-pointer bg-white rounded-2xl border border-slate-100 card-glow-hover transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br ${ICON_GRADIENTS[col.category] || ICON_GRADIENTS.Other} text-white shadow-lg shadow-slate-200/50`}>
                    <FolderOpen className="h-5 w-5" />
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, col._id)}
                    className="rounded-lg p-2 text-slate-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-900 truncate group-hover:text-violet-700 transition-colors">
                  {col.name}
                </h3>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${CATEGORY_STYLES[col.category] || CATEGORY_STYLES.Other}`}>
                    {col.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {col.documentCount || 0} documents
                  </span>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-50">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/chats?collection=${col._id}`);
                    }}
                    className="w-full flex items-center justify-center gap-2 text-sm font-medium text-slate-500 hover:text-violet-600 py-2 rounded-lg hover:bg-violet-50 transition-all"
                  >
                    <MessageSquare className="h-4 w-4" /> Open Chat
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Create Dialog */}
        <AnimatePresence>
          {open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
                className="relative w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl border border-slate-100"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900 font-[Syne]">Create New Collection</h2>
                  <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Collection Name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-200 focus:border-violet-400 outline-none transition-all bg-slate-50/50"
                      placeholder="e.g., Cardiology Research"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
                    <div className="relative">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full appearance-none px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-200 focus:border-violet-400 bg-slate-50/50 outline-none transition-all"
                      >
                        {COLLECTION_CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-3 text-slate-400" size={18} />
                    </div>
                  </div>

                  <button
                    onClick={handleCreate}
                    disabled={creating}
                    className="w-full py-3 bg-linear-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-violet-200/50 hover:from-violet-700 hover:to-indigo-700 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {creating ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating…
                      </span>
                    ) : "Create Collection"}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}