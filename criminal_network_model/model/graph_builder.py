"""Functions for creating a NetworkX graph from relationship CSV data."""

from pathlib import Path
from typing import Union

import networkx as nx
import pandas as pd


REQUIRED_COLUMNS = {"source", "target", "relationship", "weight"}


def build_graph(relationships_file: Union[str, Path]) -> nx.Graph:
    """Build an undirected, weighted relationship graph from a CSV file.

    Each CSV row creates one edge. If a duplicate pair is present, its latest
    relationship and weight replace the earlier values, which keeps the
    demonstration graph simple and predictable.
    """
    file_path = Path(relationships_file)
    if not file_path.exists():
        raise FileNotFoundError(f"Relationships file not found: {file_path}")

    try:
        # Keeping identifiers as strings prevents IDs such as 001 from becoming 1.
        relationships = pd.read_csv(file_path, dtype=str)
    except pd.errors.EmptyDataError:
        return nx.Graph()
    missing_columns = REQUIRED_COLUMNS.difference(relationships.columns)
    if missing_columns:
        raise ValueError(
            "relationships.csv is missing required columns: "
            f"{', '.join(sorted(missing_columns))}"
        )

    graph = nx.Graph()
    for row in relationships.dropna(subset=["source", "target"]).itertuples(index=False):
        source = str(row.source).strip()
        target = str(row.target).strip()
        # A self-link is not a relationship between two entities and can distort
        # degree centrality, so it is ignored.
        if not source or not target or source == target:
            continue

        weight = pd.to_numeric(row.weight, errors="coerce")
        # A non-positive or invalid weight has no useful meaning for this demo.
        weight = float(weight) if pd.notna(weight) and weight > 0 else 1.0
        graph.add_edge(
            source,
            target,
            relationship=str(row.relationship).strip(),
            weight=weight,
        )

    return graph
