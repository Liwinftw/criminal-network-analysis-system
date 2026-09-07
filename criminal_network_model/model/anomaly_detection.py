"""Temporal activity anomaly detection using a per-person Z-score baseline."""

from pathlib import Path
from typing import Dict, Union

import numpy as np
import pandas as pd


REQUIRED_COLUMNS = {"person_id", "date", "activity_count"}

# Prototype defaults. Callers can override these through
# calculate_activity_anomalies or NetworkAnalyzer.
DEFAULT_Z_MEDIUM_THRESHOLD = 2.0
DEFAULT_Z_HIGH_THRESHOLD = 3.0
DEFAULT_MINIMUM_ABSOLUTE_DEVIATION = 2.0


def _empty_result() -> Dict[str, float | int | str | None]:
    return {
        "anomaly_score": None,
        "level": "INSUFFICIENT_DATA",
        "current_activity": None,
        "baseline_mean": None,
        "baseline_standard_deviation": None,
        "absolute_deviation": None,
        "absolute_deviation_from_baseline": None,
        "relative_change": None,
        "explanation": "At least two historical activity records are required.",
        "activity_record_count": 0,
    }


def _anomaly_level(score: float, z_medium_threshold: float, z_high_threshold: float) -> str:
    if score < z_medium_threshold:
        return "NORMAL"
    if score < z_high_threshold:
        return "MEDIUM"
    return "HIGH"


def _validate_thresholds(
    z_medium_threshold: float,
    z_high_threshold: float,
    minimum_absolute_deviation: float,
) -> None:
    """Validate configurable prototype thresholds before analysis begins."""
    if z_medium_threshold < 0 or z_high_threshold <= z_medium_threshold:
        raise ValueError("z_high_threshold must be greater than z_medium_threshold.")
    if minimum_absolute_deviation < 0:
        raise ValueError("minimum_absolute_deviation cannot be negative.")


def calculate_activity_anomalies(
    activities_file: Union[str, Path],
    z_medium_threshold: float = DEFAULT_Z_MEDIUM_THRESHOLD,
    z_high_threshold: float = DEFAULT_Z_HIGH_THRESHOLD,
    minimum_absolute_deviation: float = DEFAULT_MINIMUM_ABSOLUTE_DEVIATION,
) -> Dict[str, Dict[str, float | int | str | None]]:
    """Calculate Z-score anomaly profiles with an absolute-deviation safeguard.

    The Z-score remains the primary anomaly metric. A score can only be MEDIUM
    or HIGH if its absolute difference from the baseline also meets the
    configured minimum, preventing tiny changes from being over-classified when
    historical variation is extremely small.
    """
    _validate_thresholds(
        z_medium_threshold, z_high_threshold, minimum_absolute_deviation
    )
    file_path = Path(activities_file)
    if not file_path.exists():
        raise FileNotFoundError(f"Activities file not found: {file_path}")

    try:
        activities = pd.read_csv(file_path, dtype={"person_id": str})
    except pd.errors.EmptyDataError:
        return {}
    missing_columns = REQUIRED_COLUMNS.difference(activities.columns)
    if missing_columns:
        raise ValueError(
            "activities.csv is missing required columns: "
            f"{', '.join(sorted(missing_columns))}"
        )
    if activities.empty:
        return {}

    activities["date"] = pd.to_datetime(activities["date"], errors="coerce")
    activities["activity_count"] = pd.to_numeric(
        activities["activity_count"], errors="coerce"
    )
    activities = activities.dropna(subset=["person_id", "date", "activity_count"])

    results: Dict[str, Dict[str, float | int | str | None]] = {}
    for person_id, person_activities in activities.groupby("person_id"):
        person_key = str(person_id)
        ordered = person_activities.sort_values("date")
        # Two historical values are the minimum needed for a meaningful
        # baseline mean and standard deviation.
        if len(ordered) < 3:
            result = _empty_result()
            result["activity_record_count"] = int(len(ordered))
            results[person_key] = result
            continue

        baseline = ordered.iloc[:-1]["activity_count"].to_numpy(dtype=float)
        current = float(ordered.iloc[-1]["activity_count"])
        mean = float(np.mean(baseline))
        standard_deviation = float(np.std(baseline, ddof=0))
        absolute_deviation = abs(current - mean)
        relative_change = (
            0.0
            if mean == 0 and current == 0
            else None
            if mean == 0
            else (current - mean) / abs(mean)
        )

        if standard_deviation == 0:
            # A different value from a perfectly stable baseline is anomalous,
            # but its mathematical Z-score is undefined/infinite. None keeps
            # the output JSON-safe for a later API integration.
            score = None
            if absolute_deviation < minimum_absolute_deviation:
                level = "NORMAL"
                explanation = (
                    "The baseline has no variation, but the absolute change "
                    f"({absolute_deviation:.4f}) is below the prototype safeguard "
                    f"({minimum_absolute_deviation:.4f})."
                )
            elif current == mean:
                level = "NORMAL"
                explanation = "The current activity matches the zero-variation baseline."
            else:
                level = "HIGH"
                explanation = (
                    "The baseline has no variation and the absolute change meets "
                    "the prototype safeguard; the Z-score is undefined."
                )
        else:
            score = absolute_deviation / standard_deviation
            z_score_level = _anomaly_level(
                score, z_medium_threshold, z_high_threshold
            )
            if absolute_deviation < minimum_absolute_deviation:
                level = "NORMAL"
                explanation = (
                    f"Z-score {score:.4f} is {z_score_level}, but the absolute "
                    f"change ({absolute_deviation:.4f}) is below the prototype "
                    f"safeguard ({minimum_absolute_deviation:.4f})."
                )
            else:
                level = z_score_level
                explanation = (
                    f"Z-score {score:.4f} with absolute change "
                    f"{absolute_deviation:.4f}; prototype thresholds classify this "
                    f"as {level}."
                )

        results[person_key] = {
            "anomaly_score": round(score, 4) if score is not None else None,
            "level": level,
            "current_activity": int(current) if current.is_integer() else round(current, 4),
            "baseline_mean": round(mean, 4),
            "baseline_standard_deviation": round(standard_deviation, 4),
            "absolute_deviation": round(absolute_deviation, 4),
            "absolute_deviation_from_baseline": round(absolute_deviation, 4),
            "relative_change": round(relative_change, 4)
            if relative_change is not None
            else None,
            "explanation": explanation,
            "activity_record_count": int(len(ordered)),
        }
    return results
