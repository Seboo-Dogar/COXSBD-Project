"use client";

import React, { useState, useMemo } from "react";
import { Filter, Bus, X, MapPin } from "lucide-react";
import BusSearchForm from "@/components/bus/BusSearchForm";
import FilterPanel from "@/components/bus/FilterPanel";
import TripCard from "@/components/bus/TripCard";
import { BusTrip, TimeSlot, SortOption } from "@/types/Bus";
import { inTimeSlot, parseDurationToMinutes, getHour } from "@/lib/bus-utils";

interface BusSearchClientProps {
  initialTrips: BusTrip[];
}

export default function BusSearchClient({ initialTrips }: BusSearchClientProps) {
  // UI States
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter States
  const [sortBy, setSortBy] = useState<SortOption>("rating_high");
  const [fareRange, setFareRange] = useState<[number, number]>(() => {
    const prices = initialTrips.map(t => t.pricePerSeat);
    return [Math.min(...prices), Math.max(...prices)];
  });
  const [selectedBusTypes, setSelectedBusTypes] = useState<string[]>([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedOperators, setSelectedOperators] = useState<string[]>([]);
  const [showAvailableOnly, setShowAvailableOnly] = useState<boolean>(false);

  const clearFilters = () => {
    const prices = initialTrips.map(t => t.pricePerSeat);
    setSortBy("rating_high");
    setFareRange([Math.min(...prices), Math.max(...prices)]);
    setSelectedBusTypes([]);
    setSelectedTimeSlots([]);
    setSelectedOperators([]);
    setShowAvailableOnly(false);
    setCurrentPage(1);
  };

  // Logic for filtering and sorting
  const filteredTrips = useMemo(() => {
    let result = [...initialTrips];
    if (showAvailableOnly) result = result.filter(t => t.available && t.availableSeats > 0);
    if (selectedBusTypes.length > 0) result = result.filter(t => selectedBusTypes.includes(t.busType));
    if (selectedOperators.length > 0) result = result.filter(t => selectedOperators.includes(t.operator));
    if (selectedTimeSlots.length > 0) {
      result = result.filter(t => selectedTimeSlots.some(slot => inTimeSlot(t.departureTime, slot)));
    }
    result = result.filter(t => t.pricePerSeat >= fareRange[0] && t.pricePerSeat <= fareRange[1]);

    return result.sort((a, b) => {
      switch (sortBy) {
        case "fare_low": return a.pricePerSeat - b.pricePerSeat;
        case "fare_high": return b.pricePerSeat - a.pricePerSeat;
        case "earliest_departure": return getHour(a.departureTime) - getHour(b.departureTime);
        case "shortest_duration": return parseDurationToMinutes(a.duration) - parseDurationToMinutes(b.duration);
        default: return b.rating - a.rating;
      }
    });
  }, [initialTrips, sortBy, fareRange, selectedBusTypes, selectedTimeSlots, selectedOperators, showAvailableOnly]);

  const totalPages = Math.ceil(filteredTrips.length / itemsPerPage);
  const paginatedTrips = filteredTrips.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const filterProps = {
    sortBy, setSortBy, fareRange, setFareRange,
    selectedBusTypes, setSelectedBusTypes,
    selectedTimeSlots, setSelectedTimeSlots,
    selectedOperators, setSelectedOperators,
    showAvailableOnly, setShowAvailableOnly,
    allOperators: Array.from(new Set(initialTrips.map(t => t.operator))).sort(),
    onClear: clearFilters
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-6 pb-20">
      <BusSearchForm />

      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:w-80 shrink-0">
          <FilterPanel {...filterProps} />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {/* Results Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{filteredTrips.length} Trips Available</h1>
              <p className="text-gray-500 text-sm flex items-center mt-1">
                <MapPin size={14} className="mr-1" /> Search Results
              </p>
            </div>
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Filter size={18} /> Filters
            </button>
          </div>

          {/* List of Trips */}
          <div className="space-y-4">
            {paginatedTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}

            {/* Empty State */}
            {filteredTrips.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
                  <Bus size={32} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No trips available</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">No trips match your current filters.</p>
                <button onClick={clearFilters} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md cursor-pointer transition-colors">
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredTrips.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8 mb-10">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
                disabled={currentPage === 1}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-2 border rounded-md text-sm ${currentPage === i + 1 ? "bg-red-600 text-white border-red-600" : "hover:bg-gray-50"}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Modal */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full max-h-[85vh] overflow-y-auto rounded-t-xl shadow-2xl">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold text-gray-900">Filters & Sort</h3>
              <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
            </div>
            <div className="p-4 space-y-6">
              <FilterPanel {...filterProps} />
              <div className="flex gap-2 sticky bottom-0 bg-white pt-2 pb-4">
                <button onClick={clearFilters} className="flex-1 px-4 py-3 text-red-600 border border-red-600 rounded-lg">Clear All</button>
                <button onClick={() => setShowFilters(false)} className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg">Apply Filters</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}