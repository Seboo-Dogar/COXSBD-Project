'use client'

import React from 'react'

export default function ScriptSort() {
  return (
    <div className="flex items-center gap-3">
      <label className="sr-only">Sort</label>
      <select className="border rounded px-3 py-1">
        <option value="newest">Newest</option>
        <option value="popular">Best selling</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </select>
    </div>
  )
}