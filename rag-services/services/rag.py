from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from services.vectorstore import get_vectorstore
from services.groq_llm import get_llm

MEDICAL_PROMPT = PromptTemplate(
    template="""You are a medical AI assistant. Use ONLY the context below to answer the question.
Always mention the source document name in your answer.
If you don't know the answer from the context, say "I couldn't find this information in the uploaded documents."
Always add this disclaimer at the end: "This is for informational purposes only. Consult a licensed medical professional."

Context:
{context}

Question: {question}

Answer:""",
    input_variables=["context", "question"]
)

def query_rag(collection_id: str, question: str):
    vectorstore = get_vectorstore(collection_id)
    retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 4}
    )

    llm = get_llm()

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True,
        chain_type_kwargs={"prompt": MEDICAL_PROMPT}
    )

    result = qa_chain.invoke({"query": question})

    sources = []
    for doc in result["source_documents"]:
        sources.append({
            "source": doc.metadata.get("source", "Unknown"),
            "page": doc.metadata.get("page", "N/A"),
            "type": doc.metadata.get("type", "document")
        })

    return {
        "answer": result["result"],
        "sources": sources
    }