import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()

mongoose.connect(process.env.DATABASE_URL);

const db=mongoose.connection;

db.on("connected",()=>{
    console.log("Database is connected");
})

db.on("disconnected",()=>{
    console.log("Database is disconnected")
})
db.on("error",()=>{
    console.log("error connecting database")
})

export default db;