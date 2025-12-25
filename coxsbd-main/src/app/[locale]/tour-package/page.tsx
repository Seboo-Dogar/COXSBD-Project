"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TourHomeSearch from "@/components/tour/TourHomeSearch";
import NewsletterSignup from "@/components/Newsletter";
import Image from "next/image";
import { FaStar, FaRegStar } from "react-icons/fa";
import { motion } from "framer-motion";

export default function FeaturedTourPage() {
  type Tour = {
    _id?: string;
    id?: number;
    name: string;
    model: string;
    year: number;
    features: string[];
    price: string;
    numericPrice: number;
    originalPrice?: string;
    discount?: string;
    img: string;
    rating: number;
    seats: number;
    available: boolean;
    category: string;
    reviews: number;
  };

  const [tours, setTours] = useState<Tour[]>([]);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategory, setFilteredCategory] = useState<string>("All");

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/tour-package`,
          {
            cache: "no-store",
          }
        );

        if (!res.ok) throw new Error("Failed to fetch tours");
        const data: Tour[] = await res.json();
        setTours(data);
      } catch (error) {
        console.error("Error fetching tours:", error);
        setTours([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  const viewTourDetails = (tour: Tour) => {
    setSelectedTour(tour);
    setShowDetailModal(true);
  };

  const closeModal = () => {
    setSelectedTour(null);
    setShowDetailModal(false);
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

  const filteredTours = tours
    .filter((tour) =>
      filteredCategory === "All" ? true : tour.category === filteredCategory
    )
    .filter(
      (tour) =>
        tour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.model.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-medium text-gray-600">Loading tours...</p>
      </div>
    );
  }

  if (filteredTours.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-600 mb-2">
          No tours available
        </h3>
        <p className="text-gray-500">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <Image
            src="/images/tour-logo.png"
            alt="Tour Logo"
            width={120}
            height={120}
            className="rounded-md object-cover mb-4"
          />
          <h1 className="text-2xl md:text-2xl font-bold mb-2">
            Discover{" "}
            <span className="text-red-600 text-3xl">Amazing Tours</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Curated experiences with unforgettable memories
          </p>
        </div>

        {/* Tour Search Form */}
        <div className="mb-12">
          <TourHomeSearch />
        </div>

        {/* Featured Tours */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Featured Tours</h2>
              <p className="text-gray-600">
                Premium packages with special rates
              </p>
            </div>
            <button className="text-white bg-red-600 border rounded-xl px-4 py-2 font-medium hover:bg-red-700 transition-colors">
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour) => (
              <div
                key={tour.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                {/* Tour Image */}
                <Link href={`/tour-package/${tour.id}`}>
                  <div className="relative h-56 w-full">
                    <Image
                      src={tour.featuredImage}
                      alt={tour.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority
                    />
                    {tour.discount && (
                      <div className="absolute top-4 right-4 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {tour.discount}
                      </div>
                    )}
                  </div>
                </Link>

                {/* Tour Details */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold">{tour.name}</h3>
                      <p className="text-gray-500 text-sm">
                        {tour.locationName} • {tour.type}
                      </p>
                    </div>
                    <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="font-medium">{tour.rating}</span>
                    </div>
                  </div>

                  {/* Tour Info */}
                  <div className="flex items-center gap-4 my-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                      {tour.departureDate}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      {tour.duration}
                    </div>
                  </div>

                  {/* Inclusions Chips */}
                  <div className="flex flex-wrap gap-2 my-4">
                    {tour.inclusions.slice(0, 3).map((inclusion, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                      >
                        {inclusion}
                      </span>
                    ))}
                    {tour.inclusions.length > 3 && (
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        +{tour.inclusions.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Price and Booking */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-2xl font-bold text-red-600">
                          ${tour.price}
                        </span>
                        {tour.originalPrice && (
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            ${tour.originalPrice}
                          </span>
                        )}
                        <p className="text-xs text-gray-500">per person</p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          tour.availableSpots > 5
                            ? "bg-green-100 text-green-800"
                            : tour.availableSpots > 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {tour.availableSpots > 5
                          ? `${tour.availableSpots} spots left`
                          : tour.availableSpots > 0
                            ? `Only ${tour.availableSpots} left`
                            : "Sold out"}
                      </span>
                    </div>
                    <Link href={`/tour-package/${tour.id}`}>
                      <button
                        className={`w-full bg-gradient-to-r from-red-600 to-red-800 text-white font-medium px-6 py-3 rounded-lg hover:from-red-700 hover:to-red-900 transition-all shadow-md hover:shadow-lg ${
                          tour.availableSpots === 0
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={tour.availableSpots === 0}
                      >
                        {tour.availableSpots > 0 ? "Book Tour" : "Sold Out"}
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="my-20 relative">
          {/* Section Heading */}
          <div className="mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold relative inline-block">
              Special Offers
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-red-500 to-red-700 rounded-full"></span>
            </h2>
            <p className="mt-4 text-gray-600 text-lg max-w-2xl">
              Unlock exclusive discounts and limited-time deals on your next
              adventure
            </p>
          </div>

          {/* Offers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                bigOfferTitle: "Save 20%",
                title: "Weekend Special",
                desc: "Book Friday–Sunday & save 20% on all tours.",
                gradient: "from-red-500 to-red-600",
                btnColor: "text-red-600",
                image: "/images/tour1.jpg",
              },
              {
                bigOfferTitle: "15% OFF",
                title: "Group Discount",
                desc: "Travel with 4+ people & enjoy 15% OFF.",
                gradient: "from-blue-500 to-blue-600",
                btnColor: "text-blue-600",
                image: "/images/tour2.jpg",
              },
              {
                bigOfferTitle: "Free Upgrade",
                title: "First-Time Traveler",
                desc: "First-time customers get a complimentary upgrade.",
                gradient: "from-green-500 to-green-600",
                btnColor: "text-green-600",
                image: "/images/tour3.jpg",
              },
            ].map((offer, index) => (
              <div
                key={index}
                className={`relative p-6 rounded-3xl shadow-2xl bg-gradient-to-r ${offer.gradient} text-white overflow-hidden group hover:scale-105 transition-transform duration-300`}
              >
                {/* Decorative Circles */}
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/20 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-white/20 rounded-full animate-pulse"></div>

                {/* Upper Section: Big Title + Tour Image */}
                <div className="flex justify-between items-center mb-6">
                  {/* Big Offer Title */}
                  <h1 className="text-5xl md:text-5xl font-extrabold leading-tight">
                    {offer.bigOfferTitle}
                  </h1>

                  {/* Tour Image */}
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
                <h3 className="text-xl font-semibold mb-4">Search & Select</h3>
                <p className="text-gray-600">
                  Browse our curated collection of tours and find the perfect
                  adventure for your needs.
                </p>
              </div>
              <div className="p-8 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mb-6 mx-auto">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-4">Book & Confirm</h3>
                <p className="text-gray-600">
                  Reserve your tour with our secure booking system and receive
                  instant confirmation.
                </p>
              </div>
              <div className="p-8 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl font-bold mb-6 mx-auto">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-4">Travel & Enjoy</h3>
                <p className="text-gray-600">
                  Join your tour and enjoy an unforgettable experience with
                  expert guides.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 relative">
            Guest Testimonials
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-red-600 rounded-full"></span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-green-50 border rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-yellow-400 text-2xl mb-4">★★★★★</div>
              <p className="text-gray-700 italic mb-6">
                "The Sundarbans tour exceeded all expectations! The guide was
                knowledgeable, and the wildlife sightings were incredible. Will
                definitely return!"
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
                "Our Cox's Bazar tour was magical. The beach was pristine, and
                the local cuisine experience was unforgettable!"
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
                "Sylhet Tea Gardens tour was the perfect getaway. The scenery
                was breathtaking, and learning about tea production was
                fascinating."
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
              Popular Destinations
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-red-600 rounded-full"></span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sundarbans, Bangladesh",
                  desc: "Explore the world's largest mangrove forest and see the majestic Royal Bengal Tiger in its natural habitat.",
                  image: "/images/tour1.jpg",
                },
                {
                  name: "Cox's Bazar, Bangladesh",
                  desc: "Relax on the world's longest natural sea beach and enjoy stunning sunsets over the Bay of Bengal.",
                  image: "/images/tour2.jpg",
                },
                {
                  name: "Sylhet, Bangladesh",
                  desc: "Discover lush tea gardens, stunning waterfalls, and the unique culture of Bangladesh's northeast.",
                  image: "/images/tour3.jpg",
                },
              ].map((destination, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Destination Image */}
                  <div className="h-48 relative">
                    <Image
                      src={destination.image}
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
                      Explore {destination.name.split(",")[0]} →
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
              Why Book Tours With Us?
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></span>
            </h2>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Card 1 */}
              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-red-400 to-red-600 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <span>🌿</span>
                </div>
                <h3 className="font-bold text-xl mb-3">Expert Guides</h3>
                <p className="text-gray-600 leading-relaxed">
                  Knowledgeable local guides with deep understanding of
                  destinations
                </p>
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-red-100 rounded-full opacity-30 group-hover:opacity-50 transition duration-500"></div>
              </div>

              {/* Card 2 */}
              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <span>📍</span>
                </div>
                <h3 className="font-bold text-xl mb-3">Unique Experiences</h3>
                <p className="text-gray-600 leading-relaxed">
                  Curated itineraries that showcase authentic local culture
                </p>
                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-blue-100 rounded-full opacity-30 group-hover:opacity-50 transition duration-500"></div>
              </div>

              {/* Card 3 */}
              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <span>⭐</span>
                </div>
                <h3 className="font-bold text-xl mb-3">Small Groups</h3>
                <p className="text-gray-600 leading-relaxed">
                  Intimate group sizes for personalized attention and better
                  experiences
                </p>
                <div className="absolute -top-8 -left-8 w-24 h-24 bg-green-100 rounded-full opacity-30 group-hover:opacity-50 transition duration-500"></div>
              </div>

              {/* Card 4 */}
              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <span>💰</span>
                </div>
                <h3 className="font-bold text-xl mb-3">Best Value</h3>
                <p className="text-gray-600 leading-relaxed">
                  Competitive pricing with inclusive packages and no hidden fees
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
                  question: "What is the cancellation policy?",
                  answer:
                    "You can cancel your tour reservation free of charge up to 7 days before your departure date. Cancellations within 7 days may incur a fee depending on the tour operator's policy.",
                },
                {
                  question: "What should I bring on the tour?",
                  answer:
                    "We recommend comfortable walking shoes, weather-appropriate clothing, sunscreen, a hat, and a camera. Specific requirements will be detailed in your tour confirmation.",
                },
                {
                  question: "Are meals included in the tour?",
                  answer:
                    "This varies by tour. Some tours include meals while others offer them as optional add-ons. Please check the specific tour details for meal inclusions.",
                },
                {
                  question: "What is the group size for tours?",
                  answer:
                    "Group sizes vary by tour but typically range from 6-15 people for a more personalized experience. Private tours are also available upon request.",
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
                      ▼
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

      <Footer />
    </div>
  );
}
