import { useLocation } from 'react-router-dom'
import { Shield } from 'lucide-react'

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': {
    title:    'Dashboard',
    subtitle: 'Overview of network entities and analytical indicators',
  },
  '/network': {
    title:    'Network Analysis',
    subtitle: 'Interactive relationship graph visualisation',
  },
  '/analysis': {
    title:    'Person Analysis',
    subtitle: 'Detailed behavioural and network profile for a selected entity',
  },
  '/status': {
    title:    'System Status',
    subtitle: 'Backend health and API connectivity',
  },
}

export default function Header() {
  const { pathname } = useLocation()

  // match /analysis/:id
  const key = pathname.startsWith('/analysis') ? '/analysis' : pathname
  const meta = pageTitles[key] ?? { title: 'CNAS', subtitle: '' }

  return (
    <header className="flex items-center gap-4 px-6 py-4 bg-bg-secondary border-b border-border flex-shrink-0">
      <div className="flex items-center gap-2 text-cyan-400/60">
        <Shield size={14} />
        <span className="text-[10px] tracking-widest uppercase text-gray-600">
          AI-Powered Criminal Network Analysis System
        </span>
      </div>

      <div className="h-4 w-px bg-border" />

      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-semibold text-gray-100 tracking-wide truncate">
          {meta.title}
        </h1>
        {meta.subtitle && (
          <p className="text-[11px] text-gray-500 tracking-wide truncate">
            {meta.subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <span className="inline-flex items-center gap-1.5 text-[10px] text-green-400 tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          System Online
        </span>
      </div>
    </header>
  )
}
