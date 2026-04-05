from langchain_community.document_loaders import PyPDFLoader
from utils.text_splitter import split_documents
import os

def load_pdf(file_path: str, collection_id: str, document_name: str):
    loader = PyPDFLoader(file_path)
    pages = loader.load()

    print(f"[PDF] Total pages loaded: {len(pages)}")

    # Filter out empty pages
    pages = [p for p in pages if p.page_content.strip()]
    print(f"[PDF] Non-empty pages: {len(pages)}")

    for page in pages:
        page.metadata["source"]        = document_name
        page.metadata["collection_id"] = collection_id
        page.metadata["type"]          = "pdf"

    if not pages:
        print("[PDF] WARNING: No text extracted. PDF may be image-based.")
        return []

    chunks = split_documents(pages)
    print(f"[PDF] Total chunks: {len(chunks)}")
    return chunks