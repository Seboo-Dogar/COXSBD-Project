'use client'

import { downloadScript } from '@/services/SoftwareScriptService'
import { saveBlobAsFile } from '@/utils/downloadFile'
import React, { useState } from 'react'

export default function ScriptDownloadButton({ scriptId }: { scriptId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async () => {
    setError(null)
    setLoading(true)
    try {
      // Normally verify purchase first. This demo directly downloads.
      const blob = await downloadScript(scriptId)
      saveBlobAsFile(blob, `script-${scriptId}.zip`)
    } catch (err: any) {
      console.error(err)
      setError('Download failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleDownload}
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-60"
      >
        {loading ? 'Preparing...' : 'Buy & Download'}
      </button>
      {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
    </div>
  )
}