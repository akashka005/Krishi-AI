import os
from ingestion.pdf_extractor import extract_text
from ingestion.chunker import chunk_text
from ingestion.embed import create_embeddings


DATA_DIR = "data/raw"


def run_ingestion():
    all_chunks = []

    for file in os.listdir(DATA_DIR):
        if file.endswith(".pdf"):
            path = os.path.join(DATA_DIR, file)

            print(f"Processing {file}...")

            text = extract_text(path)
            chunks = chunk_text(text)

            all_chunks.extend(chunks)

    create_embeddings(all_chunks)
    print("Ingestion complete!")


if __name__ == "__main__":
    run_ingestion()