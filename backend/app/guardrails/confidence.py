def score_confidence(query, docs, response):
    if not docs:
        return 20

    return int(min(1.0, 0.5 + 0.1 * len(docs)) * 100)