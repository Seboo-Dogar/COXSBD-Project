"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Fuel,
  Zap,
  Clock,
  Star,
  Shield,
  Heart,
  Bus,
  Luggage,
  Wifi,
  Snowflake,
  Monitor,
  Utensils,
} from "lucide-react";
import NewsletterSignup from "@/components/Newsletter";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useCart } from "@/context/cartContext";

// --- MOCK DATA ---
const allBuses = [
  {
    _id: "1",
    name: "Mercedes Tourismo",
    brand: "Mercedes-Benz",
    pricePerDay: 450,
    description:
      "Luxury coach with premium amenities for comfortable long-distance travel. Features spacious seating, onboard entertainment, climate control, and ample luggage space. Perfect for tour groups, corporate events, and school trips.",
    images: [
      "/images/bus.jpg",
      "/images/bus.jpg",
      "/images/bus.jpg",
      "/images/bus.jpg",
    ],
    capacity: 50,
    seats: 50,
    fuel: "Diesel",
    transmission: "Automatic",
    mileage: "Unlimited with 100km daily limit",
    features: [
      "Air Conditioning",
      "Wi-Fi",
      "Entertainment System",
      "USB Charging Ports",
      "Reclining Seats",
      "Onboard Restroom",
      "PA System",
      "Luggage Compartments",
      "Refreshment Station",
    ],
    location: "Central Bus Depot",
    rating: 4.9,
    reviews: 87,
    insurance: "Full coverage included",
    minimumRentalDays: 1,
    available: true,
    year: 2022,
    luggageCapacity: "20 large suitcases",
    driverIncluded: true,
    driverAccommodation: true,
  },
];

const relatedBuses = [
  {
    id: 2,
    name: "Volvo 9700",
    brand: "Volvo",
    pricePerDay: 480,
    image: "/images/bus.jpg",
    transmission: "Automatic",
    capacity: 52,
    year: 2021,
  },
  {
    id: 3,
    name: "Setra S 517 HDH",
    brand: "Setra",
    pricePerDay: 420,
    image: "/images/bus.jpg",
    transmission: "Automatic",
    capacity: 47,
    year: 2020,
  },
  {
    id: 4,
    name: "MAN Lion's Coach",
    brand: "MAN",
    pricePerDay: 400,
    image: "/images/bus.jpg",
    transmission: "Automatic",
    capacity: 49,
    year: 2021,
  },
];

export default function BusDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  // Logic to find the bus by ID or default to the first one
  const busData = useMemo(() => {
    return allBuses.find((b) => b._id === id) || allBuses[0];
  }, [id]);

  // State Management
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDates, setBookingDates] = useState({ start: "", end: "" });
  const [days, setDays] = useState(1);
  const [totalPrice, setTotalPrice] = useState(busData.pricePerDay);
  const [passengerCount, setPassengerCount] = useState(busData.capacity);
  const [showAmenities, setShowAmenities] = useState(false);

  // Price Calculation Logic
  useEffect(() => {
    if (bookingDates.start && bookingDates.end) {
      const start = new Date(bookingDates.start);
      const end = new Date(bookingDates.end);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDays(diffDays || 1);
      setTotalPrice(busData.pricePerDay * (diffDays || 1));
    }
  }, [bookingDates, busData.pricePerDay]);

  // Handlers
  const handleAddToCart = () => {
    addToCart({
      id: busData._id,
      name: busData.name,
      price: totalPrice,
      image: busData.images[0],
      days: days,
    });
    alert(`${busData.name} added to cart!`);
  };

  const handleConfirmBooking = () => {
    alert(`Bus booking confirmed for ${days} days! Total: $${totalPrice}`);
    setShowBookingModal(false);
  };

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Breadcrumb Section */}
        <nav className="text-sm text-gray-500 mb-6">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <button onClick={() => router.push("/")} className="hover:text-red-600">Home</button>
              <span className="mx-3">/</span>
            </li>
            <li className="flex items-center">
              <button onClick={() => router.push("/buses")} className="hover:text-red-600">Buses</button>
              <span className="mx-3">/</span>
            </li>
            <li className="text-red-600 font-medium">{busData.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Gallery Section */}
          <section>
            <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-lg mb-4">
              <Image src={busData.images[selectedImage]} alt={busData.name} fill className="object-cover" priority />
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
              >
                <Heart className={`w-6 h-6 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
              </button>
              {!busData.available && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">Not Available</div>
              )}
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImage + 1} / {busData.images.length}
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {busData.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-28 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImage === idx ? "border-red-500" : "border-transparent"
                  }`}
                >
                  <Image src={img} alt="Thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          </section>

          {/* Info Section */}
          <section>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{busData.name}</h1>
                <p className="text-gray-500 text-lg">{busData.brand} • {busData.year}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-red-600">${busData.pricePerDay}<span className="text-base font-normal text-gray-500">/day</span></p>
                <div className="flex items-center justify-end mt-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-gray-700">{busData.rating}</span>
                  <span className="mx-1">•</span>
                  <span className="text-gray-500">{busData.reviews} reviews</span>
                </div>
              </div>
            </div>

            <div className="flex items-center text-gray-600 mb-6">
              <MapPin className="w-5 h-5 mr-1 text-red-600" />
              <span>{busData.location}</span>
            </div>

            <p className="text-gray-700 mb-8 leading-relaxed">{busData.description}</p>

            {/* Specs Grid (Cleaned up but identical UI) */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <SpecItem icon={<Users className="w-6 h-6" />} label="Passenger Capacity" value={`${busData.capacity} people`} />
              <SpecItem icon={<Luggage className="w-6 h-6" />} label="Luggage Capacity" value={busData.luggageCapacity} />
              <SpecItem icon={<Fuel className="w-6 h-6" />} label="Fuel Type" value={busData.fuel} />
              <SpecItem icon={<Zap className="w-6 h-6" />} label="Transmission" value={busData.transmission} />
            </div>

            {/* Driver Info Section (Blue Box) */}
            <div className="bg-blue-50 p-4 rounded-xl mb-6 border border-blue-100">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-medium text-blue-800">Professional driver included</span>
              </div>
              <p className="text-sm text-blue-600 mt-1">All our buses come with experienced, licensed drivers</p>
            </div>

            {/* Amenities Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Amenities & Features</h3>
                <button onClick={() => setShowAmenities(!showAmenities)} className="text-sm text-red-600 hover:underline">
                  {showAmenities ? "Show less" : "Show all"}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {busData.features
                  .slice(0, showAmenities ? busData.features.length : 6)
                  .map((feature, index) => (
                    <span key={index} className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full flex items-center">
                      <FeatureIcon name={feature} />
                      {feature}
                    </span>
                  ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setShowBookingModal(true)}
                disabled={!busData.available}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
              >
                {busData.available ? "Book This Bus" : "Not Available"}
              </button>
              <button onClick={handleAddToCart} className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                Add To Cart
              </button>
            </div>
          </section>
        </div>

        {/* Related Buses Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Similar Buses</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedBuses.map((bus) => (
              <motion.div
                key={bus.id}
                className="border rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                whileHover={{ y: -5 }}
                onClick={() => router.push(`/buses/${bus.id}`)}
              >
                <div className="relative h-48">
                  <Image src={bus.image} alt={bus.name} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{bus.name}</h3>
                  <p className="text-gray-500">{bus.brand} • {bus.year}</p>
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{bus.capacity} seats</span>
                    </div>
                    <p className="text-red-600 font-bold">${bus.pricePerDay}/day</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Booking Modal */}
        <AnimatePresence>
          {showBookingModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-2xl p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Book {busData.name}</h2>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pick-up Date</label>
                    <input
                      type="date"
                      value={bookingDates.start}
                      onChange={(e) => setBookingDates({ ...bookingDates, start: e.target.value })}
                      className="w-full p-3 border rounded-lg"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
                    <input
                      type="date"
                      value={bookingDates.end}
                      onChange={(e) => setBookingDates({ ...bookingDates, end: e.target.value })}
                      className="w-full p-3 border rounded-lg"
                      min={bookingDates.start || new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Passengers (Max: {busData.capacity})</label>
                    <input
                      type="number"
                      value={passengerCount}
                      onChange={(e) => setPassengerCount(Number(e.target.value))}
                      min="1"
                      max={busData.capacity}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between mb-2 text-gray-600">
                    <span>${busData.pricePerDay} × {days} days</span>
                    <span>${busData.pricePerDay * days}</span>
                  </div>
                  {busData.driverIncluded && (
                    <div className="flex justify-between mb-2 text-sm text-gray-500 italic">
                      <span>Professional driver</span>
                      <span>Included</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg mt-2 text-gray-900 border-t pt-2">
                    <span>Total Price</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setShowBookingModal(false)} className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50">Cancel</button>
                  <button onClick={handleConfirmBooking} className="flex-1 bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700">Confirm</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <NewsletterSignup />
      <br />
      <Footer />
    </>
  );
}

// --- SMALL HELPER COMPONENTS (To keep UI cleaner) ---

function SpecItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="p-4 bg-gray-50 rounded-xl flex items-center border border-gray-100">
      <div className="text-red-600 mr-3">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function FeatureIcon({ name }: { name: string }) {
  const iconClass = "w-3 h-3 mr-1";
  if (name === "Wi-Fi") return <Wifi className={iconClass} />;
  if (name === "Air Conditioning") return <Snowflake className={iconClass} />;
  if (name === "Entertainment System") return <Monitor className={iconClass} />;
  if (name === "Refreshment Station") return <Utensils className={iconClass} />;
  return null;
}