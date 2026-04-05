from langchain_community.embeddings import HuggingFaceEmbeddings


def get_embeddings():
    embeddings = HuggingFaceEmbeddings()
    return embeddings
