'use client'

import React, { useState } from 'react'

export default function ScriptFilter() {
  const [stack, setStack] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200])

  // This component only demonstrates UI. Real app should sync filter state with URL or context
  return (
    <div className="bg-white p-4 rounded-lg border">
      <h4 className="font-semibold mb-3">Filters</h4>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Tech stack</label>
        <div className="flex flex-col gap-2">
          {['PHP', 'Node.js', 'Python', 'Laravel', 'React'].map((s) => (
            <label key={s} className="text-sm">
              <input
                type="checkbox"
                className="mr-2"
                checked={stack.includes(s)}
                onChange={() => {
                  setStack((cur) => (cur.includes(s) ? cur.filter((c) => c !== s) : [...cur, s]))
                }}
              />
              {s}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Price range</label>
        <div className="text-sm text-gray-600">${priceRange[0]} - ${priceRange[1]}</div>
        <input
          type="range"
          min={0}
          max={500}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([0, Number(e.target.value)])}
          className="w-full mt-2"
        />
      </div>

      <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded">Apply</button>
    </div>
  )
}