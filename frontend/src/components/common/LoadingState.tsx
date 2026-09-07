interface Props {
  message?: string
}

export default function LoadingState({ message = 'Loading...' }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      {/* Animated spinner made from CSS */}
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin" />
      </div>
      <p className="text-cyan-400/80 text-sm tracking-widest uppercase">{message}</p>
    </div>
  )
}
