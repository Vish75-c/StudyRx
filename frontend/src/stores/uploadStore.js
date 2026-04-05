import { create } from "zustand";

const useUploadStore = create((set) => ({
  uploading: false,
  progress: 0,
  status: null,
  fileName: null,

  setUploading: (uploading) => set({ uploading }),
  setProgress: (progress) => set({ progress }),
  setStatus: (status) => set({ status }),
  setFileName: (fileName) => set({ fileName }),

  reset: () =>
    set({
      uploading: false,
      progress: 0,
      status: null,
      fileName: null,
    }),

  startUpload: (fileName) =>
    set({
      uploading: true,
      progress: 0,
      status: "uploading",
      fileName,
    }),

  finishUpload: () =>
    set({
      uploading: false,
      progress: 100,
      status: "success",
    }),

  failUpload: () =>
    set({
      uploading: false,
      progress: 0,
      status: "error",
    }),
}));

export default useUploadStore;