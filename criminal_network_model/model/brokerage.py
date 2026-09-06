"""Brokerage-position calculations based on betweenness centrality."""

from typing import Dict

import networkx as nx


def interpret_score(score: float) -> str:
    """Map a normalized score to a human-readable level."""
    if score <= 0.30:
        return "LOW"
    if score <= 0.60:
        return "MEDIUM"
    return "HIGH"


def calculate_brokerage(graph: nx.Graph) -> Dict[str, float]:
    """Return normalized Freeman betweenness centrality for every node."""
    if graph.number_of_nodes() == 0:
        return {}
    # NetworkX's normalized form is safe for disconnected and small graphs.
    return {
        str(person_id): float(score)
        for person_id, score in nx.betweenness_centrality(graph, normalized=True).items()
    }
