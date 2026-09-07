import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Search, User, RefreshCw, ChevronDown } from 'lucide-react'
import BrokerageCard from '../components/analysis/BrokerageCard'
import CoordinationCard from '../components/analysis/CoordinationCard'
import ActivityAnomalyCard from '../components/analysis/ActivityAnomalyCard'
import CrossCaseCard from '../components/analysis/CrossCaseCard'
import FlagExplanation from '../components/analysis/FlagExplanation'
import DataSufficiency from '../components/analysis/DataSufficiency'
import LoadingState from '../components/common/LoadingState'
import ErrorState from '../components/common/ErrorState'
import EmptyState from '../components/common/EmptyState'
import LevelBadge from '../components/common/LevelBadge'
import { useApi } from '../hooks/useApi'
import { getPersons, analyzePerson } from '../services/api'
import type { Person } from '../types'

export default function PersonAnalysis() {
  const { personId: routePersonId } = useParams<{ personId: string }>()
  const navigate = useNavigate()

  const [selectedId, setSelectedId] = useState<string>(routePersonId ?? '')
  const [searchInput, setSearchInput] = useState<string>(routePersonId ?? '')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [personFilter, setPersonFilter] = useState('')

  // Keep URL and state in sync when navigating from other pages
  useEffect(() => {
    if (routePersonId) {
      setSelectedId(routePersonId)
      setSearchInput(routePersonId)
    }
  }, [routePersonId])

  // Fetch list of all persons for dropdown
  const { data: persons } = useApi<Person[]>(getPersons, [])

  // Fetch analysis — only when a person ID is selected
  const {
    data: analysis,
    loading,
    error,
    refetch,
  } = useApi(
    () => analyzePerson(selectedId),
    [selectedId],
    !selectedId
  )

  const filteredPersons = persons?.filter(
    (p) =>
      p.person_id.toLowerCase().includes(personFilter.toLowerCase()) ||
      p.name.toLowerCase().includes(personFilter.toLowerCase())
  ) ?? []

  const handleSearch = useCallback(() => {
    const trimmed = searchInput.trim()
    if (!trimmed) return
    setSelectedId(trimmed)
    navigate(`/analysis/${encodeURIComponent(trimmed)}`, { replace: true })
  }, [searchInput, navigate])

  const handlePersonSelect = (person: Person) => {
    setSelectedId(person.person_id)
    setSearchInput(person.person_id)
    setDropdownOpen(false)
    navigate(`/analysis/${encodeURIComponent(person.person_id)}`, { replace: true })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="space-y-6">

      {/* Search / selection bar */}
      <div className="bg-bg-card border border-border rounded-lg p-4">
        <p className="text-[10px] text-gray-600 tracking-widest uppercase mb-3">
          Select or Search Entity
        </p>
        <div className="flex items-center gap-3 flex-wrap">

          {/* Text search */}
          <div className="relative flex-1 min-w-48">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter Person ID (e.g. C001)"
              className="w-full pl-9 pr-3 py-2.5 bg-bg-secondary border border-border rounded
                         text-sm text-gray-300 placeholder-gray-600
                         focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={!searchInput.trim()}
            className="px-4 py-2.5 bg-cyan-500/10 border border-cyan-500/40 rounded
                       text-sm text-cyan-400 hover:bg-cyan-500/20 disabled:opacity-40
                       disabled:cursor-not-allowed transition-colors tracking-wide"
          >
            Analyse
          </button>

          {/* Dropdown from persons list */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center gap-2 px-4 py-2.5 bg-bg-secondary border border-border
                         rounded text-sm text-gray-400 hover:border-cyan-500/40 hover:text-gray-200
                         transition-colors"
            >
              <User size={14} />
              Select from list
              <ChevronDown size={13} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full mt-1 right-0 z-50 w-72 bg-[#1a2233] border border-border
                              rounded-lg shadow-2xl overflow-hidden">
                <div className="p-2 border-b border-border">
                  <input
                    type="text"
                    value={personFilter}
                    onChange={(e) => setPersonFilter(e.target.value)}
                    placeholder="Filter persons..."
                    className="w-full px-3 py-1.5 bg-bg-secondary border border-border rounded
                               text-xs text-gray-300 placeholder-gray-600
                               focus:outline-none focus:border-cyan-500/40"
                    autoFocus
                  />
                </div>
                <div className="max-h-56 overflow-y-auto">
                  {filteredPersons.length > 0 ? (
                    filteredPersons.map((p) => (
                      <button
                        key={p.person_id}
                        onClick={() => handlePersonSelect(p)}
                        className="w-full flex items-center justify-between px-4 py-2.5
                                   hover:bg-cyan-500/10 transition-colors text-left"
                      >
                        <div>
                          <p className="text-xs text-gray-300">{p.name}</p>
                          <p className="text-[11px] text-gray-600">{p.person_id}</p>
                        </div>
                        {p.location && (
                          <span className="text-[10px] text-gray-600 ml-2">{p.location}</span>
                        )}
                      </button>
                    ))
                  ) : (
                    <p className="text-xs text-gray-600 px-4 py-3">No persons found.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content area */}
      {!selectedId ? (
        <EmptyState
          title="No entity selected"
          message="Enter a Person ID above or select from the list to run a network analysis."
        />
      ) : loading ? (
        <LoadingState message="Running analysis — calculating behavioural indicators..." />
      ) : error ? (
        <ErrorState
          message={error.includes('404') ? `Person "${selectedId}" not found.` : error}
          onRetry={refetch}
        />
      ) : analysis ? (
        <>
          {/* Entity header */}
          <div className="bg-bg-card border border-border rounded-lg px-5 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30
                                flex items-center justify-center">
                  <User size={18} className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-600 tracking-widest uppercase">
                    Entity under analytical review
                  </p>
                  <h2 className="text-lg font-bold text-cyan-400 tracking-wide">
                    {analysis.person_id}
                  </h2>
                </div>
              </div>

              {/* Quick overview badges */}
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { label: 'Brokerage',   level: analysis.network_behavior_profile.brokerage_position.level },
                  { label: 'Coordination', level: analysis.network_behavior_profile.coordination_indicators.level },
                  { label: 'Activity',     level: analysis.network_behavior_profile.activity_anomaly.level },
                  { label: 'Cross-Case',  level: analysis.network_behavior_profile.cross_case_significance.level },
                ].map(({ label, level }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <span className="text-[10px] text-gray-600 tracking-wide">{label}:</span>
                    <LevelBadge level={level} />
                  </div>
                ))}

                <button
                  onClick={refetch}
                  title="Refresh analysis"
                  className="ml-2 p-1.5 text-gray-600 hover:text-cyan-400 transition-colors"
                >
                  <RefreshCw size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* Four analysis cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <BrokerageCard   data={analysis.network_behavior_profile.brokerage_position} />
            <CoordinationCard data={analysis.network_behavior_profile.coordination_indicators} />
            <ActivityAnomalyCard data={analysis.network_behavior_profile.activity_anomaly} />
            <CrossCaseCard   data={analysis.network_behavior_profile.cross_case_significance} />
          </div>

          {/* Flag explanation + data sufficiency side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <FlagExplanation
                profile={analysis.network_behavior_profile}
                personId={analysis.person_id}
              />
            </div>
            <div>
              <DataSufficiency data={analysis.data_sufficiency} />
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
