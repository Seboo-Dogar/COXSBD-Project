"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/Newsletter";
import Image from "next/image";
import LicenseSearchForm from "@/components/license/LicenseSearchForm";
import {
  FaFilter,
  FaChevronDown,
  FaChevronUp,
  FaTimes,
  FaStar,
  FaRegStar,
  FaBookmark,
  FaRegBookmark,
  FaShoppingCart,
  FaInfoCircle,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";

interface License {
  id: number;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  image: string;
  rating: number;
  category: string;
  validity: string;
  processingTime: string;
  isFeatured?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
}

type FilterStep = "category" | "price" | "validity" | "processing" | null;

export default function LicenseSearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [activeFilterStep, setActiveFilterStep] = useState<FilterStep>(null);
  const [savedLicenses, setSavedLicenses] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedValidities, setSelectedValidities] = useState<string[]>([]);
  const [selectedProcessingTimes, setSelectedProcessingTimes] = useState<
    string[]
  >([]);

  const featuredLicenses: License[] = [
    {
      id: 1,
      name: "Business License",
      description:
        "Perfect for entrepreneurs starting or expanding their business.",
      price: "$99/year",
      originalPrice: "$120/year",
      image: "/images/license1.jpg",
      rating: 4.8,
      category: "Business",
      validity: "1 Year",
      processingTime: "3-5 Days",
      isFeatured: true,
    },
    {
      id: 2,
      name: "Software License",
      description: "Covers all your digital product and software usage needs.",
      price: "$49/year",
      originalPrice: "$59/year",
      image: "/images/license1.jpg",
      rating: 4.5,
      category: "Technology",
      validity: "1 Year",
      processingTime: "Instant",
      isPopular: true,
    },
    {
      id: 3,
      name: "Driver's License Renewal",
      description: "Fast and easy license renewal service.",
      price: "$35",
      image: "/images/license1.jpg",
      rating: 4.2,
      category: "Personal",
      validity: "5 Years",
      processingTime: "1-2 Days",
      isNew: true,
    },
    {
      id: 4,
      name: "Food Business License",
      description: "Required for restaurants, cafes, and food vendors.",
      price: "$100/year",
      image: "/images/license1.jpg",
      rating: 4.0,
      category: "Business",
      validity: "1 Year",
      processingTime: "5-7 Days",
    },
    {
      id: 5,
      name: "Health & Safety License",
      description: "Ensures compliance with safety regulations.",
      price: "$75/year",
      image: "/images/license1.jpg",
      rating: 4.3,
      category: "Business",
      validity: "1 Year",
      processingTime: "2-3 Days",
    },
    {
      id: 6,
      name: "Software Developer License",
      description: "Covers all your software development tools and platforms.",
      price: "$89/year",
      image: "/images/license1.jpg",
      rating: 4.7,
      category: "Technology",
      validity: "1 Year",
      processingTime: "Instant",
    },
    {
      id: 7,
      name: "Vehicle Registration",
      description: "Register your vehicle with the local authorities.",
      price: "$50",
      image: "/images/license1.jpg",
      rating: 4.1,
      category: "Personal",
      validity: "1 Year",
      processingTime: "1 Day",
    },
    {
      id: 8,
      name: "Professional Certification",
      description: "Official recognition for professionals in various fields.",
      price: "$200/year",
      image: "/images/license1.jpg",
      rating: 4.6,
      category: "Professional",
      validity: "1 Year",
      processingTime: "7-10 Days",
    },
    {
      id: 9,
      name: "Import/Export License",
      description: "Legal authorization for international trade.",
      price: "$250/year",
      image: "/images/license1.jpg",
      rating: 4.4,
      category: "Business",
      validity: "1 Year",
      processingTime: "10-14 Days",
    },
  ];

  // Filter options
  const categories = [
    ...new Set(featuredLicenses.map((license) => license.category)),
  ];
  const priceRanges = [
    { id: "under50", label: "Under $50" },
    { id: "50-100", label: "$50 - $100" },
    { id: "100-200", label: "$100 - $200" },
    { id: "over200", label: "Over $200" },
  ];
  const validityOptions = [
    ...new Set(featuredLicenses.map((license) => license.validity)),
  ];
  const processingTimeOptions = [
    ...new Set(featuredLicenses.map((license) => license.processingTime)),
  ];

  // Toggle filter selections
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const togglePriceRange = (range: string) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
  };

  const toggleValidity = (validity: string) => {
    setSelectedValidities((prev) =>
      prev.includes(validity)
        ? prev.filter((v) => v !== validity)
        : [...prev, validity]
    );
  };

  const toggleProcessingTime = (time: string) => {
    setSelectedProcessingTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceRanges([]);
    setSelectedValidities([]);
    setSelectedProcessingTimes([]);
  };

  // Filter licenses based on search and filters
  const filteredLicenses = featuredLicenses.filter((license) => {
    const matchesSearch =
      license.name.toLowerCase().includes(query.toLowerCase()) ||
      license.description.toLowerCase().includes(query.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(license.category);

    const matchesPrice =
      selectedPriceRanges.length === 0 ||
      selectedPriceRanges.some((range) => {
        const price = parseFloat(license.price.replace(/[^0-9.]/g, ""));
        switch (range) {
          case "under50":
            return price < 50;
          case "50-100":
            return price >= 50 && price <= 100;
          case "100-200":
            return price > 100 && price <= 200;
          case "over200":
            return price > 200;
          default:
            return true;
        }
      });

    const matchesValidity =
      selectedValidities.length === 0 ||
      selectedValidities.includes(license.validity);

    const matchesProcessingTime =
      selectedProcessingTimes.length === 0 ||
      selectedProcessingTimes.includes(license.processingTime);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPrice &&
      matchesValidity &&
      matchesProcessingTime
    );
  });

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) =>
        i < Math.floor(rating) ||
        (i === Math.floor(rating) && rating % 1 >= 0.5) ? (
          <FaStar key={i} className="text-yellow-400" />
        ) : (
          <FaRegStar key={i} className="text-yellow-400" />
        )
      );
  };

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow">
          <section className="py-8">
            <div className="container mx-auto px-4">
              <LicenseSearchForm className="max-w-2xl mx-auto" />

              <div className="flex flex-col lg:flex-row gap-8 mt-12">
                {/* Filters Sidebar - Mobile Toggle */}
                <button
                  onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                  className="lg:hidden flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  <FaFilter /> Filters
                </button>

                {/* Filters Sidebar */}
                <div
                  className={`lg:w-1/4 ${mobileFiltersOpen ? "block" : "hidden"} lg:block`}
                >
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-4">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-bold flex items-center gap-2">
                        <FaFilter /> Filters
                      </h2>
                      {(selectedCategories.length > 0 ||
                        selectedPriceRanges.length > 0 ||
                        selectedValidities.length > 0 ||
                        selectedProcessingTimes.length > 0) && (
                        <button
                          onClick={clearFilters}
                          className="text-sm text-blue-600 flex items-center gap-1"
                        >
                          <FaTimes /> Clear all
                        </button>
                      )}
                    </div>

                    {/* Category Filter */}
                    <div className="mb-6">
                      <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() =>
                          setActiveFilterStep(
                            activeFilterStep === "category" ? null : "category"
                          )
                        }
                      >
                        <h3 className="font-medium">Category</h3>
                        {activeFilterStep === "category" ? (
                          <FaChevronUp />
                        ) : (
                          <FaChevronDown />
                        )}
                      </div>
                      {activeFilterStep === "category" && (
                        <div className="mt-3 space-y-2">
                          {categories.map((category) => (
                            <div key={category} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`category-${category}`}
                                checked={selectedCategories.includes(category)}
                                onChange={() => toggleCategory(category)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <label
                                htmlFor={`category-${category}`}
                                className="ml-2 text-sm text-gray-700"
                              >
                                {category}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Price Range Filter */}
                    <div className="mb-6">
                      <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() =>
                          setActiveFilterStep(
                            activeFilterStep === "price" ? null : "price"
                          )
                        }
                      >
                        <h3 className="font-medium">Price Range</h3>
                        {activeFilterStep === "price" ? (
                          <FaChevronUp />
                        ) : (
                          <FaChevronDown />
                        )}
                      </div>
                      {activeFilterStep === "price" && (
                        <div className="mt-3 space-y-2">
                          {priceRanges.map((range) => (
                            <div key={range.id} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`price-${range.id}`}
                                checked={selectedPriceRanges.includes(range.id)}
                                onChange={() => togglePriceRange(range.id)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <label
                                htmlFor={`price-${range.id}`}
                                className="ml-2 text-sm text-gray-700"
                              >
                                {range.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Validity Filter */}
                    <div className="mb-6">
                      <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() =>
                          setActiveFilterStep(
                            activeFilterStep === "validity" ? null : "validity"
                          )
                        }
                      >
                        <h3 className="font-medium">Validity</h3>
                        {activeFilterStep === "validity" ? (
                          <FaChevronUp />
                        ) : (
                          <FaChevronDown />
                        )}
                      </div>
                      {activeFilterStep === "validity" && (
                        <div className="mt-3 space-y-2">
                          {validityOptions.map((validity) => (
                            <div key={validity} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`validity-${validity}`}
                                checked={selectedValidities.includes(validity)}
                                onChange={() => toggleValidity(validity)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <label
                                htmlFor={`validity-${validity}`}
                                className="ml-2 text-sm text-gray-700"
                              >
                                {validity}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Processing Time Filter */}
                    <div className="mb-6">
                      <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() =>
                          setActiveFilterStep(
                            activeFilterStep === "processing"
                              ? null
                              : "processing"
                          )
                        }
                      >
                        <h3 className="font-medium">Processing Time</h3>
                        {activeFilterStep === "processing" ? (
                          <FaChevronUp />
                        ) : (
                          <FaChevronDown />
                        )}
                      </div>
                      {activeFilterStep === "processing" && (
                        <div className="mt-3 space-y-2">
                          {processingTimeOptions.map((time) => (
                            <div key={time} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`processing-${time}`}
                                checked={selectedProcessingTimes.includes(time)}
                                onChange={() => toggleProcessingTime(time)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <label
                                htmlFor={`processing-${time}`}
                                className="ml-2 text-sm text-gray-700"
                              >
                                {time}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="lg:w-3/4">
                  <h2 className="text-2xl font-bold mb-6">
                    {query
                      ? `Search Results for "${query}"`
                      : "Featured Licenses"}
                  </h2>

                  {filteredLicenses.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">
                        No licenses found matching your criteria
                      </p>
                      <button
                        onClick={clearFilters}
                        className="mt-4 text-blue-600 hover:underline"
                      >
                        Clear all filters
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6">
                      {filteredLicenses.map((license) => (
                        <div
                          key={license.id}
                          className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col lg:flex-row"
                        >
                          {/* Image */}
                          <div className="relative lg:w-1/3 h-48 lg:h-auto bg-gray-100">
                            <Image
                              src={license.image}
                              alt={license.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 1024px) 100vw, 33vw"
                            />

                            {/* Badges */}
                            <div className="absolute top-3 left-3 flex gap-2">
                              {license.isFeatured && (
                                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                                  Featured
                                </span>
                              )}
                              {license.isPopular && (
                                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                                  Popular
                                </span>
                              )}
                              {license.isNew && (
                                <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                                  New
                                </span>
                              )}
                            </div>

                            {/* Save button */}
                            <button
                              onClick={() =>
                                setSavedLicenses((prev) =>
                                  prev.includes(license.id)
                                    ? prev.filter((id) => id !== license.id)
                                    : [...prev, license.id]
                                )
                              }
                              className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                            >
                              {savedLicenses.includes(license.id) ? (
                                <FaBookmark className="text-red-600" />
                              ) : (
                                <FaRegBookmark className="text-gray-600" />
                              )}
                            </button>
                          </div>

                          {/* Content */}
                          <div className="p-5 flex flex-col flex-1">
                            <h3 className="text-xl font-bold flex items-center">
                              {license.name}
                              <MdVerified className="ml-1 text-blue-500" />
                            </h3>

                            {/* Rating */}
                            <div className="flex items-center my-3">
                              <div className="flex mr-2">
                                {renderStars(license.rating)}
                              </div>
                              <span className="text-sm text-gray-600">
                                {license.rating.toFixed(1)}
                              </span>
                            </div>

                            <p className="text-gray-600 mb-4 flex-grow">
                              {license.description}
                            </p>

                            {/* Price */}
                            <div className="mb-4">
                              {license.originalPrice ? (
                                <div className="flex items-baseline gap-2">
                                  <span className="text-2xl font-bold text-blue-600">
                                    {license.price}
                                  </span>
                                  <span className="text-gray-400 line-through">
                                    {license.originalPrice}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-2xl font-bold text-blue-600">
                                  {license.price}
                                </span>
                              )}
                            </div>

                            {/* Quick info */}
                            <div className="flex flex-wrap gap-3 mb-5 text-sm text-gray-600">
                              <span>
                                <FaInfoCircle className="inline mr-1 text-blue-500" />{" "}
                                {license.validity}
                              </span>
                              <span>
                                <FaInfoCircle className="inline mr-1 text-blue-500" />{" "}
                                {license.processingTime}
                              </span>
                            </div>

                            {/* Action button */}
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                              <FaShoppingCart /> Apply Now
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
      <NewsletterSignup /><br /><br />
      <Footer />
    </>
  );
}
