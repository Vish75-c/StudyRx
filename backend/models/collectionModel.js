import mongoose from "mongoose";

const collectionSchema=new mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        name:{
            type:String,
            required:[true,"Collection name is required"],
            trim:true,
        },
        category:{
            type:String,
            enum:["Reports","Research","Drug Manuals","Clinical Guidelines","Other"],
            default:"Other",
        },
        documentCount:{
            type:Number,
            default:0,
        },
    },
    {timestamps:true}
);

const Collection=mongoose.model("Collection",collectionSchema);
export default Collection