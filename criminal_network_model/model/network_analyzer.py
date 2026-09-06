"""Orchestrator for producing reusable per-person network behaviour profiles."""

from pathlib import Path
from typing import Any, Dict, Iterable, Optional, Set, Union

import pandas as pd

from .anomaly_detection import calculate_activity_anomalies
from .anomaly_detection import (
    DEFAULT_MINIMUM_ABSOLUTE_DEVIATION,
    DEFAULT_Z_HIGH_THRESHOLD,
    DEFAULT_Z_MEDIUM_THRESHOLD,
)
from .brokerage import calculate_brokerage, interpret_score
from .coordination import (
    DEFAULT_BETWEENNESS_WEIGHT as DEFAULT_COORDINATION_BETWEENNESS_WEIGHT,
    DEFAULT_DEGREE_WEIGHT,
    DEFAULT_INTERACTION_STRENGTH_WEIGHT,
    calculate_coordination,
)
from .cross_case import (
    DEFAULT_BETWEENNESS_WEIGHT as DEFAULT_CROSS_CASE_BETWEENNESS_WEIGHT,
    DEFAULT_CASE_COUNT_WEIGHT,
    calculate_cross_case_significance,
)
from .graph_builder import build_graph


class NetworkAnalyzer:
    """Load once, calculate once, and expose profiles for one or all people."""

    def __init__(
        self,
        relationships_file: Union[str, Path],
        activity_file: Union[str, Path],
        cases_file: Union[str, Path],
        z_medium_threshold: float = DEFAULT_Z_MEDIUM_THRESHOLD,
        z_high_threshold: float = DEFAULT_Z_HIGH_THRESHOLD,
        minimum_absolute_deviation: float = DEFAULT_MINIMUM_ABSOLUTE_DEVIATION,
        persons_file: Optional[Union[str, Path]] = None,
        degree_weight: float = DEFAULT_DEGREE_WEIGHT,
        interaction_strength_weight: float = DEFAULT_INTERACTION_STRENGTH_WEIGHT,
        coordination_betweenness_weight: float = DEFAULT_COORDINATION_BETWEENNESS_WEIGHT,
        case_count_weight: float = DEFAULT_CASE_COUNT_WEIGHT,
        cross_case_betweenness_weight: float = DEFAULT_CROSS_CASE_BETWEENNESS_WEIGHT,
    ) -> None:
        self.person_ids = self._load_person_ids(persons_file)
        self.coordination_weights = {
            "degree_centrality": degree_weight,
            "interaction_strength": interaction_strength_weight,
            "betweenness_centrality": coordination_betweenness_weight,
        }
        self.cross_case_weights = {
            "case_count": case_count_weight,
            "betweenness_centrality": cross_case_betweenness_weight,
        }
        self.graph = build_graph(relationships_file)
        self.brokerage_scores = calculate_brokerage(self.graph)
        self.coordination_scores = calculate_coordination(
            self.graph,
            self.brokerage_scores,
            degree_weight=degree_weight,
            interaction_strength_weight=interaction_strength_weight,
            betweenness_weight=coordination_betweenness_weight,
        )
        self.activity_anomalies = calculate_activity_anomalies(
            activity_file,
            z_medium_threshold=z_medium_threshold,
            z_high_threshold=z_high_threshold,
            minimum_absolute_deviation=minimum_absolute_deviation,
        )
        self.cross_case_scores = calculate_cross_case_significance(
            cases_file,
            self.brokerage_scores,
            case_count_weight=case_count_weight,
            betweenness_weight=cross_case_betweenness_weight,
        )

    @staticmethod
    def _load_person_ids(persons_file: Optional[Union[str, Path]]) -> Set[str]:
        """Load valid person IDs from an optional reference CSV."""
        if persons_file is None:
            return set()

        file_path = Path(persons_file)
        if not file_path.exists():
            raise FileNotFoundError(f"Persons file not found: {file_path}")
        try:
            persons = pd.read_csv(file_path, dtype={"person_id": str})
        except pd.errors.EmptyDataError:
            return set()
        if "person_id" not in persons.columns:
            raise ValueError("persons.csv is missing required column: person_id")

        return {
            person_id.strip()
            for person_id in persons["person_id"].dropna().astype(str)
            if person_id.strip()
        }

    def _all_people(self) -> Iterable[str]:
        """Return registered, graph, activity, and case participants without duplicates."""
        people = set(self.person_ids)
        people.update(map(str, self.graph.nodes))
        people.update(self.activity_anomalies)
        people.update(self.cross_case_scores)
        return sorted(people)

    @staticmethod
    def _default_activity() -> Dict[str, Any]:
        return {
            "anomaly_score": None,
            "level": "NO_ACTIVITY_DATA",
            "current_activity": None,
            "baseline_mean": None,
            "baseline_standard_deviation": None,
            "absolute_deviation": None,
            "absolute_deviation_from_baseline": None,
            "relative_change": None,
            "explanation": "No activity records are available for this person.",
            "activity_record_count": 0,
        }

    @staticmethod
    def _default_cross_case() -> Dict[str, Any]:
        return {
            "case_count": 0,
            "distinct_case_count": 0,
            "normalized_case_score": 0.0,
            "normalized_case_count": 0.0,
            "betweenness_centrality": 0.0,
            "contribution_weights": {
                "case_count": 0.6,
                "betweenness_centrality": 0.4,
            },
            "formula_contributions": {
                "normalized_case_count": 0.0,
                "betweenness_centrality": 0.0,
            },
            "score": 0.0,
            "level": "LOW",
        }

    @staticmethod
    def _sufficiency_level(
        record_count: int, medium_threshold: int, high_threshold: int
    ) -> str:
        """Classify the amount of available data; this is not confidence."""
        if record_count >= high_threshold:
            return "HIGH"
        if record_count >= medium_threshold:
            return "MEDIUM"
        return "LOW"

    def _data_sufficiency(self, person_id: str) -> Dict[str, Any]:
        """Describe the quantity of source data behind one person's profile."""
        relationship_count = (
            int(self.graph.degree(person_id)) if person_id in self.graph else 0
        )
        activity_count = int(
            self.activity_anomalies.get(person_id, {}).get("activity_record_count", 0)
        )
        case_count = int(
            self.cross_case_scores.get(person_id, {}).get("case_count", 0)
        )

        relationship_level = self._sufficiency_level(relationship_count, 2, 4)
        activity_level = self._sufficiency_level(activity_count, 3, 5)
        case_level = self._sufficiency_level(case_count, 2, 3)
        level_values = {"LOW": 1, "MEDIUM": 2, "HIGH": 3}
        average_level = (
            level_values[relationship_level]
            + level_values[activity_level]
            + level_values[case_level]
        ) / 3
        overall_level = (
            "HIGH"
            if average_level >= 2.5
            else "MEDIUM"
            if average_level >= 1.5
            else "LOW"
        )

        return {
            "relationship_data": {
                "record_count": relationship_count,
                "level": relationship_level,
            },
            "activity_data": {
                "record_count": activity_count,
                "level": activity_level,
            },
            "case_data": {"record_count": case_count, "level": case_level},
            "overall_level": overall_level,
            "note": "Data sufficiency describes available record quantity, not statistical confidence.",
        }

    def analyze_person(self, person_id: str) -> Dict[str, Any]:
        """Return one evidence-neutral analytical profile, or a helpful error."""
        person_key = str(person_id)
        if person_key not in self._all_people():
            return {
                "person_id": person_key,
                "error": "Person not found in persons, relationship, activity, or case data.",
            }

        brokerage_score = self.brokerage_scores.get(person_key, 0.0)
        coordination = self.coordination_scores.get(
            person_key,
            {
                "degree_centrality": 0.0,
                "normalized_interaction_strength": 0.0,
                "betweenness_centrality": 0.0,
                "contribution_weights": {
                    **self.coordination_weights,
                },
                "formula_contributions": {
                    "degree_centrality": 0.0,
                    "interaction_strength": 0.0,
                    "betweenness_centrality": 0.0,
                },
                "score": 0.0,
                "level": "LOW",
            },
        )
        return {
            "person_id": person_key,
            "network_behavior_profile": {
                "brokerage_position": {
                    "score": round(brokerage_score, 4),
                    "level": interpret_score(brokerage_score),
                    "node_degree": int(self.graph.degree(person_key))
                    if person_key in self.graph
                    else 0,
                    "explanation": (
                        "This score reflects how often the entity lies on shortest "
                        "paths between other entities in the network."
                    ),
                },
                "coordination_indicators": coordination,
                "activity_anomaly": self.activity_anomalies.get(
                    person_key, self._default_activity()
                ),
                "cross_case_significance": self.cross_case_scores.get(
                    person_key, self._default_cross_case_with_weights()
                ),
            },
            "data_sufficiency": self._data_sufficiency(person_key),
        }

    def _default_cross_case_with_weights(self) -> Dict[str, Any]:
        """Return safe cross-case values that expose configured weights."""
        result = self._default_cross_case()
        result["contribution_weights"] = dict(self.cross_case_weights)
        return result

    def analyze_all_people(self) -> Dict[str, Dict[str, Any]]:
        """Return profiles for every person represented in any input source."""
        return {person_id: self.analyze_person(person_id) for person_id in self._all_people()}
