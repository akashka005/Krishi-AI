from fastapi import APIRouter
from app.api.v1.endpoints import chat, health, usage, vision, metrics

api_router = APIRouter()

api_router.include_router(chat.router, prefix="/chat", tags=["Chat"])
api_router.include_router(usage.router)
api_router.include_router(vision.router)
api_router.include_router(health.router, prefix="/health", tags=["Health"])
api_router.include_router(metrics.router, prefix="/metrics", tags=["Metrics"])