'use client'

import React from 'react'

export default function ScriptReviews({ }: { scriptId: string }) {
  // For demo static reviews
  const reviews = [
    { id: 1, user: 'Alice', rating: 5, text: 'Works great, saved me time.' },
    { id: 2, user: 'Bob', rating: 4, text: 'Good code, needs small tweaks.' },
  ]

  return (
    <div>
      <h4 className="font-semibold">Reviews</h4>
      <div className="mt-3 space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="border rounded p-3 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="font-medium">{r.user}</div>
              <div className="text-yellow-500">{'★'.repeat(r.rating)}</div>
            </div>
            <p className="text-sm text-gray-700 mt-2">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}