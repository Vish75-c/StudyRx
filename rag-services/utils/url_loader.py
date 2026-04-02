from langchain_community.document_loaders import WebBaseLoader
from utils.text_splitter import split_documents

def load_url(url:str,collection_id:str):
    loader =WebBaseLoader()
    docs=loader.load()
    for doc in docs:
        doc.metadata["source"]=url
        doc.metadata["collection"]=collection_id
        doc.metadata["url"]=url

    chunks=split_documents(docs)
    return chunks