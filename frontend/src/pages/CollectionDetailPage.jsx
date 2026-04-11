import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Plus, Trash2, FileText, Globe, Youtube,
  MessageSquare, ChevronDown, ChevronUp, Loader2, Brain
} from "lucide-react";
import toast from "react-hot-toast";

import { getCollectionById, getDocuments, deleteDocument, createChat } from "@/utils/api";
import UploadModal from "./UploadModel";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] } }),
};
const stagger = { visible: { transition: { staggerChildren: 0.05 } } };

const CATEGORY_STYLES = {
  Reports: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Research: "bg-rose-50 text-rose-700 border-rose-100",
  "Drug Manuals": "bg-purple-50 text-purple-700 border-purple-100",
  "Clinical Guidelines": "bg-blue-50 text-blue-700 border-blue-100",
  Other: "bg-slate-50 text-slate-700 border-slate-100",
};

const DOC_ICON_STYLES = {
  pdf: { icon: FileText, color: "text-rose-500", bg: "bg-rose-50" },
  url: { icon: Globe, color: "text-sky-500", bg: "bg-sky-50" },
  youtube: { icon: Youtube, color: "text-red-500", bg: "bg-red-50" },
};

function DocTypeIcon({ type }) {
  const style = DOC_ICON_STYLES[type] || DOC_ICON_STYLES.pdf;
  const Icon = style.icon;
  return (
    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.bg} border border-slate-100/50`}>
      <Icon className={`h-5 w-5 ${style.color}`} />
    </div>
  );
}

export default function CollectionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [expandedDoc, setExpandedDoc] = useState(null);
  const [startingChat, setStartingChat] = useState(false);

  const fetchData = async () => {
    try {
      const [colRes, docRes] = await Promise.all([getCollectionById(id), getDocuments(id)]);
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
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-4xl">
          <div className="h-6 w-32 bg-slate-100 rounded-lg animate-pulse mb-8" />
          <div className="p-6 mb-8 bg-white rounded-2xl border border-slate-100 animate-pulse">
            <div className="h-10 w-64 bg-slate-50 rounded-lg" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-white border border-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-left">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="mx-auto max-w-6xl py-10 sm:px-6"
      >
        {/* Back */}
        <motion.button
          variants={fadeUp}
          onClick={() => navigate("/collections")}
          className="group mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-violet-600"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Collections
        </motion.button>

        {/* Header */}
        <motion.div variants={fadeUp} className="mb-8 p-6 bg-white rounded-2xl border border-slate-100 card-glow">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900 font-[Syne]">{collection?.name}</h1>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border ${CATEGORY_STYLES[collection?.category] || CATEGORY_STYLES.Other}`}>
                  {collection?.category}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500 font-medium">
                {documents.length} document{documents.length !== 1 ? "s" : ""} in this collection
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleStartChat}
                disabled={startingChat || documents.length === 0}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {startingChat ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
                Chat
              </button>
              <button
                onClick={() => navigate(`/quiz/generate/${id}`)}
                disabled={documents.length === 0}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-violet-600 border border-violet-200 rounded-xl bg-violet-50 hover:bg-violet-100 hover:border-violet-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Brain className="h-4 w-4" />
                Quiz
              </button>
              <button
                onClick={() => setShowUpload(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-violet-200/50 hover:from-violet-700 hover:to-indigo-700 transition-all"
              >
                <Plus className="h-4 w-4" /> Upload
              </button>
            </div>
          </div>
        </motion.div>

        {/* Documents */}
        {documents.length === 0 ? (
          <motion.div
            variants={fadeUp}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-20 text-center bg-white"
          >
            <div className="mb-4 rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <FileText className="h-8 w-8 text-slate-300" />
            </div>
            <p className="text-lg font-bold text-slate-900 font-[Syne]">No documents yet</p>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Upload PDFs, website URLs or medical lectures to get started.
            </p>
            <button
              onClick={() => setShowUpload(true)}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-violet-200/50 hover:from-violet-700 hover:to-indigo-700 transition-all"
            >
              <Plus className="h-4 w-4" /> Upload Document
            </button>
          </motion.div>
        ) : (
          <motion.div variants={stagger} className="space-y-3">
            {documents.map((doc, i) => (
              <motion.div
                key={doc._id}
                variants={fadeUp}
                custom={i}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden card-glow-hover transition-all"
              >
                <div className="flex items-center gap-4 p-4">
                  <DocTypeIcon type={doc.type} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-slate-800">{doc.name}</p>
                    <p className="text-xs text-slate-400 font-medium">
                      {doc.type.toUpperCase()} · {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {doc.summary && (
                      <button
                        onClick={() => setExpandedDoc(expandedDoc === doc._id ? null : doc._id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                      >
                        Summary
                        {expandedDoc === doc._id ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(doc._id)}
                      className="rounded-lg p-2 text-slate-300 transition-colors hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedDoc === doc._id && doc.summary && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-slate-50 bg-gradient-to-b from-violet-50/30 to-transparent px-5 py-4">
                        <p className="text-sm leading-relaxed text-slate-600 font-medium">
                          <span className="text-[10px] font-bold text-violet-400 uppercase block mb-1">AI Summary</span>
                          {doc.summary}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}

        {showUpload && (
          <UploadModal
            collectionId={id}
            onClose={() => setShowUpload(false)}
            onSuccess={fetchData}
          />
        )}
      </motion.div>
    </div>
  );
}