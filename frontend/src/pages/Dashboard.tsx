import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  Network,
  GitBranch,
  ArrowRight,
  Activity,
  Eye,
} from 'lucide-react'
import SummaryCard from '../components/dashboard/SummaryCard'
import LoadingState from '../components/common/LoadingState'
import ErrorState from '../components/common/ErrorState'
import { useApi } from '../hooks/useApi'
import { getPersons, getNetwork } from '../services/api'

export default function Dashboard() {
  const navigate = useNavigate()

  const {
    data: persons,
    loading: personsLoading,
    error: personsError,
    refetch: refetchPersons,
  } = useApi(getPersons, [])

  const {
    data: network,
    loading: networkLoading,
    error: networkError,
    refetch: refetchNetwork,
  } = useApi(getNetwork, [])

  const loading = personsLoading || networkLoading
  const error   = personsError || networkError

  // Derive unique relationship types from edges
  const relationshipTypes = useMemo(() => {
    if (!network) return []
    return [...new Set(network.edges.map((e) => e.relationship_type).filter(Boolean))]
  }, [network])

  // Approximate "connections" as unique edges
  const totalRelationships = network?.edges.length ?? 0
  const totalPersons       = persons?.length ?? 0

  const handleRetry = () => {
    refetchPersons()
    refetchNetwork()
  }

  if (loading) return <LoadingState message="Loading network overview..." />
  if (error)   return <ErrorState message={error} onRetry={handleRetry} />

  return (
    <div className="space-y-8">

      {/* Page intro */}
      <div>
        <h2 className="text-lg font-semibold text-gray-100 tracking-wide">
          AI-Powered Criminal Network Analysis
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Intelligent graph and behavioural analysis platform — SIH 26189
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Entities"
          value={totalPersons}
          subtitle="Persons in database"
          icon={<Users size={18} />}
          accent="cyan"
        />
        <SummaryCard
          title="Relationships"
          value={totalRelationships}
          subtitle="Network connections"
          icon={<GitBranch size={18} />}
          accent="blue"
        />
        <SummaryCard
          title="Network Nodes"
          value={network?.nodes.length ?? 0}
          subtitle="Graph nodes"
          icon={<Network size={18} />}
          accent="green"
        />
        <SummaryCard
          title="Relationship Types"
          value={relationshipTypes.length}
          subtitle="Distinct edge categories"
          icon={<Activity size={18} />}
          accent="amber"
        />
      </div>

      {/* Two-column layout: network overview + entity list */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Network overview panel */}
        <div className="lg:col-span-3 bg-bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-200 tracking-wide">
              Quick Network Overview
            </h3>
            <button
              onClick={() => navigate('/network')}
              className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300
                         transition-colors tracking-wide"
            >
              Explore Network <ArrowRight size={12} />
            </button>
          </div>

          {/* Relationship type breakdown */}
          {relationshipTypes.length > 0 ? (
            <div className="space-y-2">
              {relationshipTypes.map((type) => {
                const count = network!.edges.filter((e) => e.relationship_type === type).length
                const pct   = totalRelationships > 0 ? (count / totalRelationships) * 100 : 0
                return (
                  <div key={type}>
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                      <span className="capitalize tracking-wide">{type || 'Unknown'}</span>
                      <span className="text-gray-500">{count} edges ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="h-1.5 bg-bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-500/70 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No relationship data available.</p>
          )}

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 tracking-wide">Average connections per entity</p>
              <p className="text-lg font-bold text-cyan-400 mt-0.5">
                {totalPersons > 0 ? (totalRelationships / totalPersons).toFixed(1) : '—'}
              </p>
            </div>
            <button
              onClick={() => navigate('/network')}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30
                         rounded text-xs text-cyan-400 hover:bg-cyan-500/20 transition-colors tracking-wide"
            >
              <Network size={13} />
              Open Interactive Graph
            </button>
          </div>
        </div>

        {/* Entity list */}
        <div className="lg:col-span-2 bg-bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-200 tracking-wide">
              Available Entities
            </h3>
            <span className="text-[10px] text-gray-600 tracking-widest uppercase">
              {totalPersons} total
            </span>
          </div>

          <div className="space-y-1 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
            {persons && persons.length > 0 ? (
              persons.map((p) => {
                const degree = network?.edges.filter(
                  (e) => e.source === p.person_id || e.target === p.person_id
                ).length ?? 0
                return (
                  <div
                    key={p.person_id}
                    className="flex items-center justify-between px-3 py-2 rounded
                               hover:bg-white/5 cursor-pointer group transition-colors"
                    onClick={() => navigate(`/analysis/${p.person_id}`)}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/20
                                      flex items-center justify-center flex-shrink-0">
                        <span className="text-[9px] text-cyan-400 font-bold">
                          {p.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-300 truncate">{p.name}</p>
                        <p className="text-[10px] text-gray-600 truncate">{p.person_id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                      <span className="text-[10px] text-gray-600">{degree} conn.</span>
                      <Eye
                        size={12}
                        className="text-gray-600 group-hover:text-cyan-400 transition-colors"
                      />
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-sm text-gray-500 px-3">No entities found.</p>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <button
              onClick={() => navigate('/analysis')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2
                         bg-blue-500/10 border border-blue-500/30 rounded
                         text-xs text-blue-400 hover:bg-blue-500/20 transition-colors tracking-wide"
            >
              Analyse an Entity <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Info strip */}
      <div className="bg-bg-card border border-border rounded-lg px-5 py-4">
        <p className="text-[11px] text-gray-600 leading-relaxed tracking-wide">
          <span className="text-gray-400 font-semibold">Analytical Dimensions: </span>
          Brokerage Position · Coordination Indicators · Activity Anomaly · Cross-Case Significance
          <span className="mx-2 text-gray-700">|</span>
          Data sources: PostgreSQL (structured records) · Neo4j (relationship graph) · ML analysis model
        </p>
      </div>
    </div>
  )
}
