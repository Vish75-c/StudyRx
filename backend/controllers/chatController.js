import axios from "axios";
import Chat from "../models/chatModel.js";
import exportChatAsPDF from "../utils/exportPDF.js";
import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();
const RAG_URL = process.env.RAG_SERVICE_URL;

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
    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user._id });
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    chat.messages.push({ role: "user", content: question, sources: [] });

    const ragResponse = await axios.post(`${RAG_URL}/query`, {
      collection_id: chat.collectionId.toString(),
      question,
    });
    const { answer, sources: rawSources } = ragResponse.data;
    const seen = new Set();
    const uniqueSources = rawSources.filter((src) => {
      const key = `${src.source}-${src.page}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).map(({ source, page, type }) => ({ source, page, type })); // ← add this
    chat.messages.push({ role: "assistant", content: answer, sources: uniqueSources });
    if (chat.title === "New Chat") chat.title = question.slice(0, 50);
    await chat.save();
    res.json({ answer, sources: uniqueSources, chatId: chat._id });
  } catch (error) {
    console.log(error);
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