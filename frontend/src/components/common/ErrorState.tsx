import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  message?: string
  onRetry?: () => void
}

export default function ErrorState({
  message = 'An error occurred.',
  onRetry,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
        <AlertTriangle size={22} className="text-red-400" />
      </div>
      <div>
        <p className="text-red-400 font-semibold text-sm tracking-wide uppercase mb-1">
          Error
        </p>
        <p className="text-gray-400 text-sm max-w-sm">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 mt-2 px-4 py-2 bg-bg-card border border-border rounded
                     text-sm text-cyan-400 hover:border-cyan-500/60 hover:text-cyan-300
                     transition-colors duration-200"
        >
          <RefreshCw size={14} />
          Retry
        </button>
      )}
    </div>
  )
}
