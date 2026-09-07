"""Coordination indicators from graph-centrality and interaction measures."""

import math
from typing import Dict

import networkx as nx

from .brokerage import interpret_score


DEFAULT_DEGREE_WEIGHT = 0.4
DEFAULT_INTERACTION_STRENGTH_WEIGHT = 0.3
DEFAULT_BETWEENNESS_WEIGHT = 0.3


def _validate_weights(
    degree_weight: float,
    interaction_strength_weight: float,
    betweenness_weight: float,
) -> None:
    """Validate prototype coordination weights before they are applied."""
    weights = (degree_weight, interaction_strength_weight, betweenness_weight)
    if any(weight < 0 for weight in weights):
        raise ValueError("Coordination weights must be non-negative.")
    if not math.isclose(sum(weights), 1.0, rel_tol=0.0, abs_tol=1e-9):
        raise ValueError("Coordination weights must sum to 1.0.")


def _min_max_normalize(values: Dict[str, float]) -> Dict[str, float]:
    """Normalize values to 0-1, including the no-variation edge case."""
    if not values:
        return {}
    minimum = min(values.values())
    maximum = max(values.values())
    if maximum == minimum:
        # Equal non-zero strengths mean every node has the highest observed
        # strength. All-zero strengths carry no interaction signal.
        normalized_value = 1.0 if maximum > 0 else 0.0
        return {person_id: normalized_value for person_id in values}
    return {
        person_id: (value - minimum) / (maximum - minimum)
        for person_id, value in values.items()
    }


def calculate_coordination(
    graph: nx.Graph,
    brokerage_scores: Dict[str, float],
    degree_weight: float = DEFAULT_DEGREE_WEIGHT,
    interaction_strength_weight: float = DEFAULT_INTERACTION_STRENGTH_WEIGHT,
    betweenness_weight: float = DEFAULT_BETWEENNESS_WEIGHT,
) -> Dict[str, Dict[str, float | str]]:
    """Calculate the weighted coordination score for every graph node.

    Score = degree weight * degree centrality + interaction-strength weight
            * normalized node strength + betweenness weight * centrality.
    """
    _validate_weights(
        degree_weight, interaction_strength_weight, betweenness_weight
    )
    if graph.number_of_nodes() == 0:
        return {}

    degree_scores = nx.degree_centrality(graph)
    strengths = {
        str(person_id): float(graph.degree(person_id, weight="weight"))
        for person_id in graph.nodes
    }
    normalized_strengths = _min_max_normalize(strengths)

    results: Dict[str, Dict[str, float | str]] = {}
    for person_id in graph.nodes:
        person_key = str(person_id)
        degree_centrality = float(degree_scores.get(person_id, 0.0))
        normalized_strength = normalized_strengths.get(person_key, 0.0)
        betweenness_centrality = float(brokerage_scores.get(person_key, 0.0))
        degree_contribution = degree_weight * degree_centrality
        strength_contribution = interaction_strength_weight * normalized_strength
        betweenness_contribution = betweenness_weight * betweenness_centrality
        formula_contributions = {
            "degree_centrality": round(degree_contribution, 4),
            "interaction_strength": round(strength_contribution, 4),
            "betweenness_centrality": round(betweenness_contribution, 4),
        }
        # Calculate the displayed score from the displayed contributions so the
        # explainability breakdown always adds up exactly.
        score = round(min(max(sum(formula_contributions.values()), 0.0), 1.0), 4)
        results[person_key] = {
            "degree_centrality": round(degree_centrality, 4),
            "normalized_interaction_strength": round(normalized_strength, 4),
            "betweenness_centrality": round(betweenness_centrality, 4),
            "contribution_weights": {
                "degree_centrality": degree_weight,
                "interaction_strength": interaction_strength_weight,
                "betweenness_centrality": betweenness_weight,
            },
            "formula_contributions": formula_contributions,
            "score": score,
            "level": interpret_score(score),
        }
    return results
