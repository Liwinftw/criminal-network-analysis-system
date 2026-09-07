"""Analysis endpoints backed by the ML and Graph Analytics Engine."""

from typing import Any, Dict, List, Optional
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field

from app.analytics.engine import GraphAnalysisEngine
from app.config import DatabaseConfigurationError
from app.database.postgres import DatabaseUnavailableError
from app.schemas.schemas import AnalysisResponse


router = APIRouter(prefix="/analysis", tags=["analysis"])


# --- Request/Response Models for POST /analyze & /api/v1/analyze ---
class NodePayload(BaseModel):
    id: str
    label: Optional[str] = None
    name: Optional[str] = None
    type: Optional[str] = "entity"
    role: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class EdgePayload(BaseModel):
    source: str
    target: str
    relationship_type: Optional[str] = "CONNECTED"
    weight: Optional[float] = 1.0


class NetworkAnalyzeRequest(BaseModel):
    nodes: List[NodePayload] = Field(default_factory=list)
    edges: List[EdgePayload] = Field(default_factory=list)
    link_prediction_threshold: Optional[float] = 0.5


class KingpinCentrality(BaseModel):
    betweenness: float
    pagerank: float
    degree: float
    closeness: float
    connections_count: int


class KingpinResult(BaseModel):
    node_id: str
    label: str
    type: str
    kingpin_score: float
    tier: str
    level: str
    centrality: KingpinCentrality
    metadata: Optional[Dict[str, Any]] = None


class PredictedLinkResult(BaseModel):
    source: str
    target: str
    source_label: str
    target_label: str
    confidence: float
    confidence_ratio: float
    adamic_adar: float
    jaccard: float
    resource_allocation: float
    common_neighbors_count: int
    common_neighbors: List[str]
    reason: str


class NetworkAnalyzeResponse(BaseModel):
    status: str
    summary: Dict[str, Any]
    kingpin_rankings: List[KingpinResult]
    predicted_links: List[PredictedLinkResult]


@router.post("", response_model=NetworkAnalyzeResponse)
@router.post("/", response_model=NetworkAnalyzeResponse)
def analyze_network(payload: NetworkAnalyzeRequest) -> Dict[str, Any]:
    """Execute Module 5 Graph Analysis Engine on a network payload.
    
    Computes Kingpin scores, centrality profiles, and predicts covert links.
    """
    nodes_data = [node.model_dump() for node in payload.nodes]
    edges_data = [edge.model_dump() for edge in payload.edges]

    engine = GraphAnalysisEngine(nodes=nodes_data, edges=edges_data)
    result = engine.analyze(link_threshold=payload.link_prediction_threshold or 0.5)
    return result


@router.get("/{person_id}", response_model=AnalysisResponse)
def analyze_person(person_id: str, request: Request):
    """Legacy/Single-person deep ML analysis."""
    try:
        if not request.app.state.person_service.exists(person_id):
            raise HTTPException(status_code=404, detail="Person not found.")
        return request.app.state.analysis_service.analyze_person(person_id)
    except (DatabaseConfigurationError, DatabaseUnavailableError) as error:
        raise HTTPException(status_code=500, detail="Database service is unavailable.") from error

