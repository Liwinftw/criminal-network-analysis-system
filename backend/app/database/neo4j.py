"""Small Neo4j data-access layer for relationship graph data."""

from typing import Any, Dict, Iterable, List

from neo4j import GraphDatabase
from neo4j.exceptions import Neo4jError, ServiceUnavailable

from app.config import Settings
from app.database.postgres import DatabaseUnavailableError


class Neo4jDatabase:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self._driver = None

    def _driver_instance(self):
        self.settings.validate_neo4j()
        if self._driver is None:
            try:
                self._driver = GraphDatabase.driver(
                    self.settings.neo4j_uri,
                    auth=(self.settings.neo4j_username, self.settings.neo4j_password),
                )
                self._driver.verify_connectivity()
            except (Neo4jError, ServiceUnavailable) as error:
                raise DatabaseUnavailableError("Neo4j is unavailable.") from error
        return self._driver

    def close(self) -> None:
        if self._driver is not None:
            self._driver.close()
            self._driver = None

    def upsert_persons(self, persons: Iterable[Dict[str, Any]]) -> None:
        query = "MERGE (:Person {person_id: $person_id})"
        with self._driver_instance().session() as session:
            for person in persons:
                session.run(query, person_id=str(person["person_id"]))

    def upsert_relationships(self, relationships: Iterable[Dict[str, Any]]) -> None:
        query = """
        MERGE (source:Person {person_id: $source})
        MERGE (target:Person {person_id: $target})
        MERGE (source)-[relationship:CONNECTED_TO {relationship_type: $relationship_type}]->(target)
        SET relationship.weight = $weight
        """
        with self._driver_instance().session() as session:
            for item in relationships:
                session.run(
                    query,
                    source=str(item["source"]),
                    target=str(item["target"]),
                    relationship_type=str(item["relationship"]),
                    weight=float(item["weight"]),
                )

    def get_graph(self) -> Dict[str, List[Dict[str, Any]]]:
        query = """
        MATCH (source:Person)
        OPTIONAL MATCH (source)-[relationship:CONNECTED_TO]->(target:Person)
        RETURN source.person_id AS source, target.person_id AS target,
               relationship.relationship_type AS relationship_type,
               relationship.weight AS weight
        """
        with self._driver_instance().session() as session:
            records = list(session.run(query))

        nodes = set()
        edges = []
        for record in records:
            source = record["source"]
            nodes.add(source)
            if record["target"] is not None:
                nodes.add(record["target"])
                edges.append(
                    {
                        "source": source,
                        "target": record["target"],
                        "relationship_type": record["relationship_type"],
                        "weight": record["weight"],
                    }
                )
        return {
            "nodes": [{"id": node, "label": node} for node in sorted(nodes)],
            "edges": edges,
        }

    def get_person_network(self, person_id: str) -> Dict[str, List[Dict[str, Any]]]:
        query = """
        MATCH (person:Person {person_id: $person_id})
        OPTIONAL MATCH (person)-[relationship:CONNECTED_TO]-(other:Person)
        RETURN person.person_id AS person_id, other.person_id AS other_id,
               relationship.relationship_type AS relationship_type,
               relationship.weight AS weight
        """
        with self._driver_instance().session() as session:
            records = list(session.run(query, person_id=person_id))

        if not records:
            return {"nodes": [], "edges": []}
        nodes = {person_id}
        edges = []
        for record in records:
            other_id = record["other_id"]
            if other_id is not None:
                nodes.add(other_id)
                edges.append(
                    {
                        "source": person_id,
                        "target": other_id,
                        "relationship_type": record["relationship_type"],
                        "weight": record["weight"],
                    }
                )
        return {
            "nodes": [{"id": node, "label": node} for node in sorted(nodes)],
            "edges": edges,
        }
