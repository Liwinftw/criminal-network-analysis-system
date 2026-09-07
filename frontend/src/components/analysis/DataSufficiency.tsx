import { Database } from 'lucide-react'
import type { DataSufficiency as DataSufficiencyType } from '../../types'
import LevelBadge from '../common/LevelBadge'
import { levelTextColor } from '../../utils/levelColors'

interface Props {
  data: DataSufficiencyType
}

interface SufficiencyBarProps {
  label: string
  level: string
  count: number
  unit: string
}

function SufficiencyBar({ label, level, count, unit }: SufficiencyBarProps) {
  const widthMap: Record<string, string> = {
    HIGH: 'w-full',
    MEDIUM: 'w-2/3',
    LOW: 'w-1/3',
  }
  const colorMap: Record<string, string> = {
    HIGH: 'bg-green-500',
    MEDIUM: 'bg-amber-500',
    LOW: 'bg-red-500',
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-gray-600 font-mono">
            {count} {unit}
          </span>
          <span className={`font-semibold text-[11px] tracking-wide ${levelTextColor(level)}`}>
            {level}
          </span>
        </div>
      </div>
      <div className="h-1.5 bg-bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            colorMap[level] ?? 'bg-gray-600'
          } ${widthMap[level] ?? 'w-0'} opacity-70`}
        />
      </div>
    </div>
  )
}

export default function DataSufficiency({ data }: Props) {
  return (
    <div className="bg-bg-card border border-border rounded-lg p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20
                          flex items-center justify-center flex-shrink-0">
            <Database size={15} className="text-purple-400" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-300 tracking-widest uppercase">
              Data Sufficiency
            </h3>
            <p className="text-[10px] text-gray-600 mt-0.5">Available record quantity</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500">Overall</span>
          <LevelBadge level={data.overall_level} />
        </div>
      </div>

      {/* Individual source bars */}
      <div className="space-y-4 mb-4">
        <SufficiencyBar
          label="Relationships"
          level={data.relationship_data.level}
          count={data.relationship_data.record_count}
          unit="connections"
        />
        <SufficiencyBar
          label="Activity Records"
          level={data.activity_data.level}
          count={data.activity_data.record_count}
          unit="records"
        />
        <SufficiencyBar
          label="Case Records"
          level={data.case_data.level}
          count={data.case_data.record_count}
          unit="cases"
        />
      </div>

      {/* Thresholds legend */}
      <div className="flex items-center gap-4 mb-4 text-[10px] text-gray-600">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500 opacity-70" />
          HIGH
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500 opacity-70" />
          MEDIUM
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500 opacity-70" />
          LOW
        </div>
      </div>

      {/* Note */}
      <div className="pt-3 border-t border-border">
        <p className="text-[10px] text-gray-600 leading-relaxed">
          <span className="text-gray-500 font-semibold">Note: </span>
          {data.note}
          {' '}Data sufficiency does not imply statistical confidence or evidence of wrongdoing.
        </p>
      </div>
    </div>
  )
}
