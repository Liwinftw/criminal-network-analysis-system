"""Analysis endpoint backed by the existing ML module."""

from fastapi import APIRouter, HTTPException, Request

from app.config import DatabaseConfigurationError
from app.database.postgres import DatabaseUnavailableError
from app.schemas.schemas import AnalysisResponse


router = APIRouter(prefix="/analysis", tags=["analysis"])


@router.get("/{person_id}", response_model=AnalysisResponse)
def analyze_person(person_id: str, request: Request):
    try:
        if not request.app.state.person_service.exists(person_id):
            raise HTTPException(status_code=404, detail="Person not found.")
        return request.app.state.analysis_service.analyze_person(person_id)
    except (DatabaseConfigurationError, DatabaseUnavailableError) as error:
        raise HTTPException(status_code=500, detail="Database service is unavailable.") from error
