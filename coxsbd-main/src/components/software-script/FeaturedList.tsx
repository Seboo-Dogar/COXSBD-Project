import ScriptCard from "./ScriptCard"

export default function FeaturedList() {
  const featuredScripts = [
    { id: 1, title: "E-commerce Store Script", price: 49, image: "/images/script1.jpg" },
    { id: 2, title: "Hotel Booking Script", price: 79, image: "/images/script2.jpg" },
    { id: 3, title: "Multi-Vendor Marketplace", price: 99, image: "/images/script3.jpg" },
    // Add more...
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {featuredScripts.map((script) => (
        <ScriptCard key={script.id} {...script} />
      ))}
    </div>
  )
}
