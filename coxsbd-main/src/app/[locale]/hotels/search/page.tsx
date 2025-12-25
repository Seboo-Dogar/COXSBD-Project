/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Star,
  MapPin,
  Calendar,
  Filter,
  Map,
  SlidersHorizontal,
  ArrowUpDown,
  Award,
  DollarSign,
  Eye,
  ChevronLeft,
  ChevronRight,
  BedDouble,
  SortAsc,
  SortDesc,
} from "lucide-react";
import axiosConfig from "@/utils/axiosConfig";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HotelHomeSearch from "@/components/hotel/HotelSearchForm";
import NewsletterSignup from "@/components/Newsletter";

interface ExternalRoom {
  id: string;
  type: string;
  description: string;
  price: number;
  originalPrice: number;
  currency: string;
  capacity: number;
  amenities: string[];
  quantity: number;
  cancellationPolicy: number;
  offers: {
    code: string;
    name: string;
    amount: number;
  }[];
}

interface ExternalHotel {
  id: string;
  name: string;
  description: string;
  stars: number;
  featuredImage: string;
  gallery: string[];
  locationName: string;
  lat: number;
  lng: number;
  source: string;
  minRate: number;
  maxRate: number;
  currency: string;
  rooms: ExternalRoom[];
}

type SortOption =
  | "rating_high"
  | "rating_low"
  | "name_az"
  | "name_za"
  | "price_low"
  | "price_high";
type ServiceType = "all" | "luxury" | "business" | "budget"; // Aligned with filter categories

// Consolidated list of all sort options for reuse
const fullSortOptions: {
  value: SortOption;
  label: string;
  icon: React.ElementType;
}[] = [
  {
    value: "price_low",
    label: "Price (Low to High)",
    icon: SortAsc,
  },
  {
    value: "price_high",
    label: "Price (High to Low)",
    icon: SortDesc,
  },
  {
    value: "rating_high",
    label: "Stars (High to Low)",
    icon: Award,
  },
  {
    value: "rating_low",
    label: "Stars (Low to High)",
    icon: Award,
  },
  {
    value: "name_az",
    label: "Name (A-Z)",
    icon: SortAsc,
  },
  {
    value: "name_za",
    label: "Name (Z-A)",
    icon: SortDesc,
  },
];

function HotelSearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Search parameters
  const query = searchParams.get("query") || "";
  const location = searchParams.get("location") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";

  const [hotels, setHotels] = useState<ExternalHotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<ExternalHotel[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [serviceType, setServiceType] = useState<ServiceType>("all");
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("price_low");
  const [showMap, setShowMap] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentHotels = filteredHotels.slice(startIndex, endIndex);

  // --- FIX 1: Use actual search params for API call ---
  useEffect(() => {
    if (location && checkIn && checkOut) {
      // The searchData variable seemed redundant, simplified to use the payload
      const payload = {
        query: query,
        location: location,
        checkIn: checkIn, // FIXED: Using actual checkIn date from search params
        checkOut: checkOut, // FIXED: Using actual checkOut date from search params
        adults: 1,
        children: 0,
        rooms: 1,
      };

      axiosConfig()
        .post("/hotels/search-all", payload)
        .then((response) => {
          console.log(response.data);
          // console.log(payload);
          setHotels(response.data.results || []);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching hotels:", error);
          setError("Failed to load hotels. Please try again later.");
          setLoading(false);
        });
    } else {
      setError(
        "Missing required search parameters (location, check-in, or check-out)."
      );
      setLoading(false);
    }
  }, [query, location, checkIn, checkOut]);

  // --- FIX 2: Complete Sorting Logic and Service Type Alignment ---
  useEffect(() => {
    let filtered = [...hotels];

    // Filter by service type
    if (serviceType !== "all") {
      filtered = filtered.filter((hotel) => {
        switch (serviceType) {
          case "luxury":
            return hotel.stars >= 4;
          case "business": // Aligned logic with JSX label (3 Stars)
            return hotel.stars === 3;
          case "budget":
            return hotel.stars <= 2;
          default:
            return true;
        }
      });
    }

    // Filter by stars
    if (selectedStars.length > 0) {
      filtered = filtered.filter((hotel) =>
        selectedStars.includes(hotel.stars)
      );
    }

    // Filter by price range
    filtered = filtered.filter((hotel) => {
      // Ensure minRate is within the selected range
      return hotel.minRate >= priceRange[0] && hotel.minRate <= priceRange[1];
    });

    // Sort hotels (FIXED: Complete sorting logic implemented)
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price_low":
          return a.minRate - b.minRate;
        case "price_high":
          return b.minRate - a.minRate;
        case "rating_high":
          return b.stars - a.stars;
        case "rating_low":
          return a.stars - b.stars;
        case "name_az":
          return a.name.localeCompare(b.name);
        case "name_za":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    setFilteredHotels(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [hotels, selectedStars, priceRange, sortBy, serviceType]);

  const renderStars = (count: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < count ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }
        />
      ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-medium text-gray-600">
          Loading hotels by searching...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-600 text-lg font-medium mb-4">{error}</div>
            <button
              onClick={() => router.back()}
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <br />

      <HotelHomeSearch />

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className="lg:w-80">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                <Filter size={16} className="mr-2" />
                Filters & Sort
              </button>
            </div>

            {/* Filters Panel */}
            <div
              className={`${
                showFilters ? "block" : "hidden"
              } lg:block space-y-6 sticky top-6`}
            >
              {/* Map Toggle */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <button
                  onClick={() => setShowMap(!showMap)}
                  className={`flex items-center justify-center w-full px-4 py-2 rounded-md transition-colors ${
                    showMap
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Map size={16} className="mr-2" />
                  {showMap ? "Hide Map" : "Show on Map"}
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <SortAsc size={18} className="mr-2 text-red-600" />
                  Sort By
                </h3>
                <div className="space-y-2">
                  {/* Re-using the consolidated fullSortOptions list */}
                  {fullSortOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="sortBy"
                        value={option.value}
                        checked={sortBy === option.value}
                        onChange={(e) =>
                          setSortBy(e.target.value as SortOption)
                        }
                        className="mr-3 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                      />
                      <option.icon
                        size={14}
                        className="mr-2 text-gray-500 group-hover:text-red-600"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Service Type */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Star size={18} className="mr-2 text-red-600" />
                  Service Type
                </h3>
                <div className="space-y-2">
                  {[
                    { value: "all" as ServiceType, label: "All Hotels" },
                    {
                      value: "luxury" as ServiceType,
                      label: "Luxury (4-5 Stars)",
                    },
                    {
                      value: "business" as ServiceType,
                      label: "Business (3 Stars)",
                    },
                    {
                      value: "budget" as ServiceType,
                      label: "Budget (1-2 Stars)",
                    },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="serviceType"
                        value={option.value}
                        checked={serviceType === option.value}
                        onChange={(e) =>
                          setServiceType(e.target.value as ServiceType)
                        }
                        className="mr-3 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign size={18} className="mr-2 text-red-600" />
                  Price Range
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm text-gray-600 mb-1">
                        Min Price
                      </label>
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) =>
                          setPriceRange([
                            Number.parseInt(e.target.value) || 0,
                            priceRange[1],
                          ])
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="0"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm text-gray-600 mb-1">
                        Max Price
                      </label>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([
                            priceRange[0],
                            Number.parseInt(e.target.value) || 10000,
                          ])
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="10000"
                      />
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    BDT {priceRange[0].toLocaleString()} - BDT{" "}
                    {priceRange[1].toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Star Rating (FIXED: Added 1 and 2 stars for completeness) */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Star size={18} className="mr-2 text-red-600" />
                  Star Rating
                </h3>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <label
                      key={stars}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStars.includes(stars)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStars([...selectedStars, stars]);
                          } else {
                            setSelectedStars(
                              selectedStars.filter((s) => s !== stars)
                            );
                          }
                        }}
                        className="mr-3 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <div className="flex items-center">
                        {renderStars(stars)}
                        <span className="ml-2 text-sm text-gray-700">
                          {stars} Stars
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setPriceRange([0, 10000]);
                  setSelectedStars([]);
                  setSortBy("price_low");
                  setServiceType("all"); // Reset service type as well
                }}
                className="w-full px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {filteredHotels.length} Properties Found
                    {filteredHotels.length > itemsPerPage && (
                      <span className="text-lg font-normal text-gray-600">
                        {" "}
                        (Showing {startIndex + 1} -{" "}
                        {Math.min(endIndex, filteredHotels.length)})
                      </span>
                    )}
                  </h1>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin size={16} className="mr-1" />
                    <span className="mr-4">{query || location}</span>
                    <Calendar size={16} className="mr-1" />
                    <span>
                      {formatDate(checkIn)} - {formatDate(checkOut)}
                    </span>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    <SlidersHorizontal size={16} className="mr-2" />
                    Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Sort Buttons */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-wrap gap-2">
                {fullSortOptions.slice(0, 3).map(
                  (
                    option // Only show top 3 popular sorts as buttons
                  ) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        sortBy === option.value
                          ? "bg-red-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <option.icon size={16} />
                      <span className="ml-2">{option.label}</span>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Hotels List */}
            <div className="space-y-4">
              {currentHotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Hotel Image */}
                    <div className="sm:w-64 h-48 sm:h-auto relative flex-shrink-0">
                      <img
                        src={hotel.featuredImage || "/hotel.jpg"}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Hotel Details */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-col sm:flex-row sm:justify-between h-full">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">
                              {hotel.name}
                            </h3>
                            <div className="flex items-center ml-4">
                              {renderStars(hotel.stars)}
                            </div>
                          </div>

                          <div className="flex items-start text-gray-600 mb-3">
                            <MapPin
                              size={14}
                              className="mr-1 mt-1 flex-shrink-0"
                            />
                            <span className="text-sm line-clamp-2">
                              {hotel.locationName}
                            </span>
                          </div>

                          {hotel.description && (
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              {hotel.description}
                            </p>
                          )}

                          {/* Room Info */}
                          {hotel.rooms && hotel.rooms.length > 0 && (
                            <div className="text-sm text-gray-500">
                              <span>
                                {hotel.rooms.length} room type
                                {hotel.rooms.length > 1 ? "s" : ""} available
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Price and Actions */}
                        <div className="mt-4 sm:mt-0 sm:ml-6 flex flex-col justify-between items-end">
                          <div className="text-right mb-4">
                            <div className="text-2xl font-bold text-gray-900">
                              {hotel.currency} {hotel.minRate.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              per night
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2">
                            <Link
                              href={`/hotels/${hotel.id}`}
                              className="flex items-center justify-center px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition-colors text-sm font-medium"
                            >
                              <Eye size={16} className="mr-1" />
                              View Details
                            </Link>
                            <Link
                              href={`/hotels/${hotel.id}`}
                              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                            >
                              Book Now
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <ChevronLeft size={20} />
                  </button>

                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          currentPage === pageNum
                            ? "bg-red-600 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md ${
                      currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* No Results */}
            {filteredHotels.length === 0 && !loading && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="text-gray-500 mb-4">
                  No hotels found matching your criteria
                </div>
                <button
                  onClick={() => {
                    setPriceRange([0, 10000]);
                    setSelectedStars([]);
                    setServiceType("all"); // Reset service type
                  }}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <NewsletterSignup />
      <br />
      <br />
      <Footer />
    </div>
  );
}

export default function HotelSearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          </div>
        </div>
      }
    >
      <HotelSearchContent />
    </Suspense>
  );
}
