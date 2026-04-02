from langchain_community.embedding import HuggingFaceEmbeddings

def get_embedding():
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        model_kwargs={"device":"cpu"},
        encode_kwags={"normalize_embedding":True}
    )
    return embeddings
