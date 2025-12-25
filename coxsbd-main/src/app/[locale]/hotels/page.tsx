"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/Newsletter";
import Image from "next/image";
import HotelSearchForm from "@/components/hotel/HotelSearchForm";
import { FaStar, FaRegStar } from "react-icons/fa";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation"; // Added for better search integration

export default function HotelPage() {
  // 1. UPDATED HOTEL TYPE: Added hotel-specific properties and removed car/plane properties.
  type Hotel = {
    _id?: string;
    id: number; // Used for Link href
    name: string;
    description: string; // Added
    location: string; // Added
    amenities: string[]; // Added
    rooms: number; // Added
    price: string;
    numericPrice: number;
    originalPrice?: string;
    discount?: string;
    img: string;
    rating: number;
    reviews: number;
    category: string;
    // Removed: model, year, features, seats, available
  };

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategory, setFilteredCategory] = useState<string>("All");

  // State to hold the filtered list, initialized to [] to fix the .slice() error
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);

  const searchParams = useSearchParams();

  // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        // Ensure the API path is correct based on your file structure (e.g., /api/hotels)
        const apiPath = process.env.NEXT_PUBLIC_API_URL || "";
        const res = await fetch(`${apiPath}/hotels`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to fetch hotels");
        
        const data: Hotel[] = await res.json();
        
        // Ensure hotel data has the required 'id' and 'description' fields from the backend
        const completeData: Hotel[] = data.map(item => ({
             ...item,
             id: item.id || 0, // Fallback if backend ID is missing
             description: item.description || "A wonderful place to stay.", // Fallback
             location: item.location || "Unknown Location", // Fallback
             amenities: item.amenities || [], // Fallback
             rooms: item.rooms || 1, // Fallback
             img: item.img || "/images/hotel.jpg" // Fallback
        }));

        setHotels(completeData);

        // Pre-filter based on URL search query if needed
        const urlSearch = searchParams.get('q') || '';
        setSearchQuery(urlSearch);

      } catch (error) {
        console.error("Error fetching hotels:", error);
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [searchParams]);

  // --- Filtering Effect ---
  useEffect(() => {
    // This effect runs whenever hotels, searchQuery, or filteredCategory changes
    const newFilteredHotels = hotels
      .filter((hotel) =>
        filteredCategory === "All" ? true : hotel.category === filteredCategory
      )
      .filter(
        (hotel) =>
          hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hotel.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    setFilteredHotels(newFilteredHotels);
  }, [hotels, searchQuery, filteredCategory]);

  const viewHotelDetails = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setShowDetailModal(true);
  };

  const closeModal = () => {
    setShowDetailModal(false);
    setSelectedHotel(null);
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-medium text-gray-600">Loading hotels...</p>
      </div>
    );
  }

  // Use filteredHotels here, which is guaranteed to be an array
  if (filteredHotels.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-600 mb-2">
          No hotels available
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
            src="/images/hotel-logo.jpg"
            alt="Hotel Image"
            width={120}
            height={120}
            className="rounded-md object-cover mb-6"
          />
          <h1 className="text-2xl md:text-2xl font-bold mb-2">
            Find Your Perfect{" "}
            <span className="text-red-600 text-3xl">Hotel Stay</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing accommodations for your next trip with premium
            amenities and great deals
          </p>
        </div>

        {/* Search Form */}
        <div className="mb-12">
          <HotelSearchForm 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredCategory={filteredCategory}
            setFilteredCategory={setFilteredCategory}
            categories={Array.from(new Set(hotels.map(h => h.category)))} // Pass unique categories
          />
        </div>

        {/* Featured Hotels */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Featured Hotels ({filteredHotels.length})
              </h2>
              <p className="text-gray-600">
                Top-rated accommodations with special deals
              </p>
            </div>
            <button className="text-white bg-red-600 hover:bg-red-700 transition-colors rounded-xl px-4 py-2 font-medium">
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* THIS IS THE LINE THAT WAS CAUSING THE ERROR IF filteredHotels WAS UNDEFINED: Now fixed by initialization */}
            {filteredHotels.map((hotel) => (
              <div
                key={hotel.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group border border-gray-100"
              >
                {/* Image with badge */}
                <Link href={`/hotels/${hotel.id}`}>
                  <div className="relative w-full h-64">
                    <Image
                      src={hotel.img} // Use hotel.img
                      alt={hotel.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority
                    />
                  </div>

                  {hotel.discount && (
                    <div className="absolute top-4 right-4 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {hotel.discount}
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white text-sm font-medium px-2 py-1 rounded">
                    {hotel.category}
                  </div>
                </Link>

                {/* Hotel details */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold">{hotel.name}</h3>
                      <p className="text-gray-500 text-sm">{hotel.location}</p>
                    </div>
                    <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="font-medium">{hotel.rating}</span>
                      <span className="text-xs text-gray-500 ml-1">
                        ({hotel.reviews})
                      </span>
                    </div>
                  </div>

                  {/* Amenities chips */}
                  <div className="flex flex-wrap gap-2 my-4">
                    {/* Ensure amenities is an array before calling slice */}
                    {Array.isArray(hotel.amenities) && hotel.amenities.slice(0, 3).map((amenity, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                      >
                        {amenity}
                      </span>
                    ))}
                    {Array.isArray(hotel.amenities) && hotel.amenities.length > 3 && (
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        +{hotel.amenities.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Price and CTA */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-2xl font-bold text-red-600">
                          {hotel.price}
                        </span>
                        {hotel.originalPrice && (
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            {hotel.originalPrice}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {hotel.rooms} rooms
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => viewHotelDetails(hotel)}
                        className="flex-1 border border-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                      >
                        Details
                      </button>
                      <Link href={`/hotels/${hotel.id}`}>
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

        {/* The rest of your component (Special Offers, How It Works, Testimonials, Top Destinations, FAQ, Newsletter) remains the same */}

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
                image: "/images/hotel.jpg",
              },
              {
                bigOfferTitle: "15% OFF",
                title: "Long-Distance Discount",
                desc: "Fly 1000+ miles & enjoy 15% OFF.",
                gradient: "from-blue-500 to-blue-600",
                btnColor: "text-blue-600",
                image: "/images/hotel.jpg",
              },
              {
                bigOfferTitle: "Free Upgrade",
                title: "First-Time Flyer",
                desc: "First-time customers get a complimentary upgrade.",
                gradient: "from-green-500 to-green-600",
                btnColor: "text-green-600",
                image: "/images/hotel.jpg",
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
                <h3 className="text-xl font-semibold mb-4">Search & Select</h3>
                <p className="text-gray-600">
                  Browse our curated collection of hotels and find the perfect
                  accommodation for your needs.
                </p>
              </div>
              <div className="p-8 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mb-6 mx-auto">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-4">Book & Confirm</h3>
                <p className="text-gray-600">
                  Reserve your room with our secure booking system and receive
                  instant confirmation.
                </p>
              </div>
              <div className="p-8 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl font-bold mb-6 mx-auto">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-4">Check In & Enjoy</h3>
                <p className="text-gray-600">
                  Arrive at your hotel and enjoy a comfortable stay with all the
                  amenities you need.
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
                "The Grand Plaza exceeded all expectations! The room was
                spacious, clean, and the staff was incredibly helpful. Will
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
                "Our stay at Beachside Resort was magical. Waking up to ocean
                views and having direct beach access made our vacation perfect!"
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
                "Mountain View Lodge was the perfect winter getaway. Cozy rooms,
                friendly staff, and the ski-in/ski-out access was incredibly
                convenient."
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
              Popular Hotels
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-red-600 rounded-full"></span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "The Plaza Hotel, New York",
                  desc: "Experience luxury in the heart of Manhattan with world-class dining and amenities.",
                  image: "/images/hotel-destination.jpg",
                },
                {
                  name: "Fontainebleau, Miami",
                  desc: "Stay beachfront in Miami with stunning ocean views and vibrant nightlife.",
                  image: "/images/hotel-beach.jpg",
                },
                {
                  name: "Beverly Hills Hotel, LA",
                  desc: "Classic Hollywood glamour meets modern comfort in Beverly Hills.",
                  image: "/images/hotel-mountain.jpg",
                },
              ].map((hotel, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Hotel Image */}
                  <div className="h-48 relative">
                    <Image
                      src={hotel.image}
                      alt={hotel.name}
                      fill
                      className="object-cover rounded-t-2xl"
                      priority
                    />
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">{hotel.name}</h3>
                    <p className="text-gray-600 mb-4">{hotel.desc}</p>
                    <button className="text-red-600 font-medium hover:text-red-700 transition-colors">
                      Book {hotel.name.split(",")[0]} →
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
              Why Book Hotels With Us?
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></span>
            </h2>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Card 1 */}
              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-red-400 to-red-600 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <i className="fas fa-concierge-bell"></i>
                </div>
                <h3 className="font-bold text-xl mb-3">Luxury Stays</h3>
                <p className="text-gray-600 leading-relaxed">
                  Handpicked 5-star hotels with premium amenities and comfort
                </p>
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-red-100 rounded-full opacity-30 group-hover:opacity-50 transition duration-500"></div>
              </div>

              {/* Card 2 */}
              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <h3 className="font-bold text-xl mb-3">Prime Locations</h3>
                <p className="text-gray-600 leading-relaxed">
                  Stay at the heart of top cities, near attractions and
                  nightlife
                </p>
                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-blue-100 rounded-full opacity-30 group-hover:opacity-50 transition duration-500"></div>
              </div>

              {/* Card 3 */}
              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <i className="fas fa-star"></i>
                </div>
                <h3 className="font-bold text-xl mb-3">Verified Reviews</h3>
                <p className="text-gray-600 leading-relaxed">
                  Genuine guest reviews so you always know what to expect
                </p>
                <div className="absolute -top-8 -left-8 w-24 h-24 bg-green-100 rounded-full opacity-30 group-hover:opacity-50 transition duration-500"></div>
              </div>

              {/* Card 4 */}
              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <i className="fas fa-tag"></i>
                </div>
                <h3 className="font-bold text-xl mb-3">Best Price Guarantee</h3>
                <p className="text-gray-600 leading-relaxed">
                  Competitive rates with exclusive hotel deals & discounts
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
                    "You can cancel your reservation free of charge up to 48 hours before your check-in date. Cancellations within 48 hours may incur a fee equivalent to one night's stay.",
                },
                {
                  question: "Are breakfast and other meals included?",
                  answer:
                    "This varies by property. Some hotels include breakfast in the room rate, while others offer it as an optional add-on. Please check the specific hotel details for meal inclusions.",
                },
                {
                  question: "Is there a minimum stay requirement?",
                  answer:
                    "Some hotels may have minimum stay requirements, especially during peak seasons or special events. These requirements will be clearly displayed during the booking process.",
                },
                {
                  question: "Can I request a specific room or floor?",
                  answer:
                    "Yes, you can add special requests during the booking process. While we can't guarantee specific room assignments, hotels will do their best to accommodate your preferences.",
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

      {/* Hotel Detail Modal */}
      {showDetailModal && selectedHotel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">{selectedHotel.name}</h2>
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
                      src={selectedHotel.img}
                      alt={selectedHotel.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="md:w-1/2">
                  <div className="flex items-center mb-4">
                    <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="font-medium">
                        {selectedHotel.rating}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">
                        ({selectedHotel.reviews} reviews)
                      </span>
                    </div>
                    <span className="ml-3 bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                      {selectedHotel.category}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4">{selectedHotel.location}</p>
                  <p className="text-gray-600 mb-4">
                    {selectedHotel.description}
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold text-red-600">
                          {selectedHotel.price}
                        </p>
                        {selectedHotel.originalPrice && (
                          <p className="text-gray-500 line-through">
                            {selectedHotel.originalPrice}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 mt-1">
                          Including taxes and fees
                        </p>
                      </div>
                      <button className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition">
                        Book Now
                      </button>
                    </div>
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
