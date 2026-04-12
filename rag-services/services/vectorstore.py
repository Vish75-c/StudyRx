import os
from pinecone import Pinecone
from langchain_pinecone import PineconeVectorStore
from services.embeddings import get_embeddings
from dotenv import load_dotenv

load_dotenv()

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX = os.getenv("PINECONE_INDEX", "mediquery")


def get_pinecone_index():
    """Get Pinecone index instance."""
    pc = Pinecone(api_key=PINECONE_API_KEY)
    return pc.Index(PINECONE_INDEX)


def get_vectorstore(collection_id: str):
    """Get a PineconeVectorStore scoped to a collection via namespace."""
    embeddings = get_embeddings()
    index = get_pinecone_index()
    vectorstore = PineconeVectorStore(
        index=index,
        embedding=embeddings,
        namespace=collection_id,
    )
    return vectorstore


def add_documents(collection_id: str, docs: list):
    """Add documents to Pinecone under the given collection namespace."""
    embeddings = get_embeddings()
    index = get_pinecone_index()
    vectorstore = PineconeVectorStore(
        index=index,
        embedding=embeddings,
        namespace=collection_id,
    )
    vectorstore.add_documents(docs)
    print(f"[Pinecone] Added {len(docs)} docs to namespace '{collection_id}'")
    return vectorstore


def delete_collection(collection_id: str):
    """Delete all vectors in a Pinecone namespace (equivalent to dropping a collection)."""
    index = get_pinecone_index()
    index.delete(delete_all=True, namespace=collection_id)
    print(f"[Pinecone] Deleted namespace '{collection_id}'")
    return {"message": f"Collection {collection_id} deleted"}


def get_all_documents(collection_id: str):
    """Fetch ALL documents (text + metadata) from a Pinecone namespace.
    
    Uses list() to get all vector IDs, then fetch() in batches to retrieve
    the full records including metadata. Returns a dict with 'documents' and
    'metadatas' keys matching the old ChromaDB format for compatibility.
    """
    index = get_pinecone_index()

    # Step 1: List all vector IDs in this namespace
    all_ids = []
    for id_batch in index.list(namespace=collection_id):
        all_ids.extend(id_batch)

    if not all_ids:
        return {"documents": [], "metadatas": []}

    print(f"[Pinecone] Found {len(all_ids)} vectors in namespace '{collection_id}'")

    # Step 2: Fetch full records in batches of 1000
    documents = []
    metadatas = []
    batch_size = 1000

    for i in range(0, len(all_ids), batch_size):
        batch_ids = all_ids[i:i + batch_size]
        response = index.fetch(ids=batch_ids, namespace=collection_id)
        for vec_id in batch_ids:
            if vec_id in response.vectors:
                record = response.vectors[vec_id]
                metadata = dict(record.metadata) if record.metadata else {}
                # PineconeVectorStore stores the text in metadata under "text"
                text = metadata.pop("text", "")
                documents.append(text)
                metadatas.append(metadata)

    return {"documents": documents, "metadatas": metadatas}