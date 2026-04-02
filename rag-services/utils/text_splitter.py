from langchain.text_splitter import RecursiveCharacterTextSpitter

def split_documents(docs:list):
    splitter=RecursiveCharacterTextSpitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    chunks=splitter.fit_split(docs)
    return chunks