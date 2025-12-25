"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/Newsletter";
import Image from "next/image";
import FlightSearchForm from "@/components/flight/FlightSearchForm";
import { FaStar, FaRegStar } from "react-icons/fa";
import { motion } from "framer-motion";
import { useActiveFlightFeatureds } from "@/hooks/useFlightFeatured";
import type { FlightFeatured } from "@/types/FlightFeatured";

export default function FlightPage() {
  const [selectedFlight, setSelectedFlight] = useState<FlightFeatured | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isError } = useActiveFlightFeatureds({ limit: 100 });
  const flights = data?.flightFeatureds ?? [];
  const loading = isLoading;

  const viewFlightDetails = (flight: FlightFeatured) => {
    setSelectedFlight(flight);
    setShowDetailModal(true);
  };

  const closeModal = () => {
    setShowDetailModal(false);
    setSelectedFlight(null);
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

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch {
      return dateString;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const filteredFlights = flights
    .filter(
      (flight) =>
        !searchQuery.trim() ||
        flight.airline?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flight.airline?.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flight.fromAirport?.airport?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flight.fromAirport?.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flight.toAirport?.airport?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flight.toAirport?.code?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="w-12 h-12 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-gray-600">Loading flights...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-red-600 mb-2">
            Failed to load flights
          </h3>
          <p className="text-gray-500">
            Please try again later
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <Image
            src="/images/plane-logo.png"
            alt="Flight Image"
            width={120}
            height={120}
            className="rounded-md object-cover mb-6"
          />
          <h1 className="text-2xl md:text-2xl font-bold mb-2">
            Find Your{" "}
            <span className="text-red-600 text-3xl">Perfect Flight</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover affordable flights to destinations worldwide—book today!
          </p>
        </div>

        {/* Search Form */}
        <div className="mb-12">
          <FlightSearchForm />
        </div>

        {/* Featured Flights */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Featured Flights
              </h2>
              <p className="text-gray-600">
                Top-rated aircraft with exclusive deals
              </p>
            </div>
            <button className="text-white bg-red-600 hover:bg-red-700 transition-colors rounded-xl px-4 py-2 font-medium">
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFlights.map((flight) => (
              <div
                key={flight.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group border border-gray-100"
              >
                {/* Image with badge */}
                <Link href={`/flights/${flight.id}`}>
                  <div className="relative h-56 w-full cursor-pointer group">
                    <div className="relative w-full h-64">
                      <Image
                        src="/images/plane.png"
                        alt="Car"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority
                      />
                    </div>

                    <div className="absolute top-4 right-4 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Featured
                    </div>

                    <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white text-sm font-medium px-2 py-1 rounded">
                      Featured Flight
                    </div>
                  </div>
                </Link>

                {/* Flight details */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold">
                        {flight.airline?.name || "N/A"} {flight.airline?.code || ""}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {flight.fromAirport?.code || "N/A"} → {flight.toAirport?.code || "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="font-medium">4.5</span>
                      <span className="text-xs text-gray-500 ml-1">
                        (120)
                      </span>
                    </div>
                  </div>

                  {/* Flight times */}
                  <div className="flex justify-between items-center my-4 bg-gray-50 p-2 rounded">
                    <div className="text-center">
                      <p className="font-semibold">N/A</p>
                      <p className="text-xs text-gray-500">Departure</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">-</p>
                      <div className="w-16 h-1 bg-gray-300 rounded"></div>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">N/A</p>
                      <p className="text-xs text-gray-500">Arrival</p>
                    </div>
                  </div>

                  {/* Features chips */}
                  <div className="flex flex-wrap gap-2 my-4">
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                      Featured
                    </span>
                    {flight.status && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Active
                      </span>
                    )}
                  </div>

                  {/* Price and CTA */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-2xl font-bold text-red-600">
                          ${flight.price?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }) || "N/A"}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Featured
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/flights/${flight.id}`}>
                        <button
                          onClick={() => viewFlightDetails(flight)}
                          className="flex-1 border border-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                        >
                          Details
                        </button>
                      </Link>

                      <Link href={`/flights/${flight.id}`}>
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
              private flight
            </p>
          </div>

          {/* Offers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                bigOfferTitle: "Save 20%",
                title: "Weekend Special",
                desc: "Book Friday–Sunday & save 20% on all flights.",
                gradient: "from-red-500 to-red-600",
                btnColor: "text-red-600",
                image: "/images/plane.png",
              },
              {
                bigOfferTitle: "15% OFF",
                title: "Long-Distance Discount",
                desc: "Fly 1000+ miles & enjoy 15% OFF.",
                gradient: "from-blue-500 to-blue-600",
                btnColor: "text-blue-600",
                image: "/images/plane.png",
              },
              {
                bigOfferTitle: "Free Upgrade",
                title: "First-Time Flyer",
                desc: "First-time customers get a complimentary upgrade.",
                gradient: "from-green-500 to-green-600",
                btnColor: "text-green-600",
                image: "/images/plane.png",
              },
            ].map((offer, index) => (
              <div
                key={index}
                className={`relative p-6 rounded-3xl shadow-2xl bg-gradient-to-r ${offer.gradient} text-white overflow-hidden group hover:scale-105 transition-transform duration-300`}
              >
                {/* Decorative Circles */}
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/20 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-white/20 rounded-full animate-pulse"></div>

                {/* Upper Section: Big Title + Jet Image */}
                <div className="flex justify-between items-center mb-6">
                  {/* Big Offer Title */}
                  <h1 className="text-5xl md:text-5xl font-extrabold leading-tight">
                    {offer.bigOfferTitle}
                  </h1>

                  {/* Jet Image */}
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
                  Select Your Jet
                </h3>
                <p className="text-gray-600">
                  Choose from our premium fleet of private jets based on your
                  travel needs and preferences.
                </p>
              </div>
              <div className="p-8 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mb-6 mx-auto">
                  2
                </div>
                <h3 className="text-xl text-blue-600 font-semibold mb-4">
                  Customize Your Flight
                </h3>
                <p className="text-gray-600">
                  Select your departure time, catering preferences, and any
                  special requests for your journey.
                </p>
              </div>
              <div className="p-8 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl font-bold mb-6 mx-auto">
                  3
                </div>
                <h3 className="text-xl text-green-600 font-semibold mb-4">
                  Enjoy Your Flight
                </h3>
                <p className="text-gray-600">
                  Arrive at your private terminal and experience luxury travel
                  with personalized service.
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
                "The private jet experience was exceptional! We saved hours of
                airport time and traveled in ultimate comfort."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold mr-4">
                  JD
                </div>
                <div>
                  <h4 className="font-semibold">John Doe</h4>
                  <p className="text-sm text-gray-500">CEO, TechStart Inc.</p>
                </div>
              </div>
            </div>
            <div className="p-8 bg-green-50 border rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-yellow-400 text-2xl mb-4">★★★★★</div>
              <p className="text-gray-700 italic mb-6">
                "Our family vacation was transformed by the private jet
                experience. The staff was attentive and the amenities were
                superb."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-4">
                  SM
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Miller</h4>
                  <p className="text-sm text-gray-500">New York</p>
                </div>
              </div>
            </div>
            <div className="p-8 bg-green-50 border rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-yellow-400 text-2xl mb-4">★★★★☆</div>
              <p className="text-gray-700 italic mb-6">
                "The efficiency and luxury of private jet travel is unmatched.
                Perfect for our executive team's business trips."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold mr-4">
                  RJ
                </div>
                <div>
                  <h4 className="font-semibold">Robert Johnson</h4>
                  <p className="text-sm text-gray-500">Finance Director</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Top Destinations Section */}
        <section className="py-16 bg-gray-50 rounded-2xl mb-16">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 relative">
              Popular Routes
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-red-600 rounded-full"></span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "New York to Miami",
                  desc: "Escape to sunny Miami in just 2.5 hours with our luxury private jets.",
                  image: "/images/destination-plane.jpg",
                },
                {
                  name: "LA to Vegas",
                  desc: "Quick 1-hour flight to Las Vegas for business or pleasure without the airport hassle.",
                  image: "/images/destination-plane.jpg",
                },
                {
                  name: "Chicago to Aspen",
                  desc: "Ski trip made easy with direct flights to Aspen's private airport.",
                  image: "/images/destination-plane.jpg",
                },
              ].map((destination, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Image with overlay */}
                  <div className="h-32 mt-8 relative">
                    <Image
                      src="/images/destination-plane.jpg"
                      alt={destination.name}
                      fill
                      className="object-cover rounded-t-2xl"
                      priority
                    />
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">
                      {destination.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{destination.desc}</p>
                    <button className="text-red-600 font-medium hover:text-red-700 transition-colors">
                      Explore {destination.name} flights →
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
                <h3 className="font-bold text-xl mb-3">Flexible Scheduling</h3>
                <p className="text-gray-600 leading-relaxed">
                  Depart on your schedule with 24/7 availability
                </p>
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-red-100 rounded-full opacity-30 group-hover:opacity-50 transition duration-500"></div>
              </div>

              {/* Card 2 */}
              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <h3 className="font-bold text-xl mb-3">Premium Safety</h3>
                <p className="text-gray-600 leading-relaxed">
                  Industry-leading safety standards and experienced pilots
                </p>
                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-blue-100 rounded-full opacity-30 group-hover:opacity-50 transition duration-500"></div>
              </div>

              {/* Card 3 */}
              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <i className="fas fa-concierge-bell"></i>
                </div>
                <h3 className="font-bold text-xl mb-3">Personalized Service</h3>
                <p className="text-gray-600 leading-relaxed">
                  Custom catering and amenities tailored to your preferences
                </p>
                <div className="absolute -top-8 -left-8 w-24 h-24 bg-green-100 rounded-full opacity-30 group-hover:opacity-50 transition duration-500"></div>
              </div>

              {/* Card 4 */}
              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <i className="fas fa-tag"></i>
                </div>
                <h3 className="font-bold text-xl mb-3">Transparent Pricing</h3>
                <p className="text-gray-600 leading-relaxed">
                  All-inclusive quotes with no hidden fees or surprises
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
                  question: "How far in advance should I book a private jet?",
                  answer:
                    "We recommend booking at least 24-48 hours in advance to ensure aircraft availability. For peak travel times or special events, we suggest booking 1-2 weeks ahead.",
                },
                {
                  question: "What is included in the rental price?",
                  answer:
                    "Our pricing includes the aircraft rental, fuel, pilot fees, basic insurance, and standard amenities. Additional services like gourmet catering, ground transportation, or special requests may incur extra charges.",
                },
                {
                  question: "Can I change my flight schedule after booking?",
                  answer:
                    "Yes, we offer flexible scheduling changes. Changes made more than 12 hours before departure are free of charge. Last-minute changes may be subject to availability and potential fees.",
                },
                {
                  question:
                    "How many passengers can a private jet accommodate?",
                  answer:
                    "Our fleet includes jets that can accommodate from 4 to 16 passengers, depending on the aircraft model. We'll help you select the right jet based on your party size and luggage requirements.",
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

      {/* Flight Detail Modal */}
      {showDetailModal && selectedFlight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {selectedFlight.airline?.name || "N/A"} {selectedFlight.airline?.code || ""}
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
                      src="/images/plane.png"
                      alt={`${selectedFlight.airline?.name || "Flight"}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="md:w-1/2">
                  <div className="flex items-center mb-4">
                    <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="font-medium">4.5</span>
                      <span className="text-xs text-gray-500 ml-1">
                        (120 reviews)
                      </span>
                    </div>
                    <span className="ml-3 bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                      Featured Flight
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4">
                    {selectedFlight.fromAirport?.code || "N/A"} → {selectedFlight.toAirport?.code || "N/A"}
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold text-red-600">
                          ${selectedFlight.price?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }) || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Featured flight price
                        </p>
                      </div>
                      <Link href={`/flights/${selectedFlight.id}`}>
                        <button className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition">
                          Book Now
                        </button>
                      </Link>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-600">Airline</p>
                      <p className="font-medium">{selectedFlight.airline?.name || "N/A"}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-600">Route</p>
                      <p className="font-medium">{selectedFlight.fromAirport?.code || "N/A"} → {selectedFlight.toAirport?.code || "N/A"}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="font-medium">{selectedFlight.status ? "Active" : "Inactive"}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-600">Type</p>
                      <p className="font-medium">Featured</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-4">Flight Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center">
                    <div className="text-center">
                      <p className="font-semibold">{selectedFlight.fromAirport?.airport || "N/A"}</p>
                      <p className="text-sm text-gray-600">({selectedFlight.fromAirport?.code || "N/A"})</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">→</p>
                      <div className="w-24 h-1 bg-gray-300 rounded mx-auto"></div>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">{selectedFlight.toAirport?.airport || "N/A"}</p>
                      <p className="text-sm text-gray-600">({selectedFlight.toAirport?.code || "N/A"})</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-4">Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="flex items-center bg-green-50 p-3 rounded">
                    <span className="text-green-600 mr-2">✓</span>
                    Featured Flight
                  </div>
                  {selectedFlight.status && (
                    <div className="flex items-center bg-green-50 p-3 rounded">
                      <span className="text-green-600 mr-2">✓</span>
                      Active
                    </div>
                  )}
                  <div className="flex items-center bg-green-50 p-3 rounded">
                    <span className="text-green-600 mr-2">✓</span>
                    {selectedFlight.airline?.name || "Premium Airline"}
                  </div>
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
