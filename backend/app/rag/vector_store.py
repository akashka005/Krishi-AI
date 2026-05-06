import os
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings

EMBED_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
INDEX_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "data", "embeddings")

def load_index():
    faiss_file = os.path.join(INDEX_PATH, "index.faiss")
    if not os.path.exists(faiss_file):
        raise FileNotFoundError(f"FAISS index file not found at {faiss_file}")

    embeddings = HuggingFaceEmbeddings(model_name=EMBED_MODEL)
    db = FAISS.load_local(INDEX_PATH, embeddings, allow_dangerous_deserialization=True)
    return db, None