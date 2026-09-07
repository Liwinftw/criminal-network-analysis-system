import { useState } from 'react'
import { FolderOpen, ChevronDown, ChevronUp } from 'lucide-react'
import type { CrossCaseSignificance } from '../../types'
import LevelBadge from '../common/LevelBadge'
import Tooltip from '../common/Tooltip'
import { formatScore, formatNum } from '../../utils/levelColors'

interface Props {
  data: CrossCaseSignificance
}

export default function CrossCaseCard({ data }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-bg-card border border-border rounded-lg p-5
                    hover:border-amber-500/20 transition-colors duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20
                          flex items-center justify-center flex-shrink-0">
            <FolderOpen size={15} className="text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-semibold text-gray-300 tracking-widest uppercase">
                Cross-Case Significance
              </h3>
              <Tooltip
                icon
                content="Indicates the extent to which an entity is connected across multiple investigations or cases. Combines case count with betweenness centrality."
              />
            </div>
            <p className="text-[10px] text-gray-600 mt-0.5 tracking-wide">Multi-investigation footprint</p>
          </div>
        </div>
        <LevelBadge level={data.level} />
      </div>

      {/* Primary metrics */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-bg-secondary rounded-lg p-3">
          <p className="text-[10px] text-gray-600 tracking-wider uppercase mb-1">Score</p>
          <p className="text-xl font-bold text-amber-400">{formatScore(data.score)}</p>
        </div>
        <div className="bg-bg-secondary rounded-lg p-3">
          <p className="text-[10px] text-gray-600 tracking-wider uppercase mb-1">Connected Cases</p>
          <p className="text-xl font-bold text-orange-400">{data.distinct_case_count}</p>
          <p className="text-[10px] text-gray-700 mt-0.5">distinct cases</p>
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

      {/* Expand */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-1.5 text-[11px] text-gray-500
                   hover:text-amber-400 transition-colors"
      >
        {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        {expanded ? 'Hide details' : 'View details'}
      </button>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-border space-y-2">
          {[
            ['Raw Score',              formatNum(data.score)],
            ['Case Count',             data.case_count.toString()],
            ['Distinct Cases',         data.distinct_case_count.toString()],
            ['Normalised Case Score',  formatNum(data.normalized_case_score)],
            ['Betweenness Centrality', formatNum(data.betweenness_centrality)],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between text-xs">
              <span className="text-gray-500">{label}</span>
              <span className="text-gray-300 font-mono">{value}</span>
            </div>
          ))}

          {/* Formula contributions */}
          <div className="pt-2 border-t border-border mt-2">
            <p className="text-[10px] text-gray-600 tracking-widest uppercase mb-2">
              Formula Contributions
            </p>
            {Object.entries(data.formula_contributions).map(([key, val]) => (
              <div key={key} className="flex justify-between text-xs mb-1">
                <span className="text-gray-500 capitalize">{key.replace(/_/g, ' ')}</span>
                <span className="text-amber-400 font-mono">{formatNum(val as number)}</span>
              </div>
            ))}
          </div>

          {/* Contribution weights */}
          <div className="pt-2 border-t border-border mt-2">
            <p className="text-[10px] text-gray-600 tracking-widest uppercase mb-2">
              Contribution Weights
            </p>
            {Object.entries(data.contribution_weights).map(([key, val]) => (
              <div key={key} className="flex justify-between text-xs mb-1">
                <span className="text-gray-500 capitalize">{key.replace(/_/g, ' ')}</span>
                <span className="text-gray-400 font-mono">{(val as number * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
