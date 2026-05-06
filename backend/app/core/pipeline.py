import os
from app.rag.retriever import retrieve_docs
from app.llm.provider import generate_response_stream

def run_pipeline(query: str):
    # Allow disabling RAG via env var (e.g. on Render free tier where model loading is too slow)
    if os.getenv("DISABLE_RAG", "false").lower() == "true":
        docs = []
    else:
        try:
            docs = retrieve_docs(query)
        except Exception as e:
            print(f"⚠️ RAG retrieval failed: {e}")
            docs = []

    for token in generate_response_stream(query, docs):
        yield token
