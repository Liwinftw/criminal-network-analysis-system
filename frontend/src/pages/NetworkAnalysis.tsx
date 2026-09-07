import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NetworkGraph from '../components/network/NetworkGraph'
import NetworkControls from '../components/network/NetworkControls'
import NodeDetails from '../components/network/NodeDetails'
import LoadingState from '../components/common/LoadingState'
import ErrorState from '../components/common/ErrorState'
import EmptyState from '../components/common/EmptyState'
import { useApi } from '../hooks/useApi'
import { getNetwork } from '../services/api'
import { toGraphData } from '../utils/graphTransform'
import type { FGNode, FGLink } from '../types'

export default function NetworkAnalysis() {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const fgRef = useRef<any>(null) // eslint-disable-line @typescript-eslint/no-explicit-any

  const [dims, setDims] = useState({ w: 800, h: 600 })
  const [selectedNode, setSelectedNode] = useState<FGNode | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const { data: network, loading, error, refetch } = useApi(getNetwork, [])

  // Measure container
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setDims({
          w: containerRef.current.offsetWidth,
          h: containerRef.current.offsetHeight,
        })
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const graphData = network ? toGraphData(network) : { nodes: [], links: [] }

  // Filter by search — highlight matching nodes by bumping their val
  const filteredData = {
    nodes: graphData.nodes.map((n) => ({
      ...n,
      val: searchTerm && n.id.toLowerCase().includes(searchTerm.toLowerCase()) ? 12 : 4,
    })),
    links: graphData.links,
  }

  const handleNodeClick = useCallback((node: FGNode) => {
    setSelectedNode(node)
  }, [])

  const handleZoomIn  = () => fgRef.current?.zoom(1.5, 300)
  const handleZoomOut = () => fgRef.current?.zoom(0.7, 300)
  const handleFit     = () => fgRef.current?.zoomToFit(400, 60)
  const handleReset   = () => { setSelectedNode(null); setSearchTerm('') }

  if (loading) return <LoadingState message="Loading network relationships..." />
  if (error)   return <ErrorState message={error} onRetry={refetch} />
  if (!network || network.nodes.length === 0)
    return <EmptyState title="No network data" message="The graph database returned no nodes." />

  return (
    <div className="flex flex-col h-full gap-4">

      {/* Controls bar */}
      <div className="bg-bg-card border border-border rounded-lg px-4 py-3 flex-shrink-0">
        <NetworkControls
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onFit={handleFit}
          onReset={handleReset}
          totalNodes={network.nodes.length}
          totalEdges={network.edges.length}
        />
      </div>

      {/* Graph + details side-by-side */}
      <div className="flex flex-1 gap-4 min-h-0">

        {/* Graph canvas */}
        <div
          ref={containerRef}
          className="flex-1 bg-bg-card border border-border rounded-lg overflow-hidden relative"
        >
          <NetworkGraph
            data={filteredData}
            selectedNodeId={selectedNode?.id ?? null}
            onNodeClick={handleNodeClick}
            width={dims.w}
            height={dims.h}
          />

          {/* Legend overlay */}
          <div className="absolute bottom-3 left-3 bg-bg-secondary/80 border border-border
                          rounded px-3 py-2 text-[10px] text-gray-500 space-y-1 pointer-events-none">
            <p className="text-gray-400 font-semibold tracking-wider uppercase mb-1">Legend</p>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22D3EE] inline-block" />
              Selected entity
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#60A5FA] inline-block" />
              Hovered entity
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3B5A8A] inline-block" />
              Network entity
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-4 h-px bg-[#263244] inline-block" />
              Relationship
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div className="w-72 flex-shrink-0 flex flex-col gap-4">
          {selectedNode ? (
            <NodeDetails
              node={selectedNode}
              allLinks={graphData.links as FGLink[]}
              onClose={() => setSelectedNode(null)}
            />
          ) : (
            <div className="bg-bg-card border border-border rounded-lg p-5 flex-1
                            flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20
                              flex items-center justify-center mb-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                     stroke="#22D3EE" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
                </svg>
              </div>
              <p className="text-xs text-gray-500 tracking-wide">
                Click any node in the graph to view entity details
              </p>
            </div>
          )}

          {/* Graph stats */}
          <div className="bg-bg-card border border-border rounded-lg p-4">
            <p className="text-[10px] text-gray-600 tracking-widest uppercase mb-3">
              Graph Statistics
            </p>
            <div className="space-y-2">
              {[
                { label: 'Total Nodes',    value: network.nodes.length },
                { label: 'Total Edges',    value: network.edges.length },
                {
                  label: 'Avg Degree',
                  value: network.nodes.length > 0
                    ? (network.edges.length * 2 / network.nodes.length).toFixed(2)
                    : '—',
                },
                {
                  label: 'Rel. Types',
                  value: new Set(network.edges.map((e) => e.relationship_type)).size,
                },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{label}</span>
                  <span className="text-xs text-cyan-400 font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Analyse button */}
          {selectedNode && (
            <button
              onClick={() => navigate(`/analysis/${selectedNode.id}`)}
              className="w-full py-2.5 bg-cyan-500/10 border border-cyan-500/40 rounded
                         text-xs text-cyan-400 hover:bg-cyan-500/20 transition-colors
                         tracking-wide font-semibold"
            >
              Analyse {selectedNode.id} →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
