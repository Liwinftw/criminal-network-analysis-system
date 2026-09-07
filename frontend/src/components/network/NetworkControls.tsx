import { Search, ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react'

interface Props {
  searchTerm: string
  onSearchChange: (v: string) => void
  onZoomIn: () => void
  onZoomOut: () => void
  onFit: () => void
  onReset: () => void
  totalNodes: number
  totalEdges: number
}

export default function NetworkControls({
  searchTerm,
  onSearchChange,
  onZoomIn,
  onZoomOut,
  onFit,
  onReset,
  totalNodes,
  totalEdges,
}: Props) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Search */}
      <div className="relative">
        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search entity..."
          className="pl-8 pr-3 py-1.5 bg-bg-card border border-border rounded text-xs text-gray-300
                     placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 w-44
                     transition-colors"
        />
      </div>

      {/* Zoom controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={onZoomIn}
          title="Zoom in"
          className="p-1.5 bg-bg-card border border-border rounded text-gray-500
                     hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
        >
          <ZoomIn size={13} />
        </button>
        <button
          onClick={onZoomOut}
          title="Zoom out"
          className="p-1.5 bg-bg-card border border-border rounded text-gray-500
                     hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
        >
          <ZoomOut size={13} />
        </button>
        <button
          onClick={onFit}
          title="Fit to view"
          className="p-1.5 bg-bg-card border border-border rounded text-gray-500
                     hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
        >
          <Maximize2 size={13} />
        </button>
        <button
          onClick={onReset}
          title="Reset selection"
          className="p-1.5 bg-bg-card border border-border rounded text-gray-500
                     hover:text-gray-200 hover:border-gray-500/40 transition-colors"
        >
          <RotateCcw size={13} />
        </button>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 ml-auto text-[11px] text-gray-600">
        <span><span className="text-gray-400 font-semibold">{totalNodes}</span> nodes</span>
        <span><span className="text-gray-400 font-semibold">{totalEdges}</span> edges</span>
      </div>
    </div>
  )
}
