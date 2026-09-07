import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Network,
  UserSearch,
  Activity,
  Shield,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard',        icon: LayoutDashboard },
  { to: '/network',   label: 'Network Analysis', icon: Network          },
  { to: '/analysis',  label: 'Person Analysis',  icon: UserSearch       },
  { to: '/status',    label: 'System Status',    icon: Activity         },
]

export default function Sidebar() {
  return (
    <aside className="w-56 flex-shrink-0 bg-bg-secondary border-r border-border flex flex-col">
      {/* Logo mark */}
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-cyan-500/10 border border-cyan-500/30
                          flex items-center justify-center">
            <Shield size={14} className="text-cyan-400" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 tracking-widest uppercase leading-none">
              SIH 26189
            </p>
            <p className="text-xs text-cyan-400 font-semibold tracking-wide leading-tight mt-0.5">
              CNAS
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className={isActive ? 'text-cyan-400' : 'text-gray-500'} />
                <span className="tracking-wide">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-border">
        <p className="text-[10px] text-gray-600 leading-relaxed tracking-wide">
          AI-POWERED CRIMINAL<br />NETWORK ANALYSIS
        </p>
      </div>
    </aside>
  )
}
