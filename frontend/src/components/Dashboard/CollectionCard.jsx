import { FolderOpen, Trash2, MessageSquare, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CATEGORY_COLORS } from "@/utils/constants";

export default function CollectionCard({ collection, onDelete }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/collections/${collection._id}`)}
      className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
          <FolderOpen size={18} className="text-brand-600" />
        </div>
        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(collection._id); }}
            className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* Name */}
      <h3 className="font-display font-semibold text-gray-900 truncate mb-1 text-sm">
        {collection.name}
      </h3>

      {/* Meta */}
      <div className="flex items-center justify-between mt-3">
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${CATEGORY_COLORS[collection.category] || "bg-gray-50 text-gray-600"}`}>
          {collection.category}
        </span>
        <span className="text-xs text-gray-400">
          {collection.documentCount} doc{collection.documentCount !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/collections/${collection._id}`); }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronRight size={13} /> Open
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/chats?collection=${collection._id}`); }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-brand-600 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors"
        >
          <MessageSquare size={13} /> Chat
        </button>
      </div>
    </div>
  );
}