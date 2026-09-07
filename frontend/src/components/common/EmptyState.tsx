import { InboxIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface Props {
  title?: string
  message?: string
  action?: ReactNode
}

export default function EmptyState({
  title = 'No data available',
  message = 'There is nothing to display here yet.',
  action,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <div className="w-12 h-12 rounded-full bg-bg-card border border-border flex items-center justify-center">
        <InboxIcon size={22} className="text-gray-500" />
      </div>
      <div>
        <p className="text-gray-300 font-semibold text-sm tracking-wide uppercase mb-1">
          {title}
        </p>
        <p className="text-gray-500 text-sm max-w-sm">{message}</p>
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
