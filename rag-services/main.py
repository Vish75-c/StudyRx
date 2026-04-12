import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import ingest, query, quiz
from dotenv import load_dotenv
from contextlib import asynccontextmanager
import asyncio
import httpx

load_dotenv()

# ── Keep-alive: prevent Render free-tier from sleeping ──
async def keep_alive_pinger():
    """Ping self every 14 minutes to prevent Render from sleeping."""
    self_url = os.getenv("RENDER_EXTERNAL_URL")  # Render sets this automatically
    while True:
        await asyncio.sleep(14 * 60)  # 14 minutes
        if self_url:
            try:
                async with httpx.AsyncClient() as client:
                    resp = await client.get(self_url, timeout=30)
                    print(f"[KEEP-ALIVE] Self-ping OK: {resp.status_code}")
            except Exception as e:
                print(f"[KEEP-ALIVE] Self-ping failed: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start keep-alive background task
    task = asyncio.create_task(keep_alive_pinger())
    print("[KEEP-ALIVE] Pinger started — pinging every 14 minutes")
    yield
    task.cancel()

app = FastAPI(
    title="MediQuery RAG Service",
    description="AI powered medical knowledge base RAG backend",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ingest.router,    prefix="/ingest",    tags=["Ingest"])
app.include_router(query.router,     prefix="/query",     tags=["Query"])
app.include_router(quiz.router,      prefix="/quiz",      tags=["Quiz"])

@app.get("/")
def health_check():
    return {"status": "MediQuery RAG Service is running"}