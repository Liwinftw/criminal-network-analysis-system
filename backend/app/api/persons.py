"""Person endpoints."""

from fastapi import APIRouter, HTTPException, Request

from app.config import DatabaseConfigurationError
from app.database.postgres import DatabaseUnavailableError
from app.schemas.schemas import PersonResponse


router = APIRouter(prefix="/persons", tags=["persons"])


@router.get("", response_model=list[PersonResponse])
def list_persons(request: Request):
    try:
        return request.app.state.person_service.get_all()
    except (DatabaseConfigurationError, DatabaseUnavailableError) as error:
        raise HTTPException(status_code=500, detail="Database service is unavailable.") from error


@router.get("/{person_id}", response_model=PersonResponse)
def get_person(person_id: str, request: Request):
    try:
        person = request.app.state.person_service.get_one(person_id)
    except (DatabaseConfigurationError, DatabaseUnavailableError) as error:
        raise HTTPException(status_code=500, detail="Database service is unavailable.") from error
    if person is None:
        raise HTTPException(status_code=404, detail="Person not found.")
    return person
