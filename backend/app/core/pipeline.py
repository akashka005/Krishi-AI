from app.rag.retriever import retrieve_docs
from app.llm.provider import generate_response_stream

def run_pipeline(query: str):
    try:
        docs = retrieve_docs(query)
    except Exception as e:
        print(f"⚠️ RAG retrieval failed (FAISS index missing?): {e}")
        docs = []  # Fall back to LLM-only mode without context

    for token in generate_response_stream(query, docs):
        yield token