"""Person lookup service."""

from typing import Any, Dict, List

from app.database.postgres import PostgresDatabase


class PersonService:
    def __init__(self, postgres: PostgresDatabase) -> None:
        self.postgres = postgres

    def get_all(self) -> List[Dict[str, Any]]:
        return self.postgres.get_persons()

    def get_one(self, person_id: str) -> Dict[str, Any] | None:
        return self.postgres.get_person(person_id)

    def exists(self, person_id: str) -> bool:
        return self.get_one(person_id) is not None
