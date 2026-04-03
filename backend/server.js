import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import db from "./db.js"

dotenv.config()
const PORT=process.env.PORT||3001
const app=express();
app.use(cors())
app.use(cookieParser())
app.use(express.json())

app.get("/",(req,res)=>{
    res.send("Hello world")
})

app.listen(PORT,()=>{
    console.log("server is running on port")
})



