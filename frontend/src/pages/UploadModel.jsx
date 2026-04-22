import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Link, Youtube, CheckCircle, Loader2, FileText, Sparkles } from "lucide-react";
import { uploadPDF, uploadURL, uploadYoutube } from "@/utils/api";
import useUploadStore from "@/stores/uploadStore";
import toast from "react-hot-toast";
import { cn } from "@/utils/cn";

const TABS = [
  { id: "pdf",     label: "PDF File", icon: FileText },
  { id: "url",     label: "Website",  icon: Link },
  { id: "youtube", label: "YouTube",  icon: Youtube },
];

export default function UploadModal({ collectionId, onClose, onSuccess }) {
  const [tab,  setTab]  = useState("pdf");
  const [url,  setUrl]  = useState("");
  const [file, setFile] = useState(null);

  const { uploading, startUpload, finishUpload, failUpload, reset } = useUploadStore();

  useEffect(() => {
    reset();
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    disabled: uploading,
    onDrop: (accepted, rejected) => {
      if (rejected.length > 0) return toast.error("File too large or invalid type");
      setFile(accepted[0]);
    },
  });

  const handleTabChange = (id) => {
    if (uploading) return;
    setTab(id);
    setUrl("");
    setFile(null);
  };

  const handleSubmit = async () => {
    if (uploading) return;
    try {
      if (tab === "pdf") {
        if (!file) return toast.error("Please select a PDF file");
        startUpload(file.name);
        const fd = new FormData();
        fd.append("file", file);
        fd.append("collectionId", collectionId);
        fd.append("documentName", file.name);
        await uploadPDF(fd);
      } else if (tab === "url") {
        if (!url.trim()) return toast.error("Please enter a valid URL");
        startUpload(url);
        await uploadURL({ collectionId, url: url.trim() });
      } else {
        if (!url.trim()) return toast.error("Please enter a YouTube URL");
        startUpload(url);
        await uploadYoutube({ collectionId, url: url.trim() });
      }
      finishUpload();
      toast.success("Document uploaded successfully!");
      await onSuccess?.();
      onClose();
    } catch (err) {
      failUpload();
      const msg = err.response?.data?.detail || err.response?.data?.message || "";
      if (tab === "youtube") {
        toast.error("YouTube is blocking transcript requests from our cloud server. Please try uploading a PDF or website URL instead.", { duration: 6000 });
      } else {
        toast.error(msg || "Upload failed. Please try again.");
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/20"
          onClick={!uploading ? onClose : undefined}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh] z-10 border border-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 font-[Syne] flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-500" />
                Upload Document
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Add content to this collection</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 px-6 pt-5 pb-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                disabled={uploading}
                onClick={() => handleTabChange(id)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                  tab === id
                    ? "bg-linear-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200/40"
                    : "text-slate-500 hover:bg-violet-50 hover:text-violet-600"
                )}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="px-6 py-5 overflow-y-auto flex-1">
            {tab === "pdf" ? (
              <div
                {...getRootProps()}
                className={cn(
                  "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all",
                  isDragActive
                    ? "border-violet-400 bg-violet-50 scale-[1.01]"
                    : "border-slate-200 hover:border-violet-300 hover:bg-violet-50/30",
                  file && "border-violet-400 bg-violet-50/50"
                )}
              >
                <input {...getInputProps()} />
                {file ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-12 w-12 bg-linear-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <CheckCircle size={24} className="text-white" />
                    </div>
                    <p className="text-sm font-bold text-slate-800">{file.name}</p>
                    <p className="text-xs text-slate-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB · PDF
                    </p>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      className="text-xs text-red-500 hover:underline mt-1 font-medium"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-1 border border-slate-100">
                      <Upload size={22} className="text-slate-400" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">
                      {isDragActive ? "Drop your PDF here" : "Drag & drop or click to browse"}
                    </p>
                    <p className="text-xs text-slate-400">PDF files only · Max 10MB</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  {tab === "youtube" ? "YouTube Video URL" : "Website URL"}
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={
                    tab === "youtube"
                      ? "https://youtube.com/watch?v=..."
                      : "https://example.com/-article"
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-all bg-slate-50/50"
                />
                <p className="text-xs text-slate-400">
                  {tab === "youtube"
                    ? "We will extract the full transcript from this video"
                    : "We will scrape and index the text content of this page"}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 flex gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={uploading}
              className="flex-1 py-3 rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold hover:from-violet-700 hover:to-indigo-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-violet-200/40 active:scale-[0.98]"
            >
              {uploading ? (
                <><Loader2 size={15} className="animate-spin" /> Uploading...</>
              ) : (
                <><Upload size={15} /> Upload Document</>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}