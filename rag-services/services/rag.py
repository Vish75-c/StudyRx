from langchain_classic.chains import RetrievalQA
from langchain_core.prompts import PromptTemplate
from services.vectorstore import get_vectorstore
from services.groq_llm import get_llm
import traceback

MEDICAL_PROMPT = PromptTemplate(
    template="""You are a medical AI assistant. Use ONLY the context below to answer the question.
Always mention the source document name in your answer.
If you cannot find the answer in the context, say "I couldn't find this information in the uploaded documents."
Always add this disclaimer at the end: "This is for informational purposes only. Consult a licensed medical professional."

Context:
{context}

Question: {question}

Answer:""",
    input_variables=["context", "question"]
)

def query_rag(collection_id: str, question: str):
    try:
        print(f"[RAG] Getting vectorstore for collection: {collection_id}")
        vectorstore = get_vectorstore(collection_id)

        print(f"[RAG] Creating retriever")
        retriever = vectorstore.as_retriever(
            search_type="similarity",
            search_kwargs={"k": 4}
        )

        print(f"[RAG] Getting LLM")
        llm = get_llm()

        print(f"[RAG] Building QA chain")
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=retriever,
            return_source_documents=True,
            chain_type_kwargs={"prompt": MEDICAL_PROMPT}
        )

        print(f"[RAG] Running chain")
        result = qa_chain.invoke({"query": question})

        print(f"[RAG] Got result")
        sources = []
        for doc in result["source_documents"]:
            sources.append({
                "source": doc.metadata.get("source", "Unknown"),
                "page":   doc.metadata.get("page", "N/A"),
                "type":   doc.metadata.get("type", "document")
            })

        return {
            "answer":  result["result"],
            "sources": sources
        }

    except Exception as e:
        traceback.print_exc()
        raise e