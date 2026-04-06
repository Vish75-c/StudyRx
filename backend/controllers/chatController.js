import axios from "axios";
import Chat from "../models/chatModel.js";
import exportChatAsPDF from "../utils/exportPDF.js";
import mongoose from "mongoose";
const RAG_URL = process.env.RAG_SERVICE_URL || "http://localhost:8000";

export const createChat = async (req, res) => {
  try {
    console.log("VISITED");
    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    const { collectionId, title } = req.body;

    
    if (!mongoose.Types.ObjectId.isValid(collectionId)) {
      return res.status(400).json({ message: "Invalid collectionId" });
    }

    // ✅ Create chat
    const chat = await Chat.create({
      userId: req.user._id,
      collectionId,
      title: title || "New Chat", // fallback handled cleanly
      messages: []
    });

    console.log("CREATED CHAT:", chat);

    res.status(201).json(chat);

  } catch (error) {
    console.error("FULL ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { question } = req.body;
    console.log(question);
    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user._id });
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    chat.messages.push({ role: "user", content: question, sources: [] });

    const ragResponse = await axios.post(`${RAG_URL}/query`, {
      collection_id: chat.collectionId.toString(),
      question,
    });
    console.log(ragResponse.data);
    const { answer, sources } = ragResponse.data;
    chat.messages.push({ role: "assistant", content: answer});
    
    if (chat.messages.length === 2) chat.title = question.slice(0, 50);
    await chat.save();
    console.log("VISTED");
    res.json({ answer, sources, chatId: chat._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user._id })
      .select("title collectionId createdAt")
      .sort({ createdAt: -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user._id });
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    res.json({ message: "Chat deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const exportChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user._id });
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    exportChatAsPDF(chat, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};