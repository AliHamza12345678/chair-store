import { useEffect, useState } from "react"

/**
 * Debounces a fast-changing value (e.g. a search input) so consumers
 * (like a search API call) only react after the value has settled.
 *
 *   const [query, setQuery] = useState("")
 *   const debouncedQuery = useDebounce(query, 400)
 *   useEffect(() => { if (debouncedQuery) runSearch(debouncedQuery) }, [debouncedQuery])
 */
export function useDebounce<T>(value: T, delayMs: number = 400): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])

  return debounced
}
