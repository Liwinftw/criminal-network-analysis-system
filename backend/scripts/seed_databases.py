"""Seed PostgreSQL and Neo4j from the existing fictional ML demonstration CSVs."""

from pathlib import Path
import sys

import pandas as pd


BACKEND_ROOT = Path(__file__).resolve().parents[1]
PROJECT_ROOT = BACKEND_ROOT.parent
sys.path.insert(0, str(BACKEND_ROOT))

from app.config import Settings
from app.database.neo4j import Neo4jDatabase
from app.database.postgres import PostgresDatabase


DATA_DIRECTORY = PROJECT_ROOT / "criminal_network_model" / "data"


def records(csv_name: str) -> list[dict]:
    return pd.read_csv(DATA_DIRECTORY / csv_name).where(pd.notnull, None).to_dict("records")


def main() -> None:
    settings = Settings()
    postgres = PostgresDatabase(settings)
    neo4j = Neo4jDatabase(settings)

    persons = records("persons.csv")
    activities = records("activities.csv")
    person_cases = records("cases.csv")
    relationships = records("relationships.csv")

    postgres.create_tables()
    postgres.upsert_persons(persons)
    postgres.upsert_activities(activities)
    postgres.upsert_cases(person_cases)
    neo4j.upsert_persons(persons)
    neo4j.upsert_relationships(relationships)
    neo4j.close()
    print("PostgreSQL and Neo4j seeded from criminal_network_model/data.")


if __name__ == "__main__":
    main()
