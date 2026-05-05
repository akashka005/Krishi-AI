from app.rag.retriever import retrieve_docs
from app.llm.provider import generate_response_stream

def run_pipeline(query: str):
    docs = retrieve_docs(query)

    for token in generate_response_stream(query, docs):
        yield token