import Documents from "../models/documentModel.js";
import Collection from "../models/collectionModel.js"
import axios from "axios"
import fs from "fs"
import FormData from "form-data"


const RAG_URL = process.env.RAG_SERVICE_URL || "http://localhost:8000"

export const uploadPDF = async (req, res) => {
    try {
        const { collectionId, documentName } = req.body;
        if (!req.file) return res.status(400).json({
            message: "No file uploaded"
        })
        const collection = await Collection.findOne({
            _id: collectionId, userId: req.user._id
        })
        if (!collection) return res.status(404).json({
            message: "Collection not found"
        })

        // Send to RAG SERVICE
        const formData = new FormData();
        formData.append("file", fs.createReadStream(req.file.path));
        formData.append("collection_id", collectionId)
        formData.append("document_name", documentName || req.file.originalname);

        await axios.post(`${RAG}/ingest/pdf`, formData, {
            headers: formData.getHeaders(),
        })

        //Save to MongoDB
        const document = await Document.create({
            userId: req.user._id,
            collectionId,
            name: documentName || req.file.orignalname,
            type: "pdf",
            source: req.file.originalname,
        })

        // Update collection document count
        await Collection.findByIdAndUpdate(collectionId, {
            $inc: { documentCount: 1 }
        });

        // Remove temp file
        fs.unlinkSync(req.file.path);
        res.status(201).json(document)

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
};

export const uploadYoutube = async(req, res)=> {
    try {
        const { collectionId, url } = req.body;
        if (!url) return res.status(400).json({ message: "YouTube URL is required" });
        const collection = await Collection.findOne({ _id: collectionId, userId: req.user._id })
        if (!collection) return res.status(404).json({
            message: "Collection not found"
        });
        await axios.post(`${RAG_URL}/ingest/youtube?collection_id=${collectionId}&url=${encodeURIComponent(url)}`);

        const document=await Document.create({
            userId:req.user._id,
            collectionId,
            name:url,
            type:"youtube",
            source:url,
        })
        await Collection.findByIdAndUpdate(collectionId,{$inc:{documentCount:1}});
        return res.status(201).json(document)
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
};

export const getDocuments=async (req,res)=>{
    try {
        const documents=await Documents.find({
            collectionId:req.params.collectionId,
            userId:req.user._id,
        }).sort({createdAt:-1})
        return res.json(documents)
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}


export const deleteDocument=async (req,res)=>{
    try {
        const document=await Document.findOneAndDelete({
            _id:req.params._id,
            userId:req.user._id,
        });
        if(!document)return res.status(404).json({
            message:"Document not found"
        })

        await Collection.findByIdAndUpdate(document.collectionId,{
            $inc:{documentCount:-1}
        })
        return res.json({message:"Document Deleted Successfully"})
    } catch (error) {
        return res.status(500).json({message:error.message});   
    }
}