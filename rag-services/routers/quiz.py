from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from services.quiz import generate_quiz, evaluate_answers
import traceback

router = APIRouter()


class GenerateRequest(BaseModel):
    collection_id: str
    num_questions: int = 10
    difficulty: str = "medium"


class QuestionModel(BaseModel):
    question: str
    options: dict
    correct_answer: str
    topic: str = "General"


class EvaluateRequest(BaseModel):
    collection_id: str
    questions: List[QuestionModel]
    user_answers: List[str]


@router.post("/generate")
async def generate(request: GenerateRequest):
    try:
        print(f"[QUIZ ROUTER] Generate: collection={request.collection_id}, "
              f"num={request.num_questions}, difficulty={request.difficulty}")

        questions = generate_quiz(
            collection_id=request.collection_id,
            num_questions=request.num_questions,
            difficulty=request.difficulty
        )

        return {
            "questions": questions,
            "total": len(questions)
        }
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/evaluate")
async def evaluate(request: EvaluateRequest):
    try:
        print(f"[QUIZ ROUTER] Evaluate: collection={request.collection_id}, "
              f"questions={len(request.questions)}, answers={len(request.user_answers)}")

        questions_dicts = [q.model_dump() for q in request.questions]

        result = evaluate_answers(
            collection_id=request.collection_id,
            questions=questions_dicts,
            user_answers=request.user_answers
        )

        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
