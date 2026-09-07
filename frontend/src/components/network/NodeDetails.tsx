import { useNavigate } from 'react-router-dom'
import { X, GitBranch, BarChart2, ArrowRight } from 'lucide-react'
import type { FGNode, FGLink } from '../../types'

interface Props {
  node: FGNode
  allLinks: FGLink[]
  onClose: () => void
}

export default function NodeDetails({ node, allLinks, onClose }: Props) {
  const navigate = useNavigate()

  // Edges touching this node
  const nodeEdges = allLinks.filter((l) => {
    const src = typeof l.source === 'object' ? l.source.id : l.source
    const tgt = typeof l.target === 'object' ? l.target.id : l.target
    return src === node.id || tgt === node.id
  })

  // Neighbour IDs
  const neighbours = nodeEdges.map((l) => {
    const src = typeof l.source === 'object' ? l.source.id : l.source
    const tgt = typeof l.target === 'object' ? l.target.id : l.target
    return src === node.id ? tgt : src
  })

  // Relationship type counts
  const typeCounts: Record<string, number> = {}
  nodeEdges.forEach((l) => {
    const t = l.relationship_type || 'unknown'
    typeCounts[t] = (typeCounts[t] ?? 0) + 1
  })

  return (
    <div className="bg-bg-card border border-cyan-500/30 rounded-lg p-4 shadow-xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[10px] text-gray-500 tracking-widest uppercase mb-0.5">
            Selected Entity
          </p>
          <h3 className="text-sm font-bold text-cyan-400 tracking-wide">{node.label ?? node.id}</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-gray-300 transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-bg-secondary rounded p-2">
          <div className="flex items-center gap-1.5 mb-0.5">
            <GitBranch size={11} className="text-cyan-400" />
            <span className="text-[10px] text-gray-500 tracking-wider uppercase">Connections</span>
          </div>
          <p className="text-lg font-bold text-cyan-400">{nodeEdges.length}</p>
        </div>
        <div className="bg-bg-secondary rounded p-2">
          <div className="flex items-center gap-1.5 mb-0.5">
            <BarChart2 size={11} className="text-blue-400" />
            <span className="text-[10px] text-gray-500 tracking-wider uppercase">Avg Weight</span>
          </div>
          <p className="text-lg font-bold text-blue-400">
            {nodeEdges.length > 0
              ? (nodeEdges.reduce((s, l) => s + (l.weight ?? 1), 0) / nodeEdges.length).toFixed(2)
              : '—'}
          </p>
        </div>
      </div>

      {/* Relationship types */}
      {Object.keys(typeCounts).length > 0 && (
        <div className="mb-3">
          <p className="text-[10px] text-gray-600 tracking-widest uppercase mb-1.5">
            Relationship Types
          </p>
          <div className="flex flex-wrap gap-1">
            {Object.entries(typeCounts).map(([type, count]) => (
              <span
                key={type}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded
                           bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-300"
              >
                {type}
                <span className="text-blue-500 font-semibold">{count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Neighbours (max 5) */}
      {neighbours.length > 0 && (
        <div className="mb-4">
          <p className="text-[10px] text-gray-600 tracking-widest uppercase mb-1.5">
            Connected To
          </p>
          <div className="flex flex-wrap gap-1">
            {neighbours.slice(0, 5).map((nid) => (
              <span
                key={nid}
                className="px-2 py-0.5 rounded bg-bg-secondary border border-border
                           text-[10px] text-gray-400"
              >
                {nid}
              </span>
            ))}
            {neighbours.length > 5 && (
              <span className="px-2 py-0.5 rounded bg-bg-secondary border border-border
                               text-[10px] text-gray-600">
                +{neighbours.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={() => navigate(`/analysis/${node.id}`)}
        className="w-full flex items-center justify-center gap-2 py-2 px-4
                   bg-cyan-500/10 border border-cyan-500/30 rounded
                   text-xs text-cyan-400 hover:bg-cyan-500/20 transition-colors tracking-wide"
      >
        Analyse Entity <ArrowRight size={12} />
      </button>
    </div>
  )
}
