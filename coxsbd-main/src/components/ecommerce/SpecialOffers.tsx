import Image from "next/image";

export default function SpecialOffers() {
  const offers = [
    { title: "Electronics Sale", text: "Up to 30% off on all electronics" },
    { title: "Summer Fashion", text: "New arrivals with 25% discount" },
    { title: "Home Essentials", text: "Buy one get one free on selected items" },
  ];

  return (
    <div className="bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Special Offers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((o, i) => (
            <div className="bg-white rounded-lg overflow-hidden shadow-md" key={i}>
              <div className="relative h-48">
                <Image src="/api/placeholder/400/300" alt={o.title} fill className="object-cover" />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{o.title}</h3>
                <p className="text-gray-600 mb-4">{o.text}</p>
                <button className="text-red-600 font-semibold hover:underline">Shop Now →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
