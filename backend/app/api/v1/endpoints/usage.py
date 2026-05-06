from fastapi import APIRouter, Depends, HTTPException
from app.api.deps import get_current_user

router = APIRouter(prefix="/usage", tags=["Usage"])

@router.get("/stats")
def get_usage_stats(user=Depends(get_current_user)):
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
    user=Depends(get_current_user)
):
    if tier not in ["Pro", "Pro+"]:
        raise HTTPException(status_code=400, detail="Invalid tier")
    
    return {"message": f"Successfully upgraded to {tier} (Mock Mode)", "new_queries": user.queries_remaining}