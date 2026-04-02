from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from services.vectorstore import add_document
from util.pdf_loader import load_pdf
from util.url_loader import load_url
from utils.youtube_loader import load_youtube
import stutil
import os

router = APIRouter()
UPLOAD_DIR = './uploads'


@router / post('/pdf')
async def ingest_pdf(
        file: UploadFile = File(...),
        collection_id: str = Form(...),
        document_name: str = Form(...)
):
    try:
        file_path = "{UPLOAD_DIR}/{file.filename}"
        with open(file_path, "rb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        chunks = load_pdf(file_path, collection_id, document_name)
        add_document(collection_id, chunks)
        os.remove(file_path)
        return {"message": f"PDF '{document_name}' ingested successfully", "chunks": len(chunks)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post('/youtube')
async def ingest_youtube(collection_id: str, url: str):
    try:
        chunks = load_youtube(url, collection_id)
        add_document(collection_id, chunks)
        return {"message": f"YouTube video ingested successfully", "chunks": len(chunks)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))