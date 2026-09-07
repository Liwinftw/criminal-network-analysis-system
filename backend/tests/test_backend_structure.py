"""Backend checks that do not require PostgreSQL or Neo4j to be running."""

from pathlib import Path
import sys


BACKEND_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_ROOT))

from app.config import DatabaseConfigurationError, Settings
from app.main import create_app


def test_required_routes_are_registered() -> None:
    app = create_app()
    paths = set(app.openapi()["paths"])

    assert {"/health", "/persons", "/persons/{person_id}", "/network", "/network/{person_id}", "/analysis/{person_id}"} <= paths


def test_missing_database_password_fails_with_safe_configuration_error() -> None:
    settings = Settings(postgres_password="", neo4j_password="")

    try:
        settings.validate_postgres()
    except DatabaseConfigurationError as error:
        assert str(error) == "PostgreSQL configuration is incomplete."
    else:
        raise AssertionError("Expected a configuration error for a missing password.")
