def detect_intent(query):
    if "yellow" in query:
        return "disease"
    elif "fertilizer" in query:
        return "nutrient"
    return "general"