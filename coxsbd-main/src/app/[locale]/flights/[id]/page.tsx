"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Star,
  Heart,
  Luggage,
  Wifi,
  Utensils,
  Plane,
  CloudSnow,
  Tv,
  Power,
} from "lucide-react";
import NewsletterSignup from "@/components/Newsletter";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useCart } from "@/context/cartContext";

// Mock data for flight - in a real app, this would come from an API
const flightData = {
  _id: "1",
  flightNumber: "AA 1234",
  airline: "American Airlines",
  aircraft: "Boeing 737-800",
  price: 299,
  description:
    "Non-stop flight with premium amenities for comfortable travel. Features spacious seating, onboard entertainment, Wi-Fi, and meal service. Perfect for business trips and vacations.",
  images: [
    "/images/plane.png",
    "/images/plane.png",
    "/images/plane.png",
    "/images/plane.png",
  ],
  capacity: 180,
  seatsAvailable: 24,
  class: "Economy",
  duration: "2h 45m",
  features: [
    "Wi-Fi Available",
    "In-flight Entertainment",
    "USB Charging Ports",
    "Complimentary Meals",
    "Extra Legroom",
    "Priority Boarding",
  ],
  amenities: [
    "Wifi",
    "Entertainment",
    "Power Outlets",
    "Meal Service",
    "Extra Legroom",
  ],
  departure: {
    airport: "JFK",
    city: "New York",
    time: "08:00 AM",
    date: "2023-12-15",
  },
  arrival: {
    airport: "LAX",
    city: "Los Angeles",
    time: "10:45 AM",
    date: "2023-12-15",
  },
  rating: 4.7,
  reviews: 256,
  baggageAllowance: "1 carry-on + 1 checked bag",
  refundable: false,
  available: true,
};

// Related flights for recommendation section
const relatedFlights = [
  {
    id: 2,
    flightNumber: "DL 5678",
    airline: "Delta Airlines",
    aircraft: "Airbus A321",
    price: 315,
    image: "/images/plane.png",
    class: "Economy",
    duration: "2h 55m",
    departure: {
      airport: "JFK",
      city: "New York",
      time: "10:30 AM",
    },
    arrival: {
      airport: "LAX",
      city: "Los Angeles",
      time: "01:25 PM",
    },
  },
  {
    id: 3,
    flightNumber: "UA 9012",
    airline: "United Airlines",
    aircraft: "Boeing 757",
    price: 285,
    image: "/images/plane.png",
    class: "Economy",
    duration: "2h 50m",
    departure: {
      airport: "JFK",
      city: "New York",
      time: "07:15 AM",
    },
    arrival: {
      airport: "LAX",
      city: "Los Angeles",
      time: "10:05 AM",
    },
  },
  {
    id: 4,
    flightNumber: "B6 3456",
    airline: "JetBlue",
    aircraft: "Airbus A320",
    price: 275,
    image: "/images/plane.png",
    class: "Economy",
    duration: "2h 40m",
    departure: {
      airport: "JFK",
      city: "New York",
      time: "06:45 PM",
    },
    arrival: {
      airport: "LAX",
      city: "Los Angeles",
      time: "09:25 PM",
    },
  },
];

export default function FlightDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [passengerCount, setPassengerCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(flightData.price);
  const [showAmenities, setShowAmenities] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const { addToCart } = useCart();

  // Calculate total price based on passenger count
  useEffect(() => {
    setTotalPrice(flightData.price * passengerCount);
  }, [passengerCount]);

  const handleBookNow = () => {
    setShowBookingModal(true);
  };

  const handleAddToCart = () => {
    addToCart({
      id: flightData._id,
      name: `${flightData.airline} ${flightData.flightNumber}`,
      price: totalPrice,
      image: flightData.images[0],
      passengers: passengerCount,
    });
    alert(`${flightData.airline} ${flightData.flightNumber} added to cart!`);
  };

  const handleConfirmBooking = () => {
    // In a real app, this would send data to your backend
    alert(
      `Flight booking confirmed for ${passengerCount} passenger(s)! Total: $${totalPrice}`
    );
    setShowBookingModal(false);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In a real app, this would update user preferences in the backend
  };

  const navigateToFlight = (flightId: string) => {
    router.push(`/flights/${flightId}`);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <button
                onClick={() => router.push("/")}
                className="hover:text-red-600"
              >
                Home
              </button>
              <svg
                className="fill-current w-3 h-3 mx-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
            <li className="flex items-center">
              <button
                onClick={() => router.push("/flights")}
                className="hover:text-red-600"
              >
                Flights
              </button>
              <svg
                className="fill-current w-3 h-3 mx-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
            <li className="text-red-600">{flightData.flightNumber}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Gallery Section */}
          <div>
            <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-lg mb-4">
              <Image
                src={flightData.images[selectedImage]}
                alt={`${flightData.airline} ${flightData.flightNumber}`}
                fill
                className="object-cover"
                priority
              />
              <button
                onClick={toggleFavorite}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                aria-label={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
              >
                <Heart
                  className={`w-6 h-6 ${
                    isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                  }`}
                />
              </button>
              {!flightData.available && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Not Available
                </div>
              )}
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImage + 1} / {flightData.images.length}
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {flightData.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-28 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImage === idx
                      ? "border-blue-500"
                      : "border-gray-200"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${flightData.airline} view ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {flightData.airline}
                </h1>
                <p className="text-gray-500 text-lg">
                  {flightData.flightNumber} • {flightData.aircraft}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-red-600">
                  ${flightData.price}
                  <span className="text-base font-normal text-gray-500">
                    /person
                  </span>
                </p>
                <div className="flex items-center justify-end mt-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-gray-700">
                    {flightData.rating}
                  </span>
                  <span className="mx-1">•</span>
                  <span className="text-gray-500">
                    {flightData.reviews} reviews
                  </span>
                </div>
              </div>
            </div>

            {/* Flight Route */}
            <div className="bg-gray-50 p-4 rounded-xl mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {flightData.departure.time}
                  </p>
                  <p className="text-gray-600">
                    {flightData.departure.airport}
                  </p>
                  <p className="text-sm text-gray-500">
                    {flightData.departure.city}
                  </p>
                </div>

                <div className="flex flex-col items-center mx-4">
                  <div className="text-gray-400 text-sm">
                    {flightData.duration}
                  </div>
                  <div className="relative w-32 h-px bg-gray-300 my-2">
                    <div className="absolute inset-0 flex items-center justify-between">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <Plane className="w-4 h-4 text-red-600" />
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    </div>
                  </div>
                  <div className="text-gray-400 text-xs">Non-stop</div>
                </div>

                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {flightData.arrival.time}
                  </p>
                  <p className="text-gray-600">{flightData.arrival.airport}</p>
                  <p className="text-sm text-gray-500">
                    {flightData.arrival.city}
                  </p>
                </div>
              </div>
              <div className="text-center text-sm text-gray-500">
                {formatDate(flightData.departure.date)}
              </div>
            </div>

            <p className="text-gray-700 mb-8 leading-relaxed">
              {flightData.description}
            </p>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-gray-50 rounded-xl flex items-center">
                <Users className="w-6 h-6 text-red-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Class</p>
                  <p className="font-medium">{flightData.class}</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl flex items-center">
                <Luggage className="w-6 h-6 text-red-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Baggage</p>
                  <p className="font-medium">{flightData.baggageAllowance}</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl flex items-center">
                <Clock className="w-6 h-6 text-red-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">{flightData.duration}</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl flex items-center">
                <div className="w-6 h-6 text-red-600 mr-3 flex items-center justify-center">
                  {flightData.refundable ? (
                    <span className="text-green-500 text-sm font-bold">✓</span>
                  ) : (
                    <span className="text-gray-400 text-sm font-bold">✗</span>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Refundable</p>
                  <p className="font-medium">
                    {flightData.refundable ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>

            {/* Availability Info */}
            <div className="bg-blue-50 p-4 rounded-xl mb-6">
              <div className="flex items-center">
                <div className="w-5 h-5 text-red-600 mr-2 flex items-center justify-center">
                  {flightData.seatsAvailable > 10 ? (
                    <span className="text-green-500 text-sm font-bold">✓</span>
                  ) : flightData.seatsAvailable > 0 ? (
                    <span className="text-yellow-500 text-sm font-bold">!</span>
                  ) : (
                    <span className="text-red-500 text-sm font-bold">✗</span>
                  )}
                </div>
                <span className="font-medium text-red-800">
                  {flightData.seatsAvailable > 10
                    ? "Good availability"
                    : flightData.seatsAvailable > 0
                    ? `Only ${flightData.seatsAvailable} seats left`
                    : "Sold out"}
                </span>
              </div>
            </div>

            {/* Features */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">In-Flight Amenities</h3>
                <button
                  onClick={() => setShowAmenities(!showAmenities)}
                  className="text-sm text-red-600 hover:underline"
                >
                  {showAmenities ? "Show less" : "Show all"}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {flightData.features
                  .slice(0, showAmenities ? flightData.features.length : 4)
                  .map((feature, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-red-800 text-sm px-3 py-1 rounded-full flex items-center"
                    >
                      {feature.includes("Wi-Fi") && (
                        <Wifi className="w-3 h-3 mr-1" />
                      )}
                      {feature.includes("Entertainment") && (
                        <Tv className="w-3 h-3 mr-1" />
                      )}
                      {feature.includes("Charging") && (
                        <Power className="w-3 h-3 mr-1" />
                      )}
                      {feature.includes("Meal") && (
                        <Utensils className="w-3 h-3 mr-1" />
                      )}
                      {feature.includes("Legroom") && (
                        <Users className="w-3 h-3 mr-1" />
                      )}
                      {feature}
                    </span>
                  ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleBookNow}
                disabled={
                  !flightData.available || flightData.seatsAvailable === 0
                }
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {flightData.available && flightData.seatsAvailable > 0
                  ? "Book This Flight"
                  : flightData.seatsAvailable === 0
                  ? "Sold Out"
                  : "Not Available"}
              </button>
              <button
                onClick={handleAddToCart}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Add To Cart
              </button>
            </div>
          </div>
        </div>

        {/* Related Flights Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Similar Flights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedFlights.map((flight) => (
              <motion.div
                key={flight.id}
                className="border rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                whileHover={{ y: -5 }}
                onClick={() => navigateToFlight(flight.id.toString())}
              >
                <div className="relative h-48">
                  <Image
                    src={flight.image}
                    alt={`${flight.airline} ${flight.flightNumber}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{flight.airline}</h3>
                  <p className="text-gray-500">
                    {flight.flightNumber} • {flight.aircraft}
                  </p>
                  <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
                    <div>
                      {flight.departure.time} - {flight.arrival.time}
                    </div>
                    <div>{flight.duration}</div>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-gray-500">
                      {flight.class}
                    </span>
                    <p className="text-red-600 font-bold">${flight.price}</p>
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
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md"
              >
                <h2 className="text-2xl font-bold mb-4">
                  Book {flightData.flightNumber}
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="font-medium">
                          {flightData.departure.airport} →{" "}
                          {flightData.arrival.airport}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(flightData.departure.date)}
                        </p>
                      </div>
                      <p className="font-medium">{flightData.duration}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {flightData.airline} • {flightData.aircraft}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Passengers
                    </label>
                    <select
                      value={passengerCount}
                      onChange={(e) =>
                        setPassengerCount(Number(e.target.value))
                      }
                      className="w-full p-3 border rounded-lg"
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "passenger" : "passengers"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span>
                      ${flightData.price} × {passengerCount}{" "}
                      {passengerCount === 1 ? "ticket" : "tickets"}
                    </span>
                    <span>${flightData.price * passengerCount}</span>
                  </div>
                  <div className="flex justify-between mb-2 text-sm text-gray-600">
                    <span>Taxes & fees</span>
                    <span>Included</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-2">
                    <span>Total</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmBooking}
                    className="flex-1 bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700"
                  >
                    Confirm Booking
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
      <NewsletterSignup />
      <br />
      <br />
      <Footer />
    </>
  );
}
