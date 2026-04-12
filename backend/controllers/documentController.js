import Document from "../models/documentModel.js";
import Collection from "../models/collectionModel.js";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import dotenv from "dotenv"
dotenv.config();
const RAG_URL = process.env.RAG_SERVICE_URL;

export const uploadPDF = async (req, res) => {
  try {
    console.log("IVS");
    console.log(RAG_URL)
    const { collectionId, documentName } = req.body;
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const collection = await Collection.findOne({ _id: collectionId, userId: req.user._id });
    if (!collection) return res.status(404).json({ message: "Collection not found" });

    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path));
    formData.append("collection_id", collectionId);
    formData.append("document_name", documentName || req.file.originalname);
    console.log("VISITED");
    await axios.post(`${RAG_URL}/ingest/pdf`, formData, { headers: formData.getHeaders() });

   

    const document = await Document.create({
      userId: req.user._id,
      collectionId,
      name: documentName || req.file.originalname,
      type: "pdf",
      source: req.file.originalname,
      
    });

    await Collection.findByIdAndUpdate(collectionId, { $inc: { documentCount: 1 } });
    fs.unlinkSync(req.file.path);

    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadURL = async (req, res) => {
  try {
    const RAG_URL = process.env.RAG_SERVICE_URL;

    const { collectionId, url } = req.body;
    console.log(collectionId, url)
    if (!url) return res.status(400).json({ message: "URL is required" });

    const collection = await Collection.findOne({ _id: collectionId, userId: req.user._id });
    if (!collection) return res.status(404).json({ message: "Collection not found" });

    await axios.post(`${RAG_URL}/ingest/url?collection_id=${collectionId}&url=${encodeURIComponent(url)}`);

    const document = await Document.create({
      userId: req.user._id,
      collectionId,
      name: url,
      type: "url",
      source: url,
    });

    await Collection.findByIdAndUpdate(collectionId, { $inc: { documentCount: 1 } });
    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadYoutube = async (req, res) => {
  try {
    const RAG_URL = process.env.RAG_SERVICE_URL;
    const { collectionId, url } = req.body;
    if (!url) return res.status(400).json({ message: "YouTube URL is required" });

    const collection = await Collection.findOne({ _id: collectionId, userId: req.user._id });
    if (!collection) return res.status(404).json({ message: "Collection not found" });
    console.log("VISITED");
    await axios.post(`${RAG_URL}/ingest/youtube?collection_id=${collectionId}&url=${encodeURIComponent(url)}`);
    const document = await Document.create({
      userId: req.user._id,
      collectionId,
      name: url,
      type: "youtube",
      source: url,
    });

    await Collection.findByIdAndUpdate(collectionId, { $inc: { documentCount: 1 } });
    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDocuments = async (req, res) => {
  try {
    
    const documents = await Document.find({
      collectionId: req.params.collectionId,
      userId: req.user._id,
    }).sort({ createdAt: -1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!document) return res.status(404).json({ message: "Document not found" });
    await Collection.findByIdAndUpdate(document.collectionId, { $inc: { documentCount: -1 } });
    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};