import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { X, Upload, Link, Youtube, CheckCircle, Loader2, FileText } from "lucide-react";
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
  const [tab, setTab]       = useState("pdf");
  const [url, setUrl]       = useState("");
  const [file, setFile]     = useState(null);
  const { uploading, startUpload, finishUpload, failUpload, reset } = useUploadStore();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    onDrop: (accepted, rejected) => {
      if (rejected.length > 0) return toast.error("File too large or invalid type");
      setFile(accepted[0]);
    },
  });

  const handleTabChange = (id) => {
    setTab(id);
    setUrl("");
    setFile(null);
    reset();
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
      toast.success("Document uploaded and indexed successfully!");
      onSuccess?.();
      onClose();
    } catch (err) {
      failUpload();
      toast.error(err.response?.data?.message || "Upload failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h3 className="font-display font-semibold text-gray-900">Upload Document</h3>
            <p className="text-xs text-gray-400 mt-0.5">Add content to this collection</p>
          </div>
          <button
            onClick={onClose}
            disabled={uploading}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-5 pb-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleTabChange(id)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                tab === id
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              )}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          {tab === "pdf" ? (
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
                isDragActive
                  ? "border-brand-400 bg-brand-50 scale-[1.01]"
                  : "border-gray-200 hover:border-brand-300 hover:bg-gray-50",
                file && "border-brand-400 bg-brand-50"
              )}
            >
              <input {...getInputProps()} />
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle size={36} className="text-brand-500" />
                  <p className="text-sm font-semibold text-brand-700">{file.name}</p>
                  <p className="text-xs text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB · PDF
                  </p>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors mt-1"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-1">
                    <Upload size={22} className="text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">
                    {isDragActive ? "Drop your PDF here" : "Drag & drop or click to browse"}
                  </p>
                  <p className="text-xs text-gray-400">PDF files only · Max 10MB</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
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
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-400">
                {tab === "youtube"
                  ? "We will extract the transcript from this video"
                  : "We will scrape and index the text content of this page"}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={uploading}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="flex-1 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={15} />
                Upload
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}