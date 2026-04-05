from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from services.vectorstore import add_documents
from utils.pdf_loader import load_pdf
from utils.url_loader import load_url
from utils.youtube_loader import load_youtube
import traceback
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
    file_path = None
    try:
        safe_filename = os.path.basename(file.filename)
        file_path = os.path.join(UPLOAD_DIR, safe_filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        print(f"[PDF] Saved to: {file_path}")

        chunks = load_pdf(file_path, collection_id, document_name)
        print(f"[PDF] Chunks created: {len(chunks)}")

        if len(chunks) == 0:
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from this PDF. It may be a scanned or image-based PDF. Please use a text-based PDF."
            )

        add_documents(collection_id, chunks)
        print(f"[PDF] Stored successfully")

        return {
            "message": f"PDF '{document_name}' ingested successfully",
            "chunks": len(chunks)
        }

    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if file_path and os.path.exists(file_path):
            os.remove(file_path)

@router.post("/url")
async def ingest_url(collection_id: str, url: str):
    try:
        chunks = load_url(url, collection_id)
        if len(chunks) == 0:
            raise HTTPException(status_code=400, detail="Could not extract text from this URL.")
        add_documents(collection_id, chunks)
        return {"message": "URL ingested successfully", "chunks": len(chunks)}
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/youtube")
async def ingest_youtube(collection_id: str, url: str):
    try:
        chunks = load_youtube(url, collection_id)
        if len(chunks) == 0:
            raise HTTPException(status_code=400, detail="Could not extract transcript from this YouTube video.")
        add_documents(collection_id, chunks)
        return {"message": "YouTube video ingested successfully", "chunks": len(chunks)}
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))