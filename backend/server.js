import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import db from "./db.js"
import authRoutes from "./routes/auth.js"
import errorHandler from "./middleware/errorHandler.js"
import fs from "fs"

dotenv.config();
const PORT=process.env.PORT||3001
const app=express();

// Create uploads folder if not exists
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}));

// Routes
app.use("/api/auth",authRoutes)

app.get("/", (req, res) => res.json({ message: "MediQuery Backend Running" }));

app.use(errorHandler)


app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
})

