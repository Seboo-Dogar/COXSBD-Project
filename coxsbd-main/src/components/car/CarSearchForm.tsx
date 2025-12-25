// src/components/car/CarSearchForm.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import {
  Calendar,
  Car,
  MapPin, // Using MapPin for dropoff, MapPinHouse is less common
  Minus,
  Plus,
  Search,
  Users,
  ChevronDown,
} from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
// NOTE: Ensure react-datepicker styles are imported in your global CSS or setup.

export default function CarSearchForm() {
  const router = useRouter();

  // Search parameters
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [pickupDate, setPickupDate] = useState<Date | null>(null);
  const [showPassengers, setShowPassengers] = useState(false);
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const [showDropoffDropdown, setShowDropoffDropdown] = useState(false);
  const [men, setMen] = useState(1);
  const [women, setWomen] = useState(0);
  const [children, setChildren] = useState(0);

  const totalPassengers = men + women + children;
  const cities = ["Dhaka", "Chittagong", "Khulna", "Rajshahi", "Sylhet"];

  // Refs for closing dropdowns when clicking outside
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setShowPickupDropdown(false);
        setShowDropoffDropdown(false);
        setShowPassengers(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleSearch = () => {
    if (!pickup || !dropoff || !pickupDate) {
      // Use a more subtle notification method in a real app (e.g., toast/state)
      alert("Please fill Pickup, Drop-off locations and Pickup Date");
      return;
    }

    const dateStr = pickupDate.toISOString().split("T")[0];
    router.push(
      `/cars/search?pickup=${encodeURIComponent(
        pickup
      )}&dropoff=${encodeURIComponent(
        dropoff
      )}&date=${encodeURIComponent(dateStr)}&passengers=${totalPassengers}`
    );
  };

  return (
    // FIX: Using a standard grid layout with responsive columns instead of non-standard `xl:grid-cols-15`.
    // The columns are distributed as 4-4-3-3-2 (total 16, which is standard, or total 12 for md:grid).
    <div 
      ref={formRef} // Attach ref for outside click logic
      className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10 items-center bg-sky-50 rounded-xl p-6 md:p-8"
    >
      {/* Pickup (Column span 1/5) */}
      <div className="lg:col-span-1 flex flex-col relative">
        <label className="mb-1 font-medium text-lg">Starting Point</label>
        <div className="relative w-full"> {/* Ensure full width */}
          <Car className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={pickup}
            onChange={(e) => {
              setPickup(e.target.value);
              setShowPickupDropdown(true); // Show dropdown on change
            }}
            onFocus={() => setShowPickupDropdown(true)}
            placeholder="Enter pickup location"
            // FIX: Ensure input style matches parent height/padding
            className="w-full pl-10 pr-4 py-3 bg-white text-lg border-2 border-sky-300 hover:border-red-600 outline-red-600 rounded-md placeholder:text-gray-500 font-medium"
          />
          {showPickupDropdown && (
            <ul className="absolute z-50 bg-white border border-sky-300 mt-1 w-full rounded-md shadow-lg max-h-60 overflow-y-auto">
              {cities
                .filter(city => city.toLowerCase().includes(pickup.toLowerCase())) // Simple filtering
                .map((city) => (
                  <li
                    key={city}
                    className="px-4 py-3 hover:bg-sky-100 cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      setPickup(city);
                      setShowPickupDropdown(false);
                    }}
                  >
                    <MapPin className="w-4 h-4 text-gray-600" />
                    {city}
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>

      {/* Dropoff (Column span 1/5) */}
      <div className="lg:col-span-1 flex flex-col relative">
        <label className="mb-1 font-medium text-lg">Drop-off Point</label>
        <div className="relative w-full">
          {/* Using MapPin, as MapPinHouse is non-standard for this purpose */}
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" /> 
          <input
            type="text"
            value={dropoff}
            onChange={(e) => {
              setDropoff(e.target.value);
              setShowDropoffDropdown(true);
            }}
            onFocus={() => setShowDropoffDropdown(true)}
            placeholder="Enter drop-off location"
            className="w-full pl-10 pr-4 py-3 bg-white text-lg border-2 border-sky-300 hover:border-red-600 outline-red-600 rounded-md placeholder:text-gray-500 font-medium"
          />
          {showDropoffDropdown && (
            <ul className="absolute z-50 bg-white border border-sky-300 mt-1 w-full rounded-md shadow-lg max-h-60 overflow-y-auto">
              {cities
                .filter(city => city.toLowerCase().includes(dropoff.toLowerCase())) // Simple filtering
                .map((city) => (
                  <li
                    key={city}
                    className="px-4 py-3 hover:bg-sky-100 cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      setDropoff(city);
                      setShowDropoffDropdown(false);
                    }}
                  >
                    <MapPin className="w-4 h-4 text-gray-600" />
                    {city}
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>

      {/* Pickup Date (Column span 1/5) */}
      <div className="lg:col-span-1 flex flex-col">
        <label className="mb-1 font-medium text-lg">Pickup Date</label>
        <div className="flex items-center w-full px-4 h-[3.15rem] text-lg border-2 border-sky-300 rounded-md bg-white hover:border-red-600 font-medium">
          <Calendar className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
          <DatePicker
            selected={pickupDate}
            onChange={(date) => setPickupDate(date)}
            placeholderText="Select date"
            minDate={new Date()}
            dateFormat="dd/MM/yyyy"
            className="w-full text-md outline-none bg-transparent h-full placeholder:text-gray-500"
            wrapperClassName="datePickerWrapper w-full"
          />
        </div>
      </div>

      {/* Passengers (Column span 1/5) */}
      <div className="lg:col-span-1 flex flex-col relative">
        <label className="mb-1 font-medium text-lg">Passengers</label>
        <button
          type="button"
          onClick={() => setShowPassengers((prev) => !prev)}
          className="w-full bg-white text-lg font-medium rounded-md border-2 border-sky-300 hover:border-red-600 outline-red-600 pl-10 pr-4 py-3 flex justify-between items-center cursor-pointer relative h-[3.15rem]"
        >
          <Users className="absolute left-3 w-5 h-5 text-gray-700" />
          <span className="flex-grow text-left ml-2">
            {totalPassengers} Passenger{totalPassengers !== 1 ? "s" : ""}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showPassengers ? "rotate-180" : "rotate-0"}`} />
        </button>

        {showPassengers && (
          <div className="absolute top-full right-0 bg-white text-black text-lg font-medium border border-sky-300 rounded-md shadow-xl mt-1 w-full sm:w-80 z-50 p-4 space-y-3">
            {[
              { label: "Men", count: men, setCount: setMen },
              { label: "Women", count: women, setCount: setWomen },
              { label: "Children", count: children, setCount: setChildren },
            ].map(({ label, count, setCount }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-gray-700">{label}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCount(Math.max(0, count - 1))}
                    className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    type="button"
                    disabled={label === "Men" && count <= 1} // Ensure at least 1 man is selected
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-6 text-center">{count}</span>
                  <button
                    onClick={() => setCount(count + 1)}
                    className="p-1 rounded-full bg-sky-100 text-sky-600 hover:bg-sky-200 transition"
                    type="button"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search Button (Column span 1/5) */}
      <div className="lg:col-span-1 flex flex-col justify-end">
        {/* Invisible label ensures the button aligns correctly with the inputs above */}
        <label className="block text-lg font-medium mb-1 invisible">
          Search
        </label>
        <button
          type="button"
          onClick={handleSearch}
          className="w-full h-[3.15rem] bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-xl font-semibold flex items-center justify-center shadow-lg"
        >
          <Search className="w-6 h-6 mr-2" />
          Search
        </button>
      </div>
    </div>
  );
}