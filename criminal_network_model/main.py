"""Run the local criminal-network analysis demonstration."""

import json
from pathlib import Path

from model.network_analyzer import NetworkAnalyzer


def main() -> None:
    project_root = Path(__file__).resolve().parent
    analyzer = NetworkAnalyzer(
        relationships_file=project_root / "data" / "relationships.csv",
        activity_file=project_root / "data" / "activities.csv",
        cases_file=project_root / "data" / "cases.csv",
        persons_file=project_root / "data" / "persons.csv",
    )

    print("Network Behaviour Profile for C004 (bridge example):")
    print(json.dumps(analyzer.analyze_person("C004"), indent=2))

    print("\nAll-person summary:")
    profiles = analyzer.analyze_all_people()
    summary = {
        person_id: {
            "brokerage": profile["network_behavior_profile"]["brokerage_position"]["level"],
            "coordination": profile["network_behavior_profile"]["coordination_indicators"]["level"],
            "activity_anomaly": profile["network_behavior_profile"]["activity_anomaly"]["level"],
            "cross_case": profile["network_behavior_profile"]["cross_case_significance"]["level"],
        }
        for person_id, profile in profiles.items()
    }
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
