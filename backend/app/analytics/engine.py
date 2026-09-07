"""Graph analysis and link prediction engine (Module 5 analytics)."""

from typing import Any, Dict, List, Optional
import networkx as nx
import math


class GraphAnalysisEngine:
    """Engine to perform network centrality, Kingpin identification, and link prediction."""

    def __init__(self, nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]):
        self.nodes = nodes
        self.edges = edges
        self.graph = nx.Graph()
        self._build_graph()

    def _build_graph(self):
        for node in self.nodes:
            node_id = str(node.get("id") or node.get("person_id") or "")
            if node_id:
                self.graph.add_node(node_id, **node)

        for edge in self.edges:
            src = str(edge.get("source") or "")
            dst = str(edge.get("target") or "")
            if src and dst:
                weight = float(edge.get("weight", 1.0))
                rel = edge.get("relationship_type") or edge.get("relationship") or "CONNECTED"
                self.graph.add_edge(src, dst, weight=weight, relationship_type=rel)

    def compute_kingpins(self) -> List[Dict[str, Any]]:
        """Compute Betweenness, PageRank/Degree, and composite Kingpin score for all nodes."""
        if len(self.graph.nodes) == 0:
            return []

        # Centralities
        try:
            betweenness = nx.betweenness_centrality(self.graph, weight="weight")
        except Exception:
            betweenness = {n: 0.0 for n in self.graph.nodes}

        try:
            degree_cent = nx.degree_centrality(self.graph)
        except Exception:
            degree_cent = {n: 0.0 for n in self.graph.nodes}

        try:
            pagerank = nx.pagerank(self.graph, weight="weight")
        except Exception:
            pagerank = {n: 0.0 for n in self.graph.nodes}

        try:
            closeness = nx.closeness_centrality(self.graph)
        except Exception:
            closeness = {n: 0.0 for n in self.graph.nodes}

        # Normalize PageRank to 0-1 scale relative to max PageRank for fair comparison
        max_pr = max(pagerank.values()) if pagerank and max(pagerank.values()) > 0 else 1.0

        rankings = []
        for node_id in self.graph.nodes:
            bw = betweenness.get(node_id, 0.0)
            deg = degree_cent.get(node_id, 0.0)
            pr = pagerank.get(node_id, 0.0) / max_pr
            cls = closeness.get(node_id, 0.0)

            # Kingpin composite score formula:
            # 40% Betweenness + 35% PageRank + 25% Degree
            score = round(0.40 * bw + 0.35 * pr + 0.25 * deg, 4)

            # Determine risk tier
            if score >= 0.80:
                tier = "CRITICAL KINGPIN"
                level = "CRITICAL"
            elif score >= 0.60:
                tier = "HIGH RISK"
                level = "HIGH"
            elif score >= 0.40:
                tier = "MEDIUM RISK"
                level = "MEDIUM"
            else:
                tier = "LOW RISK"
                level = "LOW"

            node_data = self.graph.nodes[node_id]
            label = node_data.get("label") or node_data.get("name") or node_id

            rankings.append({
                "node_id": node_id,
                "label": label,
                "type": node_data.get("type", "entity"),
                "kingpin_score": score,
                "tier": tier,
                "level": level,
                "centrality": {
                    "betweenness": round(bw, 4),
                    "pagerank": round(pr, 4),
                    "degree": round(deg, 4),
                    "closeness": round(cls, 4),
                    "connections_count": self.graph.degree(node_id),
                },
                "metadata": node_data
            })

        rankings.sort(key=lambda x: x["kingpin_score"], reverse=True)
        return rankings

    def predict_links(self, threshold: float = 0.5) -> List[Dict[str, Any]]:
        """Predict covert non-existing links using Adamic-Adar & Jaccard index."""
        if len(self.graph.nodes) < 2:
            return []

        predicted = []
        non_edges = list(nx.non_edges(self.graph))

        # Adamic-Adar Index
        aa_scores = {}
        try:
            for u, v, p in nx.adamic_adar_index(self.graph, non_edges):
                aa_scores[(u, v)] = p
        except Exception:
            pass

        # Jaccard Coefficient
        jc_scores = {}
        try:
            for u, v, p in nx.jaccard_coefficient(self.graph, non_edges):
                jc_scores[(u, v)] = p
        except Exception:
            pass

        # Resource Allocation Index
        ra_scores = {}
        try:
            for u, v, p in nx.resource_allocation_index(self.graph, non_edges):
                ra_scores[(u, v)] = p
        except Exception:
            pass

        max_aa = max(aa_scores.values()) if aa_scores and max(aa_scores.values()) > 0 else 1.0

        for u, v in non_edges:
            aa = aa_scores.get((u, v), 0.0)
            jc = jc_scores.get((u, v), 0.0)
            ra = ra_scores.get((u, v), 0.0)

            # Normalized confidence: blend of Jaccard and normalized Adamic-Adar
            norm_aa = min(1.0, aa / max_aa) if max_aa > 0 else 0.0
            confidence = round(0.6 * norm_aa + 0.4 * jc, 4)

            # Common neighbors explanation
            common_neighbors = list(nx.common_neighbors(self.graph, u, v))
            
            if confidence >= threshold or (len(common_neighbors) > 0 and confidence > 0.3):
                u_label = self.graph.nodes[u].get("label") or self.graph.nodes[u].get("name") or u
                v_label = self.graph.nodes[v].get("label") or self.graph.nodes[v].get("name") or v

                predicted.append({
                    "source": u,
                    "target": v,
                    "source_label": u_label,
                    "target_label": v_label,
                    "confidence": round(confidence * 100, 1),
                    "confidence_ratio": confidence,
                    "adamic_adar": round(aa, 3),
                    "jaccard": round(jc, 3),
                    "resource_allocation": round(ra, 3),
                    "common_neighbors_count": len(common_neighbors),
                    "common_neighbors": common_neighbors,
                    "reason": f"{len(common_neighbors)} shared clandestine intermediaries: {', '.join(common_neighbors[:3])}."
                })

        predicted.sort(key=lambda x: x["confidence_ratio"], reverse=True)
        return predicted

    def analyze(self, link_threshold: float = 0.5) -> Dict[str, Any]:
        """Perform complete network intelligence analysis."""
        kingpins = self.compute_kingpins()
        predicted_links = self.predict_links(threshold=link_threshold)

        return {
            "status": "success",
            "summary": {
                "total_nodes": len(self.graph.nodes),
                "total_edges": len(self.graph.edges),
                "density": round(nx.density(self.graph), 4) if len(self.graph.nodes) > 0 else 0,
                "connected_components": nx.number_connected_components(self.graph) if len(self.graph.nodes) > 0 else 0,
                "kingpins_detected": len([k for k in kingpins if k["level"] in ["CRITICAL", "HIGH"]]),
                "predicted_links_count": len(predicted_links)
            },
            "kingpin_rankings": kingpins,
            "predicted_links": predicted_links
        }
