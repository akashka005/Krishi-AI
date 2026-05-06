from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from app.core.pipeline import run_pipeline
from pydantic import BaseModel
from app.api.deps import get_current_user


router = APIRouter()

class ChatQuery(BaseModel):
    query: str

@router.post("/")
async def chat_with_ai(
    data: ChatQuery, 
    user=Depends(get_current_user)
):
    if user.queries_remaining <= 0 and user.tier == "Free":
        raise HTTPException(status_code=403, detail="Query limit reached. Please upgrade.")
    
    # user.queries_remaining = max(0, user.queries_remaining - 1) # Skip decrement for now
    
    return StreamingResponse(run_pipeline(data.query), media_type="text/event-stream")