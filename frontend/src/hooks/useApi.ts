import { useState, useEffect, useCallback } from 'react'

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

/**
 * Generic hook that calls an async API function, tracks loading/error state,
 * and re-fetches when deps change or refetch() is called.
 *
 * @param fetcher  Async function that returns data (or throws).
 * @param deps     Dependency array — re-runs fetcher when these change.
 * @param skip     If true, skips the fetch entirely (e.g. missing personId).
 */
export function useApi<T>(
  fetcher: () => Promise<T>,
  deps: unknown[],
  skip = false
): UseApiState<T> {
  const [data, setData]       = useState<T | null>(null)
  const [loading, setLoading] = useState(!skip)
  const [error, setError]     = useState<string | null>(null)
  const [tick, setTick]       = useState(0)

  const refetch = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    if (skip) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    fetcher()
      .then((result) => {
        if (!cancelled) {
          setData(result)
          setLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const msg =
            err instanceof Error ? err.message : 'An unexpected error occurred.'
          setError(msg)
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick])

  return { data, loading, error, refetch }
}
