from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from services.vectorstore import add_documents
from utils.pdf_loader import load_pdf
from utils.youtube_loader import load_youtube
import shutil
import os

router = APIRouter()
UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/pdf")
async def ingest_pdf(
    file: UploadFile = File(...),
    collection_id: str = Form(...),
    document_name: str = Form(...)
):
    try:
        file_path = f"{UPLOAD_DIR}/{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        chunks = load_pdf(file_path, collection_id, document_name)
        add_documents(collection_id, chunks)

        os.remove(file_path)
        return {"message": f"PDF '{document_name}' ingested successfully", "chunks": len(chunks)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/url")
async def ingest_url(collection_id: str, url: str):
    try:
        chunks = load_url(url, collection_id)
        add_documents(collection_id, chunks)
        return {"message": f"URL ingested successfully", "chunks": len(chunks)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/youtube")
async def ingest_youtube(collection_id: str, url: str):
    try:
        chunks = load_youtube(url, collection_id)
        add_documents(collection_id, chunks)
        return {"message": f"YouTube video ingested successfully", "chunks": len(chunks)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))