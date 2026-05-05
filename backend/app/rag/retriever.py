from app.rag.vector_store import load_index
def retrieve_docs(query: str, k: int = 3):
    index, metadata = load_index()

    docs = index.similarity_search(query, k=k)

    return [d.page_content for d in docs]