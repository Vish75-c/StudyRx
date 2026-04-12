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
import axios from "axios"

dotenv.config();
const PORT=process.env.PORT||3001
const app=express();

// Create uploads folder if not exists
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://study-rx.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.use(cookieParser())
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


const server = app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
})

// Increase server timeouts so slow RAG requests (Render cold-start) don't abort
server.timeout = 300000;          // 5 min — total request/response time
server.headersTimeout = 310000;   // slightly above timeout
server.keepAliveTimeout = 300000; // keep socket alive for long requests

// ── Keep-alive pinger: prevent Render free-tier from sleeping ──
const RAG_URL = process.env.RAG_SERVICE_URL;
const SELF_URL = process.env.RENDER_EXTERNAL_URL; // Render sets this automatically

const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes

function keepAlive() {
  // Ping RAG service
  if (RAG_URL) {
    axios.get(RAG_URL)
      .then(() => console.log(`[KEEP-ALIVE] RAG service pinged successfully`))
      .catch((err) => console.log(`[KEEP-ALIVE] RAG service ping failed: ${err.message}`));
  }
  // Ping self (backend)
  if (SELF_URL) {
    axios.get(SELF_URL)
      .then(() => console.log(`[KEEP-ALIVE] Self-ping successful`))
      .catch((err) => console.log(`[KEEP-ALIVE] Self-ping failed: ${err.message}`));
  }
}

// Start pinging after server boots
setInterval(keepAlive, PING_INTERVAL);
keepAlive(); // initial ping on startup
console.log(`[KEEP-ALIVE] Pinger started — pinging every 14 minutes`);
