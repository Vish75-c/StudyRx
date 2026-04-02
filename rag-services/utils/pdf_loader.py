from langchain_community.document_loader import PyPDFLoader
from utils.text_splitter import split_documents
import os

def load_pdf(file_path:str,collection_id:str,document_id:str):
    loader=PyPDFLoader(file_path)
    pages=loader.load()
    for page in pages:
        page.metadata["source"]=document_name
        page.metadata["collection_id"]=collection_id
        page.metadata["type"]="pdf"

    chunks=split_documents(pages)
    return chunks