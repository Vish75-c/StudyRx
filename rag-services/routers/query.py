from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.rag import query_rag

router = APIRouter()


class QueryRequest(BaseModel):
    collection_id: str
    question: str


@router.post("/")
async def query(request: QueryRequest):
    try:
        result = query_rag(request.collection_id, request.question)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
