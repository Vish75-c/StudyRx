from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from services.vectorstore import get_vectorstore
from services.groq_llm import groq_llm

MEDICAL_PROMPT=PromptTemplate(
    template="""You are a medical AI assistant. Use ONLY the context below to answer the question.
Always mention the source document name in your answer.
If you don't know the answer from the context, say "I couldn't find this information in the uploaded documents."
Always add a disclaimer: "This is for informational purposes only. Consult a licensed medical professional."
 
Context:
{context}
 
Question: {question}
 
Answer:""",
    input_variables=["context", "question"]
)

def query_rag(collections_id:str,question:str):
    vectorstore = get_vectorstore(collections_id)
    retriever=vectorstore.as_retriever()
    llm=get_llm()
    qa_chain=RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        source_documents=True,
        chain_type_kwargs={"prompt":MEDICAL_PROMPT},
    )
    sources=[]
    for doc in result["source_documents"]:
        sources.append({
            "source":doc.metadata.get("source","unknown"),
            "page":doc.metadata.get("page","n/a"),
            "type":doc.metadata.get("type","document"),
        })
    return {
        "answer":result["result"],
        "sources":sources,
    }