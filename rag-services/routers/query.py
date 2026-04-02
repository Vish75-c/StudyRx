from fastapi import APIRouter,HTTPException
from pydantic import BaseModel
from services.rag import query_rag

router=APIRouter()

class QueryRequest(BaseModel):
    collection_id: str
    question:str

@router.post("/")
async def query(request: QueryRequest):
    try:
        result=quey_rag(request.collection_id,request.question)
        return result
    except Exception as e:
        raise HTTPException(status_code=400,detail=str(e))