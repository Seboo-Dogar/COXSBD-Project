"use client";

import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Star,
  DollarSign,
  Calendar,
  SlidersHorizontal,
} from "lucide-react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TourHomeSearch from "@/components/tour/TourHomeSearch";

type Tour = {
  id: string;
  name: string;
  locationName: string;
  rating: number;
  featuredImage: string;
  pricePerNight: number;
  durationDays: number;
  discount?: number;
};

const mockTours: Tour[] = [
  {
    id: "1",
    name: "Sundarbans Tour",
    locationName: "Khulna, Bangladesh",
    rating: 4.8,
    featuredImage: "/images/tour1.jpg",
    pricePerNight: 120,
    durationDays: 3,
    discount: 15,
  },
  {
    id: "2",
    name: "Cox's Bazar Adventure",
    locationName: "Cox's Bazar, Bangladesh",
    rating: 4.6,
    featuredImage: "/images/tour2.jpg",
    pricePerNight: 90,
    durationDays: 4,
  },
  {
    id: "3",
    name: "Sylhet Nature Trip",
    locationName: "Sylhet, Bangladesh",
    rating: 4.9,
    featuredImage: "/images/tour3.jpg",
    pricePerNight: 110,
    durationDays: 2,
    discount: 10,
  },
  {
    id: "4",
    name: "Bandarban Trekking",
    locationName: "Bandarban, Bangladesh",
    rating: 4.7,
    featuredImage: "/images/tour4.jpg",
    pricePerNight: 150,
    durationDays: 5,
  },
  {
    id: "5",
    name: "Saint Martin Island Getaway",
    locationName: "Saint Martin, Bangladesh",
    rating: 4.5,
    featuredImage: "/images/tour5.jpg",
    pricePerNight: 130,
    durationDays: 3,
    discount: 20,
  },
];

export default function TourPackageSearchPage() {
  const [filteredTours, setFilteredTours] = useState<Tour[]>(mockTours);
  const [isLoading, setIsLoading] = useState(false);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300]);
  const [duration, setDuration] = useState<number | null>(null);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedLocation("");
    setMinRating(0);
    setPriceRange([0, 300]);
    setDuration(null);
  };

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const results = mockTours.filter((tour) => {
        return (
          tour.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (selectedLocation
            ? tour.locationName.includes(selectedLocation)
            : true) &&
          tour.rating >= minRating &&
          tour.pricePerNight >= priceRange[0] &&
          tour.pricePerNight <= priceRange[1] &&
          (duration ? tour.durationDays === duration : true)
        );
      });
      setFilteredTours(results);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedLocation, minRating, priceRange, duration]);

  // Extract unique locations correctly
  const locations = Array.from(
    new Set(mockTours.map((tour) => tour.locationName.split(",")[0]))
  );

  return (
    <>
      <Header />
      <br />
      <TourHomeSearch />

      <div className="max-w-8xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filter */}
        <aside className="bg-white rounded-xl shadow-md p-6 space-y-12 border sticky top-4 h-fit">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-red-600" />
              Filters
            </h2>
            <button
              onClick={resetFilters}
              className="text-sm text-red-600 hover:underline"
            >
              Reset all
            </button>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Search Tour
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded-lg pl-10 pr-3 py-2 w-full focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-red-500"
            >
              <option value="">All Locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Min Rating */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              Minimum Rating: {minRating.toFixed(1)}
            </label>
            <input
              type="range"
              min={0}
              max={5}
              step={0.1}
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full accent-red-600"
            />
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              Price Range (per night)
            </label>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-500">${priceRange[0]}</span>
              <input
                type="range"
                min={0}
                max={300}
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([Number(e.target.value), priceRange[1]])
                }
                className="flex-1 accent-red-600"
              />
              <span className="text-xs text-gray-500">${priceRange[1]}</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([Number(e.target.value), priceRange[1]])
                }
                className="border rounded-lg px-2 py-1 w-20 text-sm"
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                min={priceRange[0]}
                max={500}
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number(e.target.value)])
                }
                className="border rounded-lg px-2 py-1 w-20 text-sm"
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Duration (days)
            </label>
            <select
              value={duration || ""}
              onChange={(e) =>
                setDuration(e.target.value ? Number(e.target.value) : null)
              }
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-red-500"
            >
              <option value="">Any duration</option>
              {[1, 2, 3, 4, 5, 7, 10].map((days) => (
                <option key={days} value={days}>
                  {days} {days === 1 ? "day" : "days"}
                </option>
              ))}
            </select>
          </div>
        </aside>

        {/* Results */}
        <main className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {isLoading
                ? "Searching..."
                : `Found ${filteredTours.length} Tour${filteredTours.length !== 1 ? "s" : ""}`}
            </h2>
            <div className="text-sm text-gray-500">
              Showing {filteredTours.length} of {mockTours.length} tours
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
          ) : filteredTours.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">No tours found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search filters
              </p>
              <button
                onClick={resetFilters}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredTours.map((tour) => (
                <div
                  key={tour.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row"
                >
                  {/* Image with discount badge */}
                  <div className="relative md:w-1/3 h-48 md:h-auto">
                    <Image
                      src={tour.featuredImage}
                      alt={tour.name}
                      width={400}
                      height={250}
                      className="w-full h-full object-cover"
                    />
                    {tour.discount && (
                      <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                        {tour.discount}% OFF
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold">{tour.name}</h3>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin className="w-4 h-4" />
                            <span>{tour.locationName}</span>
                          </p>
                        </div>
                        <div className="flex items-center bg-yellow-100 px-2 py-1 rounded">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-medium ml-1">
                            {tour.rating}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-gray-700">
                          {tour.durationDays}{" "}
                          {tour.durationDays === 1 ? "day" : "days"} tour
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-600">
                            Includes accommodation, meals, and guided tours
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">
                          Starting from
                        </div>
                        {tour.discount ? (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-sm line-through">
                              ${tour.pricePerNight * tour.durationDays}
                            </span>
                            <span className="text-green-600 font-bold text-xl">
                              $
                              {Math.round(
                                tour.pricePerNight *
                                  (1 - tour.discount / 100) *
                                  tour.durationDays
                              )}
                            </span>
                          </div>
                        ) : (
                          <span className="text-green-600 font-bold text-xl">
                            ${tour.pricePerNight * tour.durationDays}
                          </span>
                        )}
                        <div className="text-xs text-gray-500 mt-1">
                          {tour.discount ? (
                            <span>Save {tour.discount}% on this tour!</span>
                          ) : (
                            <span>Best price guarantee</span>
                          )}
                        </div>
                      </div>
                      <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                        <span>Book Now</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
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
        </main>
      </div>

      <Footer />
    </>
  );
}
