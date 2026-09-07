"""Response schemas kept intentionally small for the prototype API."""

from typing import Any, List, Optional

from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str


class PersonResponse(BaseModel):
    person_id: str
    name: str
    age: Optional[int] = None
    location: Optional[str] = None


class GraphNode(BaseModel):
    id: str
    label: str


class GraphEdge(BaseModel):
    source: str
    target: str
    relationship_type: str
    weight: float


class NetworkResponse(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]


class AnalysisResponse(BaseModel):
    person_id: str
    network_behavior_profile: dict[str, Any]
    data_sufficiency: dict[str, Any]
