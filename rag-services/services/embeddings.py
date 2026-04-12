import os
from langchain_cohere import CohereEmbeddings

def get_embeddings():
    return CohereEmbeddings(
        model="embed-english-light-v3.0",
        cohere_api_key=os.getenv("COHERE_API_KEY")
    )