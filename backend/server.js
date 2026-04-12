import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import db from "./db.js"
import authRoutes from "./routes/auth.js"
import chatRoutes from "./routes/chat.js"
import collectionsRoutes from "./routes/collections.js"
import documentRoutes from "./routes/documents.js"
import quizRoutes from "./routes/quiz.js"
import errorHandler from "./middleware/errorHandler.js"
import fs from "fs"

dotenv.config();
const PORT=process.env.PORT||3001
const app=express();

// Create uploads folder if not exists
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://study-rx.vercel.app/",
  ],
  credentials: true,
}));app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}));

// Routes
app.use("/api/auth",authRoutes)
app.use("/api/collections",collectionsRoutes)
app.use("/api/documents",documentRoutes)
app.use("/api/chat",chatRoutes)
app.use("/api/quiz",quizRoutes)


app.get("/", (req, res) => res.json({ message: "MediQuery Backend Running" }));

app.use(errorHandler)


app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
})

