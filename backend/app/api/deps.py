from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.config.db import get_db
from app.models.user import User

def get_current_user(db: Session = Depends(get_db)) -> User:
    phone = "anonymous"
    user = db.query(User).filter(User.phone_number == phone).first()
    if not user:
        user = User(
            phone_number=phone, 
            full_name="Anonymous Farmer", 
            tier="Free", 
            queries_remaining=10
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    return user