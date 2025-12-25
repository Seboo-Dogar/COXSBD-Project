interface ScriptProps {
  id: number
  title: string
  price: number
  image: string
}

export default function ScriptCard({ title, price, image }: ScriptProps) {
  return (
    <div className="border rounded-lg shadow hover:shadow-lg transition">
      <img src={image} alt={title} className="rounded-t-lg h-40 w-full object-cover" />
      <div className="p-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-gray-600">${price}</p>
      </div>
    </div>
  )
}
