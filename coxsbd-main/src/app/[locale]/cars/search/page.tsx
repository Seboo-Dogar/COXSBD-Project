"use client";

import { useState, useEffect } from "react";
import {
  Star,
  Users,
  Phone,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  TrendingUp,
  Award,
  DollarSign,
  Car,
  X,
  Zap,
  Wifi,
  Navigation,
  MapPin,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import "react-datepicker/dist/react-datepicker.css";
import { useSearchParams } from "next/navigation";
import CarSearchForm from "@/components/car/CarSearchForm";
import Image from "next/image";

interface CarType {
  id: string;
  name: string;
  type: string;
  capacity: number;
  image: string;
  pricePerKm: number;
  pricePerHour: number;
  pricePerDay: number;
  features: string[];
  rating: number;
  available: boolean;
  driverName: string;
  driverPhone: string;
}

type SortOption = "name_asc" | "fare_low" | "fare_high" | "rating_high";
type ServiceType = "point-to-point" | "round-trip" | "full-day";

const sortOptions = [
  {
    value: "rating_high" as SortOption,
    label: "Rating (High to Low)",
    icon: <Award size={16} />,
  },
  {
    value: "name_asc" as SortOption,
    label: "Name (A-Z)",
    icon: <ArrowUpDown size={16} />,
  },
  {
    value: "fare_low" as SortOption,
    label: "Fare (Low to High)",
    icon: <TrendingUp size={16} />,
  },
  {
    value: "fare_high" as SortOption,
    label: "Fare (High to Low)",
    icon: <ArrowUpDown size={16} />,
  },
];

const serviceTypes = [
  { value: "point-to-point" as ServiceType, label: "Point to Point" },
  { value: "round-trip" as ServiceType, label: "Round Trip" },
  { value: "full-day" as ServiceType, label: "Full Day" },
];

const carTypes = [
  { value: "Sedan", label: "Sedan" },
  { value: "SUV", label: "SUV" },
  { value: "Hatchback", label: "Hatchback" },
  { value: "Luxury", label: "Luxury" },
];

const capacityOptions = [
  { value: 2, label: "2+" },
  { value: 4, label: "4+" },
  { value: 6, label: "6+" },
  { value: 7, label: "7+" },
];

export default function CarListingPage() {
  const searchParams = useSearchParams();
  const pickup = searchParams.get("pickup") || "";
  const dropoff = searchParams.get("dropoff") || "";
  const date = searchParams.get("date") || "";
  const passengers = searchParams.get("passengers") || "0";

  const [cars, setCars] = useState<CarType[]>([]);
  const [filteredCars, setFilteredCars] = useState<CarType[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [sortBy, setSortBy] = useState<SortOption>("rating_high");
  const [fareRange, setFareRange] = useState<[number, number]>([1000, 10000]);
  const [selectedCarTypes, setSelectedCarTypes] = useState<string[]>([]);
  const [selectedCapacity, setSelectedCapacity] = useState<number[]>([]);
  const [selectedServiceType, setSelectedServiceType] =
    useState<ServiceType>("point-to-point");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:1337/cars/search?pickup=${pickup}&dropoff=${dropoff}&date=${date}&passengers=${passengers}`
        );
        if (!res.ok) throw new Error("Failed to fetch cars");
        const data: CarType[] = await res.json();
        setCars(data);
      } catch (err: any) {
        setError(err.message || "Error fetching cars");
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, [pickup, dropoff, date, passengers]);

  // Filtering and sorting
  useEffect(() => {
    let filtered = [...cars];

    if (showAvailableOnly) filtered = filtered.filter((car) => car.available);

    if (selectedCarTypes.length > 0)
      filtered = filtered.filter((car) => selectedCarTypes.includes(car.type));

    if (selectedCapacity.length > 0)
      filtered = filtered.filter((car) =>
        selectedCapacity.some((cap) => car.capacity >= cap)
      );

    filtered = filtered.filter((car) => {
      let price = 0;
      switch (selectedServiceType) {
        case "point-to-point":
          price = car.pricePerKm * 15;
          break;
        case "round-trip":
          price = car.pricePerKm * 30;
          break;
        case "full-day":
          price = car.pricePerDay;
          break;
      }
      return price >= fareRange[0] && price <= fareRange[1];
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "fare_low":
          return (
            (selectedServiceType === "full-day"
              ? a.pricePerDay
              : a.pricePerKm) -
            (selectedServiceType === "full-day" ? b.pricePerDay : b.pricePerKm)
          );
        case "fare_high":
          return (
            (selectedServiceType === "full-day"
              ? b.pricePerDay
              : b.pricePerKm) -
            (selectedServiceType === "full-day" ? a.pricePerDay : a.pricePerKm)
          );
        case "rating_high":
        default:
          return b.rating - a.rating;
      }
    });

    setFilteredCars(filtered);
    setCurrentPage(1); // Reset page on filter change
  }, [
    cars,
    sortBy,
    fareRange,
    selectedCarTypes,
    selectedCapacity,
    selectedServiceType,
    showAvailableOnly,
  ]);

  const renderStars = (rating: number) =>
    Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < Math.floor(rating)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          }
        />
      ));

  const getFeatureIcon = (feature: string) => {
    const featureLower = feature.toLowerCase();
    if (featureLower.includes("wifi")) return <Wifi size={14} />;
    if (featureLower.includes("gps")) return <Navigation size={14} />;
    if (featureLower.includes("ac"))
      return <span className="text-blue-500">❄️</span>;
    return <Zap size={14} />;
  };

  const getFareDisplay = (car: CarType) => {
    switch (selectedServiceType) {
      case "point-to-point":
      case "round-trip":
        return `৳${car.pricePerKm}/km`;
      case "full-day":
        return `৳${car.pricePerDay}/day`;
      default:
        return `৳${car.pricePerKm}/km`;
    }
  };

  const getEstimatedFare = (car: CarType) => {
    switch (selectedServiceType) {
      case "point-to-point":
        return car.pricePerKm * 15;
      case "round-trip":
        return car.pricePerKm * 30;
      case "full-day":
        return car.pricePerDay;
      default:
        return car.pricePerKm * 15;
    }
  };

  const clearFilters = () => {
    setFareRange([1000, 10000]);
    setSelectedCarTypes([]);
    setSelectedCapacity([]);
    setSortBy("rating_high");
    setShowAvailableOnly(false);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-12 h-12 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="sr-only">Loading searchable cars...</span>
      </div>
    );

  if (error)
    return <div className="text-center py-8 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <br />

      <div className="max-w-7xl mx-auto px-4">
        <CarSearchForm />
      </div>

      <div className="container mx-auto px-4 py-">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters - Desktop */}
          <div className="lg:w-80">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 shadow-sm"
              >
                <Filter size={16} className="mr-2" />
                Filters & Sort
              </button>
            </div>

            {/* Filters Panel */}
            <div
              className={`${
                showFilters ? "block" : "hidden"
              } lg:block space-y-6`}
            >
              {/* Sort By */}
              <Card className="shadow-sm border border-gray-100">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <SlidersHorizontal
                      size={18}
                      className="mr-2 text-red-600"
                    />
                    Sort By
                  </h3>
                  <div className="space-y-2">
                    {sortOptions.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="sort"
                          value={option.value}
                          checked={sortBy === option.value}
                          onChange={(e) =>
                            setSortBy(e.target.value as SortOption)
                          }
                          className="mr-3 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                        />
                        <div className="flex items-center">
                          {option.icon}
                          <span className="ml-2 text-sm text-gray-700">
                            {option.label}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Service Type */}
              <Card className="shadow-sm border border-gray-100">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Car size={18} className="mr-2 text-red-600" />
                    Service Type
                  </h3>
                  <div className="space-y-2">
                    {serviceTypes.map((service) => (
                      <label
                        key={service.value}
                        className="flex items-center cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="serviceType"
                          value={service.value}
                          checked={selectedServiceType === service.value}
                          onChange={(e) =>
                            setSelectedServiceType(
                              e.target.value as ServiceType
                            )
                          }
                          className="mr-3 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                        />
                        <span className="text-sm text-gray-700">
                          {service.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Fare Range */}
              <Card className="shadow-sm border border-gray-100">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <DollarSign size={18} className="mr-2 text-red-600" />
                    Fare Range
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <label className="block text-sm text-gray-600 mb-1">
                          Min Fare
                        </label>
                        <input
                          type="number"
                          value={fareRange[0]}
                          onChange={(e) =>
                            setFareRange([
                              Number.parseInt(e.target.value) || 0,
                              fareRange[1],
                            ])
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="1000"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm text-gray-600 mb-1">
                          Max Fare
                        </label>
                        <input
                          type="number"
                          value={fareRange[1]}
                          onChange={(e) =>
                            setFareRange([
                              fareRange[0],
                              Number.parseInt(e.target.value) || 10000,
                            ])
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="10000"
                        />
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      ৳{fareRange[0].toLocaleString()} - ৳
                      {fareRange[1].toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Car Type */}
              <Card className="shadow-sm border border-gray-100">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Car size={18} className="mr-2 text-red-600" />
                    Car Type
                  </h3>
                  <div className="space-y-2">
                    {carTypes.map(({ value, label }) => (
                      <label
                        key={value}
                        className="flex items-center cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCarTypes.includes(value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCarTypes([...selectedCarTypes, value]);
                            } else {
                              setSelectedCarTypes(
                                selectedCarTypes.filter((t) => t !== value)
                              );
                            }
                          }}
                          className="mr-3 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Capacity */}
              <Card className="shadow-sm border border-gray-100">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Users size={18} className="mr-2 text-red-600" />
                    Capacity
                  </h3>
                  <div className="space-y-2">
                    {capacityOptions.map(({ value, label }) => (
                      <label
                        key={value}
                        className="flex items-center cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCapacity.includes(value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCapacity([...selectedCapacity, value]);
                            } else {
                              setSelectedCapacity(
                                selectedCapacity.filter((c) => c !== value)
                              );
                            }
                          }}
                          className="mr-3 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">
                          {label}+ passengers
                        </span>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Availability */}
              <Card className="shadow-sm border border-gray-100">
                <CardContent className="p-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showAvailableOnly}
                      onChange={(e) => setShowAvailableOnly(e.target.checked)}
                      className="mr-3 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      Show available cars only
                    </span>
                  </label>
                </CardContent>
              </Card>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 mb-6 text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {filteredCars.length} Cars Available
                  </h1>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin size={16} className="mr-1" />
                    <span className="mr-4">Dhaka, Bangladesh</span>
                    <span className="capitalize">
                      {selectedServiceType.replace("-", " ")} Service
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

            {/* Cars List */}
            <div className="space-y-4">
              {filteredCars.map((car, index) => (
                <Card
                  key={car.id}
                  className={`transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 animate-fade-in ${
                    !car.available ? "opacity-75" : ""
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      {/* Car Image */}
                      <div className="sm:w-80 h-48 sm:h-auto relative flex-shrink-0">
                        <Image
                          src={
                            car.image || "/placeholder.svg?height=200&width=320"
                          }
                          alt={car.name}
                          width={320} // intrinsic size
                          height={200}
                          className="w-full h-full object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
                        />

                        {!car.available && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-t-lg sm:rounded-l-lg sm:rounded-t-none">
                            <span className="text-white font-medium">
                              Currently Unavailable
                            </span>
                          </div>
                        )}
                        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-md flex items-center shadow-sm">
                          {renderStars(car.rating)}
                          <span className="ml-1 text-sm font-medium text-gray-700">
                            {car.rating}
                          </span>
                        </div>
                      </div>

                      {/* Car Details */}
                      <div className="flex-1 p-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between h-full">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                  {car.name}
                                </h3>
                                <p className="text-gray-600 mb-2">{car.type}</p>
                              </div>
                            </div>

                            {/* Capacity and Features */}
                            <div className="flex items-center mb-3">
                              <Users size={16} className="text-gray-400 mr-2" />
                              <span className="text-sm text-gray-600 mr-4">
                                {car.capacity} passengers
                              </span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  car.available
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {car.available ? "Available" : "Unavailable"}
                              </span>
                            </div>

                            {/* Features */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {car.features.slice(0, 5).map((feature, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center bg-gray-100 px-2 py-1 rounded-md text-xs text-gray-600"
                                >
                                  {getFeatureIcon(feature)}
                                  <span className="ml-1">{feature}</span>
                                </div>
                              ))}
                              {car.features.length > 5 && (
                                <div className="bg-gray-100 px-2 py-1 rounded-md text-xs text-gray-600">
                                  +{car.features.length - 5} more
                                </div>
                              )}
                            </div>

                            {/* Driver Info */}
                            <div className="bg-gray-50 p-3 rounded-md">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {car.driverName}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    Professional Driver
                                  </p>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {car.driverPhone}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Price and Actions */}
                          <div className="mt-4 sm:mt-0 sm:ml-6 flex flex-col justify-between items-end min-w-[200px]">
                            <div className="text-right mb-4">
                              <div className="text-2xl font-bold text-gray-900 mb-1">
                                ৳{getEstimatedFare(car).toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-500 mb-1">
                                estimated total
                              </div>
                              <div className="text-sm text-gray-600">
                                {getFareDisplay(car)}
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                              <button
                                disabled={!car.available}
                                className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                              >
                                Request Ride
                              </button>
                              <button
                                disabled={!car.available}
                                className="flex items-center justify-center px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                              >
                                <Phone
                                  size={16}
                                  className="mr-1 cursor-pointer"
                                />
                                Call Driver
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {filteredCars.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
                  <Car size={32} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No rides available
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  No cars match your current filters. Try adjusting your search
                  criteria to find more options.
                </p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Load More Button */}
            {filteredCars.length > 0 && (
              <div className="text-center mt-8 mb-8">
                <button className="px-8 py-3 font-medium border border-red-300 text-red-600 rounded-md hover: transition-colors cursor-pointer">
                  Load More Cars
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal Overlay */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full max-h-[80vh] overflow-y-auto rounded-t-xl animate-slide-up">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Filters & Sort
              </h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-6">
              {/* Mobile filter content would go here - same as desktop but in modal */}
              <div className="flex gap-2">
                <button
                  onClick={clearFilters}
                  className="flex-1 px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
