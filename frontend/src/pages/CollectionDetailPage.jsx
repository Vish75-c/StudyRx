import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Trash2,
  FileText,
  Globe,
  Youtube,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Loader2,
  X
} from "lucide-react";
import toast from "react-hot-toast";

// API & Logic Imports (Kept exactly as per your code)
import { getCollectionById, getDocuments, deleteDocument, createChat } from "@/utils/api";
import UploadModal from "./UploadModel"; 

/** * STANDALONE UI COMPONENTS FROM TEMPLATE
 */
const Card = ({ children, className = "" }) => (
  <div className={`bg-white border border-slate-200 rounded-xl shadow-sm ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = "primary", size = "md", disabled, className = "" }) => {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300",
    outline: "border border-slate-200 text-slate-600 hover:bg-slate-50",
    ghost: "text-slate-500 hover:bg-slate-100 hover:text-blue-600",
    link: "text-blue-600 hover:underline bg-transparent"
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

const CATEGORY_STYLES = {
  Health: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Cardiology: "bg-red-50 text-red-700 border-red-100",
  Neurology: "bg-purple-50 text-purple-700 border-purple-100",
  Radiology: "bg-blue-50 text-blue-700 border-blue-100",
  Other: "bg-slate-50 text-slate-700 border-slate-100",
};

function DocTypeIcon({ type }) {
  const cls = "h-5 w-5";
  if (type === "pdf") return <FileText className={`${cls} text-rose-500`} />;
  if (type === "url") return <Globe className={`${cls} text-sky-500`} />;
  if (type === "youtube") return <Youtube className={`${cls} text-red-500`} />;
  return null;
}

/**
 * PAGE COMPONENT
 */
export default function CollectionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Logic State (Directly from your component)
  const [collection, setCollection] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [expandedDoc, setExpandedDoc] = useState(null);
  const [startingChat, setStartingChat] = useState(false);

  // Logic: Fetch Data
  const fetchData = async () => {
    try {
      const [colRes, docRes] = await Promise.all([
        getCollectionById(id),
        getDocuments(id),
      ]);
      setCollection(colRes.data);
      setDocuments(docRes.data);
    } catch {
      toast.error("Failed to load collection");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  // Logic: Delete Handler
  const handleDelete = async (docId) => {
    if (!window.confirm("Delete this document from the collection?")) return;
    try {
      await deleteDocument(docId);
      setDocuments((prev) => prev.filter((d) => d._id !== docId));
      setCollection((prev) => ({ ...prev, documentCount: (prev.documentCount || 1) - 1 }));
      toast.success("Document deleted");
    } catch {
      toast.error("Failed to delete document");
    }
  };

  // Logic: Chat Handler
  const handleStartChat = async () => {
    setStartingChat(true);
    try {
      const res = await createChat({ collectionId: id });
      navigate(`/chats/${res.data._id}`);
    } catch {
      toast.error("Failed to start chat");
      setStartingChat(false);
    }
  };

  // Loading Skeleton State
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-4xl">
            <div className="h-6 w-32 bg-slate-200 rounded animate-pulse mb-8" />
            <Card className="p-6 mb-8">
                <div className="h-10 w-64 bg-slate-100 rounded animate-pulse" />
            </Card>
            <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-white border border-slate-200 rounded-xl animate-pulse" />
            ))}
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-left">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button
          onClick={() => navigate("/collections")}
          className="group mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Collections
        </button>

        {/* Header Section */}
        <Card className="mb-8 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900">
                  {collection?.name}
                </h1>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border ${CATEGORY_STYLES[collection?.category] || CATEGORY_STYLES.Other}`}>
                  {collection?.category}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500 font-medium">
                {documents.length} document{documents.length !== 1 ? "s" : ""} in this collection
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleStartChat}
                disabled={startingChat || documents.length === 0}
              >
                {startingChat ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <MessageSquare className="mr-2 h-4 w-4" />
                )}
                Chat
              </Button>
              <Button onClick={() => setShowUpload(true)}>
                <Plus className="mr-1.5 h-4 w-4" />
                Upload
              </Button>
            </div>
          </div>
        </Card>

        {/* Documents List */}
        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 py-20 text-center bg-white">
            <div className="mb-4 rounded-full bg-slate-50 p-4">
              <FileText className="h-8 w-8 text-slate-300" />
            </div>
            <p className="text-lg font-bold text-slate-900">No documents yet</p>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Upload PDFs, website URLs or medical lectures to get started.
            </p>
            <Button onClick={() => setShowUpload(true)} className="mt-6">
              <Plus className="mr-1.5 h-4 w-4" />
              Upload Document
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <Card key={doc._id} className="overflow-hidden border-slate-200 hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 border border-slate-100">
                    <DocTypeIcon type={doc.type} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-slate-800">
                      {doc.name}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">
                      {doc.type.toUpperCase()} · {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {doc.summary && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setExpandedDoc(expandedDoc === doc._id ? null : doc._id)
                        }
                        className="text-xs text-blue-600 font-semibold"
                      >
                        Summary
                        {expandedDoc === doc._id ? (
                          <ChevronUp className="ml-1 h-3 w-3" />
                        ) : (
                          <ChevronDown className="ml-1 h-3 w-3" />
                        )}
                      </Button>
                    )}
                    <button
                      onClick={() => handleDelete(doc._id)}
                      className="rounded-lg p-2 text-slate-300 transition-colors hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {expandedDoc === doc._id && doc.summary && (
                  <div className="border-t border-slate-100 bg-slate-50 px-5 py-4">
                    <p className="text-sm leading-relaxed text-slate-600 font-medium">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">AI Summary</span>
                      {doc.summary}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Upload Modal (Using your external component) */}
        {showUpload && (
          <UploadModal
            collectionId={id}
            onClose={() => setShowUpload(false)}
            onSuccess={fetchData}
          />
        )}
      </div>
    </div>
  );
}