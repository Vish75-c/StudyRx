import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FolderOpen, Trash2, MessageSquare, X, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

import { getCollections, createCollection, deleteCollection } from "@/utils/api";
import useCollectionStore from "@/stores/collectionStore";
import { COLLECTION_CATEGORIES } from "@/utils/constants";

/** UI COMPONENTS **/

const Card = ({ children, className = "", onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white border border-slate-200 rounded-xl shadow-sm transition-all 
    hover:shadow-md hover:border-blue-300 hover:-translate-y-1 ${className}`}
  >
    {children}
  </div>
);

const Button = ({ children, onClick, variant = "primary", size = "md", disabled, className = "" }) => {
  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-300 disabled:to-indigo-300",
    outline:
      "border border-slate-300 text-slate-700 hover:bg-slate-100",
    ghost:
      "text-slate-500 hover:bg-blue-50 hover:text-blue-600",
    destructive:
      "bg-red-50 text-red-600 hover:bg-red-100"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
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

const CustomDialog = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

/** CATEGORY COLORS **/

const CATEGORY_STYLES = {
  Reports: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  Research: "bg-rose-100 text-rose-800 border border-rose-200",
  DrugManuals: "bg-purple-100 text-purple-800 border border-purple-200",
  clinicalguidelines: "bg-blue-100 text-blue-800 border border-blue-200",
  Other: "bg-slate-100 text-slate-700 border border-slate-200",
};

/** MAIN COMPONENT **/

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
      .then((res) => {
        setCollections(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [setCollections]);

  const handleCreate = async () => {
    if (!name.trim()) return toast.error("Collection name is required");
    setCreating(true);
    try {
      const res = await createCollection({ name, category });
      addCollection(res.data);
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
    if (!window.confirm("Delete this collection?")) return;
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
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 text-left">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Collections</h1>
            <p className="mt-1 text-slate-500">Organise your medical documents by topic</p>
          </div>

          <Button onClick={() => setOpen(true)} className="w-full sm:w-auto">
            <Plus className="mr-1.5 w-4 h-4" /> New Collection
          </Button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 w-full animate-pulse bg-slate-200 rounded-xl" />
            ))}
          </div>
        ) : collections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center px-4">
            <div className="bg-slate-100 p-6 rounded-full mb-4">
              <FolderOpen className="h-12 w-12 text-slate-300" />
            </div>
            <p className="text-lg font-semibold text-slate-900">No collections yet</p>
            <p className="mt-1 text-sm text-slate-500">Create your first collection</p>
            <Button onClick={() => setOpen(true)} className="mt-6 w-full sm:w-auto">
              <Plus className="mr-1.5 w-4 h-4" /> Create Collection
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((col) => (
              <Card
                key={col._id}
                onClick={() => navigate(`/collections/${col._id}`)}
                className="group relative p-5 cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-sm ${CATEGORY_STYLES[col.category] || CATEGORY_STYLES.Other}`}>
                    <FolderOpen className="text-blue-600 h-6 w-6" />
                  </div>

                  <button
                    onClick={(e) => handleDelete(e, col._id)}
                    className="rounded-lg p-2 text-slate-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-900 truncate wrap-break-words">
                  {col.name}
                </h3>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${CATEGORY_STYLES[col.category] || CATEGORY_STYLES.Other}`}>
                    {col.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {col.documentCount || 0} documents
                  </span>
                </div>

                <div className="mt-5 pt-4 hover:text-blue-600 border-t border-slate-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/chats?collection=${col._id}`);
                    }}
                    className="w-full justify-center gap-2 text-xs sm:text-sm"
                  >
                    <MessageSquare className="h-4 w-4" /> Open Chat
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Dialog */}
        <CustomDialog open={open} onClose={() => setOpen(false)} title="Create New Collection">
          <div className="space-y-5">

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Collection Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Category
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {COLLECTION_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 text-slate-400" size={18} />
              </div>
            </div>

            <Button onClick={handleCreate} disabled={creating} className="w-full py-3">
              {creating ? "Creating…" : "Create Collection"}
            </Button>

          </div>
        </CustomDialog>

      </div>
    </div>
  );
}