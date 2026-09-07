import { useState, type ReactNode } from 'react'
import { Info } from 'lucide-react'

interface Props {
  content: string
  children?: ReactNode
  /** If true, renders just the Info icon as the trigger */
  icon?: boolean
}

export default function Tooltip({ content, children, icon = false }: Props) {
  const [visible, setVisible] = useState(false)

  return (
    <span
      className="relative inline-flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {icon ? (
        <Info size={14} className="text-gray-500 hover:text-cyan-400 cursor-help transition-colors" />
      ) : (
        children
      )}

      {visible && (
        <span
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50
                     w-64 px-3 py-2 rounded bg-[#1a2233] border border-border
                     text-xs text-gray-300 leading-relaxed shadow-xl pointer-events-none"
        >
          {content}
          {/* arrow */}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1a2233]" />
        </span>
      )}
    </span>
  )
}
