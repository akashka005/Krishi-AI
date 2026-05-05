from sqlalchemy import Column, Integer, String
from app.config.db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=True)
    password = Column(String, nullable=True)
    phone_number = Column(String, unique=True, index=True, nullable=True)
    full_name = Column(String, nullable=True)
    location = Column(String, nullable=True)
    primary_crop = Column(String, nullable=True)
    tier = Column(String, default="Free")
    queries_remaining = Column(Integer, default=100)
    credits = Column(Integer, default=0)