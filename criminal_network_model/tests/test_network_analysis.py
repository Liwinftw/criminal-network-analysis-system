"""Small automated checks for the criminal network analysis module."""

from pathlib import Path

import pytest

from model.anomaly_detection import calculate_activity_anomalies
from model.network_analyzer import NetworkAnalyzer


PROJECT_ROOT = Path(__file__).resolve().parents[1]
DATA_DIRECTORY = PROJECT_ROOT / "data"


def create_analyzer() -> NetworkAnalyzer:
    """Create an analyzer using the project's fictional demonstration data."""
    return NetworkAnalyzer(
        relationships_file=DATA_DIRECTORY / "relationships.csv",
        activity_file=DATA_DIRECTORY / "activities.csv",
        cases_file=DATA_DIRECTORY / "cases.csv",
    )


def test_bridge_node_has_higher_brokerage_than_peripheral_node() -> None:
    analyzer = create_analyzer()

    assert analyzer.brokerage_scores["C004"] > analyzer.brokerage_scores["C001"]


def test_coordination_scores_stay_between_zero_and_one() -> None:
    analyzer = create_analyzer()

    for result in analyzer.coordination_scores.values():
        assert 0.0 <= result["score"] <= 1.0


def test_activity_anomaly_detects_spike_and_normal_activity() -> None:
    analyzer = create_analyzer()

    assert analyzer.activity_anomalies["C001"]["level"] == "HIGH"
    assert analyzer.activity_anomalies["C003"]["level"] == "NORMAL"


def test_activity_anomaly_handles_insufficient_data() -> None:
    activity_file = PROJECT_ROOT / "tests" / "fixtures" / "insufficient_activities.csv"

    result = calculate_activity_anomalies(activity_file)["NEW001"]

    assert result["level"] == "INSUFFICIENT_DATA"
    assert result["anomaly_score"] is None


def test_cross_case_score_uses_distinct_case_count() -> None:
    analyzer = create_analyzer()
    c001_cross_case = analyzer.cross_case_scores["C001"]

    assert c001_cross_case["distinct_case_count"] == 4
    assert c001_cross_case["normalized_case_count"] == 1.0


def test_network_analyzer_returns_profile_and_graceful_unknown_error() -> None:
    analyzer = create_analyzer()

    known_person = analyzer.analyze_person("C004")
    unknown_person = analyzer.analyze_person("UNKNOWN")

    assert known_person["person_id"] == "C004"
    assert "network_behavior_profile" in known_person
    assert "data_sufficiency" in known_person
    assert unknown_person == {
        "person_id": "UNKNOWN",
        "error": "Person not found in persons, relationship, activity, or case data.",
    }


def test_person_registered_only_in_persons_file_gets_safe_defaults() -> None:
    analyzer = NetworkAnalyzer(
        relationships_file=DATA_DIRECTORY / "relationships.csv",
        activity_file=DATA_DIRECTORY / "activities.csv",
        cases_file=DATA_DIRECTORY / "cases.csv",
        persons_file=PROJECT_ROOT / "tests" / "fixtures" / "persons_only.csv",
    )

    profile = analyzer.analyze_person("C999")

    assert "C999" in analyzer.analyze_all_people()
    assert profile["network_behavior_profile"]["brokerage_position"]["score"] == 0.0
    assert profile["network_behavior_profile"]["coordination_indicators"]["score"] == 0.0
    assert profile["network_behavior_profile"]["activity_anomaly"]["level"] == "NO_ACTIVITY_DATA"
    assert profile["network_behavior_profile"]["cross_case_significance"]["score"] == 0.0


def test_configurable_coordination_weights_are_used() -> None:
    analyzer = NetworkAnalyzer(
        relationships_file=DATA_DIRECTORY / "relationships.csv",
        activity_file=DATA_DIRECTORY / "activities.csv",
        cases_file=DATA_DIRECTORY / "cases.csv",
        degree_weight=0.2,
        interaction_strength_weight=0.5,
        coordination_betweenness_weight=0.3,
    )

    coordination = analyzer.analyze_person("C004")["network_behavior_profile"][
        "coordination_indicators"
    ]

    assert coordination["contribution_weights"] == {
        "degree_centrality": 0.2,
        "interaction_strength": 0.5,
        "betweenness_centrality": 0.3,
    }
    assert coordination["score"] == round(
        sum(coordination["formula_contributions"].values()), 4
    )


def test_invalid_coordination_weights_raise_value_error() -> None:
    with pytest.raises(ValueError, match="Coordination weights must sum to 1.0"):
        NetworkAnalyzer(
            relationships_file=DATA_DIRECTORY / "relationships.csv",
            activity_file=DATA_DIRECTORY / "activities.csv",
            cases_file=DATA_DIRECTORY / "cases.csv",
            degree_weight=0.5,
            interaction_strength_weight=0.3,
            coordination_betweenness_weight=0.3,
        )


def test_configurable_cross_case_weights_are_used() -> None:
    analyzer = NetworkAnalyzer(
        relationships_file=DATA_DIRECTORY / "relationships.csv",
        activity_file=DATA_DIRECTORY / "activities.csv",
        cases_file=DATA_DIRECTORY / "cases.csv",
        case_count_weight=0.7,
        cross_case_betweenness_weight=0.3,
    )

    cross_case = analyzer.analyze_person("C004")["network_behavior_profile"][
        "cross_case_significance"
    ]

    assert cross_case["contribution_weights"] == {
        "case_count": 0.7,
        "betweenness_centrality": 0.3,
    }
    assert cross_case["score"] == round(
        sum(cross_case["formula_contributions"].values()), 4
    )


def test_invalid_cross_case_weights_raise_value_error() -> None:
    with pytest.raises(ValueError, match="Cross-case weights must sum to 1.0"):
        NetworkAnalyzer(
            relationships_file=DATA_DIRECTORY / "relationships.csv",
            activity_file=DATA_DIRECTORY / "activities.csv",
            cases_file=DATA_DIRECTORY / "cases.csv",
            case_count_weight=0.5,
            cross_case_betweenness_weight=0.3,
        )
