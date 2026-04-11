import os
os.environ["ANONYMIZED_TELEMETRY"] = "False"
os.environ["CHROMA_TELEMETRY"] = "False"
os.environ["POSTHOG_DISABLED"] = "True"
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import ingest, query, quiz
from dotenv import load_dotenv
load_dotenv()
app = FastAPI(
    title="MediQuery RAG Service",
    description="AI powered medical knowledge base RAG backend",
    version="1.0.0"
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