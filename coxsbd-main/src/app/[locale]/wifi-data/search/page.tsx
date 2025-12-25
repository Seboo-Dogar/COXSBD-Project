"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/Newsletter";
import WifiDataSearchForm from "@/components/wifi-data/WifidataSearchForm";
import {
  FaWifi,
  FaBolt,
  FaClock,
  FaDatabase,
  FaShoppingCart,
  FaInfoCircle,
  FaFilter,
  FaChevronDown,
  FaChevronUp,
  FaTimes,
} from "react-icons/fa";
import { IoMdSpeedometer } from "react-icons/io";
import { GiDiceTarget } from "react-icons/gi";

interface WifiPlan {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  dataLimit: string;
  validity: string;
  speed?: string;
  features: string[];
  bestFor: string;
  popularity?: number;
  category?: string;
}

const mockWifiPlans: WifiPlan[] = [
  {
    id: 1,
    name: "Unlimited 4G Plan",
    price: 25,
    originalPrice: 30,
    discount: 17,
    dataLimit: "Unlimited",
    validity: "30 days",
    speed: "50 Mbps",
    features: ["HD Streaming", "Unlimited Calls", "5G Ready"],
    bestFor: "Heavy users",
    popularity: 4.8,
    category: "unlimited",
  },
  {
    id: 2,
    name: "Basic 3GB Plan",
    price: 10,
    dataLimit: "3GB",
    validity: "7 days",
    speed: "20 Mbps",
    features: ["Social Media", "Email", "Light Browsing"],
    bestFor: "Casual users",
    popularity: 3.9,
    category: "basic",
  },
  {
    id: 3,
    name: "Family Pack 10GB",
    price: 40,
    originalPrice: 50,
    discount: 20,
    dataLimit: "10GB",
    validity: "30 days",
    speed: "100 Mbps",
    features: ["4 Devices", "Parental Controls", "Shared Data"],
    bestFor: "Families",
    popularity: 4.5,
    category: "family",
  },
  {
    id: 4,
    name: "Weekend Special 5GB",
    price: 15,
    dataLimit: "5GB",
    validity: "3 days",
    speed: "75 Mbps",
    features: ["Weekend Only", "High Speed", "Short Term"],
    bestFor: "Weekenders",
    popularity: 4.2,
    category: "special",
  },
  {
    id: 5,
    name: "Student 2GB Plan",
    price: 8,
    dataLimit: "2GB",
    validity: "7 days",
    speed: "15 Mbps",
    features: ["Student Discount", "Educational Sites", "Budget Friendly"],
    bestFor: "Students",
    popularity: 4.0,
    category: "student",
  },
  {
    id: 6,
    name: "Premium 50GB Plan",
    price: 60,
    originalPrice: 75,
    discount: 20,
    dataLimit: "50GB",
    validity: "30 days",
    speed: "200 Mbps",
    features: ["Priority Network", "4K Streaming", "Gaming Optimized"],
    bestFor: "Power users",
    popularity: 4.9,
    category: "premium",
  },
];

const priceRanges = [
  { id: 1, label: "Under $10", min: 0, max: 10 },
  { id: 2, label: "$10 - $20", min: 10, max: 20 },
  { id: 3, label: "$20 - $30", min: 20, max: 30 },
  { id: 4, label: "Over $30", min: 30, max: Infinity },
];

const validityOptions = [
  { id: 1, label: "1-7 days", value: "7 days" },
  { id: 2, label: "2-4 weeks", value: "30 days" },
  { id: 3, label: "Short term", value: "3 days" },
];

const speedOptions = [
  { id: 1, label: "Basic (<50 Mbps)", value: 50 },
  { id: 2, label: "Fast (50-100 Mbps)", value: 100 },
  { id: 3, label: "Ultra Fast (100+ Mbps)", value: 101 },
];

export default function WifiDataSearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  // Filter states
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<number[]>([]);
  const [selectedValidities, setSelectedValidities] = useState<string[]>([]);
  const [selectedSpeeds, setSelectedSpeeds] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [activeFilterStep, setActiveFilterStep] = useState<string | null>(null);

  // Filter the plans based on all criteria
  const filteredPlans = mockWifiPlans.filter((plan) => {
    // Text search filter
    const matchesSearch = q
      ? plan.name.toLowerCase().includes(q.toLowerCase())
      : true;

    // Price range filter
    const matchesPrice =
      selectedPriceRanges.length === 0 ||
      selectedPriceRanges.some((rangeId) => {
        const range = priceRanges.find((r) => r.id === rangeId);
        return range && plan.price >= range.min && plan.price <= range.max;
      });

    // Validity filter
    const matchesValidity =
      selectedValidities.length === 0 ||
      selectedValidities.includes(plan.validity);

    // Speed filter
    const matchesSpeed =
      selectedSpeeds.length === 0 ||
      selectedSpeeds.some((speedId) => {
        const speed = speedOptions.find((s) => s.id === speedId);
        if (!speed || !plan.speed) return false;
        const planSpeed = parseInt(plan.speed.split(" ")[0]);

        if (speedId === 1) return planSpeed < 50;
        if (speedId === 2) return planSpeed >= 50 && planSpeed < 100;
        if (speedId === 3) return planSpeed >= 100;
        return false;
      });

    // Category filter
    const matchesCategory =
      selectedCategories.length === 0 ||
      (plan.category && selectedCategories.includes(plan.category));

    return (
      matchesSearch &&
      matchesPrice &&
      matchesValidity &&
      matchesSpeed &&
      matchesCategory
    );
  });

  // Toggle price range selection
  const togglePriceRange = (rangeId: number) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(rangeId)
        ? prev.filter((id) => id !== rangeId)
        : [...prev, rangeId]
    );
  };

  // Toggle validity selection
  const toggleValidity = (validity: string) => {
    setSelectedValidities((prev) =>
      prev.includes(validity)
        ? prev.filter((v) => v !== validity)
        : [...prev, validity]
    );
  };

  // Toggle speed selection
  const toggleSpeed = (speedId: number) => {
    setSelectedSpeeds((prev) =>
      prev.includes(speedId)
        ? prev.filter((id) => id !== speedId)
        : [...prev, speedId]
    );
  };

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedPriceRanges([]);
    setSelectedValidities([]);
    setSelectedSpeeds([]);
    setSelectedCategories([]);
  };

  // Get unique categories from plans
  const categories = Array.from(
    new Set(
      mockWifiPlans.map((plan) => plan.category).filter(Boolean)
    ) as unknown as string[]
  );

  return (
    <>
      <Header />
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <WifiDataSearchForm />
        </div>
      </div>

      <main className="max-w-8xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="lg:hidden flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg mb-4 w-full justify-center"
          >
            <FaFilter /> {mobileFiltersOpen ? "Hide Filters" : "Show Filters"}
            {selectedPriceRanges.length +
              selectedValidities.length +
              selectedSpeeds.length +
              selectedCategories.length >
              0 && (
              <span className="bg-white text-blue-600 rounded-full h-5 w-5 flex items-center justify-center text-xs">
                {selectedPriceRanges.length +
                  selectedValidities.length +
                  selectedSpeeds.length +
                  selectedCategories.length}
              </span>
            )}
          </button>

          {/* Filters Sidebar */}
          {/* Filters Sidebar */}
          <div
            className={`lg:w-1/4 ${mobileFiltersOpen ? "block" : "hidden"} lg:block`}
          >
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-4 space-y-12">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <FaFilter /> Filters
                </h2>
                {(selectedPriceRanges.length > 0 ||
                  selectedValidities.length > 0 ||
                  selectedSpeeds.length > 0 ||
                  selectedCategories.length > 0) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 flex items-center gap-1"
                  >
                    <FaTimes /> Clear all
                  </button>
                )}
              </div>

              {/* Price Range Filter */}
              <div>
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() =>
                    setActiveFilterStep(
                      activeFilterStep === "price" ? null : "price"
                    )
                  }
                >
                  <h3 className="font-medium flex items-center gap-2">
                    <GiDiceTarget /> Price Range
                  </h3>
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
              <div>
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() =>
                    setActiveFilterStep(
                      activeFilterStep === "validity" ? null : "validity"
                    )
                  }
                >
                  <h3 className="font-medium flex items-center gap-2">
                    <FaClock /> Validity
                  </h3>
                  {activeFilterStep === "validity" ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </div>
                {activeFilterStep === "validity" && (
                  <div className="mt-3 space-y-2">
                    {validityOptions.map((option) => (
                      <div key={option.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`validity-${option.id}`}
                          checked={selectedValidities.includes(option.value)}
                          onChange={() => toggleValidity(option.value)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`validity-${option.id}`}
                          className="ml-2 text-sm text-gray-700"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Speed Filter */}
              <div>
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() =>
                    setActiveFilterStep(
                      activeFilterStep === "speed" ? null : "speed"
                    )
                  }
                >
                  <h3 className="font-medium flex items-center gap-2">
                    <IoMdSpeedometer /> Speed
                  </h3>
                  {activeFilterStep === "speed" ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </div>
                {activeFilterStep === "speed" && (
                  <div className="mt-3 space-y-2">
                    {speedOptions.map((option) => (
                      <div key={option.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`speed-${option.id}`}
                          checked={selectedSpeeds.includes(option.id)}
                          onChange={() => toggleSpeed(option.id)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`speed-${option.id}`}
                          className="ml-2 text-sm text-gray-700"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Category Filter */}
              <div>
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() =>
                    setActiveFilterStep(
                      activeFilterStep === "category" ? null : "category"
                    )
                  }
                >
                  <h3 className="font-medium flex items-center gap-2">
                    <FaWifi /> Plan Type
                  </h3>
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
                          className="ml-2 text-sm text-gray-700 capitalize"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Plans List */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">
                {q ? (
                  <>
                    Search results for:{" "}
                    <span className="text-blue-600">&quot;{q}&quot;</span>
                  </>
                ) : (
                  <>
                    Our <span className="text-blue-600">WiFi Data</span> Plans
                  </>
                )}
              </h1>
              <p className="text-gray-600">
                {filteredPlans.length}{" "}
                {filteredPlans.length === 1 ? "plan" : "plans"} found
              </p>
            </div>
            <p className="text-gray-600 mb-8">
              Choose the perfect plan for your needs
            </p>

            {filteredPlans.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-700">
                  No plans match your filters
                </h3>
                <p className="text-gray-500 mt-2">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                      {/* Plan Header */}
                      <div className="lg:col-span-3 bg-gradient-to-br from-blue-50 to-blue-100 p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                              <FaWifi className="text-blue-600 text-xl" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">
                              {plan.name}
                            </h2>
                          </div>
                          <p className="text-gray-600 text-sm mb-4">
                            {plan.bestFor}
                          </p>
                        </div>

                        {/* Price Section */}
                        <div>
                          <div className="flex items-end gap-2 mb-1">
                            <span className="text-3xl font-bold text-blue-600">
                              ${plan.price}
                            </span>
                            {plan.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                ${plan.originalPrice}
                              </span>
                            )}
                          </div>
                          {plan.discount && (
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                              {plan.discount}% OFF
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Plan Details */}
                      <div className="lg:col-span-6 p-6 border-l border-r border-gray-100">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <FaDatabase className="text-blue-400" />
                            <div>
                              <p className="text-xs text-gray-500">
                                Data Limit
                              </p>
                              <p className="font-medium">{plan.dataLimit}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaClock className="text-blue-400" />
                            <div>
                              <p className="text-xs text-gray-500">Validity</p>
                              <p className="font-medium">{plan.validity}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <IoMdSpeedometer className="text-blue-400" />
                            <div>
                              <p className="text-xs text-gray-500">Speed</p>
                              <p className="font-medium">{plan.speed}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-sm ${i < Math.floor(plan.popularity || 0) ? "text-yellow-400" : "text-gray-300"}`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Rating</p>
                              <p className="font-medium">
                                {plan.popularity?.toFixed(1)}/5
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Features */}
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                            <FaBolt className="text-yellow-400" /> Key Features
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {plan.features.map((feature, index) => (
                              <span
                                key={index}
                                className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* CTA Section */}
                      <div className="lg:col-span-3 p-6 bg-gray-50 flex flex-col justify-between">
                        <div className="mb-4">
                          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition">
                            <FaShoppingCart /> Buy Now
                          </button>
                          <button className="w-full mt-2 border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition">
                            <FaInfoCircle /> Details
                          </button>
                        </div>
                        <div className="text-xs text-gray-500">
                          <p className="flex items-center gap-1">
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            No hidden fees
                          </p>
                          <p className="flex items-center gap-1">
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Instant activation
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <NewsletterSignup />
      <br />
      <br />
      <Footer />
    </>
  );
}
