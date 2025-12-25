'use client'

import { getScripts } from '@/services/SoftwareScriptService';
import React, { useEffect, useState } from 'react'
import ScriptCard from './ScriptCard';

type Props = { query?: string; category?: string }

export default function ScriptList({ query, category }: Props) {
  const [scripts, setScripts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const data = await getScripts({ q: query, category })
        setScripts(data || [])
      } catch (err) {
        console.error(err)
        setScripts([])
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [query, category])

  if (loading) return <div>Loading scripts...</div>
  if (scripts.length === 0) return <div>No scripts found.</div>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {scripts.map((s) => (
        <ScriptCard key={s.id} script={s} />
      ))}
    </div>
  )
}