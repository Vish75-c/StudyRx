from services.vectorstore import get_vectorstore
from services.groq_llm import get_llm
import traceback
import json
import re


def get_chunks_from_collection(collection_id: str, num_questions: int):
    """Fetch relevant text chunks from ChromaDB for quiz generation."""
    try:
        vectorstore = get_vectorstore(collection_id)
        # Fetch 3x the number of questions for diverse content
        num_chunks = num_questions * 3
        retriever = vectorstore.as_retriever(
            search_type="similarity",
            search_kwargs={"k": num_chunks}
        )
        docs = retriever.invoke("key concepts topics definitions important facts")
        print(f"[QUIZ] Retrieved {len(docs)} chunks from collection {collection_id}")
        return docs
    except Exception as e:
        traceback.print_exc()
        raise e


def generate_quiz(collection_id: str, num_questions: int = 10, difficulty: str = "medium"):
    """Generate MCQ questions from collection documents using Groq LLaMA3."""
    try:
        print(f"[QUIZ] Generating {num_questions} {difficulty} questions for collection {collection_id}")

        # 1. Get document chunks
        docs = get_chunks_from_collection(collection_id, num_questions)
        if not docs:
            raise Exception("No documents found in this collection")

        # 2. Combine chunks into context
        context = "\n\n".join([doc.page_content for doc in docs])
        # Limit context to avoid token limits
        context = context[:8000]

        # 3. Build difficulty instructions
        difficulty_instructions = {
            "easy": "Create straightforward questions that test basic recall and understanding. Questions should be simple and direct.",
            "medium": "Create questions that require understanding of concepts and some analytical thinking. Include some questions that require connecting ideas.",
            "hard": "Create challenging questions that require deep understanding, critical analysis, and the ability to apply concepts. Include questions that test nuanced understanding."
        }

        diff_instruction = difficulty_instructions.get(difficulty, difficulty_instructions["medium"])

        # 4. Build prompt
        prompt = f"""You are a quiz generator. Based on the following document content, generate exactly {num_questions} multiple choice questions.

{diff_instruction}

IMPORTANT RULES:
- Each question must have exactly 4 options: A, B, C, D
- Only ONE option should be correct
- Questions must be based ONLY on the provided content
- Each question must have a topic field identifying the subject area
- Return ONLY valid JSON, no other text

Return the questions in this exact JSON format:
[
  {{
    "question": "What is...?",
    "options": {{
      "A": "Option A text",
      "B": "Option B text",
      "C": "Option C text",
      "D": "Option D text"
    }},
    "correct_answer": "A",
    "topic": "Topic Name"
  }}
]

Document Content:
{context}

Generate exactly {num_questions} questions now. Return ONLY the JSON array:"""

        # 5. Send to Groq
        llm = get_llm()
        response = llm.invoke(prompt)
        response_text = response.content

        print(f"[QUIZ] Raw response length: {len(response_text)}")

        # 6. Parse JSON from response
        # Try to extract JSON array using regex
        json_match = re.search(r'\[[\s\S]*\]', response_text)
        if json_match:
            questions = json.loads(json_match.group())
        else:
            questions = json.loads(response_text)

        # 7. Validate questions
        validated = []
        for q in questions:
            if all(k in q for k in ("question", "options", "correct_answer", "topic")):
                if isinstance(q["options"], dict) and len(q["options"]) == 4:
                    if q["correct_answer"] in ("A", "B", "C", "D"):
                        validated.append({
                            "question": q["question"],
                            "options": q["options"],
                            "correct_answer": q["correct_answer"],
                            "topic": q["topic"]
                        })

        print(f"[QUIZ] Generated {len(validated)} valid questions")
        return validated

    except Exception as e:
        traceback.print_exc()
        raise e


def evaluate_answers(collection_id: str, questions: list, user_answers: list):
    """Evaluate user answers and generate explanations using Groq."""
    try:
        print(f"[QUIZ] Evaluating {len(questions)} answers")

        score = 0
        results = []
        llm = get_llm()
        vectorstore = get_vectorstore(collection_id)

        for i, (question, user_answer) in enumerate(zip(questions, user_answers)):
            correct = question["correct_answer"].strip().upper()
            user_ans = (user_answer or "").strip().upper()
            is_correct = user_ans == correct

            if is_correct:
                score += 1

            # Fetch relevant chunks for explanation
            try:
                retriever = vectorstore.as_retriever(
                    search_type="similarity",
                    search_kwargs={"k": 2}
                )
                rel_docs = retriever.invoke(question["question"])
                explanation_context = "\n".join([d.page_content for d in rel_docs])[:2000]
            except:
                explanation_context = ""

            # Generate explanation
            try:
                explain_prompt = f"""Based on this context, provide a brief 1-2 sentence explanation for why the correct answer is "{correct}" ({question['options'].get(correct, '')}) for this question:

Question: {question['question']}
Options: A) {question['options'].get('A', '')} B) {question['options'].get('B', '')} C) {question['options'].get('C', '')} D) {question['options'].get('D', '')}

Context: {explanation_context}

Provide ONLY the explanation, nothing else:"""

                explanation_response = llm.invoke(explain_prompt)
                explanation = explanation_response.content.strip()
            except:
                explanation = f"The correct answer is {correct}: {question['options'].get(correct, '')}"

            results.append({
                "questionIndex": i,
                "question": question["question"],
                "options": question["options"],
                "userAnswer": user_ans,
                "correctAnswer": correct,
                "isCorrect": is_correct,
                "explanation": explanation,
                "topic": question.get("topic", "General")
            })

        # Calculate grade
        total = len(questions)
        percentage = round((score / total) * 100, 1) if total > 0 else 0

        if percentage >= 90:
            grade = "Excellent"
        elif percentage >= 75:
            grade = "Good"
        elif percentage >= 60:
            grade = "Average"
        elif percentage >= 40:
            grade = "Below Average"
        else:
            grade = "Needs Improvement"

        print(f"[QUIZ] Score: {score}/{total} ({percentage}%) — {grade}")

        return {
            "score": score,
            "total": total,
            "percentage": percentage,
            "grade": grade,
            "results": results
        }

    except Exception as e:
        traceback.print_exc()
        raise e
