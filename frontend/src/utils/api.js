import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");
export const updatePassword = (data) => API.put("/auth/password", data);
export const deleteAccount = () => API.delete("/auth/delete");

// Collections
export const getCollections = () => API.get("/collections");
export const createCollection = (data) => API.post("/collections", data);
export const getCollectionById = (id) => API.get(`/collections/${id}`);
export const updateCollection = (id, data) => API.put(`/collections/${id}`, data);
export const deleteCollection = (id) => API.delete(`/collections/${id}`);
export const getStats = () => API.get("/collections/stats");

// Documents
export const uploadPDF = (formData) => API.post("/documents/upload-pdf", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const uploadURL = (data) => API.post("/documents/upload-url", data);
export const uploadYoutube = (data) => API.post("/documents/upload-youtube", data);
export const getDocuments = (collectionId) => API.get(`/documents/${collectionId}`);
export const deleteDocument = (id) => API.delete(`/documents/${id}`);

// Chat
export const createChat = (data) => API.post("/chat", data);
export const sendMessage = (chatId, data) => API.post(`/chat/${chatId}/message`, data);
export const getChatHistory = () => API.get("/chat/history");
export const getChatById = (id) => API.get(`/chat/${id}`);
export const deleteChat = (id) => API.delete(`/chat/${id}`);
export const exportChat = (id) => API.get(`/chat/${id}/export`, { responseType: "blob" });

export default API;