import express from "express"
import { Router} from "express";
import { uploadPDF, uploadYoutube, getDocuments, deleteDocument, uploadURL } from "../controllers/documentController.js";
import { upload } from "../middleware/upload.js";
import protect from "../middleware/auth.js";

const documentRoutes=Router();
documentRoutes.use(protect);
documentRoutes.post("/upload-pdf", upload.single("file"), uploadPDF);
documentRoutes.post("/upload-youtube", uploadYoutube);
documentRoutes.post('/upload-url',uploadURL)
documentRoutes.get("/:collectionId", getDocuments);
documentRoutes.delete("/:id", deleteDocument);

export default documentRoutes;