import type { RiskLevel } from '../../types'
import { levelBgColor, levelLabel } from '../../utils/levelColors'

interface Props {
  level: RiskLevel | string
  className?: string
}

export default function LevelBadge({ level, className = '' }: Props) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold
                  tracking-widest uppercase ${levelBgColor(level)} ${className}`}
    >
      {levelLabel(level)}
    </span>
  )
}
