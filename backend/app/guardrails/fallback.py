def fallback_response(query):
    return {
        "diagnosis": "Unable to determine exact issue.",
        "recommendation": "Check soil, watering, and visible pests.",
        "precautions": "Monitor plant regularly.",
        "sources": ["Fallback"],
        "confidence": 0.3,
        "suggestions": []
    }