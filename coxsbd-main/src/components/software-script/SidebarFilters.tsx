export default function SidebarFilters() {
  return (
    <div className="border p-4 rounded">
      <h3 className="font-semibold mb-2">Filters</h3>

      {/* Example Filter */}
      <div className="mb-4">
        <label className="block mb-1">Category</label>
        <select className="border p-2 w-full rounded">
          <option>All</option>
          <option>E-commerce</option>
          <option>Booking</option>
          <option>Marketplace</option>
        </select>
      </div>

      {/* Price Filter */}
      <div>
        <label className="block mb-1">Price Range</label>
        <input type="range" min={0} max={500} className="w-full" />
      </div>
    </div>
  )
}
