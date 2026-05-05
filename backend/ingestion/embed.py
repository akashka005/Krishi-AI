from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings


def create_embeddings(chunks):
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    db = FAISS.from_texts(chunks, embeddings)
    db.save_local("data/embeddings")