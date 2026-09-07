"""FastAPI application entry point with frontend static hosting and API routing."""

from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.api import analysis, network, persons
from app.config import Settings
from app.database.neo4j import Neo4jDatabase
from app.database.postgres import PostgresDatabase
from app.schemas.schemas import HealthResponse
from app.services.analysis_service import AnalysisService
from app.services.network_service import NetworkService
from app.services.person_service import PersonService

# Resolve directory paths
BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Close the lazy Neo4j driver when the application shuts down."""
    yield
    if hasattr(app.state, "neo4j") and app.state.neo4j is not None:
        try:
            app.state.neo4j.close()
        except Exception:
            pass


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or Settings()
    app = FastAPI(
        title="AI-Powered Criminal Network & Intelligence Analysis System",
        description="Forensic intelligence backend with network centrality, Kingpin identification, and link prediction",
        version="1.0.0",
        lifespan=lifespan,
    )

    # 1. Configure CORS Middleware (allowing all origins for development)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # 2. Database and Services Initialization
    postgres = PostgresDatabase(settings)
    neo4j = Neo4jDatabase(settings)
    app.state.neo4j = neo4j
    app.state.person_service = PersonService(postgres)
    app.state.network_service = NetworkService(neo4j)
    app.state.analysis_service = AnalysisService(postgres, neo4j)

    # 3. Mount API Routers
    # Direct routes (/analysis, /network, /persons)
    app.include_router(persons.router)
    app.include_router(network.router)
    app.include_router(analysis.router)

    # Versioned API routes
    app.include_router(analysis.router, prefix="/api/v1")
    app.include_router(analysis.router, prefix="/api/v1/analyze", tags=["analysis-v1"])
    app.include_router(network.router, prefix="/api/v1")
    app.include_router(persons.router, prefix="/api/v1")

    # Direct /api/v1/analyze POST endpoint shortcut
    @app.post("/api/v1/analyze", response_model=analysis.NetworkAnalyzeResponse, tags=["analysis-v1"])
    def analyze_shortcut(payload: analysis.NetworkAnalyzeRequest):
        return analysis.analyze_network(payload)

    # 4. Mount Static Files
    STATIC_DIR.mkdir(parents=True, exist_ok=True)
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

    # 5. Core Endpoints
    @app.get("/health", response_model=HealthResponse, tags=["health"])
    def health() -> dict[str, str]:
        return {"status": "healthy"}

    @app.get("/", response_class=FileResponse, tags=["frontend"])
    def serve_frontend():
        """Serve the interactive single-file frontend code.html."""
        html_file = STATIC_DIR / "code.html"
        if html_file.exists():
            return FileResponse(str(html_file), media_type="text/html")
        return {"message": "Frontend code.html not found. Place it in backend/app/static/code.html"}

    return app


app = create_app()
