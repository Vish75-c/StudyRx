import { create } from "zustand";
const useChatStore = create((set) => ({
  chats: [],
  activeChat: null,
  messages: [],
  isLoading: false,
  setChats: (chats) => set({ chats }),
  setActiveChat: (chat) => set({ activeChat: chat, messages: chat?.messages || [] }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setLoading: (isLoading) => set({ isLoading }),
  addChat: (chat) => set((state) => ({ chats: [chat, ...state.chats] })),
  removeChat: (id) => set((state) => ({ chats: state.chats.filter((c) => c._id !== id) })),
  clearChat: () => set({ activeChat: null, messages: [] }),
}));
export default useChatStore;