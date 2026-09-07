"""Adapter that feeds database records into the existing CSV-based ML model."""

from pathlib import Path
import sys
import tempfile
from typing import Any, Dict

import pandas as pd

from app.database.neo4j import Neo4jDatabase
from app.database.postgres import PostgresDatabase


PROJECT_ROOT = Path(__file__).resolve().parents[3]
ML_MODULE_ROOT = PROJECT_ROOT / "criminal_network_model"
if str(ML_MODULE_ROOT) not in sys.path:
    sys.path.insert(0, str(ML_MODULE_ROOT))

from model.network_analyzer import NetworkAnalyzer  # noqa: E402


class AnalysisService:
    """Fetch database records, create short-lived CSVs, and run NetworkAnalyzer."""

    def __init__(self, postgres: PostgresDatabase, neo4j: Neo4jDatabase) -> None:
        self.postgres = postgres
        self.neo4j = neo4j

    @staticmethod
    def _write_csv(path: Path, rows: list[Dict[str, Any]], columns: list[str]) -> None:
        pd.DataFrame(rows, columns=columns).to_csv(path, index=False)

    def analyze_person(self, person_id: str) -> Dict[str, Any]:
        persons = self.postgres.get_persons()
        activities = self.postgres.get_activities()
        person_cases = self.postgres.get_person_cases()
        graph = self.neo4j.get_graph()
        relationships = [
            {
                "source": edge["source"],
                "target": edge["target"],
                "relationship": edge["relationship_type"],
                "weight": edge["weight"],
            }
            for edge in graph["edges"]
        ]

        runtime_directory = PROJECT_ROOT / "backend" / ".runtime"
        runtime_directory.mkdir(exist_ok=True)
        with tempfile.TemporaryDirectory(dir=runtime_directory) as temporary_directory:
            directory = Path(temporary_directory)
            self._write_csv(directory / "persons.csv", persons, ["person_id", "name"])
            self._write_csv(
                directory / "relationships.csv",
                relationships,
                ["source", "target", "relationship", "weight"],
            )
            self._write_csv(
                directory / "activities.csv",
                activities,
                ["person_id", "date", "activity_count"],
            )
            self._write_csv(directory / "cases.csv", person_cases, ["person_id", "case_id"])
            analyzer = NetworkAnalyzer(
                relationships_file=directory / "relationships.csv",
                activity_file=directory / "activities.csv",
                cases_file=directory / "cases.csv",
                persons_file=directory / "persons.csv",
            )
            return analyzer.analyze_person(person_id)
