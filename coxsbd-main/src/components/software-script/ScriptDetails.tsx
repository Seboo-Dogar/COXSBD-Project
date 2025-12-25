'use client'

import React, { useEffect, useState } from 'react'
import ScriptDownloadButton from './ScriptDownloadButton'
import ScriptReviews from './ScriptReviews'
import { getScriptById } from '@/services/SoftwareScriptService'
import { formatPrice } from '@/utils/formatPrice'

type Script = {
  thumbnail?: string
  name: string
  longDescription?: string
  shortDescription?: string
  features?: string[]
  price: number
  category?: string
  techStack?: string[]
}

export default function ScriptDetails({ id }: { id: string }) {
  const [script, setScript] = useState<Script | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const run = async () => {
      try {
        const data = await getScriptById(id)
        if (mounted) setScript(data)
      } catch (err) {
        console.error(err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    run()
    return () => { mounted = false }
  }, [id])

  if (loading) return <div>Loading...</div>
  if (!script) return <div>Script not found.</div>

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white p-6 rounded border">
        <img src={script.thumbnail || '/placeholder.png'} className="w-full h-64 object-cover rounded" />
        <h1 className="text-2xl font-bold mt-4">{script.name}</h1>
        <p className="text-gray-600 mt-2">{script.longDescription || script.shortDescription}</p>

        <section className="mt-6">
          <h3 className="font-semibold mb-2">Features</h3>
          <ul className="list-disc ml-6 text-gray-700">
            {(script.features || []).map((f: string, i: number) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </section>

        <section className="mt-6">
          <ScriptReviews scriptId={id} />
        </section>
      </div>

      <aside className="bg-white p-6 rounded border">
        <div className="text-2xl font-bold">{formatPrice(script.price)}</div>
        <div className="text-sm text-gray-500 mt-1">One-time purchase · Instant download</div>
        <div className="mt-4">
          {/* In a real app, download should be gated behind purchase verification */}
          <ScriptDownloadButton scriptId={id} />
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <div>Category: {script.category || 'General'}</div>
          <div>Tech stack: {script.techStack?.join(', ') || '—'}</div>
        </div>
      </aside>
    </div>
  )
}