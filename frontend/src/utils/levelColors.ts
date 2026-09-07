import type { RiskLevel } from '../types'

/**
 * Returns Tailwind text-color class for a given risk/sufficiency level.
 */
export function levelTextColor(level: RiskLevel | string): string {
  switch (level) {
    case 'HIGH':   return 'text-red-400'
    case 'MEDIUM': return 'text-amber-400'
    case 'LOW':    return 'text-green-400'
    case 'NORMAL': return 'text-green-400'
    default:       return 'text-gray-400'
  }
}

/**
 * Returns Tailwind border-color class for a given risk level.
 */
export function levelBorderColor(level: RiskLevel | string): string {
  switch (level) {
    case 'HIGH':   return 'border-red-500'
    case 'MEDIUM': return 'border-amber-500'
    case 'LOW':    return 'border-green-500'
    case 'NORMAL': return 'border-green-500'
    default:       return 'border-gray-600'
  }
}

/**
 * Returns Tailwind bg-color class for a given risk level badge.
 */
export function levelBgColor(level: RiskLevel | string): string {
  switch (level) {
    case 'HIGH':   return 'bg-red-500/20 text-red-400 border border-red-500/40'
    case 'MEDIUM': return 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
    case 'LOW':    return 'bg-green-500/20 text-green-400 border border-green-500/40'
    case 'NORMAL': return 'bg-green-500/20 text-green-400 border border-green-500/40'
    default:       return 'bg-gray-700/40 text-gray-400 border border-gray-600/40'
  }
}

/**
 * Returns hex color for graph nodes / charts.
 */
export function levelHexColor(level: RiskLevel | string): string {
  switch (level) {
    case 'HIGH':   return '#EF4444'
    case 'MEDIUM': return '#F59E0B'
    case 'LOW':    return '#22C55E'
    case 'NORMAL': return '#22C55E'
    default:       return '#6B7280'
  }
}

/**
 * Formats a numeric score (0–1) as a percentage string, e.g. "42.3%".
 */
export function formatScore(score: number | null | undefined): string {
  if (score === null || score === undefined) return 'N/A'
  return `${(score * 100).toFixed(1)}%`
}

/**
 * Formats a numeric value to a fixed number of decimal places.
 */
export function formatNum(value: number | null | undefined, decimals = 4): string {
  if (value === null || value === undefined) return 'N/A'
  return value.toFixed(decimals)
}

/**
 * Returns a human-friendly label for anomaly / sufficiency levels.
 */
export function levelLabel(level: RiskLevel | string): string {
  switch (level) {
    case 'INSUFFICIENT_DATA': return 'INSUFFICIENT DATA'
    case 'NO_ACTIVITY_DATA':  return 'NO DATA'
    case 'NORMAL':            return 'NORMAL'
    default:                  return level
  }
}
