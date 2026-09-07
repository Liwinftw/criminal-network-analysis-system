import { CheckCircle2, XCircle, RefreshCw, Wifi, Database, Server } from 'lucide-react'
import { useApi } from '../hooks/useApi'
import { getHealth, BASE_URL } from '../services/api'

function StatusRow({
  icon,
  label,
  value,
  ok,
}: {
  icon: React.ReactNode
  label: string
  value: string
  ok: boolean
}) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-border last:border-0">
      <div className="w-8 h-8 rounded-lg bg-bg-secondary border border-border
                      flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 tracking-wide uppercase">{label}</p>
        <p className="text-sm text-gray-300 font-mono truncate">{value}</p>
      </div>
      <div>
        {ok ? (
          <div className="flex items-center gap-1.5 text-green-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs tracking-wide font-semibold">ONLINE</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-red-400">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <span className="text-xs tracking-wide font-semibold">OFFLINE</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SystemStatus() {
  const { data, loading, error, refetch } = useApi(getHealth, [])

  const apiOnline  = !loading && !error && !!data
  const healthStatus = data?.status ?? (loading ? 'Checking...' : 'Unavailable')

  return (
    <div className="space-y-6 max-w-2xl">

      {/* Page intro */}
      <div>
        <h2 className="text-lg font-semibold text-gray-100 tracking-wide">System Status</h2>
        <p className="text-sm text-gray-500 mt-1">
          Backend health and API connectivity — checked live against the running server
        </p>
      </div>

      {/* Overall status banner */}
      <div
        className={`flex items-center gap-4 p-5 rounded-lg border ${
          loading
            ? 'bg-bg-card border-border'
            : apiOnline
            ? 'bg-green-500/5 border-green-500/30'
            : 'bg-red-500/5 border-red-500/30'
        }`}
      >
        {loading ? (
          <>
            <div className="w-10 h-10 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin" />
            <div>
              <p className="text-sm font-semibold text-gray-300">Connecting…</p>
              <p className="text-xs text-gray-600">Checking backend health endpoint</p>
            </div>
          </>
        ) : apiOnline ? (
          <>
            <CheckCircle2 size={28} className="text-green-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green-400">All Systems Operational</p>
              <p className="text-xs text-gray-500">Backend is reachable and returning healthy status</p>
            </div>
          </>
        ) : (
          <>
            <XCircle size={28} className="text-red-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-400">Backend Unreachable</p>
              <p className="text-xs text-gray-500">
                {error ?? 'Unable to connect to the backend. Check that the server is running.'}
              </p>
            </div>
          </>
        )}

        <button
          onClick={refetch}
          disabled={loading}
          className="ml-auto flex items-center gap-2 px-4 py-2 bg-bg-card border border-border
                     rounded text-sm text-gray-400 hover:text-cyan-400 hover:border-cyan-500/40
                     disabled:opacity-40 transition-colors"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Checking…' : 'Retry'}
        </button>
      </div>

      {/* Detailed status rows */}
      <div className="bg-bg-card border border-border rounded-lg px-5 py-2">
        <StatusRow
          icon={<Wifi size={14} className="text-cyan-400" />}
          label="API Connection"
          value={BASE_URL}
          ok={apiOnline}
        />
        <StatusRow
          icon={<Server size={14} className="text-blue-400" />}
          label="Backend Status"
          value={healthStatus}
          ok={apiOnline}
        />
        <StatusRow
          icon={<Database size={14} className="text-purple-400" />}
          label="Health Endpoint"
          value={`${BASE_URL}/health`}
          ok={apiOnline}
        />
      </div>

      {/* Notes */}
      <div className="bg-bg-card border border-border rounded-lg p-5">
        <p className="text-xs text-gray-500 font-semibold tracking-wide uppercase mb-3">
          Connection Notes
        </p>
        <ul className="space-y-2 text-[12px] text-gray-600 leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="text-cyan-500 mt-0.5">›</span>
            The backend must be running at <span className="text-gray-400 font-mono">{BASE_URL}</span> before starting the frontend.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-500 mt-0.5">›</span>
            PostgreSQL and Neo4j must be running and seeded for analysis endpoints to return data.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-500 mt-0.5">›</span>
            The <span className="text-gray-400 font-mono">VITE_API_BASE_URL</span> environment variable controls the target URL. Edit <span className="text-gray-400 font-mono">frontend/.env</span> to change it.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-500 mt-0.5">›</span>
            CORS is configured on the backend to allow <span className="text-gray-400 font-mono">http://localhost:5173</span> by default.
          </li>
        </ul>
      </div>

      {/* Startup sequence */}
      <div className="bg-bg-card border border-border rounded-lg p-5">
        <p className="text-xs text-gray-500 font-semibold tracking-wide uppercase mb-3">
          Startup Sequence
        </p>
        <ol className="space-y-2">
          {[
            'Start PostgreSQL service',
            'Start Neo4j service',
            'Run seed script: python backend/scripts/seed_databases.py',
            'Start FastAPI backend: uvicorn app.main:app --reload',
            'Start React frontend: npm run dev  (inside frontend/)',
            'Open http://localhost:5173 in your browser',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-[12px] text-gray-500">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-bg-secondary border border-border
                               text-[10px] text-cyan-400 font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <span className="font-mono">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
