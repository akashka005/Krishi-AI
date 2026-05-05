from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from app.api.deps import get_current_user
from app.models.user import User
from app.core.pipeline import run_pipeline
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.config.db import get_db

router = APIRouter()

class ChatQuery(BaseModel):
    query: str

@router.post("/")
async def chat_with_ai(
    data: ChatQuery, 
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    if user.queries_remaining <= 0 and user.tier == "Free":
        raise HTTPException(status_code=403, detail="Query limit reached. Please upgrade.")
    
    user.queries_remaining = max(0, user.queries_remaining - 1)
    db.commit()
    
    return StreamingResponse(run_pipeline(data.query), media_type="text/event-stream")