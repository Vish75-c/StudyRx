import { create } from "zustand";
const useCollectionStore = create((set) => ({
  collections: [],
  selectedCollection: null,
  stats: { totalCollections: 0, totalDocuments: 0, totalChats: 0 },
  setCollections: (collections) => set({ collections }),
  addCollection: (collection) => set((state) => ({ collections: [collection, ...state.collections] })),
  updateCollection: (id, data) => set((state) => ({ collections: state.collections.map((c) => c._id === id ? { ...c, ...data } : c) })),
  removeCollection: (id) => set((state) => ({ collections: state.collections.filter((c) => c._id !== id) })),
  setSelectedCollection: (collection) => set({ selectedCollection: collection }),
  setStats: (stats) => set({ stats }),
}));
export default useCollectionStore;