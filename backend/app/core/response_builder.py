import json

def build_response(raw_response, confidence):
    try:
        parsed = json.loads(raw_response)
    except Exception:
        parsed = {
            "diagnosis": raw_response,
            "recommendation": "",
            "precautions": "",
            "sources": []
        }

    return {
        "diagnosis": parsed.get("diagnosis", ""),
        "recommendation": parsed.get("recommendation", ""),
        "precautions": parsed.get("precautions", ""),
        "sources": parsed.get("sources", []),
        "confidence": confidence,
        "suggestions": []
    }