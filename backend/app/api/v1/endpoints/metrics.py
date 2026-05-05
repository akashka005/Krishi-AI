from fastapi import APIRouter
from pydantic import BaseModel
from app.core.telemetry import calculate_real_metrics

router = APIRouter()

class TelemetryMetrics(BaseModel):
    nlp: dict
    conversation: dict
    satisfaction: dict
    system: dict

@router.get("", response_model=TelemetryMetrics)
@router.get("/", response_model=TelemetryMetrics)
def get_model_metrics():
    return calculate_real_metrics()