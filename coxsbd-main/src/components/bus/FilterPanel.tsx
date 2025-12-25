import React from "react";
import { Star, Clock, Bus as BusIcon } from "lucide-react";
import { BusTrip, TimeSlot, SortOption } from "@/types/Bus";

interface FilterPanelProps {
  sortBy: SortOption;
  setSortBy: (val: SortOption) => void;
  fareRange: [number, number];
  setFareRange: (val: [number, number]) => void;
  selectedBusTypes: string[];
  setSelectedBusTypes: React.Dispatch<React.SetStateAction<string[]>>;
  selectedTimeSlots: TimeSlot[];
  setSelectedTimeSlots: React.Dispatch<React.SetStateAction<TimeSlot[]>>;
  selectedOperators: string[];
  setSelectedOperators: React.Dispatch<React.SetStateAction<string[]>>;
  showAvailableOnly: boolean;
  setShowAvailableOnly: (val: boolean) => void;
  allOperators: string[];
}

export default function FilterPanel({
  sortBy, setSortBy, fareRange, setFareRange,
  selectedBusTypes, setSelectedBusTypes,
  selectedTimeSlots, setSelectedTimeSlots,
  selectedOperators, setSelectedOperators,
  showAvailableOnly, setShowAvailableOnly,
  allOperators
}: FilterPanelProps) {

  const toggleItem = (list: any[], item: any, setter: Function) => {
    setter(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  return (
    <div className="space-y-8 bg-white p-2 lg:p-0">
      {/* Sort By Section */}
      <section>
        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Sort By</h4>
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
        >
          <option value="rating_high">Top Rated</option>
          <option value="fare_low">Price: Low to High</option>
          <option value="fare_high">Price: High to Low</option>
          <option value="earliest_departure">Earliest Departure</option>
          <option value="shortest_duration">Shortest Trip</option>
        </select>
      </section>

      {/* Price Range Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Price Range</h4>
          <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">₹{fareRange[1]}</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="5000" 
          step="100"
          value={fareRange[1]}
          onChange={(e) => setFareRange([fareRange[0], parseInt(e.target.value)])}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-bold">
          <span>MIN: ₹{fareRange[0]}</span>
          <span>MAX: ₹5000</span>
        </div>
      </section>

      {/* Time Slot Section */}
      <section>
        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Clock size={16} /> Departure Time
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {(["morning", "afternoon", "evening", "night"] as TimeSlot[]).map((slot) => (
            <button
              key={slot}
              onClick={() => toggleItem(selectedTimeSlots, slot, setSelectedTimeSlots)}
              className={`py-2 px-3 text-xs rounded-lg border transition-all capitalize ${
                selectedTimeSlots.includes(slot)
                  ? "bg-red-600 border-red-600 text-white shadow-md shadow-red-200"
                  : "bg-white border-gray-200 text-gray-600 hover:border-red-300"
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </section>

      {/* Bus Type Section */}
      <section>
        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <BusIcon size={16} /> Bus Type
        </h4>
        {["AC Sleeper", "Non-AC Sleeper", "AC Seater", "Luxury"].map((type) => (
          <label key={type} className="flex items-center group mb-3 last:mb-0 cursor-pointer">
            <input 
              type="checkbox"
              checked={selectedBusTypes.includes(type)}
              onChange={() => toggleItem(selectedBusTypes, type, setSelectedBusTypes)}
              className="w-4 h-4 rounded text-red-600 border-gray-300 focus:ring-red-500 cursor-pointer" 
            />
            <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{type}</span>
          </label>
        ))}
      </section>

      {/* Operators Section */}
      <section>
        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Bus Operators</h4>
        <div className="max-h-48 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-gray-200">
          {allOperators.map((op) => (
            <label key={op} className="flex items-center group cursor-pointer">
              <input 
                type="checkbox"
                checked={selectedOperators.includes(op)}
                onChange={() => toggleItem(selectedOperators, op, setSelectedOperators)}
                className="w-4 h-4 rounded text-red-600 border-gray-300 focus:ring-red-500 cursor-pointer" 
              />
              <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900 transition-colors truncate">{op}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Toggle Available Only */}
      <section className="pt-6 border-t border-gray-100">
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            checked={showAvailableOnly}
            onChange={(e) => setShowAvailableOnly(e.target.checked)}
            className="sr-only peer" 
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
          <span className="ml-3 text-sm font-medium text-gray-700">Available Only</span>
        </label>
      </section>
    </div>
  );
}