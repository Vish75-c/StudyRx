import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FolderOpen, Trash2, MessageSquare, X, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
// API & Store Imports (Kept exactly as per your logic)
import { getCollections, createCollection, deleteCollection } from "@/utils/api";
import useCollectionStore from "@/stores/collectionStore";
import { COLLECTION_CATEGORIES } from "@/utils/constants";

/** * STANDALONE UI COMPONENTS FROM TEMPLATE
 */
const Card = ({ children, className = "", onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white border border-slate-200 rounded-xl shadow-sm transition-all ${className}`}
  >
    {children}
  </div>
);

const Button = ({ children, onClick, variant = "primary", size = "md", disabled, className = "" }) => {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300",
    outline: "border border-slate-200 text-slate-600 hover:bg-slate-50",
    ghost: "text-slate-500 hover:bg-slate-100",
    destructive: "text-red-500 hover:bg-red-50"
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
  };
  return (
    <button 
      disabled={disabled}
      onClick={onClick} 
      className={`${variants[variant]} ${sizes[size]} font-medium rounded-lg transition-colors flex items-center justify-center disabled:cursor-not-allowed ${className}`}
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
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
        </div>
        {children}
      </div>
    </div>
  );
};

// UI Category Styles
const CATEGORY_STYLES = {
  Health: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Cardiology: "bg-red-50 text-red-700 border-red-100",
  Neurology: "bg-purple-50 text-purple-700 border-purple-100",
  Radiology: "bg-blue-50 text-blue-700 border-blue-100",
  Other: "bg-slate-50 text-slate-700 border-slate-100",
};

/**
 * MAIN COMPONENT
 */
export default function CollectionPage() {
  const navigate = useNavigate();
  const { collections, setCollections, addCollection, removeCollection } = useCollectionStore();
  
  // Logic State
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Other");
  const [creating, setCreating] = useState(false);

  // Logic: Initial Fetch
  useEffect(() => {
    getCollections()
      .then((res) => {
        setCollections(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [setCollections]);

  // Logic: Create Handler
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
    } catch (err) {
      toast.error("Failed to create collection");
    } finally {
      setCreating(false);
    }
  };

  // Logic: Delete Handler
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
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 text-left">
        
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Collections</h1>
            <p className="mt-1 text-slate-500">Organise your medical documents by topic</p>
          </div>
          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-1.5 w-4 h-4" /> New Collection
          </Button>
        </div>

        {/* Content States */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 w-full animate-pulse bg-slate-200 rounded-xl" />
            ))}
          </div>
        ) : collections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="bg-slate-100 p-6 rounded-full mb-4">
               <FolderOpen className="h-12 w-12 text-slate-300" />
            </div>
            <p className="text-lg font-semibold text-slate-900">No collections yet</p>
            <p className="mt-1 text-sm text-slate-500">Create your first collection to start uploading documents</p>
            <Button onClick={() => setOpen(true)} className="mt-6">
              <Plus className="mr-1.5 w-4 h-4" /> Create Collection
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((col) => (
              <Card
                key={col._id}
                onClick={() => navigate(`/collections/${col._id}`)}
                className="group relative p-5 hover:border-blue-200 cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${CATEGORY_STYLES[col.category] || CATEGORY_STYLES.Other}`}>
                    <FolderOpen className="h-6 w-6" />
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, col._id)}
                    className="rounded-lg p-2 text-slate-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-900 truncate">{col.name}</h3>

                <div className="mt-2 flex items-center gap-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${CATEGORY_STYLES[col.category] || CATEGORY_STYLES.Other}`}>
                    {col.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{col.documentCount || 0} documents</span>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-50">
                   <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/chats?collection=${col._id}`);
                      }}
                      className="w-full justify-center gap-2 group-hover:text-blue-600"
                    >
                      <MessageSquare className="h-4 w-4" /> Open Chat
                    </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Create Dialog */}
        <CustomDialog 
          open={open} 
          onClose={() => setOpen(false)} 
          title="Create New Collection"
        >
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Collection Name</label>
              <input
                placeholder="e.g. Patient Records"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
                >
                  {COLLECTION_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" size={18} />
              </div>
            </div>

            <Button
              onClick={handleCreate}
              disabled={creating}
              className="w-full py-3"
            >
              {creating ? "Creating…" : "Create Collection"}
            </Button>
          </div>
        </CustomDialog>

      </div>
    </div>
  );
}