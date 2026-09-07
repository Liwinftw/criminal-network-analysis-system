"""Network graph endpoints."""

from fastapi import APIRouter, HTTPException, Request

from app.config import DatabaseConfigurationError
from app.database.postgres import DatabaseUnavailableError
from app.schemas.schemas import NetworkResponse


router = APIRouter(prefix="/network", tags=["network"])


@router.get("", response_model=NetworkResponse)
def get_network(request: Request):
    try:
        return request.app.state.network_service.get_network()
    except (DatabaseConfigurationError, DatabaseUnavailableError) as error:
        raise HTTPException(status_code=500, detail="Database service is unavailable.") from error


@router.get("/{person_id}", response_model=NetworkResponse)
def get_person_network(person_id: str, request: Request):
    try:
        network = request.app.state.network_service.get_person_network(person_id)
    except (DatabaseConfigurationError, DatabaseUnavailableError) as error:
        raise HTTPException(status_code=500, detail="Database service is unavailable.") from error
    if not network["nodes"]:
        raise HTTPException(status_code=404, detail="Person not found in the network.")
    return network
