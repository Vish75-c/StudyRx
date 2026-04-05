import os
os.environ["ANONYMIZED_TELEMETRY"] = "False"
os.environ["CHROMA_TELEMETRY"] = "False"

from langchain_chroma import Chroma
from services.embeddings import get_embeddings
import chromadb

CHROMA_PATH = "./chromadb_store"

def get_chroma_client():
    return chromadb.PersistentClient(path=CHROMA_PATH)

def get_vectorstore(collection_id: str):
    embeddings = get_embeddings()
    vectorstore = Chroma(
        client=get_chroma_client(),
        collection_name=collection_id,
        embedding_function=embeddings,
    )
    return vectorstore

def add_documents(collection_id: str, docs: list):
    embeddings = get_embeddings()
    client = get_chroma_client()
    vectorstore = Chroma(
        client=client,
        collection_name=collection_id,
        embedding_function=embeddings,
    )
    vectorstore.add_documents(docs)
    print("Completed")
    return vectorstore

def delete_collection(collection_id: str):
    client = get_chroma_client()
    client.delete_collection(name=collection_id)
    return {"message": f"Collection {collection_id} deleted"}