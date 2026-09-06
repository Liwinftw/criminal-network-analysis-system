"""FastAPI application entry point."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import analysis, network, persons
from app.config import Settings
from app.database.neo4j import Neo4jDatabase
from app.database.postgres import PostgresDatabase
from app.schemas.schemas import HealthResponse
from app.services.analysis_service import AnalysisService
from app.services.network_service import NetworkService
from app.services.person_service import PersonService


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Close the lazy Neo4j driver when the application shuts down."""
    yield
    app.state.neo4j.close()


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or Settings()
    app = FastAPI(
        title="Criminal Network Analysis API",
        version="0.1.0",
        lifespan=lifespan,
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    postgres = PostgresDatabase(settings)
    neo4j = Neo4jDatabase(settings)
    app.state.neo4j = neo4j
    app.state.person_service = PersonService(postgres)
    app.state.network_service = NetworkService(neo4j)
    app.state.analysis_service = AnalysisService(postgres, neo4j)

    @app.get("/health", response_model=HealthResponse, tags=["health"])
    def health() -> dict[str, str]:
        return {"status": "healthy"}

    app.include_router(persons.router)
    app.include_router(network.router)
    app.include_router(analysis.router)
    return app


app = create_app()
