from langchain_community.document_loaders import WebBaseLoader
from utils.text_splitter import split_documents

def load_url(url: str, collection_id: str):
    loader = WebBaseLoader(url)
    docs = loader.load()

    for doc in docs:
        doc.metadata["source"] = url
        doc.metadata["collection_id"] = collection_id
        doc.metadata["type"] = "url"

    chunks = split_documents(docs)
    return chunks