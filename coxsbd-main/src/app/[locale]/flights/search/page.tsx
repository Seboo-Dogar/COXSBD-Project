"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Star,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  TrendingUp,
  Award,
  DollarSign,
  Plane,
  X,
  Wifi,
  Navigation,
  MapPin,
  Clock,
  Calendar,
  Luggage,
  Utensils,
  Tv,
  Power,
  Headphones,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Image from "next/image";
import FlightSearchForm from "@/components/flight/FlightSearchForm";

// Types & Constants
interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  aircraft: string;
  image: string;
  rating: number;
  amenities: string[];
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  cabinClass: "Economy" | "Premium Economy" | "Business" | "First";
  stops: number;
  departureTerminal: string;
  arrivalTerminal: string;
  baggageAllowance: string;
  refundable: boolean;
}

type SortOption =
  | "price_low"
  | "price_high"
  | "duration_short"
  | "departure_early"
  | "arrival_early"
  | "airline_asc"
  | "rating_high";

type CabinClass = "Economy" | "Premium Economy" | "Business" | "First";

const sortOptions: {
  value: SortOption;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "price_low",
    label: "Price (Low to High)",
    icon: <TrendingUp size={16} />,
  },
  {
    value: "price_high",
    label: "Price (High to Low)",
    icon: <ArrowUpDown size={16} />,
  },
  {
    value: "duration_short",
    label: "Shortest Duration",
    icon: <Clock size={16} />,
  },
  {
    value: "departure_early",
    label: "Earliest Departure",
    icon: <Clock size={16} />,
  },
  {
    value: "arrival_early",
    label: "Earliest Arrival",
    icon: <Clock size={16} />,
  },
  {
    value: "airline_asc",
    label: "Airline (A-Z)",
    icon: <Plane size={16} />,
  },
  {
    value: "rating_high",
    label: "Highest Rating",
    icon: <Award size={16} />,
  },
];

const cabinClasses: CabinClass[] = [
  "Economy",
  "Premium Economy",
  "Business",
  "First",
];

const stopsOptions = [
  { value: 0, label: "Non-stop" },
  { value: 1, label: "1 Stop" },
  { value: 2, label: "2+ Stops" },
];

const timeSlots = [
  { value: "morning", label: "Morning (05:00–11:59)" },
  { value: "afternoon", label: "Afternoon (12:00–15:59)" },
  { value: "evening", label: "Evening (16:00–19:59)" },
  { value: "night", label: "Night (20:00–04:59)" },
];

// Mock data
const mockFlights: Flight[] = [
  {
    id: "f1",
    airline: "Biman Bangladesh",
    flightNumber: "BG 101",
    aircraft: "Boeing 787-8",
    image: "/images/flight1.jpg",
    rating: 4.2,
    amenities: ["Meal", "Entertainment", "WiFi", "USB Port"],
    departureAirport: "DAC",
    arrivalAirport: "JFK",
    departureTime: "22:30",
    arrivalTime: "06:20",
    duration: "14h 50m",
    price: 120000,
    availableSeats: 12,
    totalSeats: 240,
    cabinClass: "Business",
    stops: 0,
    departureTerminal: "I",
    arrivalTerminal: "4",
    baggageAllowance: "2 x 32kg",
    refundable: true,
  },
  {
    id: "f2",
    airline: "Emirates",
    flightNumber: "EK 584",
    aircraft: "Airbus A380",
    image: "/images/flight2.jpg",
    rating: 4.8,
    amenities: ["Meal", "Entertainment", "WiFi", "USB Port", "Lie-flat Seat"],
    departureAirport: "DAC",
    arrivalAirport: "DXB",
    departureTime: "08:15",
    arrivalTime: "11:45",
    duration: "4h 30m",
    price: 45000,
    availableSeats: 5,
    totalSeats: 517,
    cabinClass: "Economy",
    stops: 0,
    departureTerminal: "I",
    arrivalTerminal: "3",
    baggageAllowance: "30kg",
    refundable: false,
  },
  {
    id: "f3",
    airline: "Qatar Airways",
    flightNumber: "QR 648",
    aircraft: "Boeing 777-300ER",
    image: "/images/flight3.jpg",
    rating: 4.7,
    amenities: ["Meal", "Entertainment", "WiFi", "USB Port", "Lie-flat Seat"],
    departureAirport: "DAC",
    arrivalAirport: "DOH",
    departureTime: "02:30",
    arrivalTime: "05:15",
    duration: "5h 45m",
    price: 38000,
    availableSeats: 8,
    totalSeats: 335,
    cabinClass: "Premium Economy",
    stops: 1,
    departureTerminal: "I",
    arrivalTerminal: "A",
    baggageAllowance: "35kg",
    refundable: true,
  },
  {
    id: "f4",
    airline: "Singapore Airlines",
    flightNumber: "SQ 446",
    aircraft: "Airbus A350-900",
    image: "/images/flight4.jpg",
    rating: 4.9,
    amenities: ["Meal", "Entertainment", "WiFi", "USB Port", "Lie-flat Seat"],
    departureAirport: "DAC",
    arrivalAirport: "SIN",
    departureTime: "15:45",
    arrivalTime: "21:30",
    duration: "4h 45m",
    price: 52000,
    availableSeats: 0,
    totalSeats: 253,
    cabinClass: "First",
    stops: 0,
    departureTerminal: "I",
    arrivalTerminal: "3",
    baggageAllowance: "50kg",
    refundable: true,
  },
  {
    id: "f5",
    airline: "Turkish Airlines",
    flightNumber: "TK 712",
    aircraft: "Boeing 787-9",
    image: "/images/flight5.jpg",
    rating: 4.5,
    amenities: ["Meal", "Entertainment", "WiFi", "USB Port"],
    departureAirport: "DAC",
    arrivalAirport: "IST",
    departureTime: "23:45",
    arrivalTime: "05:10",
    duration: "8h 25m",
    price: 65000,
    availableSeats: 14,
    totalSeats: 300,
    cabinClass: "Business",
    stops: 0,
    departureTerminal: "I",
    arrivalTerminal: "I",
    baggageAllowance: "2 x 32kg",
    refundable: true,
  },
  {
    id: "f6",
    airline: "Etihad Airways",
    flightNumber: "EY 283",
    aircraft: "Boeing 777-300ER",
    image: "/images/flight6.jpg",
    rating: 4.6,
    amenities: ["Meal", "Entertainment", "WiFi", "USB Port", "Lie-flat Seat"],
    departureAirport: "DAC",
    arrivalAirport: "AUH",
    departureTime: "19:30",
    arrivalTime: "23:15",
    duration: "4h 45m",
    price: 48000,
    availableSeats: 22,
    totalSeats: 328,
    cabinClass: "Economy",
    stops: 0,
    departureTerminal: "I",
    arrivalTerminal: "3",
    baggageAllowance: "30kg",
    refundable: false,
  },
];

const parseDurationToMinutes = (d: string): number => {
  const h = /(\d+)h/.exec(d)?.[1];
  const m = /(\d+)m/.exec(d)?.[1];
  return (h ? parseInt(h) : 0) * 60 + (m ? parseInt(m) : 0);
};

const getHour = (hhmm: string): number => {
  const [h] = hhmm.split(":");
  return parseInt(h);
};

const inTimeSlot = (time: string, slot: string): boolean => {
  const hour = getHour(time);
  const def = timeSlots.find((s) => s.value === slot)!;
  const [start, end] = def.label.includes("Morning")
    ? [5, 11]
    : def.label.includes("Afternoon")
      ? [12, 15]
      : def.label.includes("Evening")
        ? [16, 19]
        : [20, 4];

  if (start <= end) {
    return hour >= start && hour <= end;
  }
  return hour >= start || hour <= end;
};

const amenityIcon = (amenity: string) => {
  const a = amenity.toLowerCase();
  if (a.includes("wifi")) return <Wifi size={14} />;
  if (a.includes("entertainment")) return <Tv size={14} />;
  if (a.includes("meal")) return <Utensils size={14} />;
  if (a.includes("usb")) return <Power size={14} />;
  if (a.includes("lie-flat")) return <span className="text-blue-500">🛏️</span>;
  return <Headphones size={14} />;
};

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

type FilterPanelProps = {
  sortBy: SortOption;
  setSortBy: (value: SortOption) => void;
  priceRange: [number, number];
  setPriceRange: (value: [number, number]) => void;
  selectedCabinClasses: CabinClass[];
  setSelectedCabinClasses: (value: CabinClass[]) => void;
  selectedTimeSlots: string[];
  setSelectedTimeSlots: (value: string[]) => void;
  selectedAirlines: string[];
  setSelectedAirlines: (value: string[]) => void;
  selectedStops: number[];
  setSelectedStops: (value: number[]) => void;
  showAvailableOnly: boolean;
  setShowAvailableOnly: (value: boolean) => void;
  showRefundableOnly: boolean;
  setShowRefundableOnly: (value: boolean) => void;
  allAirlines: string[];
  onClear: () => void;
};

function FilterPanel(props: FilterPanelProps) {
  const {
    sortBy,
    setSortBy,
    priceRange,
    setPriceRange,
    selectedCabinClasses,
    setSelectedCabinClasses,
    selectedTimeSlots,
    setSelectedTimeSlots,
    selectedAirlines,
    setSelectedAirlines,
    selectedStops,
    setSelectedStops,
    showAvailableOnly,
    setShowAvailableOnly,
    showRefundableOnly,
    setShowRefundableOnly,
    allAirlines,
    onClear,
  } = props;

  return (
    <div className="space-y-6">
      {/* Sort By */}
      <Card className="shadow-sm border border-gray-100">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <SlidersHorizontal size={18} className="mr-2 text-red-600" />
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
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
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

      {/* Price Range */}
      <Card className="shadow-sm border border-gray-100">
        <CardContent className="p-4">
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
                    setPriceRange([Number(e.target.value) || 0, priceRange[1]])
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="10000"
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
                      Number(e.target.value) || 500000,
                    ])
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="200000"
                />
              </div>
            </div>
            <div className="text-sm text-gray-600">
              ৳{priceRange[0].toLocaleString()} – ৳
              {priceRange[1].toLocaleString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cabin Class */}
      <Card className="shadow-sm border border-gray-100">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Luggage size={18} className="mr-2 text-red-600" />
            Cabin Class
          </h3>
          <div className="space-y-2">
            {cabinClasses.map((cabin) => (
              <label key={cabin} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCabinClasses.includes(cabin)}
                  onChange={(e) => {
                    if (e.target.checked)
                      setSelectedCabinClasses([...selectedCabinClasses, cabin]);
                    else
                      setSelectedCabinClasses(
                        selectedCabinClasses.filter((c) => c !== cabin)
                      );
                  }}
                  className="mr-3 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{cabin}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Departure Time */}
      <Card className="shadow-sm border border-gray-100">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock size={18} className="mr-2 text-red-600" />
            Departure Time
          </h3>
          <div className="space-y-2">
            {timeSlots.map(({ value, label }) => (
              <label key={value} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedTimeSlots.includes(value)}
                  onChange={(e) => {
                    if (e.target.checked)
                      setSelectedTimeSlots([...selectedTimeSlots, value]);
                    else
                      setSelectedTimeSlots(
                        selectedTimeSlots.filter((v) => v !== value)
                      );
                  }}
                  className="mr-3 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stops */}
      <Card className="shadow-sm border border-gray-100">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Navigation size={18} className="mr-2 text-red-600" />
            Stops
          </h3>
          <div className="space-y-2">
            {stopsOptions.map(({ value, label }) => (
              <label key={value} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedStops.includes(value)}
                  onChange={(e) => {
                    if (e.target.checked)
                      setSelectedStops([...selectedStops, value]);
                    else
                      setSelectedStops(
                        selectedStops.filter((v) => v !== value)
                      );
                  }}
                  className="mr-3 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Airlines */}
      <Card className="shadow-sm border border-gray-100">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Plane size={18} className="mr-2 text-red-600" />
            Airlines
          </h3>
          <div className="space-y-2 max-h-44 overflow-auto pr-1">
            {allAirlines.map((airline) => (
              <label key={airline} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedAirlines.includes(airline)}
                  onChange={(e) => {
                    if (e.target.checked)
                      setSelectedAirlines([...selectedAirlines, airline]);
                    else
                      setSelectedAirlines(
                        selectedAirlines.filter((a) => a !== airline)
                      );
                  }}
                  className="mr-3 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{airline}</span>
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
              Show flights with seats available
            </span>
          </label>
        </CardContent>
      </Card>

      {/* Refundable */}
      <Card className="shadow-sm border border-gray-100">
        <CardContent className="p-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showRefundableOnly}
              onChange={(e) => setShowRefundableOnly(e.target.checked)}
              className="mr-3 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">
              Show refundable flights only
            </span>
          </label>
        </CardContent>
      </Card>

      {/* Clear */}
      <button
        onClick={onClear}
        className="w-full px-4 py-2 mb-6 text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
      >
        Clear All Filters
      </button>
    </div>
  );
}

export default function FlightSearchPage() {
  // Data
  const [flights, setFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);

  // UI
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [sortBy, setSortBy] = useState<SortOption>("price_low");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    10000, 200000,
  ]);
  const [selectedCabinClasses, setSelectedCabinClasses] = useState<
    CabinClass[]
  >([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [selectedStops, setSelectedStops] = useState<number[]>([]);
  const [showAvailableOnly, setShowAvailableOnly] = useState<boolean>(false);
  const [showRefundableOnly, setShowRefundableOnly] = useState<boolean>(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Derived
  const totalPages = Math.ceil(filteredFlights.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFlights = filteredFlights.slice(startIndex, endIndex);

  // Airlines list from data
  const allAirlines = useMemo(
    () => Array.from(new Set(flights.map((f) => f.airline))).sort(),
    [flights]
  );

  useEffect(() => {
    // simulate fetch
    setFlights(mockFlights);
    setLoading(false);
  }, []);

  // Filtering & sorting
  useEffect(() => {
    try {
      let f = [...flights];

      if (showAvailableOnly)
        f = f.filter((flight) => flight.availableSeats > 0);
      if (showRefundableOnly) f = f.filter((flight) => flight.refundable);
      if (selectedCabinClasses.length > 0)
        f = f.filter((flight) =>
          selectedCabinClasses.includes(flight.cabinClass)
        );
      if (selectedAirlines.length > 0)
        f = f.filter((flight) => selectedAirlines.includes(flight.airline));
      if (selectedStops.length > 0) {
        f = f.filter((flight) => {
          if (selectedStops.includes(2)) {
            return flight.stops >= 2 || selectedStops.includes(flight.stops);
          }
          return selectedStops.includes(flight.stops);
        });
      }

      // time slots
      if (selectedTimeSlots.length > 0) {
        f = f.filter((flight) =>
          selectedTimeSlots.some((slot) =>
            inTimeSlot(flight.departureTime, slot)
          )
        );
      }

      // price range
      f = f.filter(
        (flight) =>
          flight.price >= priceRange[0] && flight.price <= priceRange[1]
      );

      // sort
      f.sort((a, b) => {
        switch (sortBy) {
          case "airline_asc":
            return a.airline.localeCompare(b.airline);
          case "price_low":
            return a.price - b.price;
          case "price_high":
            return b.price - a.price;
          case "duration_short":
            return (
              parseDurationToMinutes(a.duration) -
              parseDurationToMinutes(b.duration)
            );
          case "departure_early":
            return getHour(a.departureTime) - getHour(b.departureTime);
          case "arrival_early":
            return getHour(a.arrivalTime) - getHour(b.arrivalTime);
          case "rating_high":
          default:
            return b.rating - a.rating;
        }
      });

      setFilteredFlights(f);
      setCurrentPage(1);
    } catch (e: unknown) {
      if (typeof e === "object" && e !== null && "message" in e) {
        setError(
          (e as { message?: string }).message || "Failed to filter flights"
        );
      } else {
        setError("Failed to filter flights");
      }
    }
  }, [
    flights,
    sortBy,
    priceRange,
    selectedCabinClasses,
    selectedTimeSlots,
    selectedAirlines,
    selectedStops,
    showAvailableOnly,
    showRefundableOnly,
  ]);

  const clearFilters = () => {
    setSortBy("price_low");
    setPriceRange([10000, 200000]);
    setSelectedCabinClasses([]);
    setSelectedTimeSlots([]);
    setSelectedAirlines([]);
    setSelectedStops([]);
    setShowAvailableOnly(false);
    setShowRefundableOnly(false);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-12 h-12 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="sr-only">Loading flights...</span>
      </div>
    );

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Search Form */}
      <div className="max-w-7xl mx-auto px-4">
        <FlightSearchForm />
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-80">
            {/* Mobile Toggle */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 shadow-sm"
              >
                <Filter size={16} className="mr-2" />
                Filters & Sort
              </button>
            </div>

            {/* Filters Panel (Desktop) */}
            <div
              className={`${showFilters ? "block" : "hidden"} lg:block space-y-6`}
            >
              <FilterPanel
                sortBy={sortBy}
                setSortBy={setSortBy}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                selectedCabinClasses={selectedCabinClasses}
                setSelectedCabinClasses={setSelectedCabinClasses}
                selectedTimeSlots={selectedTimeSlots}
                setSelectedTimeSlots={setSelectedTimeSlots}
                selectedAirlines={selectedAirlines}
                setSelectedAirlines={setSelectedAirlines}
                selectedStops={selectedStops}
                setSelectedStops={setSelectedStops}
                showAvailableOnly={showAvailableOnly}
                setShowAvailableOnly={setShowAvailableOnly}
                showRefundableOnly={showRefundableOnly}
                setShowRefundableOnly={setShowRefundableOnly}
                allAirlines={allAirlines}
                onClear={clearFilters}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {filteredFlights.length} Flights Available
                  </h1>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin size={16} className="mr-1" />
                    <span className="mr-4">Popular international routes</span>
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

            {/* Flight Cards */}
            <div className="space-y-4">
              {currentFlights.map((flight, index) => (
                <Card
                  key={flight.id}
                  className={`transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${flight.availableSeats === 0 ? "opacity-75" : ""}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      {/* Image */}
                      <div className="sm:w-80 h-48 sm:h-auto relative flex-shrink-0">
                        <Image
                          src="/images/plane1.png"
                          alt="Plane"
                          width={320}
                          height={200}
                          className="w-full h-full object-cover rounded-t-lg"
                        />

                        {flight.availableSeats === 0 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg sm:rounded-l-lg sm:rounded-t-none">
                            <span className="text-white font-medium">
                              Sold Out
                            </span>
                          </div>
                        )}

                        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-md flex items-center shadow-sm">
                          {renderStars(flight.rating)}
                          <span className="ml-1 text-sm font-medium text-gray-700">
                            {flight.rating}
                          </span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex-1 p-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between h-full">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                  {flight.airline} — {flight.flightNumber}
                                </h3>
                                <p className="text-gray-600 mb-2">
                                  {flight.aircraft} • {flight.cabinClass}
                                </p>
                              </div>
                            </div>

                            {/* Route & Time */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                              <div className="flex items-center text-sm text-gray-700">
                                <MapPin
                                  size={16}
                                  className="mr-2 text-gray-400"
                                />
                                <span>
                                  {flight.departureAirport} →{" "}
                                  {flight.arrivalAirport}
                                  {flight.stops > 0 &&
                                    ` (${flight.stops} stop${flight.stops > 1 ? "s" : ""})`}
                                </span>
                              </div>
                              <div className="flex items-center text-sm text-gray-700">
                                <Clock
                                  size={16}
                                  className="mr-2 text-gray-400"
                                />
                                <span>
                                  {flight.departureTime} — {flight.arrivalTime}{" "}
                                  • {flight.duration}
                                </span>
                              </div>
                              <div className="flex items-center text-sm text-gray-700">
                                <Luggage
                                  size={16}
                                  className="mr-2 text-gray-400"
                                />
                                <span>
                                  {flight.baggageAllowance} •{" "}
                                  {flight.refundable
                                    ? "Refundable"
                                    : "Non-refundable"}
                                </span>
                              </div>
                            </div>

                            {/* Amenities */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {flight.amenities.slice(0, 6).map((am, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center bg-gray-100 px-2 py-1 rounded-md text-xs text-gray-600"
                                >
                                  {amenityIcon(am)}
                                  <span className="ml-1">{am}</span>
                                </div>
                              ))}
                              {flight.amenities.length > 6 && (
                                <div className="bg-gray-100 px-2 py-1 rounded-md text-xs text-gray-600">
                                  +{flight.amenities.length - 6} more
                                </div>
                              )}
                            </div>

                            {/* Terminals */}
                            <div className="bg-gray-50 p-3 rounded-md">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">
                                    Departure Terminal
                                  </p>
                                  <p className="text-sm text-gray-900">
                                    {flight.departureTerminal}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">
                                    Arrival Terminal
                                  </p>
                                  <p className="text-sm text-gray-900">
                                    {flight.arrivalTerminal}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Price & Actions */}
                          <div className="mt-4 sm:mt-0 sm:ml-6 flex flex-col justify-between items-end min-w-[220px]">
                            <div className="text-right mb-4">
                              <div className="text-2xl font-bold text-gray-900 mb-1">
                                ৳{flight.price.toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-500 mb-1">
                                per passenger
                              </div>
                              <div className="text-sm text-gray-600">
                                {flight.availableSeats} seats left
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                              <button
                                disabled={flight.availableSeats === 0}
                                className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                              >
                                Select Flight
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
            {filteredFlights.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
                  <Plane size={32} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No flights available
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  No flights match your current filters. Try adjusting your
                  search criteria to find more options.
                </p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {filteredFlights.length > 0 && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8 mb-10">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }).map((_, i) => {
                  const n = i + 1;
                  const active = n === currentPage;
                  return (
                    <button
                      key={n}
                      onClick={() => setCurrentPage(n)}
                      className={`px-3 py-2 border rounded-md text-sm ${
                        active
                          ? "bg-red-600 text-white border-red-600"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {n}
                    </button>
                  );
                })}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full max-h-[85vh] overflow-y-auto rounded-t-xl">
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
              <FilterPanel
                sortBy={sortBy}
                setSortBy={setSortBy}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                selectedCabinClasses={selectedCabinClasses}
                setSelectedCabinClasses={setSelectedCabinClasses}
                selectedTimeSlots={selectedTimeSlots}
                setSelectedTimeSlots={setSelectedTimeSlots}
                selectedAirlines={selectedAirlines}
                setSelectedAirlines={setSelectedAirlines}
                selectedStops={selectedStops}
                setSelectedStops={setSelectedStops}
                showAvailableOnly={showAvailableOnly}
                setShowAvailableOnly={setShowAvailableOnly}
                showRefundableOnly={showRefundableOnly}
                setShowRefundableOnly={setShowRefundableOnly}
                allAirlines={allAirlines}
                onClear={clearFilters}
              />

              <div className="flex gap-2 sticky bottom-0 bg-white pt-2">
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
