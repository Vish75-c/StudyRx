import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Plus, Trash2, FileText,
  Globe, Youtube, MessageSquare, ChevronDown, ChevronUp, Loader2,
} from "lucide-react";
import { getCollectionById, getDocuments, deleteDocument, createChat } from "@/utils/api";
import UploadModal from "./UploadModel";
import { CATEGORY_COLORS } from "@/utils/constants";
import toast from "react-hot-toast";

function DocTypeIcon({ type }) {
  if (type === "pdf")     return <FileText size={16} className="text-red-500 flex-shrink-0" />;
  if (type === "url")     return <Globe    size={16} className="text-blue-500 flex-shrink-0" />;
  if (type === "youtube") return <Youtube  size={16} className="text-red-600 flex-shrink-0" />;
  return null;
}

export default function CollectionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [collection,   setCollection]   = useState(null);
  const [documents,    setDocuments]    = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [showUpload,   setShowUpload]   = useState(false);
  const [expandedDoc,  setExpandedDoc]  = useState(null);
  const [startingChat, setStartingChat] = useState(false);

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

  if (loading) {
    return (
      <div className="p-8 max-w-4xl">
        <div className="h-6 w-32 bg-gray-100 rounded-lg animate-pulse mb-8" />
        <div className="h-10 w-64 bg-gray-100 rounded-xl animate-pulse mb-6" />
        <div className="space-y-3">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl">

      {/* Back */}
      <button
        onClick={() => navigate("/collections")}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6 group"
      >
        <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to Collections
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-display text-2xl font-bold text-gray-900">
              {collection?.name}
            </h1>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${CATEGORY_COLORS[collection?.category] || "bg-gray-50 text-gray-600"}`}>
              {collection?.category}
            </span>
          </div>
          <p className="text-gray-500 text-sm">
            {documents.length} document{documents.length !== 1 ? "s" : ""} in this collection
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleStartChat}
            disabled={startingChat || documents.length === 0}
            className="inline-flex items-center gap-2 border border-brand-200 text-brand-600 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {startingChat ? (
              <><Loader2 size={14} className="animate-spin" /> Starting...</>
            ) : (
              <><MessageSquare size={14} /> Chat</>
            )}
          </button>
          <button
            onClick={() => setShowUpload(true)}
            className="inline-flex items-center gap-2 bg-brand-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors shadow-sm"
          >
            <Plus size={14} /> Upload
          </button>
        </div>
      </div>

      {/* Documents List */}
      {documents.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-16 text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText size={24} className="text-gray-300" />
          </div>
          <h3 className="font-display font-semibold text-gray-900 mb-2">No documents yet</h3>
          <p className="text-gray-500 text-sm mb-6">
            Upload PDFs, paste website URLs or add YouTube medical lectures
          </p>
          <button
            onClick={() => setShowUpload(true)}
            className="inline-flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors"
          >
            <Plus size={15} /> Upload Document
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-sm transition-shadow">

              {/* Document Row */}
              <div className="flex items-center gap-4 px-5 py-4">
                <DocTypeIcon type={doc.type} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{doc.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {doc.type.toUpperCase()} · Uploaded {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {doc.summary && (
                    <button
                      onClick={() => setExpandedDoc(expandedDoc === doc._id ? null : doc._id)}
                      className="flex items-center gap-1 text-xs text-brand-600 font-medium hover:underline"
                    >
                      Summary
                      {expandedDoc === doc._id ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(doc._id)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Expanded Summary */}
              {expandedDoc === doc._id && doc.summary && (
                <div className="px-5 pb-4 border-t border-gray-50">
                  <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-4 mt-3">
                    {doc.summary}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <UploadModal
          collectionId={id}
          onClose={() => setShowUpload(false)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}