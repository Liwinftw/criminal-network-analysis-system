import { useState } from 'react'
import { GitBranch, ChevronDown, ChevronUp } from 'lucide-react'
import type { BrokeragePosition } from '../../types'
import LevelBadge from '../common/LevelBadge'
import Tooltip from '../common/Tooltip'
import { formatScore, formatNum } from '../../utils/levelColors'

interface Props {
  data: BrokeragePosition
}

export default function BrokerageCard({ data }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-bg-card border border-border rounded-lg p-5
                    hover:border-cyan-500/20 transition-colors duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20
                          flex items-center justify-center flex-shrink-0">
            <GitBranch size={15} className="text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-semibold text-gray-300 tracking-widest uppercase">
                Brokerage Position
              </h3>
              <Tooltip
                icon
                content="Indicates the entity's role in connecting different parts of the network. Based on normalised Freeman betweenness centrality."
              />
            </div>
            <p className="text-[10px] text-gray-600 mt-0.5 tracking-wide">Network bridge role</p>
          </div>
        </div>
        <LevelBadge level={data.level} />
      </div>

      {/* Primary metrics */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-bg-secondary rounded-lg p-3">
          <p className="text-[10px] text-gray-600 tracking-wider uppercase mb-1">Score</p>
          <p className="text-xl font-bold text-cyan-400">{formatScore(data.score)}</p>
          <p className="text-[10px] text-gray-700 mt-0.5">0–100% scale</p>
        </div>
        <div className="bg-bg-secondary rounded-lg p-3">
          <p className="text-[10px] text-gray-600 tracking-wider uppercase mb-1">Connections</p>
          <p className="text-xl font-bold text-blue-400">{data.node_degree}</p>
          <p className="text-[10px] text-gray-700 mt-0.5">Direct links</p>
        </div>
      </div>

      {/* Score bar */}
      <div className="mb-3">
        <div className="flex justify-between text-[10px] text-gray-600 mb-1">
          <span>LOW</span><span>MEDIUM</span><span>HIGH</span>
        </div>
        <div className="h-1.5 bg-bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-green-500 via-amber-500 to-red-500
                       transition-all duration-700"
            style={{ width: `${data.score * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-gray-700 mt-1">
          <span>0%</span><span>30%</span><span>60%</span><span>100%</span>
        </div>
      </div>

      {/* Expand / collapse */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-1.5 text-[11px] text-gray-500
                   hover:text-cyan-400 transition-colors mt-1"
      >
        {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        {expanded ? 'Hide details' : 'View details'}
      </button>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-border space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Raw score</span>
            <span className="text-gray-300 font-mono">{formatNum(data.score)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Node degree</span>
            <span className="text-gray-300 font-mono">{data.node_degree}</span>
          </div>
          <p className="text-[11px] text-gray-600 leading-relaxed pt-1 border-t border-border mt-2">
            {data.explanation}
          </p>
        </div>
      )}
    </div>
  )
}
