import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FolderOpen, Trash2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCollections, createCollection, deleteCollection } from "@/utils/api";
import useCollectionStore from "@/stores/collectionStore";
import { CATEGORY_COLORS, COLLECTION_CATEGORIES } from "@/utils/constants";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function CollectionPage() {
  const navigate = useNavigate();
  const { collections, setCollections, addCollection, removeCollection } = useCollectionStore();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Other");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    getCollections().then((res) => { setCollections(res.data); setLoading(false); });
  }, []);

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
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Collections</h1>
          <p className="text-gray-500 mt-1">Organise your medical documents by topic</p>
        </div>
        <Button onClick={() => setOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> New Collection
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-36 rounded-xl" />)}
        </div>
      ) : collections.length === 0 ? (
        <div className="text-center py-20">
          <FolderOpen className="w-14 h-14 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No collections yet</h3>
          <p className="text-gray-500 mb-6">Create your first collection to start uploading documents</p>
          <Button onClick={() => setOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" /> Create Collection
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((col) => (
            <Card
              key={col._id}
              className="p-5 border-gray-100 hover:shadow-md transition-all cursor-pointer group"
              onClick={() => navigate(`/collections/${col._id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-blue-600" />
                </div>
                <button
                  onClick={(e) => handleDelete(e, col._id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 truncate">{col.name}</h3>
              <div className="flex items-center justify-between mt-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${CATEGORY_COLORS[col.category] || "bg-gray-100 text-gray-600"}`}>
                  {col.category}
                </span>
                <span className="text-xs text-gray-500">{col.documentCount} docs</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full mt-3 text-xs"
                onClick={(e) => { e.stopPropagation(); navigate(`/chats?collection=${col._id}`); }}
              >
                <MessageSquare className="w-3 h-3 mr-1" /> Chat
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Collection</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label>Collection Name</Label>
              <Input placeholder="e.g. Cardiology Research" value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COLLECTION_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleCreate} className="w-full bg-blue-600 hover:bg-blue-700" disabled={creating}>
              {creating ? "Creating..." : "Create Collection"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}