import { useState, useEffect } from 'react'
import { getScripts } from '@/src/services/softwareScriptsService'

export function useScriptSearch(q?: string) {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (q === undefined) return
    let mounted = true
    const run = async () => {
      setLoading(true)
      try {
        const data = await getScripts({ q })
        if (mounted) setResults(data)
      } catch (err) {
        console.error(err)
        if (mounted) setResults([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    run()
    return () => { mounted = false }
  }, [q])

  return { results, loading }
}