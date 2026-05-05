from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.config.db import get_db
from app.models.user import User
from app.api.deps import get_current_user

router = APIRouter(prefix="/usage", tags=["Usage"])

@router.get("/stats")
def get_usage_stats(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if user.tier == "Free" and user.queries_remaining < 100:
        user.queries_remaining = 100
        db.commit()
        db.refresh(user)
        
    return {
        "tier": user.tier,
        "queries_remaining": user.queries_remaining,
        "credits": user.credits,
        "total_queries_used": 0,
        "most_asked_crop": "Wheat"
    }

@router.post("/upgrade")
def upgrade_tier(
    tier: str, 
    db: Session = Depends(get_db), 
    user: User = Depends(get_current_user)
):
    if tier not in ["Pro", "Pro+"]:
        raise HTTPException(status_code=400, detail="Invalid tier")
        
    user.tier = tier
    if tier == "Pro":
        user.queries_remaining += 100
    elif tier == "Pro+":
        user.queries_remaining += 1000
        
    db.commit()
    db.refresh(user)
    
    return {"message": f"Successfully upgraded to {tier}", "new_queries": user.queries_remaining}