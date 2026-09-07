import { useRef, useCallback, useEffect, useState } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import type { FGNode, FGLink, GraphData } from '../../types'

interface Props {
  data: GraphData
  selectedNodeId: string | null
  onNodeClick: (node: FGNode) => void
  width: number
  height: number
}

export default function NetworkGraph({
  data,
  selectedNodeId,
  onNodeClick,
  width,
  height,
}: Props) {
  const fgRef = useRef<any>(null) // eslint-disable-line @typescript-eslint/no-explicit-any
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)

  // Center graph on mount / data change
  useEffect(() => {
    if (fgRef.current) {
      setTimeout(() => {
        fgRef.current?.zoomToFit(400, 60)
      }, 500)
    }
  }, [data])

  const getNodeColor = useCallback(
    (node: FGNode) => {
      if (node.id === selectedNodeId) return '#22D3EE'  // cyan — selected
      if (node.id === hoveredNodeId)  return '#60A5FA'  // blue — hovered
      return '#3B5A8A'                                   // default steel-blue
    },
    [selectedNodeId, hoveredNodeId]
  )

  const getNodeVal = useCallback(
    (node: FGNode) => {
      if (node.id === selectedNodeId) return 10
      return node.val ?? 4
    },
    [selectedNodeId]
  )

  const getLinkColor = useCallback(
    (link: FGLink) => {
      const src = typeof link.source === 'object' ? link.source.id : link.source
      const tgt = typeof link.target === 'object' ? link.target.id : link.target
      if (src === selectedNodeId || tgt === selectedNodeId) return '#22D3EE44'
      return '#26324488'
    },
    [selectedNodeId]
  )

  const getLinkWidth = useCallback(
    (link: FGLink) => {
      const src = typeof link.source === 'object' ? link.source.id : link.source
      const tgt = typeof link.target === 'object' ? link.target.id : link.target
      if (src === selectedNodeId || tgt === selectedNodeId) return 1.5
      return Math.max(0.5, Math.min(link.weight ?? 1, 3) * 0.5)
    },
    [selectedNodeId]
  )

  const paintNode = useCallback(
    (node: FGNode, ctx: CanvasRenderingContext2D) => {
      const r = Math.sqrt(getNodeVal(node)) * 2.8
      const color = getNodeColor(node)
      const isSelected = node.id === selectedNodeId

      // Glow ring for selected node
      if (isSelected) {
        ctx.beginPath()
        ctx.arc(node.x ?? 0, node.y ?? 0, r + 5, 0, 2 * Math.PI)
        ctx.fillStyle = '#22D3EE18'
        ctx.fill()
        ctx.beginPath()
        ctx.arc(node.x ?? 0, node.y ?? 0, r + 3, 0, 2 * Math.PI)
        ctx.strokeStyle = '#22D3EE60'
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Main circle
      ctx.beginPath()
      ctx.arc(node.x ?? 0, node.y ?? 0, r, 0, 2 * Math.PI)
      ctx.fillStyle = color
      ctx.fill()

      // Border
      ctx.strokeStyle = isSelected ? '#22D3EE' : '#1E3A5F'
      ctx.lineWidth = isSelected ? 1.5 : 0.8
      ctx.stroke()

      // Label
      const label = node.label ?? node.id
      const fontSize = isSelected ? 3.5 : 3
      ctx.font = `${fontSize}px JetBrains Mono, monospace`
      ctx.fillStyle = isSelected ? '#E0F7FF' : '#94A3B8'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(label, node.x ?? 0, (node.y ?? 0) + r + 5)
    },
    [getNodeColor, getNodeVal, selectedNodeId]
  )

  return (
    <ForceGraph2D
      ref={fgRef}
      graphData={data}
      width={width}
      height={height}
      backgroundColor="#0B0F14"
      nodeCanvasObject={paintNode}
      nodeCanvasObjectMode={() => 'replace'}
      linkColor={getLinkColor}
      linkWidth={getLinkWidth}
      linkDirectionalParticles={2}
      linkDirectionalParticleWidth={1}
      linkDirectionalParticleColor={() => '#22D3EE40'}
      onNodeClick={(node) => onNodeClick(node as FGNode)}
      onNodeHover={(node) => setHoveredNodeId(node ? (node as FGNode).id : null)}
      nodeLabel={(node) => (node as FGNode).label ?? (node as FGNode).id}
      cooldownTicks={120}
      d3AlphaDecay={0.02}
      d3VelocityDecay={0.3}
    />
  )
}
