"""Environment-based configuration for local backend development."""

from dataclasses import dataclass
import os
from typing import List

from dotenv import load_dotenv


load_dotenv()


class DatabaseConfigurationError(RuntimeError):
    """Raised when required database settings are missing."""


@dataclass(frozen=True)
class Settings:
    postgres_host: str = os.getenv("POSTGRES_HOST", "localhost")
    postgres_port: int = int(os.getenv("POSTGRES_PORT", "5432"))
    postgres_db: str = os.getenv("POSTGRES_DB", "criminal_network")
    postgres_user: str = os.getenv("POSTGRES_USER", "postgres")
    postgres_password: str = os.getenv("POSTGRES_PASSWORD", "")
    neo4j_uri: str = os.getenv("NEO4J_URI", "bolt://localhost:7687")
    neo4j_username: str = os.getenv("NEO4J_USERNAME", "neo4j")
    neo4j_password: str = os.getenv("NEO4J_PASSWORD", "")
    cors_origins: str = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173")

    @property
    def cors_origin_list(self) -> List[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    def validate_postgres(self) -> None:
        if not self.postgres_password:
            raise DatabaseConfigurationError("PostgreSQL configuration is incomplete.")

    def validate_neo4j(self) -> None:
        if not self.neo4j_password:
            raise DatabaseConfigurationError("Neo4j configuration is incomplete.")
