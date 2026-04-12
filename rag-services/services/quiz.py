from services.vectorstore import get_vectorstore, get_chroma_client
from services.groq_llm import get_llm
from langchain_core.documents import Document
from collections import defaultdict
import traceback
import json
import re
import random


def get_chunks_from_collection(collection_id: str, num_questions: int):
    """Fetch text chunks from ALL documents in ChromaDB for quiz generation.
    
    Uses round-robin sampling across different source documents to ensure
    diverse content coverage instead of biasing toward a single document.
    """
    try:
        # Directly query ChromaDB to get ALL chunks in this collection
        client = get_chroma_client()
        collection = client.get_collection(name=collection_id)
        all_data = collection.get(include=["documents", "metadatas"])

        if not all_data["documents"]:
            raise Exception("No documents found in this collection")

        # Group chunks by their source document
        source_groups = defaultdict(list)
        for doc_text, metadata in zip(all_data["documents"], all_data["metadatas"]):
            source = (metadata or {}).get("source", "unknown")
            source_groups[source].append(
                Document(page_content=doc_text, metadata=metadata or {})
            )

        print(f"[QUIZ] Collection '{collection_id}' has {len(all_data['documents'])} chunks "
              f"across {len(source_groups)} source document(s): {list(source_groups.keys())}")

        # Shuffle chunks within each source for variety
        for source in source_groups:
            random.shuffle(source_groups[source])

        # Round-robin sample across all sources for diversity
        num_chunks = min(num_questions * 3, len(all_data["documents"]))
        sampled_docs = []
        source_iters = {src: iter(chunks) for src, chunks in source_groups.items()}
        sources_list = list(source_iters.keys())

        while len(sampled_docs) < num_chunks and source_iters:
            exhausted = []
            for src in sources_list:
                if src not in source_iters:
                    continue
                try:
                    sampled_docs.append(next(source_iters[src]))
                    if len(sampled_docs) >= num_chunks:
                        break
                except StopIteration:
                    exhausted.append(src)
            for src in exhausted:
                del source_iters[src]
            sources_list = [s for s in sources_list if s in source_iters]

        # Shuffle the final selection so questions aren't grouped by document
        random.shuffle(sampled_docs)

        print(f"[QUIZ] Sampled {len(sampled_docs)} chunks across {len(source_groups)} source(s)")
        return sampled_docs
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

        # 2. Group chunks by source and build context with equal budget per source
        from collections import defaultdict as _defaultdict
        source_chunks = _defaultdict(list)
        for doc in docs:
            src = doc.metadata.get("source", "unknown")
            source_chunks[src].append(doc.page_content)

        num_sources = len(source_chunks)
        max_context = 8000
        budget_per_source = max_context // max(num_sources, 1)

        context_parts = []
        source_names = []
        for src, chunks in source_chunks.items():
            src_type = "document"
            if "youtube.com" in src or "youtu.be" in src:
                src_type = "YouTube video"
            elif src.startswith("http"):
                src_type = "web article"
            else:
                src_type = "PDF document"
            source_names.append(f"{src_type} ({src})")

            combined = "\n".join(chunks)
            # Truncate each source to its fair share of the budget
            combined = combined[:budget_per_source]
            context_parts.append(f"--- SOURCE: {src_type} — {src} ---\n{combined}")

        context = "\n\n".join(context_parts)
        source_list_str = ", ".join(source_names)

        print(f"[QUIZ] Context built from {num_sources} source(s): {source_list_str}")
        print(f"[QUIZ] Total context length: {len(context)} chars")

        # 3. Build difficulty instructions
        difficulty_instructions = {
            "easy": "Create straightforward questions that test basic recall and understanding. Questions should be simple and direct.",
            "medium": "Create questions that require understanding of concepts and some analytical thinking. Include some questions that require connecting ideas.",
            "hard": "Create challenging questions that require deep understanding, critical analysis, and the ability to apply concepts. Include questions that test nuanced understanding."
        }

        diff_instruction = difficulty_instructions.get(difficulty, difficulty_instructions["medium"])

        # 4. Build prompt — explicitly instruct to cover ALL sources
        prompt = f"""You are a quiz generator. Based on the following document content, generate exactly {num_questions} multiple choice questions.

{diff_instruction}

The content comes from {num_sources} different sources: {source_list_str}.
You MUST generate questions that cover ALL of these sources — distribute questions roughly equally across sources.

IMPORTANT RULES:
- Each question must have exactly 4 options: A, B, C, D
- Only ONE option should be correct
- Questions must be based ONLY on the provided content
- Each question must have a topic field identifying the subject area
- You MUST include questions from EVERY source listed above, not just one
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

Generate exactly {num_questions} questions covering ALL {num_sources} sources. Return ONLY the JSON array:"""

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
