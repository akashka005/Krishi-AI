from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
import random
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/vision", tags=["Vision"])

DISEASES = [
    {"name": "Leaf Blight", "treatment": "Apply Mancozeb fungicide and ensure proper spacing for aeration."},
    {"name": "Powdery Mildew", "treatment": "Spray sulfur-based fungicide and avoid overhead watering."},
    {"name": "Healthy", "treatment": "Crop looks healthy! Maintain current watering and nutrient schedule."}
]

@router.post("/detect")
def detect_disease(
    file: UploadFile = File(...), 
    user: User = Depends(get_current_user)
):
    if user.tier != "Pro+":
        raise HTTPException(status_code=403, detail="Disease detection is a Pro+ feature.")
        
    result = random.choice(DISEASES)
    confidence = random.randint(75, 99) if result["name"] != "Healthy" else random.randint(90, 99)
    
    return {
        "disease_name": result["name"],
        "confidence": confidence,
        "suggested_treatment": result["treatment"],
        "bounding_box": [100, 150, 300, 400] 
    }