import { useState } from 'react'
import { Activity, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartTooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import type { ActivityAnomaly } from '../../types'
import LevelBadge from '../common/LevelBadge'
import Tooltip from '../common/Tooltip'
import { formatNum, levelTextColor } from '../../utils/levelColors'

interface Props {
  data: ActivityAnomaly
}

export default function ActivityAnomalyCard({ data }: Props) {
  const [expanded, setExpanded] = useState(false)

  const isHigh = data.level === 'HIGH'
  const hasChartData =
    data.current_activity !== null &&
    data.baseline_mean !== null

  // Build a simple bar chart: baseline mean vs current
  const chartData = hasChartData
    ? [
        { name: 'Baseline\nMean', value: data.baseline_mean ?? 0, fill: '#3B82F6' },
        { name: 'Current\nActivity', value: data.current_activity ?? 0, fill: isHigh ? '#EF4444' : '#22C55E' },
      ]
    : []

  const borderClass = isHigh
    ? 'border-red-500/40 hover:border-red-500/60'
    : 'border-border hover:border-amber-500/20'

  return (
    <div className={`bg-bg-card border ${borderClass} rounded-lg p-5 transition-colors duration-200`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                           ${isHigh
                             ? 'bg-red-500/10 border border-red-500/30'
                             : 'bg-amber-500/10 border border-amber-500/20'}`}>
            {isHigh
              ? <AlertTriangle size={15} className="text-red-400" />
              : <Activity size={15} className="text-amber-400" />}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-semibold text-gray-300 tracking-widest uppercase">
                Activity Anomaly
              </h3>
              <Tooltip
                icon
                content="Detects statistically unusual activity levels compared to the entity's own historical baseline using Z-score analysis."
              />
            </div>
            <p className="text-[10px] text-gray-600 mt-0.5 tracking-wide">Temporal behaviour pattern</p>
          </div>
        </div>
        <LevelBadge level={data.level} />
      </div>

      {/* Score + key values */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-bg-secondary rounded-lg p-3">
          <p className="text-[10px] text-gray-600 tracking-wider uppercase mb-1">Z-Score</p>
          <p className={`text-lg font-bold ${levelTextColor(data.level)}`}>
            {data.anomaly_score !== null ? formatNum(data.anomaly_score, 2) : '—'}
          </p>
        </div>
        <div className="bg-bg-secondary rounded-lg p-3">
          <p className="text-[10px] text-gray-600 tracking-wider uppercase mb-1">Current</p>
          <p className="text-lg font-bold text-gray-300">
            {data.current_activity !== null ? data.current_activity : '—'}
          </p>
        </div>
        <div className="bg-bg-secondary rounded-lg p-3">
          <p className="text-[10px] text-gray-600 tracking-wider uppercase mb-1">Baseline</p>
          <p className="text-lg font-bold text-blue-400">
            {data.baseline_mean !== null ? formatNum(data.baseline_mean, 1) : '—'}
          </p>
        </div>
      </div>

      {/* Mini chart */}
      {hasChartData && (
        <div className="h-28 mb-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="name"
                tick={{ fill: '#6B7280', fontSize: 9 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#6B7280', fontSize: 9 }}
                axisLine={false}
                tickLine={false}
              />
              <RechartTooltip
                contentStyle={{
                  background: '#151B26',
                  border: '1px solid #263244',
                  borderRadius: 6,
                  fontSize: 11,
                  color: '#D1D5DB',
                }}
                cursor={{ fill: '#FFFFFF08' }}
              />
              {data.baseline_mean !== null && (
                <ReferenceLine
                  y={data.baseline_mean}
                  stroke="#3B82F630"
                  strokeDasharray="4 3"
                />
              )}
              <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                {chartData.map((entry, index) => (
                  <rect key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Explanation snippet */}
      <p className="text-[11px] text-gray-500 leading-relaxed mb-2 line-clamp-2">
        {data.explanation}
      </p>

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
            ['Anomaly Score',     data.anomaly_score !== null ? formatNum(data.anomaly_score) : 'N/A'],
            ['Current Activity',  data.current_activity?.toString() ?? 'N/A'],
            ['Baseline Mean',     data.baseline_mean !== null ? formatNum(data.baseline_mean) : 'N/A'],
            ['Std Deviation',     data.baseline_standard_deviation !== null ? formatNum(data.baseline_standard_deviation) : 'N/A'],
            ['Absolute Deviation', data.absolute_deviation !== null ? formatNum(data.absolute_deviation) : 'N/A'],
            ['Relative Change',   data.relative_change !== null ? `${(data.relative_change * 100).toFixed(1)}%` : 'N/A'],
            ['Activity Records',  data.activity_record_count.toString()],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between text-xs">
              <span className="text-gray-500">{label}</span>
              <span className="text-gray-300 font-mono">{value}</span>
            </div>
          ))}
          <p className="text-[11px] text-gray-600 leading-relaxed pt-2 border-t border-border mt-2">
            {data.explanation}
          </p>
        </div>
      )}
    </div>
  )
}
