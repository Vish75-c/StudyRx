import { create } from "zustand";
const useUploadStore = create((set) => ({
  uploading: false,
  progress: 0,
  status: null,
  setUploading: (uploading) => set({ uploading }),
  setProgress: (progress) => set({ progress }),
  setStatus: (status) => set({ status }),
  reset: () => set({ uploading: false, progress: 0, status: null }),
}));
export default useUploadStore;