import express from "express"
import { Router } from "express"
import { createChat,sendMessage,getChatHistory,getChatById,deleteChat,exportChat } from "../controllers/chatController.js";
import protect from "../middleware/auth.js"

const chatRoutes=Router();

chatRoutes.use(protect)
chatRoutes.post("/", createChat);
chatRoutes.post("/:id/message", sendMessage);
chatRoutes.get("/history", getChatHistory);
chatRoutes.get("/:id", getChatById);
chatRoutes.delete("/:id", deleteChat);
chatRoutes.get("/:id/export", exportChat);

export default chatRoutes;