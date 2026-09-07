import { useState } from 'react'
import { Layers, ChevronDown, ChevronUp } from 'lucide-react'
import type { CoordinationIndicators } from '../../types'
import LevelBadge from '../common/LevelBadge'
import Tooltip from '../common/Tooltip'
import { formatScore, formatNum } from '../../utils/levelColors'

interface Props {
  data: CoordinationIndicators
}

interface MetricRowProps {
  label: string
  value: number
  weight: number
  contribution: number
  tooltip?: string
}

function MetricRow({ label, value, weight, contribution, tooltip }: MetricRowProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[11px]">
        <span className="flex items-center gap-1 text-gray-500">
          {label}
          {tooltip && <Tooltip icon content={tooltip} />}
        </span>
        <span className="text-gray-300 font-mono">{formatNum(value)}</span>
      </div>
      <div className="h-1 bg-bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500/60 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(value * 100, 100)}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-gray-700">
        <span>weight {(weight * 100).toFixed(0)}%</span>
        <span>contrib {formatNum(contribution)}</span>
      </div>
    </div>
  )
}

export default function CoordinationCard({ data }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-bg-card border border-border rounded-lg p-5
                    hover:border-blue-500/20 transition-colors duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20
                          flex items-center justify-center flex-shrink-0">
            <Layers size={15} className="text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-semibold text-gray-300 tracking-widest uppercase">
                Coordination
              </h3>
              <Tooltip
                icon
                content="Identifies patterns of strong interaction and strategic network positioning. Weighted combination of degree centrality, interaction strength, and betweenness centrality."
              />
            </div>
            <p className="text-[10px] text-gray-600 mt-0.5 tracking-wide">Network activity role</p>
          </div>
        </div>
        <LevelBadge level={data.level} />
      </div>

      {/* Score */}
      <div className="bg-bg-secondary rounded-lg p-3 mb-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] text-gray-600 tracking-wider uppercase mb-1">
              Coordination Score
            </p>
            <p className="text-2xl font-bold text-blue-400">{formatScore(data.score)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-600 tracking-wider uppercase mb-1">Formula</p>
            <p className="text-[11px] text-gray-500 font-mono">
              0.4·deg + 0.3·str + 0.3·btw
            </p>
          </div>
        </div>
      </div>

      {/* Score bar */}
      <div className="mb-3">
        <div className="h-1.5 bg-bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-green-500 via-amber-500 to-red-500
                       transition-all duration-700"
            style={{ width: `${data.score * 100}%` }}
          />
        </div>
      </div>

      {/* Expand / collapse */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-1.5 text-[11px] text-gray-500
                   hover:text-blue-400 transition-colors"
      >
        {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        {expanded ? 'Hide details' : 'View details'}
      </button>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-border space-y-4">
          <MetricRow
            label="Degree Centrality"
            value={data.degree_centrality}
            weight={data.contribution_weights.degree_centrality}
            contribution={data.formula_contributions.degree_centrality}
            tooltip="Fraction of all entities this person is directly connected to."
          />
          <MetricRow
            label="Interaction Strength"
            value={data.normalized_interaction_strength}
            weight={data.contribution_weights.interaction_strength}
            contribution={data.formula_contributions.interaction_strength}
            tooltip="Min-max normalised sum of edge weights for this entity."
          />
          <MetricRow
            label="Betweenness Centrality"
            value={data.betweenness_centrality}
            weight={data.contribution_weights.betweenness_centrality}
            contribution={data.formula_contributions.betweenness_centrality}
            tooltip="Measures how frequently an entity lies on shortest paths between other entities."
          />
        </div>
      )}
    </div>
  )
}
