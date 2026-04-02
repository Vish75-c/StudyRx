import chromadb
from chromadb.config import Settings
from langchain_community.vectorstores import Chroma
from services.embeddings import get_embeddings
import os

CHROMA_PATH = "./chromadb_store"

def get_vectorstore(collection_id: str):
    embeddings = get_embeddings()
    vectorstore = Chroma(
        collection_name=collection_id,
        embedding_function=embeddings,
        persist_directory=CHROMA_PATH
    )
    return vectorstore

def add_documents(collection_id: str, docs: list):
    embeddings = get_embeddings()
    vectorstore = Chroma.from_documents(
        documents=docs,
        embedding=embeddings,
        collection_name=collection_id,
        persist_directory=CHROMA_PATH
    )
    return vectorstore

def delete_collection(collection_id: str):
    client = chromadb.PersistentClient(path=CHROMA_PATH)
    client.delete_collection(name=collection_id)
    return {"message": f"Collection {collection_id} deleted"}