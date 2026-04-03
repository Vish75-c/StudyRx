import express, { Router } from "express"
import { getCollections, createCollection, getCollectionById, updateCollection, deleteCollection, getStats } from "../controllers/collectionController.js";
import protect from "../middleware/auth.js";

const collectionsRoutes=Router();

collectionsRoutes.use(protect);
collectionsRoutes.get("/stats", getStats);
collectionsRoutes.get("/", getCollections);
collectionsRoutes.post("/", createCollection);
collectionsRoutes.get("/:id", getCollectionById);
collectionsRoutes.put("/:id", updateCollection);
collectionsRoutes.delete("/:id", deleteCollection);

export default collectionsRoutes