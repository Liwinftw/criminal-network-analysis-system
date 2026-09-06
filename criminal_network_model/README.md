# Criminal Network Analysis Module

A small, reusable Python module for the **AI-Powered Criminal Network Analysis System (SIH26189)**. It converts relationship, activity, and case-association CSV files into explainable Network Behaviour Profiles. The included data is entirely fictional and exists only for a prototype demonstration.

This project deliberately contains no API, user interface, authentication, database, cloud setup, or automated decision-making. It provides analysis results that a separate backend can consume after appropriate human review.

## Indicators

1. **Brokerage Position** — normalized Freeman betweenness centrality. A high score means an entity often sits on shortest paths between other entities, so it may bridge groups.
2. **Coordination Indicators** — `0.4 × degree centrality + 0.3 × normalized interaction strength + 0.3 × betweenness centrality` by default.
3. **Activity Anomaly** — the absolute Z-score of the latest activity against that entity's earlier records. Prototype thresholds are: less than 2 is `NORMAL`, 2–3 is `MEDIUM`, and 3 or higher is `HIGH`. A safeguard also requires an absolute change of at least 2 activity units before a result can be `MEDIUM` or `HIGH`; this prevents a very small change from being over-classified when historical standard deviation is extremely small. These are configurable prototype thresholds, not calibrated production thresholds. At least two historical records are required; otherwise the result is `INSUFFICIENT_DATA`. When a baseline has zero variation, the score is `null` and the level is `NORMAL` (unchanged or below the safeguard) or `HIGH` (change meets the safeguard).
4. **Cross-Case Significance** — `0.6 × normalized distinct case count + 0.4 × betweenness centrality` by default.

Every profile also includes explainability metadata: graph measures and formula contributions behind each score, activity baseline values, and a `data_sufficiency` section. Data sufficiency is a simple measure of the available relationship, activity, and case-record quantity; it is not statistical confidence.

Scores are analytical indicators, not findings of criminality. They must be interpreted alongside supporting evidence and reviewed by an authorized human.

The coordination and cross-case weights are configurable **prototype heuristic parameters**, not learned machine-learning parameters. Every set of weights must be non-negative and sum to `1.0`; the active values and their contributions are returned in each profile's explainability metadata.

## Folder structure

```text
criminal_network_model/
├── data/
│   ├── persons.csv
│   ├── relationships.csv
│   ├── activities.csv
│   └── cases.csv
├── model/
│   ├── __init__.py
│   ├── graph_builder.py
│   ├── brokerage.py
│   ├── coordination.py
│   ├── anomaly_detection.py
│   ├── cross_case.py
│   └── network_analyzer.py
├── main.py
├── requirements.txt
└── README.md
```

## Installation and running

Use Python 3.10 or newer. From this folder, create an optional virtual environment and install the dependencies:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python main.py
```

## Automated tests

The lightweight test suite checks the four indicators and safe handling of an
unknown person and insufficient activity data. Install dependencies, then run:

```powershell
python -m pytest
```

The test suite uses a committed CSV fixture and disables pytest's optional disk
cache, so it can run in restricted or cloud-synced folders without requiring
access to the system temporary directory.

The demo prints C004's profile (a bridge between two groups), then a compact profile-level summary for every fictional person. C001's final activity record is intentionally a high anomaly, and C001/C004 each appear in multiple cases.

## CSV inputs

`data/persons.csv` is a reference list:

```csv
person_id,name
C001,Aarav Mehta
```

It is optional when creating `NetworkAnalyzer`. When supplied, every valid `person_id` is included in `analyze_all_people()`, even if the person does not yet have relationships, activities, or case records. Such people receive safe default values.

`data/relationships.csv` creates graph edges. `weight` is a positive interaction strength/frequency:

```csv
source,target,relationship,weight
C001,C002,communication,12
```

`data/activities.csv` must contain chronological activity records. The latest record per person is evaluated against all prior rows:

```csv
person_id,date,activity_count
C001,2026-08-01,5
```

`data/cases.csv` associates people with cases:

```csv
person_id,case_id
C001,CASE001
```

## Example output

```json
{
  "person_id": "C004",
  "network_behavior_profile": {
    "brokerage_position": {"score": 0.7143, "level": "HIGH"},
    "coordination_indicators": {"score": 0.8, "level": "HIGH"},
    "activity_anomaly": {"anomaly_score": 2.8284, "level": "MEDIUM"},
    "cross_case_significance": {"case_count": 3, "score": 0.74, "level": "HIGH"}
  }
}
```

Actual values are calculated from the CSVs at runtime and may change when data changes.

## Integrating into another backend

The integration developer can import the class and call it with their own file paths:

```python
from model.network_analyzer import NetworkAnalyzer

analyzer = NetworkAnalyzer(
    relationships_file="data/relationships.csv",
    activity_file="data/activities.csv",
    cases_file="data/cases.csv",
    persons_file="data/persons.csv",  # optional
)

result = analyzer.analyze_person("C001")
all_profiles = analyzer.analyze_all_people()
```

Optional activity-anomaly thresholds can be supplied when constructing the analyzer:

```python
analyzer = NetworkAnalyzer(
    relationships_file="data/relationships.csv",
    activity_file="data/activities.csv",
    cases_file="data/cases.csv",
    z_medium_threshold=2.0,
    z_high_threshold=3.0,
    minimum_absolute_deviation=2.0,
)
```

Optional prototype formula weights can also be supplied:

```python
analyzer = NetworkAnalyzer(
    relationships_file="data/relationships.csv",
    activity_file="data/activities.csv",
    cases_file="data/cases.csv",
    persons_file="data/persons.csv",
    degree_weight=0.4,
    interaction_strength_weight=0.3,
    coordination_betweenness_weight=0.3,
    case_count_weight=0.6,
    cross_case_betweenness_weight=0.4,
)
```

`analyze_person` returns a standard Python dictionary and gracefully returns an `error` field for an unknown ID. The module performs all calculations during initialization, so repeated profile reads reuse the computed scores.
