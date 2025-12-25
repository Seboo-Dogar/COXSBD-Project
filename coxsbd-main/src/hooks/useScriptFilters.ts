import { useState } from 'react'

export function useScriptFilters() {
  const [filters, setFilters] = useState<Record<string, any>>({})

  const setCategory = (c?: string) => setFilters((f) => ({ ...f, category: c }))
  const setQuery = (q?: string) => setFilters((f) => ({ ...f, q }))

  return { filters, setFilters, setCategory, setQuery }
}