import type { ReactNode } from 'react'

interface Props {
  title: string
  value: string | number
  subtitle?: string
  icon: ReactNode
  accent?: 'cyan' | 'blue' | 'green' | 'amber' | 'red'
  loading?: boolean
}

const accentMap = {
  cyan:  { border: 'border-cyan-500/30',  icon: 'bg-cyan-500/10 text-cyan-400',  value: 'text-cyan-400'  },
  blue:  { border: 'border-blue-500/30',  icon: 'bg-blue-500/10 text-blue-400',  value: 'text-blue-400'  },
  green: { border: 'border-green-500/30', icon: 'bg-green-500/10 text-green-400', value: 'text-green-400' },
  amber: { border: 'border-amber-500/30', icon: 'bg-amber-500/10 text-amber-400', value: 'text-amber-400' },
  red:   { border: 'border-red-500/30',   icon: 'bg-red-500/10 text-red-400',   value: 'text-red-400'   },
}

export default function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  accent = 'cyan',
  loading = false,
}: Props) {
  const colors = accentMap[accent]

  return (
    <div
      className={`bg-bg-card border ${colors.border} rounded-lg p-5
                  flex items-start gap-4 hover:border-opacity-60 transition-colors duration-200`}
    >
      <div className={`w-10 h-10 rounded-lg ${colors.icon} flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-gray-500 tracking-widest uppercase mb-1">{title}</p>
        {loading ? (
          <div className="h-7 w-16 bg-white/5 rounded animate-pulse" />
        ) : (
          <p className={`text-2xl font-bold ${colors.value} leading-none`}>{value}</p>
        )}
        {subtitle && (
          <p className="text-[11px] text-gray-600 mt-1 tracking-wide truncate">{subtitle}</p>
        )}
      </div>
    </div>
  )
}
