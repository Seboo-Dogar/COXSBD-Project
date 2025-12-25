"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Star,
  Heart,
  Users,
  Clock,
  Calendar,
  Shield,
  Bus,
  Utensils,
  Hotel,
  Guide,
} from "lucide-react";
import NewsletterSignup from "@/components/Newsletter";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useCart } from "@/context/cartContext";

// Mock data for tour package
const tourData = {
  _id: "1",
  name: "European Capitals Explorer",
  provider: "Luxury Tours",
  price: 1299,
  description:
    "10-day guided tour through Europe's most captivating capitals. Experience rich history, stunning architecture, and diverse cultures with expert guides, premium accommodations, and seamless transportation.",
  images: [
    "/images/tour.jpg",
    "/images/tour.jpg",
    "/images/tour.jpg",
    "/images/tour.jpg",
  ],
  rating: 4.9,
  reviews: 187,
  duration: "10 days / 9 nights",
  destinations: ["Paris", "Rome", "Barcelona", "Amsterdam"],
  inclusions: [
    "4-star Accommodations",
    "Daily Breakfast",
    "All Transportation",
    "Expert Tour Guide",
    "Entrance Fees",
    "City Tours",
    "Airport Transfers",
    "Welcome Dinner",
  ],
  groupSize: "Max 16 people",
  difficulty: "Easy",
  available: true,
  departureDates: ["2023-12-10", "2023-12-20", "2024-01-05", "2024-01-15"],
};

// Related tours for recommendation section
const relatedTours = [
  {
    id: 2,
    name: "Asian Cultural Journey",
    provider: "Culture Tours",
    price: 1499,
    image: "/images/tour.jpg",
    duration: "14 days",
    destinations: ["Tokyo", "Seoul", "Beijing"],
    rating: 4.8,
  },
  {
    id: 3,
    name: "Mediterranean Cruise Tour",
    provider: "Ocean Adventures",
    price: 1899,
    image: "/images/tour.jpg",
    duration: "7 days",
    destinations: ["Santorini", "Mykonos", "Dubrovnik"],
    rating: 4.7,
  },
  {
    id: 4,
    name: "African Safari Experience",
    provider: "Wildlife Expeditions",
    price: 2199,
    image: "/images/tour.jpg",
    duration: "12 days",
    destinations: ["Serengeti", "Maasai Mara", "Victoria Falls"],
    rating: 4.9,
  },
];

export default function TourDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [travelers, setTravelers] = useState(2);
  const [totalPrice, setTotalPrice] = useState(tourData.price * 2);
  const [showItinerary, setShowItinerary] = useState(false);
  const { addToCart } = useCart();

  // Calculate total price based on travelers
  useEffect(() => {
    setTotalPrice(tourData.price * travelers);
  }, [travelers]);

  const handleBookNow = () => {
    setShowBookingModal(true);
  };

  const handleAddToCart = () => {
    addToCart({
      id: tourData._id,
      name: tourData.name,
      price: totalPrice,
      image: tourData.images[0],
      travelers,
      selectedDate,
      duration: tourData.duration,
      provider: tourData.provider,
    });

    alert(`${tourData.name} added to cart!`);
  };

  const handleConfirmBooking = () => {
    alert(
      `Tour booking confirmed for ${travelers} travelers! Total: $${totalPrice}`
    );
    setShowBookingModal(false);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const navigateToTour = (tourId: string) => {
    router.push(`/tours/${tourId}`);
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
                className="hover:text-purple-600"
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
                onClick={() => router.push("/tours")}
                className="hover:text-purple-600"
              >
                Tours
              </button>
              <svg
                className="fill-current w-3 h-3 mx-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
            <li className="text-purple-600">{tourData.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Gallery Section */}
          <div>
            <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-lg mb-4">
              <Image
                src={tourData.images[selectedImage]}
                alt={tourData.name}
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
                  className={`w-6 h-6 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                />
              </button>
              {!tourData.available && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Not Available
                </div>
              )}
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImage + 1} / {tourData.images.length}
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {tourData.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-28 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImage === idx
                      ? "border-purple-500"
                      : "border-gray-200"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${tourData.name} view ${idx + 1}`}
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
                  {tourData.name}
                </h1>
                <p className="text-gray-500 text-lg">{tourData.provider}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-purple-600">
                  ${tourData.price}
                  <span className="text-base font-normal text-gray-500">
                    /person
                  </span>
                </p>
                <div className="flex items-center justify-end mt-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-gray-700">{tourData.rating}</span>
                  <span className="mx-1">•</span>
                  <span className="text-gray-500">
                    {tourData.reviews} reviews
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center text-gray-600 mb-6">
              <MapPin className="w-5 h-5 mr-1" />
              <span>{tourData.destinations.join(", ")}</span>
            </div>

            <p className="text-gray-700 mb-8 leading-relaxed">
              {tourData.description}
            </p>

            {/* Tour Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-gray-50 rounded-xl flex items-center">
                <Clock className="w-6 h-6 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">{tourData.duration}</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl flex items-center">
                <Users className="w-6 h-6 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Group Size</p>
                  <p className="font-medium">{tourData.groupSize}</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl flex items-center">
                <Shield className="w-6 h-6 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Difficulty</p>
                  <p className="font-medium">{tourData.difficulty}</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl flex items-center">
                <Calendar className="w-6 h-6 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Next Departure</p>
                  <p className="font-medium">
                    {new Date(tourData.departureDates[0]).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Destinations */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Destinations</h3>
              <div className="flex flex-wrap gap-2">
                {tourData.destinations.map((destination, index) => (
                  <span
                    key={index}
                    className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full"
                  >
                    {destination}
                  </span>
                ))}
              </div>
            </div>

            {/* Inclusions */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">What's Included</h3>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {tourData.inclusions.map((inclusion, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <div className="w-5 h-5 text-green-500 mr-2 flex items-center justify-center">
                      ✓
                    </div>
                    <span>{inclusion}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleBookNow}
                disabled={!tourData.available}
                className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {tourData.available ? "Book This Tour" : "Not Available"}
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

        {/* Related Tours Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Similar Tours</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTours.map((tour) => (
              <motion.div
                key={tour.id}
                className="border rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                whileHover={{ y: -5 }}
                onClick={() => navigateToTour(tour.id.toString())}
              >
                <div className="relative h-48">
                  <Image
                    src={tour.image}
                    alt={tour.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{tour.name}</h3>
                  <p className="text-gray-500">{tour.provider}</p>
                  <div className="flex items-center mt-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm text-gray-700">
                      {tour.rating}
                    </span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-sm text-gray-500">
                      {tour.duration}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-gray-500">
                      {tour.destinations.slice(0, 2).join(", ")}
                    </span>
                    <p className="text-purple-600 font-bold">
                      ${tour.price}/person
                    </p>
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
                  Book {tourData.name}
                </h2>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Departure Date
                    </label>

                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select a date</option>
                      {tourData.departureDates.map((date) => (
                        <option key={date} value={date}>
                          {new Date(date).toLocaleDateString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Travelers
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          travelers > 1 && setTravelers(travelers - 1)
                        }
                        disabled={travelers <= 1}
                        className="px-4 py-3 bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center py-3 font-medium">
                        {travelers} {travelers === 1 ? "Traveler" : "Travelers"}
                      </span>
                      <button
                        onClick={() =>
                          travelers < 10 && setTravelers(travelers + 1)
                        }
                        disabled={travelers >= 10}
                        className="px-4 py-3 bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">
                        ${tourData.price} × {travelers} travelers
                      </span>
                      <span className="font-medium">
                        ${tourData.price * travelers}
                      </span>
                    </div>
                    <div className="flex justify-between items-center font-bold text-lg pt-2 border-t border-gray-200">
                      <span>Total</span>
                      <span className="text-purple-600">${totalPrice}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmBooking}
                    disabled={!selectedDate}
                    className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Confirm Booking
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Itinerary Section */}
        <section className="mt-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Tour Itinerary</h2>
            <button
              onClick={() => setShowItinerary(!showItinerary)}
              className="text-purple-600 font-medium hover:text-purple-700"
            >
              {showItinerary ? "Hide Itinerary" : "Show Full Itinerary"}
            </button>
          </div>

          <AnimatePresence>
            {showItinerary && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((day) => (
                    <div
                      key={day}
                      className="border-l-4 border-purple-500 pl-6 pb-6"
                    >
                      <h3 className="text-lg font-semibold mb-2">
                        Day {day}:{" "}
                        {
                          tourData.destinations[
                            day % tourData.destinations.length
                          ]
                        }
                      </h3>
                      <p className="text-gray-600 mb-2">
                        {day === 1 &&
                          "Arrival and welcome dinner. Meet your tour guide and fellow travelers."}
                        {day === 10 &&
                          "Final breakfast and departure transfers to the airport."}
                        {day > 1 &&
                          day < 10 &&
                          `Explore the city's main attractions, including guided tours of historical sites, cultural experiences, and local cuisine tasting.`}
                      </p>
                      <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Hotel className="w-4 h-4 mr-1" />
                          {day === 10 ? "Breakfast only" : "4-star Hotel"}
                        </span>
                        <span className="flex items-center">
                          <Utensils className="w-4 h-4 mr-1" />
                          {day === 1
                            ? "Welcome Dinner"
                            : day === 10
                              ? "No meals"
                              : "Breakfast & Lunch"}
                        </span>
                        <span className="flex items-center">
                          <Bus className="w-4 h-4 mr-1" />
                          {day === 1
                            ? "Airport Transfer"
                            : day === 10
                              ? "Departure Transfer"
                              : "Guided Transportation"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Reviews Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((review) => (
              <div key={review} className="border rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
                    U{review}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold">User {review}</h4>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < 5 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">
                  "This tour exceeded all my expectations! The guides were
                  knowledgeable, the accommodations were excellent, and the
                  itinerary was perfectly balanced between sightseeing and free
                  time."
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Posted on December 15, 2023
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <NewsletterSignup />
      <br />
      <br />
      <Footer />
    </>
  );
}
