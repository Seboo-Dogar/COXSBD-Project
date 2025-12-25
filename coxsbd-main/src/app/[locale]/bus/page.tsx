"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/Newsletter";
import Image from "next/image";
import BusSearchForm from "@/components/bus/BusSearchForm";
import { FaStar, FaRegStar } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/dist/client/link";

export default function BusPage() {
  type Bus = {
  id: string;
  operator: string;  // Matches backend
  busType: string;   // Matches backend
  departureTime: string;
  arrivalTime: string;
  duration: string;
  pricePerSeat: number;
  availableSeats: number;
  rating: number;
  available: boolean;
  category?: string; // Add optional for safety
};

  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategory, setFilteredCategory] = useState<string>("All");

  useEffect(() => {
  const fetchBuses = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bus-trips`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch buses");
      
      const rawData = await res.json();

      // NORMALIZATION: Transform backend data to match UI expectations
      const normalizedData: Bus[] = rawData.map((bus: any) => ({
        ...bus,
        // Map Prisma 'operator' to UI 'name'
        name: bus.operator || "Unknown Operator",
        // Map Prisma 'busType' to UI 'model'
        model: bus.busType || "Standard",
        // Map Prisma 'amenities' to UI 'features' and ensure it's an array
        features: bus.amenities || [], 
        // Map Prisma 'pricePerSeat' to UI 'price' string
        price: `BDT ${bus.pricePerSeat}`,
        // Provide defaults for missing UI fields
        img: "/images/bus.jpg",
        category: bus.busType || "Bus",
        transmission: "Manual",
        seats: bus.availableSeats || 40,
        fuelType: "Diesel",
        reviews: Math.floor(Math.random() * 100) + 1, // Placeholder
      }));

      setBuses(normalizedData);
    } catch (error) {
      console.error("Error fetching buses:", error);
      setBuses([]);
    } finally {
      setLoading(false);
    }
  };
  fetchBuses();
}, []);

  const viewBusDetails = (bus: Bus) => {
    setSelectedBus(bus);
    setShowDetailModal(true);
  };

  const closeModal = () => {
    setShowDetailModal(false);
    setSelectedBus(null);
  };

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }).map((_, i) =>
      i < Math.floor(rating) ||
      (i === Math.floor(rating) && rating % 1 >= 0.5) ? (
        <FaStar key={i} className="text-yellow-400" />
      ) : (
        <FaRegStar key={i} className="text-yellow-400" />
      )
    );

  const filteredBuses = buses
  .filter((bus) =>
    filteredCategory === "All" ? true : bus.busType === filteredCategory
  )
  .filter((bus) => {
    // 2. Safe filtering with optional chaining and fallbacks
    const search = searchQuery.toLowerCase();
    const operatorMatch = (bus.operator || "").toLowerCase().includes(search);
    const typeMatch = (bus.busType || "").toLowerCase().includes(search);
    return operatorMatch || typeMatch;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-medium text-gray-600">Loading buses...</p>
      </div>
    );
  }

  if (filteredBuses.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-600 mb-2">
          No buses available
        </h3>
        <p className="text-gray-500">
          Try adjusting your search criteria or check back later
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <Image
            src="/images/bus-logo.png"
            alt="Bus Image"
            width={120}
            height={120}
            className="rounded-md object-cover mb-6"
          />
          <h1 className="text-2xl md:text-2xl font-bold mb-2">
            Find Your Perfect{" "}
            <span className="text-red-600 text-3xl">Rental Bus</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our premium collection of buses for group travel and
            events
          </p>
        </div>

        {/* Search Form */}
        <div className="mb-12">
          <BusSearchForm />
        </div>

        {/* Featured Buses */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Featured Buses</h2>
              <p className="text-gray-600">
                Top-rated vehicles with special deals
              </p>
            </div>
            <button className="text-white bg-red-600 hover:bg-red-700 transition-colors rounded-xl px-4 py-2 font-medium">
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {buses.map((bus) => (
              <div
                key={bus.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group border border-gray-100"
              >
                {/* Image with badge */}
                <Link
                  href={`/bus/${bus.id}`}
                  className="relative h-56 w-full block cursor-pointer"
                >
                  <div
                    className="relative h-56 w-full cursor-pointer"
                    onClick={() => viewBusDetails(bus)}
                  >
                    <div className="relative w-full h-64">
                      <Image
                        src="/images/bus.jpg" // Must be inside public/images/
                        alt="Bus"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority
                      />
                    </div>

                    {bus.discount && (
                      <div className="absolute top-4 right-4 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {bus.discount}
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white text-sm font-medium px-2 py-1 rounded">
                      {bus.category}
                    </div>
                  </div>
                </Link>

                {/* Bus details */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold">
                        {bus.name} {bus.model}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {bus.year} • {bus.transmission} • {bus.seats} Seats
                      </p>
                    </div>
                    <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="font-medium">{bus.rating}</span>
                      <span className="text-xs text-gray-500 ml-1">
                        ({bus.reviews})
                      </span>
                    </div>
                  </div>

                  {/* Features chips */}
                  <div className="flex flex-wrap gap-2 my-4">
                    {bus.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                    {bus.features.length > 3 && (
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        +{bus.features.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Price and CTA */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-2xl font-bold text-red-600">
                          {bus.price}
                        </span>
                        {bus.originalPrice && (
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            {bus.originalPrice}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {bus.fuelType}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/bus/${bus.id}`}
                        className="flex-1 border border-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition text-center"
                      >
                        Details
                      </Link>

                      <Link href={`/bus/${bus.id}`}>
                        <button className="flex-1 bg-gradient-to-r from-red-600 to-red-800 text-white font-medium px-4 py-2 rounded-lg hover:from-red-700 hover:to-red-900 transition-all shadow-md hover:shadow-lg">
                          Book Now
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Special Offers Section */}
        <section className="my-20 relative">
          {/* Section Heading */}
          <div className="mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold relative inline-block">
              Special Offers
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-red-500 to-red-700 rounded-full"></span>
            </h2>
            <p className="mt-4 text-gray-600 text-lg max-w-2xl">
              Unlock exclusive discounts and limited-time deals on your next
              rental
            </p>
          </div>

          {/* Offers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                bigOfferTitle: "Save 20%",
                title: "Weekend Special",
                desc: "Book Friday–Sunday & save 20% on all vehicles.",
                gradient: "from-red-500 to-red-600",
                btnColor: "text-red-600",
                image: "/images/bus.jpg",
              },
              {
                bigOfferTitle: "15% OFF",
                title: "Long-Term Discount",
                desc: "Rent 7+ days & enjoy 15% OFF.",
                gradient: "from-blue-500 to-blue-600",
                btnColor: "text-blue-600",
                image: "/images/bus.jpg",
              },
              {
                bigOfferTitle: "Free Upgrade",
                title: "Free Upgrade",
                desc: "Get a complimentary upgrade on select rentals.",
                gradient: "from-green-500 to-green-600",
                btnColor: "text-green-600",
                image: "/images/bus.jpg",
              },
            ].map((offer, index) => (
              <div
                key={index}
                className={`relative p-6 rounded-3xl shadow-2xl bg-gradient-to-r ${offer.gradient} text-white overflow-hidden group hover:scale-105 transition-transform duration-300`}
              >
                {/* Decorative Circles */}
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/20 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-white/20 rounded-full animate-pulse"></div>

                {/* Upper Section: Big Title + Car Image */}
                <div className="flex justify-between items-center mb-6">
                  {/* Big Offer Title */}
                  <h1 className="text-5xl md:text-5xl font-extrabold leading-tight">
                    {offer.bigOfferTitle}
                  </h1>

                  {/* Car Image */}
                  <div className="relative w-26 h-14 md:w-44 md:h-22 flex-shrink-0">
                    <Image
                      src={offer.image}
                      alt={offer.bigOfferTitle}
                      fill
                      className="object-contain transition-transform duration-500 group-hover:scale-105"
                      priority
                    />
                  </div>
                </div>

                {/* Bottom Section: Title, Description + Button */}
                <div className="mt-auto">
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">
                    {offer.title}
                  </h3>
                  <p className="mb-4 opacity-90 leading-relaxed">
                    {offer.desc}
                  </p>
                  <button
                    className={`w-full bg-white ${offer.btnColor} font-semibold py-3 rounded-lg hover:bg-gray-100 transition shadow-md`}
                  >
                    Claim Offer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-sky-50 rounded-2xl mb-16">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 relative">
              How It Works
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-red-600 rounded-full"></span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-2xl font-bold mb-6 mx-auto">
                  1
                </div>
                <h3 className="text-xl text-red-600 font-semibold mb-4">
                  Search & Select
                </h3>
                <p className="text-gray-600">
                  Browse our extensive fleet and choose the perfect bus for your
                  group size and needs.
                </p>
              </div>
              <div className="p-8 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mb-6 mx-auto">
                  2
                </div>
                <h3 className="text-xl text-blue-600 font-semibold mb-4">
                  Book & Confirm
                </h3>
                <p className="text-gray-600">
                  Reserve your bus in seconds with our secure booking system and
                  instant confirmation.
                </p>
              </div>
              <div className="p-8 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl font-bold mb-6 mx-auto">
                  3
                </div>
                <h3 className="text-xl text-green-600 font-semibold mb-4">
                  Pick Up & Travel
                </h3>
                <p className="text-gray-600">
                  Collect your vehicle at the scheduled time and enjoy your
                  group journey with comfort.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 relative">
            Customer Testimonials
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-red-600 rounded-full"></span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-green-50 border rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-yellow-400 text-2xl mb-4">★★★★★</div>
              <p className="text-gray-700 italic mb-6">
                "Perfect for our company retreat! The bus was clean,
                comfortable, and the driver was professional. Will definitely
                book again!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold mr-4">
                  JD
                </div>
                <div>
                  <h4 className="font-semibold">John Doe</h4>
                  <p className="text-sm text-gray-500">New York</p>
                </div>
              </div>
            </div>
            <div className="p-8 bg-green-50 border rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-yellow-400 text-2xl mb-4">★★★★★</div>
              <p className="text-gray-700 italic mb-6">
                "The school trip was a huge success thanks to the comfortable
                bus and excellent service. The kids loved the entertainment
                system!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-4">
                  SM
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Miller</h4>
                  <p className="text-sm text-gray-500">Los Angeles</p>
                </div>
              </div>
            </div>
            <div className="p-8 bg-green-50 border rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-yellow-400 text-2xl mb-4">★★★★☆</div>
              <p className="text-gray-700 italic mb-6">
                "We rented a bus for our wedding party and it was perfect. On
                time, clean, and the amenities made the experience special for
                everyone."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold mr-4">
                  DJ
                </div>
                <div>
                  <h4 className="font-semibold">David Johnson</h4>
                  <p className="text-sm text-gray-500">Chicago</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Top Destinations Section */}
        <section className="py-16 bg-gray-50 rounded-2xl mb-16">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 relative">
              Top Destinations
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-red-600 rounded-full"></span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "New York",
                  desc: "Explore the big apple in style with our premium fleet of vehicles.",
                  image: "/images/destination-car.jpg",
                },
                {
                  name: "Miami",
                  desc: "Cruise ocean drive with a convertible or luxury vehicle for the ultimate experience.",
                  image: "/images/destination-car.jpg",
                },
                {
                  name: "Los Angeles",
                  desc: "Drive around the city of stars in a premium rental car for your Hollywood adventure.",
                  image: "/images/destination-car.jpg",
                },
              ].map((destination, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Image with overlay */}
                  <div className="h-32 mt-8 relative">
                    <Image
                      src="/images/destination-bus.png" // must exist in public/images/
                      alt="New York"
                      fill
                      className="object-cover rounded-t-2xl"
                      priority
                    />
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">{destination.desc}</p>
                    <button className="text-red-600 font-medium hover:text-red-700 transition-colors">
                      Explore {destination.name} deals →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 relative bg-gray-50 overflow-hidden">
          {/* Decorative Background Shapes */}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

          <div className="max-w-6xl mx-auto px-4">
            {/* Section Heading */}
            <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-16 relative">
              Why Choose Us?
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></span>
            </h2>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Card 1 */}
              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-red-400 to-red-600 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <i className="fas fa-check-circle"></i>
                </div>
                <h3 className="font-bold text-xl mb-3">Free Cancellation</h3>
                <p className="text-gray-600 leading-relaxed">
                  Cancel up to 24 hours before for a full refund
                </p>
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-red-100 rounded-full opacity-30 group-hover:opacity-50 transition duration-500"></div>
              </div>

              {/* Card 2 */}
              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <i className="fas fa-headset"></i>
                </div>
                <h3 className="font-bold text-xl mb-3">24/7 Support</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our team is always available to assist you
                </p>
                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-blue-100 rounded-full opacity-30 group-hover:opacity-50 transition duration-500"></div>
              </div>

              {/* Card 3 */}
              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <h3 className="font-bold text-xl mb-3">Insurance Included</h3>
                <p className="text-gray-600 leading-relaxed">
                  All rentals include basic insurance coverage
                </p>
                <div className="absolute -top-8 -left-8 w-24 h-24 bg-green-100 rounded-full opacity-30 group-hover:opacity-50 transition duration-500"></div>
              </div>

              {/* Card 4 */}
              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <i className="fas fa-tag"></i>
                </div>
                <h3 className="font-bold text-xl mb-3">Best Prices</h3>
                <p className="text-gray-600 leading-relaxed">
                  Guaranteed competitive rates with no hidden fees
                </p>
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-purple-100 rounded-full opacity-30 group-hover:opacity-50 transition duration-500"></div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50 rounded-2xl mb-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 relative">
              Frequently Asked Questions
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-red-600 rounded-full"></span>
            </h2>
            <div className="space-y-4">
              {[
                {
                  question: "Is a driver included with the bus rental?",
                  answer:
                    "Yes, all our bus rentals include a professional, licensed driver. Our drivers are experienced, background-checked, and familiar with the routes.",
                },
                {
                  question: "What is the cancellation policy?",
                  answer:
                    "You can cancel your reservation free of charge up to 72 hours before your scheduled pickup time. Cancellations within 72 hours may incur a fee depending on the circumstances.",
                },
                {
                  question: "Are there any hidden fees?",
                  answer:
                    "No, our pricing is transparent. The quoted price includes the bus rental, driver, basic insurance, and standard amenities. Additional costs may apply for extra services like extended mileage or special requests.",
                },
                {
                  question: "Can we bring food and drinks on the bus?",
                  answer:
                    "Yes, you're welcome to bring food and non-alcoholic drinks on board. We do charge a cleaning fee if excessive mess is left. Alcohol consumption is subject to local laws and may require special permits.",
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300"
                >
                  <button
                    className="w-full p-6 text-left font-semibold flex justify-between items-center"
                    onClick={() => toggleFAQ(index)}
                  >
                    {faq.question}
                    <span
                      className={`transform transition-transform duration-300 ${
                        activeFAQ === index ? "rotate-180" : ""
                      }`}
                    >
                      <i className="fas fa-chevron-down"></i>
                    </span>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      activeFAQ === index ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <div className="p-6 pt-0 text-gray-600">{faq.answer}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <NewsletterSignup />
      </main>

      {/* Bus Detail Modal */}
      {showDetailModal && selectedBus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {selectedBus.name} {selectedBus.model}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="md:w-1/2">
                  <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
                    <Image
                      src={selectedBus.img}
                      alt={`${selectedBus.name} ${selectedBus.model}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="md:w-1/2">
                  <div className="flex items-center mb-4">
                    <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="font-medium">{selectedBus.rating}</span>
                      <span className="text-xs text-gray-500 ml-1">
                        ({selectedBus.reviews} reviews)
                      </span>
                    </div>
                    <span className="ml-3 bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                      {selectedBus.category}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4">
                    {selectedBus.year} • {selectedBus.transmission} •{" "}
                    {selectedBus.seats} Seats • {selectedBus.fuelType}
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold text-red-600">
                          {selectedBus.price}
                        </p>
                        {selectedBus.originalPrice && (
                          <p className="text-gray-500 line-through">
                            {selectedBus.originalPrice}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 mt-1">
                          Including driver and basic insurance
                        </p>
                      </div>
                      <button className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition">
                        Book Now
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-600">Mileage</p>
                      <p className="font-medium">{selectedBus.mileage}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-600">Transmission</p>
                      <p className="font-medium">{selectedBus.transmission}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-600">Seats</p>
                      <p className="font-medium">{selectedBus.seats}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-600">Fuel Type</p>
                      <p className="font-medium">{selectedBus.fuelType}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-4">Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedBus.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center bg-green-50 p-3 rounded"
                    >
                      <span className="text-green-600 mr-2">✓</span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
