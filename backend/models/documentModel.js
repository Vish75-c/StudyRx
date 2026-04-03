import mongoose from "mongoose";

const documentSchema=new mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        collectionId:{
            type:mongoose.Scehma.Types.ObjectId,
            ref:"Collection",
            required:true,
        },
        name:{
            type:String,
            required:true,
            trim:true,
        },
        type:{
            type:String,
            enum:["pdf","url","youtube"],
            required:true
        },
        source:{
            type:String,
            required:true,
        },
    },
    {timestamps:true}
)

const Documents=mongoose.model("Document",documentSchema)
export default Documents