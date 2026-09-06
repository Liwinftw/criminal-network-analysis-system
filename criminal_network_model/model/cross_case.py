"""Cross-case significance calculations."""

import math
from pathlib import Path
from typing import Dict, Union

import pandas as pd

from .brokerage import interpret_score


REQUIRED_COLUMNS = {"person_id", "case_id"}

DEFAULT_CASE_COUNT_WEIGHT = 0.6
DEFAULT_BETWEENNESS_WEIGHT = 0.4


def _validate_weights(case_count_weight: float, betweenness_weight: float) -> None:
    """Validate prototype cross-case weights before they are applied."""
    if case_count_weight < 0 or betweenness_weight < 0:
        raise ValueError("Cross-case weights must be non-negative.")
    if not math.isclose(
        case_count_weight + betweenness_weight, 1.0, rel_tol=0.0, abs_tol=1e-9
    ):
        raise ValueError("Cross-case weights must sum to 1.0.")


def calculate_cross_case_significance(
    cases_file: Union[str, Path],
    brokerage_scores: Dict[str, float],
    case_count_weight: float = DEFAULT_CASE_COUNT_WEIGHT,
    betweenness_weight: float = DEFAULT_BETWEENNESS_WEIGHT,
) -> Dict[str, Dict[str, float | int | str]]:
    """Combine distinct case count and brokerage into cross-case significance."""
    _validate_weights(case_count_weight, betweenness_weight)
    file_path = Path(cases_file)
    if not file_path.exists():
        raise FileNotFoundError(f"Cases file not found: {file_path}")

    try:
        cases = pd.read_csv(file_path, dtype={"person_id": str, "case_id": str})
    except pd.errors.EmptyDataError:
        return {}
    missing_columns = REQUIRED_COLUMNS.difference(cases.columns)
    if missing_columns:
        raise ValueError(
            "cases.csv is missing required columns: "
            f"{', '.join(sorted(missing_columns))}"
        )
    cases = cases.dropna(subset=["person_id", "case_id"])
    if cases.empty:
        return {}

    counts = cases.groupby("person_id")["case_id"].nunique().to_dict()
    maximum_count = max(counts.values(), default=0)
    results: Dict[str, Dict[str, float | int | str]] = {}
    for person_id, count in counts.items():
        person_key = str(person_id)
        normalized_case_score = float(count / maximum_count) if maximum_count else 0.0
        betweenness_centrality = float(brokerage_scores.get(person_key, 0.0))
        case_count_contribution = case_count_weight * normalized_case_score
        betweenness_contribution = betweenness_weight * betweenness_centrality
        formula_contributions = {
            "normalized_case_count": round(case_count_contribution, 4),
            "betweenness_centrality": round(betweenness_contribution, 4),
        }
        # Match the final displayed score to the displayed contribution values.
        score = round(min(max(sum(formula_contributions.values()), 0.0), 1.0), 4)
        results[person_key] = {
            "case_count": int(count),
            "distinct_case_count": int(count),
            "normalized_case_score": round(normalized_case_score, 4),
            "normalized_case_count": round(normalized_case_score, 4),
            "betweenness_centrality": round(betweenness_centrality, 4),
            "contribution_weights": {
                "case_count": case_count_weight,
                "betweenness_centrality": betweenness_weight,
            },
            "formula_contributions": formula_contributions,
            "score": score,
            "level": interpret_score(score),
        }
    return results
