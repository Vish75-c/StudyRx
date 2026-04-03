import Document from "../models/documentModel.js";
import Chat from "../models/chatModel.js";
import Collection from "../models/collectionModel.js"
export const getCollections = async (req, res) => {
  try {
    const collections = await Collection.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCollection = async (req, res) => {
  try {
    const { name, category } = req.body;
    if (!name) return res.status(400).json({ message: "Collection name is required" });
    const collection = await Collection.create({ userId: req.user._id, name, category: category || "Other" });
    res.status(201).json(collection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCollectionById = async (req, res) => {
  try {
    const collection = await Collection.findOne({ _id: req.params.id, userId: req.user._id });
    if (!collection) return res.status(404).json({ message: "Collection not found" });
    res.json(collection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCollection = async (req, res) => {
  try {
    const collection = await Collection.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { name: req.body.name, category: req.body.category },
      { new: true }
    );
    if (!collection) return res.status(404).json({ message: "Collection not found" });
    res.json(collection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!collection) return res.status(404).json({ message: "Collection not found" });
    res.json({ message: "Collection deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const totalCollections = await Collection.countDocuments({ userId: req.user._id });
    const totalDocuments = await Document.countDocuments({ userId: req.user._id });
    const totalChats = await Chat.countDocuments({ userId: req.user._id });
    res.json({ totalCollections, totalDocuments, totalChats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};