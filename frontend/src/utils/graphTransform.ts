import type { NetworkResponse, GraphData, FGNode, FGLink } from '../types'

/**
 * Converts the backend NetworkResponse into the shape expected by
 * react-force-graph-2d: { nodes: FGNode[], links: FGLink[] }.
 */
export function toGraphData(network: NetworkResponse): GraphData {
  const nodes: FGNode[] = network.nodes.map((n) => ({
    id: n.id,
    label: n.label,
    val: 4, // default node size
  }))

  const links: FGLink[] = network.edges.map((e) => ({
    source: e.source,
    target: e.target,
    relationship_type: e.relationship_type,
    weight: e.weight,
  }))

  return { nodes, links }
}
