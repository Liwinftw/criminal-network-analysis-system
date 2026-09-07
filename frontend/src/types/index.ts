// ============================================================
// Types derived directly from backend/app/schemas/schemas.py
// and the actual JSON returned by each endpoint.
// DO NOT invent field names — these match the real API.
// ============================================================

// GET /health
export interface HealthResponse {
  status: string
}

// GET /persons  /  GET /persons/{person_id}
export interface Person {
  person_id: string
  name: string
  age: number | null
  location: string | null
}

// GET /network  /  GET /network/{person_id}
export interface GraphNode {
  id: string
  label: string
}

export interface GraphEdge {
  source: string
  target: string
  relationship_type: string
  weight: number
}

export interface NetworkResponse {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

// ============================================================
// GET /analysis/{person_id}
// Nested shape from NetworkAnalyzer.analyze_person()
// ============================================================

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'INSUFFICIENT_DATA' | 'NO_ACTIVITY_DATA' | 'NORMAL'

// -- brokerage_position --
export interface BrokeragePosition {
  score: number
  level: RiskLevel
  node_degree: number
  explanation: string
}

// -- coordination_indicators --
export interface FormulaContributions {
  degree_centrality: number
  interaction_strength: number
  betweenness_centrality: number
}

export interface ContributionWeights {
  degree_centrality: number
  interaction_strength: number
  betweenness_centrality: number
}

export interface CoordinationIndicators {
  degree_centrality: number
  normalized_interaction_strength: number
  betweenness_centrality: number
  contribution_weights: ContributionWeights
  formula_contributions: FormulaContributions
  score: number
  level: RiskLevel
}

// -- activity_anomaly --
export interface ActivityAnomaly {
  anomaly_score: number | null
  level: RiskLevel
  current_activity: number | null
  baseline_mean: number | null
  baseline_standard_deviation: number | null
  absolute_deviation: number | null
  absolute_deviation_from_baseline: number | null
  relative_change: number | null
  explanation: string
  activity_record_count: number
}

// -- cross_case_significance --
export interface CrossCaseContributionWeights {
  case_count: number
  betweenness_centrality: number
}

export interface CrossCaseFormulaContributions {
  normalized_case_count: number
  betweenness_centrality: number
}

export interface CrossCaseSignificance {
  case_count: number
  distinct_case_count: number
  normalized_case_score: number
  normalized_case_count: number
  betweenness_centrality: number
  contribution_weights: CrossCaseContributionWeights
  formula_contributions: CrossCaseFormulaContributions
  score: number
  level: RiskLevel
}

// -- network_behavior_profile --
export interface NetworkBehaviorProfile {
  brokerage_position: BrokeragePosition
  coordination_indicators: CoordinationIndicators
  activity_anomaly: ActivityAnomaly
  cross_case_significance: CrossCaseSignificance
}

// -- data_sufficiency --
export interface SufficiencyDetail {
  record_count: number
  level: RiskLevel
}

export interface DataSufficiency {
  relationship_data: SufficiencyDetail
  activity_data: SufficiencyDetail
  case_data: SufficiencyDetail
  overall_level: RiskLevel
  note: string
}

// -- top-level analysis response --
export interface AnalysisResponse {
  person_id: string
  network_behavior_profile: NetworkBehaviorProfile
  data_sufficiency: DataSufficiency
}

// ============================================================
// UI-only helper types
// ============================================================

// Shape used by react-force-graph-2d
export interface FGNode {
  id: string
  label: string
  x?: number
  y?: number
  vx?: number
  vy?: number
  fx?: number
  fy?: number
  color?: string
  val?: number
}

export interface FGLink {
  source: string | FGNode
  target: string | FGNode
  relationship_type: string
  weight: number
}

export interface GraphData {
  nodes: FGNode[]
  links: FGLink[]
}
