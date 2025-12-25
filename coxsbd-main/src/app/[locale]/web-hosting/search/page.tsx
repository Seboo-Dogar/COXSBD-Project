"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Header from "@/components/Header";
import NewsletterSignup from "@/components/Newsletter";
import Footer from "@/components/Footer";
import Image from "next/image";
import {
  FiServer,
  FiCpu,
  FiHardDrive,
  FiWifi,
  FiShield,
  FiFilter,
  FiX,
} from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";
import HostingSearchForm from "@/components/web-hosting/HostingSearchForm";

type HostingPlan = {
  id: string;
  name: string;
  pricePerMonth: number;
  cpuCores: number;
  ramGB: number;
  storageGB: number;
  bandwidthTB: number;
  sslIncluded: boolean;
  type: "Shared" | "VPS" | "Dedicated";
  description: string;
  available: boolean;
  rating: number;
  features: string[];
  bestSeller?: boolean;
};

const hostingPlans: HostingPlan[] = [
  {
    id: "1",
    name: "Basic Shared",
    pricePerMonth: 500,
    cpuCores: 1,
    ramGB: 2,
    storageGB: 50,
    bandwidthTB: 1,
    sslIncluded: true,
    type: "Shared",
    description:
      "Affordable hosting for small websites with 99.9% uptime guarantee.",
    available: true,
    rating: 4.2,
    features: ["Unlimited Bandwidth", "Free Domain", "24/7 Support"],
  },
  {
    id: "2",
    name: "Pro Shared",
    pricePerMonth: 1200,
    cpuCores: 2,
    ramGB: 4,
    storageGB: 150,
    bandwidthTB: 3,
    sslIncluded: true,
    type: "Shared",
    description: "More power for growing websites with enhanced security.",
    available: true,
    rating: 4.5,
    features: ["Free SSL", "Daily Backups", "Unlimited Databases"],
    bestSeller: true,
  },
  {
    id: "3",
    name: "VPS Starter",
    pricePerMonth: 3000,
    cpuCores: 4,
    ramGB: 8,
    storageGB: 250,
    bandwidthTB: 5,
    sslIncluded: true,
    type: "VPS",
    description:
      "Virtual private server with root access for higher performance.",
    available: true,
    rating: 4.7,
    features: ["Full Root Access", "Dedicated IP", "SSD Storage"],
  },
  {
    id: "4",
    name: "Dedicated Server",
    pricePerMonth: 12000,
    cpuCores: 16,
    ramGB: 64,
    storageGB: 2000,
    bandwidthTB: 20,
    sslIncluded: true,
    type: "Dedicated",
    description:
      "Full server resources for enterprise needs with premium support.",
    available: true,
    rating: 4.9,
    features: ["Enterprise Hardware", "24/7 Monitoring", "DDoS Protection"],
  },
  {
    id: "5",
    name: "Starter Shared",
    pricePerMonth: 300,
    cpuCores: 1,
    ramGB: 1,
    storageGB: 20,
    bandwidthTB: 0.5,
    sslIncluded: false,
    type: "Shared",
    description: "Entry-level shared hosting perfect for hobby projects.",
    available: true,
    rating: 3.9,
    features: ["One Website", "Free Email", "Basic Support"],
  },
  {
    id: "6",
    name: "Business Shared",
    pricePerMonth: 2000,
    cpuCores: 4,
    ramGB: 8,
    storageGB: 300,
    bandwidthTB: 4,
    sslIncluded: true,
    type: "Shared",
    description:
      "Perfect for small businesses and e-commerce stores with WooCommerce support.",
    available: true,
    rating: 4.6,
    features: ["Free CDN", "Auto Scaling", "Staging Environment"],
    bestSeller: true,
  },
  {
    id: "7",
    name: "VPS Pro",
    pricePerMonth: 5000,
    cpuCores: 8,
    ramGB: 16,
    storageGB: 500,
    bandwidthTB: 10,
    sslIncluded: true,
    type: "VPS",
    description:
      "High-performance VPS with NVMe storage for medium to large websites.",
    available: true,
    rating: 4.8,
    features: ["NVMe Storage", "Load Balancing", "API Access"],
  },
  {
    id: "8",
    name: "VPS Ultimate",
    pricePerMonth: 8000,
    cpuCores: 12,
    ramGB: 32,
    storageGB: 1000,
    bandwidthTB: 15,
    sslIncluded: true,
    type: "VPS",
    description:
      "Enterprise-grade VPS with top-tier resources and priority support.",
    available: true,
    rating: 4.9,
    features: ["GPU Acceleration", "Private Network", "Managed Services"],
  },
  {
    id: "9",
    name: "Dedicated Lite",
    pricePerMonth: 9000,
    cpuCores: 8,
    ramGB: 32,
    storageGB: 1000,
    bandwidthTB: 10,
    sslIncluded: true,
    type: "Dedicated",
    description: "A balanced dedicated server solution for mid-size companies.",
    available: true,
    rating: 4.7,
    features: ["Custom Configurations", "Hardware RAID", "Bare Metal"],
  },
];

export default function WebHostingSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Helper to parse params or default to empty string
  const getParam = (key: string) => searchParams.get(key) ?? "";

  // Filter state synced with URL params
  const [searchText, setSearchText] = useState(getParam("search") || "");
  const [priceMin, setPriceMin] = useState(getParam("priceMin") || "");
  const [priceMax, setPriceMax] = useState(getParam("priceMax") || "");
  const [storageMin, setStorageMin] = useState(getParam("storageMin") || "");
  const [bandwidthMin, setBandwidthMin] = useState(
    getParam("bandwidthMin") || ""
  );
  const [cpuCoresMin, setCpuCoresMin] = useState(getParam("cpuCoresMin") || "");
  const [ramMin, setRamMin] = useState(getParam("ramMin") || "");
  const [sslIncluded, setSslIncluded] = useState(
    getParam("sslIncluded") === "true"
  );
  const [ratingMin, setRatingMin] = useState(getParam("ratingMin") || "0");
  const planTypesParam = getParam("planTypes");
  const initialPlanTypes = planTypesParam ? planTypesParam.split(",") : [];
  const [planTypes, setPlanTypes] = useState<string[]>(initialPlanTypes);

  const [filteredPlans, setFilteredPlans] = useState<HostingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // When URL query changes, sync state
  useEffect(() => {
    setSearchText(getParam("search") || "");
    setPriceMin(getParam("priceMin") || "");
    setPriceMax(getParam("priceMax") || "");
    setStorageMin(getParam("storageMin") || "");
    setBandwidthMin(getParam("bandwidthMin") || "");
    setCpuCoresMin(getParam("cpuCoresMin") || "");
    setRamMin(getParam("ramMin") || "");
    setSslIncluded(getParam("sslIncluded") === "true");
    setRatingMin(getParam("ratingMin") || "0");
    setPlanTypes(planTypesParam ? planTypesParam.split(",") : []);
  }, [searchParams, planTypesParam]);

  // Toggle plan type in array
  const togglePlanType = useCallback(
    (type: string) => {
      if (planTypes.includes(type)) {
        setPlanTypes(planTypes.filter((t) => t !== type));
      } else {
        setPlanTypes([...planTypes, type]);
      }
    },
    [planTypes]
  );

  // Filter logic with debounce
  const applyFilters = useCallback(() => {
    setIsLoading(true);

    setTimeout(() => {
      const filtered = hostingPlans.filter((plan) => {
        if (!plan.available) return false;

        // Text search on name or description (case-insensitive)
        if (
          searchText &&
          !plan.name.toLowerCase().includes(searchText.toLowerCase()) &&
          !plan.description.toLowerCase().includes(searchText.toLowerCase())
        ) {
          return false;
        }

        if (priceMin && plan.pricePerMonth < Number(priceMin)) return false;
        if (priceMax && plan.pricePerMonth > Number(priceMax)) return false;
        if (storageMin && plan.storageGB < Number(storageMin)) return false;
        if (bandwidthMin && plan.bandwidthTB < Number(bandwidthMin))
          return false;
        if (cpuCoresMin && plan.cpuCores < Number(cpuCoresMin)) return false;
        if (ramMin && plan.ramGB < Number(ramMin)) return false;
        if (sslIncluded && !plan.sslIncluded) return false;
        if (planTypes.length > 0 && !planTypes.includes(plan.type))
          return false;
        if (ratingMin && plan.rating < Number(ratingMin)) return false;

        return true;
      });

      setFilteredPlans(filtered);
      setIsLoading(false);
    }, 300);
  }, [
    searchText,
    priceMin,
    priceMax,
    storageMin,
    bandwidthMin,
    cpuCoresMin,
    ramMin,
    sslIncluded,
    planTypes,
    ratingMin,
  ]);

  // Apply filters on mount and when filter inputs change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Update URL with current filters
  const updateUrlParams = useCallback(() => {
    const params = new URLSearchParams();

    if (searchText.trim()) params.append("search", searchText.trim());
    if (priceMin) params.append("priceMin", priceMin);
    if (priceMax) params.append("priceMax", priceMax);
    if (storageMin) params.append("storageMin", storageMin);
    if (bandwidthMin) params.append("bandwidthMin", bandwidthMin);
    if (cpuCoresMin) params.append("cpuCoresMin", cpuCoresMin);
    if (ramMin) params.append("ramMin", ramMin);
    if (sslIncluded) params.append("sslIncluded", "true");
    if (planTypes.length > 0) params.append("planTypes", planTypes.join(","));
    if (ratingMin !== "0") params.append("ratingMin", ratingMin);

    router.push(`/web-hosting/search?${params.toString()}`);
  }, [
    searchText,
    priceMin,
    priceMax,
    storageMin,
    bandwidthMin,
    cpuCoresMin,
    ramMin,
    sslIncluded,
    planTypes,
    ratingMin,
    router,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrlParams();
    setMobileFiltersOpen(false);
  };

  const resetFilters = () => {
    setSearchText("");
    setPriceMin("");
    setPriceMax("");
    setStorageMin("");
    setBandwidthMin("");
    setCpuCoresMin("");
    setRamMin("");
    setSslIncluded(false);
    setPlanTypes([]);
    setRatingMin("0");
    router.push("/web-hosting/search");
  };

  const activeFilterCount = [
    searchText,
    priceMin,
    priceMax,
    storageMin,
    bandwidthMin,
    cpuCoresMin,
    ramMin,
    sslIncluded,
    planTypes.length,
    ratingMin !== "0",
  ].filter(Boolean).length;

  return (
    <>
      <Header />
      <br />
      <HostingSearchForm />

      <div className="max-w-9xl min-h-screen bg-white">
        {/* Mobile filter dialog */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="fixed inset-0 bg-black bg-opacity-25"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">Filters</h2>
                  <button
                    type="button"
                    onClick={() => setMobileFiltersOpen(false)}
                    className="-mr-2 p-2 rounded-md"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-6">
                  {/* Mobile filter form content */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Search
                      </label>
                      <input
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Search plans..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price Range (৳)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={priceMin}
                          onChange={(e) => setPriceMin(e.target.value)}
                          className="w-1/2 px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          value={priceMax}
                          onChange={(e) => setPriceMax(e.target.value)}
                          className="w-1/2 px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Minimum Rating
                      </label>
                      <select
                        value={ratingMin}
                        onChange={(e) => setRatingMin(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="0">Any Rating</option>
                        <option value="3">3+ Stars</option>
                        <option value="4">4+ Stars</option>
                        <option value="4.5">4.5+ Stars</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Plan Types
                      </label>
                      <div className="space-y-2">
                        {["Shared", "VPS", "Dedicated"].map((type) => (
                          <label
                            key={type}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              checked={planTypes.includes(type)}
                              onChange={() => togglePlanType(type)}
                              className="h-4 w-4 text-red-600"
                            />
                            <span className="text-sm text-gray-700">
                              {type}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-x-4 flex">
                    <button
                      type="submit"
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md"
                    >
                      Apply
                    </button>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="flex-1 py-2 px-4 border border-gray-300 rounded-md"
                    >
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 flex items-baseline justify-between pt-8 pb-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Web Hosting Plans
            </h1>

            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden -m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 flex items-center"
              >
                <FiFilter className="h-5 w-5 mr-1" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="ml-1.5 rounded-full bg-red-600 text-white text-xs px-2 py-0.5">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="max-w-9xl pt-6 pb-12 lg:grid lg:grid-cols-4 lg:gap-x-8">
            {/* Filters sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={resetFilters}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Reset all
                    </button>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Search
                    </label>
                    <input
                      type="text"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      placeholder="Search plans..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  {/* Price range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price Range (৳)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceMin}
                        onChange={(e) => setPriceMin(e.target.value)}
                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceMax}
                        onChange={(e) => setPriceMax(e.target.value)}
                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </div>

                  {/* Resources */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      Resources
                    </h3>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Minimum Storage (GB)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={storageMin}
                        onChange={(e) => setStorageMin(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Minimum Bandwidth (TB)
                      </label>
                      <input
                        type="number"
                        min={0}
                        step="0.5"
                        value={bandwidthMin}
                        onChange={(e) => setBandwidthMin(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Minimum CPU Cores
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={cpuCoresMin}
                        onChange={(e) => setCpuCoresMin(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Minimum RAM (GB)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={ramMin}
                        onChange={(e) => setRamMin(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      Features
                    </h3>

                    <div className="flex items-center">
                      <input
                        id="sslIncluded"
                        type="checkbox"
                        checked={sslIncluded}
                        onChange={() => setSslIncluded(!sslIncluded)}
                        className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <label
                        htmlFor="sslIncluded"
                        className="ml-2 text-sm text-gray-700"
                      >
                        SSL Included
                      </label>
                    </div>
                  </div>

                  {/* Plan Types */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Plan Types
                    </h3>
                    <div className="mt-2 space-y-2">
                      {["Shared", "VPS", "Dedicated"].map((type) => (
                        <div key={type} className="flex items-center">
                          <input
                            id={`type-${type}`}
                            type="checkbox"
                            checked={planTypes.includes(type)}
                            onChange={() => togglePlanType(type)}
                            className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                          />
                          <label
                            htmlFor={`type-${type}`}
                            className="ml-2 text-sm text-gray-700"
                          >
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Minimum Rating
                    </h3>
                    <select
                      value={ratingMin}
                      onChange={(e) => setRatingMin(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                    >
                      <option value="0">Any Rating</option>
                      <option value="3">3+ Stars</option>
                      <option value="4">4+ Stars</option>
                      <option value="4.5">4.5+ Stars</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                  >
                    Apply Filters
                  </button>
                </form>
              </div>
            </aside>

            {/* Results */}
            <div className="lg:col-span-3 space-y-6">
              {/* Active Filters */}
              <div className="mb-6 flex flex-wrap gap-2">
                {searchText && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Search: {searchText}
                    <button
                      onClick={() => setSearchText("")}
                      className="ml-1.5 inline-flex text-red-400 hover:text-red-600"
                    >
                      <FiX className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {(priceMin || priceMax) && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Price: {priceMin ? `৳${priceMin}` : ""} -{" "}
                    {priceMax ? `৳${priceMax}` : "∞"}
                    <button
                      onClick={() => {
                        setPriceMin("");
                        setPriceMax("");
                      }}
                      className="ml-1.5 inline-flex text-red-400 hover:text-red-600"
                    >
                      <FiX className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {storageMin && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Storage: ≥{storageMin}GB
                    <button
                      onClick={() => setStorageMin("")}
                      className="ml-1.5 inline-flex text-red-400 hover:text-red-600"
                    >
                      <FiX className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {planTypes.length > 0 &&
                  planTypes.map((type) => (
                    <span
                      key={type}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                    >
                      {type}
                      <button
                        onClick={() => togglePlanType(type)}
                        className="ml-1.5 inline-flex text-red-400 hover:text-red-600"
                      >
                        <FiX className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                {ratingMin !== "0" && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Rating: ≥{ratingMin}
                    <button
                      onClick={() => setRatingMin("0")}
                      className="ml-1.5 inline-flex text-red-400 hover:text-red-600"
                    >
                      <FiX className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>

              {/* Loading */}
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
                </div>
              ) : filteredPlans.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow text-center">
                  <FiServer className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    No plans found
                  </h3>
                  <p className="mt-1 text-gray-500">
                    Try adjusting your search or filter criteria
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={resetFilters}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
                    >
                      Reset all filters
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col space-y-6">
                  {filteredPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`bg-white rounded-lg shadow-md overflow-hidden border ${plan.bestSeller ? "border-red-500 ring-1 ring-red-500" : "border-gray-200"} hover:shadow-lg transition-all duration-200`}
                    >
                      {plan.bestSeller && (
                        <div className="bg-red-600 text-white text-xs font-bold px-3 py-1">
                          BEST SELLER
                        </div>
                      )}
                      <div className="p-6 flex flex-col md:flex-row">
                        {/* Left: Info */}
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900">
                            {plan.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {plan.type} Hosting
                          </p>
                          <p className="mt-2 text-gray-600 text-sm">
                            {plan.description}
                          </p>

                          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center">
                              <FiCpu className="h-4 w-4 text-red-600 mr-2" />
                              {plan.cpuCores} CPU Cores
                            </div>
                            <div className="flex items-center">
                              <FiHardDrive className="h-4 w-4 text-red-600 mr-2" />
                              {plan.storageGB}GB Storage
                            </div>
                            <div className="flex items-center">
                              <FiServer className="h-4 w-4 text-red-600 mr-2" />
                              {plan.ramGB}GB RAM
                            </div>
                            <div className="flex items-center">
                              <FiWifi className="h-4 w-4 text-red-600 mr-2" />
                              {plan.bandwidthTB}TB Bandwidth
                            </div>
                          </div>

                          {plan.features.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-gray-900 mb-1">
                                Features:
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {plan.features.map((feature, i) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                                  >
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Right: Price & Rating */}
                        <div className="mt-4 md:mt-0 md:ml-6 text-right flex flex-col justify-between">
                          <p className="text-2xl font-bold text-red-600">
                            ৳{plan.pricePerMonth.toLocaleString()}
                            <span className="text-base font-medium">/mo</span>
                          </p>
                          <div className="flex items-center justify-end mt-2">
                            {[...Array(5)].map((_, i) =>
                              i < Math.floor(plan.rating) ? (
                                <FaStar
                                  key={i}
                                  className="h-4 w-4 text-yellow-400"
                                />
                              ) : (
                                <FaRegStar
                                  key={i}
                                  className="h-4 w-4 text-yellow-400"
                                />
                              )
                            )}
                            <span className="ml-1 text-xs text-gray-500">
                              ({plan.rating})
                            </span>
                          </div>
                          <button className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center">
                            <span>Choose Plan</span>
                            <svg
                              className="ml-2 h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <NewsletterSignup />
      <br />
      <br />
      <Footer />
    </>
  );
}
