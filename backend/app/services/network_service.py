"""Network graph service."""

from typing import Any, Dict

from app.database.neo4j import Neo4jDatabase


class NetworkService:
    def __init__(self, neo4j: Neo4jDatabase) -> None:
        self.neo4j = neo4j

    def get_network(self) -> Dict[str, Any]:
        return self.neo4j.get_graph()

    def get_person_network(self, person_id: str) -> Dict[str, Any]:
        return self.neo4j.get_person_network(person_id)
