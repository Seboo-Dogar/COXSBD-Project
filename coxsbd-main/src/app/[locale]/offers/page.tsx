"use client";

import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NewsletterSignup from "@/components/Newsletter";
import {
  FaStar,
  FaRegStar,
  FaShoppingCart,
  FaFire,
  FaTag,
  FaClock,
  FaRocket,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import OffersSearchForm from "@/components/offers/OffersSearchForm";
import { categories } from "../ecommerce/data";

interface License {
  _id?: string;
  id?: number;
  title: string;
  name?: string;
  description: string;
  price: string;
  originalPrice?: string;
  image: string;
  rating: number;
  isFeatured?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  validity?: string;
  processingTime?: string;
  requirements?: string[];
  features: { text: string; icon: JSX.Element }[];
  bestFor?: string;
  discount?: string | number;
  category?: string;
  badge?: string;
  duration?: string;
}

export default function LicensesPage() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedLicenses, setSavedLicenses] = useState<string[]>([]);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const toggleSaved = (id: string) => {
    setSavedLicenses((prev) =>
      prev.includes(id) ? prev.filter((lid) => lid !== id) : [...prev, id]
    );
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

  const filteredOffers = licenses
    .filter((offer) =>
      activeCategory === "All" ? true : offer.category === activeCategory
    )
    .filter((offer) =>
      offer.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/licenses`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch licenses");
        const data: License[] = await res.json();
        setLicenses(data);
      } catch (err) {
        console.error("Error fetching licenses:", err);
        setError("Unable to load licenses. Please try again later.");
        setLicenses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLicenses();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-medium text-gray-600">Loading licenses...</p>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-8 text-red-600">
        {error}
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center"
          >
            <Image
              src="/images/offers-logo.png"
              alt="Offers Logo"
              width={100}
              height={100}
              className="rounded-md object-cover mb-4"
            />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Special{" "}
              <span className="text-yellow-300">Offers & Discounts</span>
            </h1>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Limited-time deals on our most popular services. Don't miss out on
              these exclusive offers!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <OffersSearchForm onSearch={setSearchQuery} />
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  activeCategory === category
                    ? "bg-red-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Banner */}
      <section className="py-12 bg-gradient-to-r from-red-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                icon: <FaTag className="w-8 h-8" />,
                text: "Best Prices",
                desc: "Guaranteed lowest rates",
              },
              {
                icon: <FaClock className="w-8 h-8" />,
                text: "24/7 Support",
                desc: "Always available",
              },
              {
                icon: <FaShieldAlt className="w-8 h-8" />,
                text: "Secure Payment",
                desc: "Safe transactions",
              },
              {
                icon: <FaRocket className="w-8 h-8" />,
                text: "Fast Delivery",
                desc: "Quick turnaround",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <div className="text-red-600 mb-4">{item.icon}</div>
                <span className="font-bold text-gray-800">{item.text}</span>
                <span className="text-sm text-gray-600">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offers Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                Our Special Offers
              </h2>
              <p className="text-gray-600 mt-2">
                {filteredOffers.length} offers available in{" "}
                {activeCategory === "All" ? "all categories" : activeCategory}
              </p>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Sort by:</span>
              <select className="border rounded-lg px-3 py-2">
                <option>Most Popular</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Highest Rated</option>
              </select>
            </div>
          </div>

          {filteredOffers.length === 0 ? (
            <div className="text-center py-12">
              <FaFire className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600">
                No offers found
              </h3>
              <p className="text-gray-500 mt-2">
                Try a different search or category
              </p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredOffers.map((offer, index) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group border border-gray-100"
                >
                  {/* Offer Image with Badge */}
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-r from-red-100 to-orange-100 flex items-center justify-center">
                      <FaShoppingCart className="w-16 h-16 text-red-300" />
                    </div>
                    {offer.badge && (
                      <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {offer.badge}
                      </div>
                    )}
                    {offer.category && (
                      <div className="absolute top-4 left-4 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                        {offer.category}
                      </div>
                    )}
                  </div>

                  {/* Offer Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-bold text-gray-800 group-hover:text-red-600 transition-colors line-clamp-1">
                        {offer.title}
                      </h2>
                      {offer.discount && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {offer.discount}
                        </span>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center mb-3">
                      <div className="flex mr-2">
                        {renderStars(offer.rating)}
                      </div>
                      <span className="text-sm text-gray-600">
                        {offer.rating.toFixed(1)}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {offer.description}
                    </p>

                    {/* Features List */}
                    <ul className="mb-6 space-y-2">
                      {offer.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          {feature.icon || (
                            <FaCheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                          )}
                          <span className="text-gray-700 line-clamp-1">
                            {feature.text}
                          </span>
                        </li>
                      ))}
                      {offer.features.length > 3 && (
                        <li className="text-sm text-gray-500">
                          + {offer.features.length - 3} more features
                        </li>
                      )}
                    </ul>

                    {/* Price and CTA */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <span className="text-2xl font-bold text-red-600">
                            {offer.price}
                          </span>
                          {offer.originalPrice && (
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              {offer.originalPrice}
                            </span>
                          )}
                        </div>
                        {offer.duration && (
                          <span className="text-xs text-gray-500 flex items-center">
                            <FaClock className="mr-1" /> {offer.duration}
                          </span>
                        )}
                      </div>

                      <Link href={`/offers/${offer.id}`}>
                        <button className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white font-medium px-6 py-3 rounded-lg hover:from-red-700 hover:to-red-900 transition-all shadow-md hover:shadow-lg flex items-center justify-center">
                          <FaShoppingCart className="mr-2" /> Get This Offer
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contact us for custom quotes and personalized offers tailored to
            your specific needs.
          </p>
          <button className="bg-white text-red-600 font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
            Request Custom Quote
          </button>
        </div>
      </section>

      <NewsletterSignup />
      <br />
      <br />
      <Footer />
    </div>
  );
}
