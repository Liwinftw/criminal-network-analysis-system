"""Small PostgreSQL data-access layer for tabular investigation data."""

from typing import Any, Dict, Iterable, List

import psycopg
from psycopg.rows import dict_row

from app.config import DatabaseConfigurationError, Settings


class DatabaseUnavailableError(RuntimeError):
    """Raised when a database cannot be reached without exposing internals."""


class PostgresDatabase:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    def _connect(self):
        self.settings.validate_postgres()
        try:
            return psycopg.connect(
                host=self.settings.postgres_host,
                port=self.settings.postgres_port,
                dbname=self.settings.postgres_db,
                user=self.settings.postgres_user,
                password=self.settings.postgres_password,
                row_factory=dict_row,
            )
        except psycopg.Error as error:
            raise DatabaseUnavailableError("PostgreSQL is unavailable.") from error

    def create_tables(self) -> None:
        statements = [
            """
            CREATE TABLE IF NOT EXISTS persons (
                person_id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                age INTEGER,
                location TEXT
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS activities (
                id SERIAL PRIMARY KEY,
                person_id TEXT NOT NULL REFERENCES persons(person_id) ON DELETE CASCADE,
                date DATE NOT NULL,
                activity_count DOUBLE PRECISION NOT NULL,
                UNIQUE (person_id, date)
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS cases (
                case_id TEXT PRIMARY KEY,
                case_name TEXT,
                case_type TEXT
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS person_cases (
                person_id TEXT NOT NULL REFERENCES persons(person_id) ON DELETE CASCADE,
                case_id TEXT NOT NULL REFERENCES cases(case_id) ON DELETE CASCADE,
                PRIMARY KEY (person_id, case_id)
            )
            """,
        ]
        with self._connect() as connection, connection.cursor() as cursor:
            for statement in statements:
                cursor.execute(statement)

    def upsert_persons(self, persons: Iterable[Dict[str, Any]]) -> None:
        with self._connect() as connection, connection.cursor() as cursor:
            for person in persons:
                cursor.execute(
                    """
                    INSERT INTO persons (person_id, name, age, location)
                    VALUES (%(person_id)s, %(name)s, %(age)s, %(location)s)
                    ON CONFLICT (person_id) DO UPDATE SET
                        name = EXCLUDED.name,
                        age = EXCLUDED.age,
                        location = EXCLUDED.location
                    """,
                    {
                        "person_id": str(person["person_id"]),
                        "name": str(person.get("name") or person["person_id"]),
                        "age": person.get("age"),
                        "location": person.get("location"),
                    },
                )

    def upsert_activities(self, activities: Iterable[Dict[str, Any]]) -> None:
        with self._connect() as connection, connection.cursor() as cursor:
            for activity in activities:
                cursor.execute(
                    """
                    INSERT INTO activities (person_id, date, activity_count)
                    VALUES (%(person_id)s, %(date)s, %(activity_count)s)
                    ON CONFLICT (person_id, date) DO UPDATE SET
                        activity_count = EXCLUDED.activity_count
                    """,
                    activity,
                )

    def upsert_cases(self, person_cases: Iterable[Dict[str, Any]]) -> None:
        with self._connect() as connection, connection.cursor() as cursor:
            for item in person_cases:
                cursor.execute(
                    "INSERT INTO cases (case_id) VALUES (%s) ON CONFLICT (case_id) DO NOTHING",
                    (item["case_id"],),
                )
                cursor.execute(
                    """
                    INSERT INTO person_cases (person_id, case_id)
                    VALUES (%(person_id)s, %(case_id)s)
                    ON CONFLICT (person_id, case_id) DO NOTHING
                    """,
                    item,
                )

    def get_persons(self) -> List[Dict[str, Any]]:
        with self._connect() as connection, connection.cursor() as cursor:
            cursor.execute("SELECT person_id, name, age, location FROM persons ORDER BY person_id")
            return list(cursor.fetchall())

    def get_person(self, person_id: str) -> Dict[str, Any] | None:
        with self._connect() as connection, connection.cursor() as cursor:
            cursor.execute(
                "SELECT person_id, name, age, location FROM persons WHERE person_id = %s",
                (person_id,),
            )
            return cursor.fetchone()

    def get_activities(self) -> List[Dict[str, Any]]:
        with self._connect() as connection, connection.cursor() as cursor:
            cursor.execute(
                "SELECT person_id, date, activity_count FROM activities ORDER BY person_id, date"
            )
            return list(cursor.fetchall())

    def get_person_cases(self) -> List[Dict[str, Any]]:
        with self._connect() as connection, connection.cursor() as cursor:
            cursor.execute("SELECT person_id, case_id FROM person_cases ORDER BY person_id, case_id")
            return list(cursor.fetchall())
