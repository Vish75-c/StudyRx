from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.rag import query_rag
import traceback

router = APIRouter()

class QueryRequest(BaseModel):
    collection_id: str
    question: str

@router.post("/")
async def query(request: QueryRequest):
    try:
        print(f"[QUERY] collection_id: {request.collection_id}")
        print(f"[QUERY] question: {request.question}")
        result = query_rag(request.collection_id, request.question)
        print(f"[QUERY] success")
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))