"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import {
  Bus,
  Calendar,
  Car,
  ChevronDown,
  MapPinHouse,
  Minus,
  Plus,
  Search,
  Users,
} from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";

export default function BusSearchForm() {
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

  const handleSearch = () => {
    if (!pickup || !dropoff || !pickupDate) {
      alert("Please fill Pickup, Drop-off locations and Pickup Date");
      return;
    }

    const dateStr = pickupDate.toISOString().split("T")[0];
    router.push(
      `/bus/search?pickup=${encodeURIComponent(
        pickup
      )}&dropoff=${encodeURIComponent(
        dropoff
      )}&date=${encodeURIComponent(dateStr)}&passengers=${totalPassengers}`
    );
  };

  return (
       <div className="mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-15 gap-4 mb-10 items-center bg-sky-50 rounded-xl px-12 md:px-24 xl:px-6 py-3">
      {/* Pickup */}
      <div className="md:col-span-1 xl:col-span-4 flex flex-col relative">
        <label className="mb-1 font-medium text-lg">Starting Point</label>
        <div className="relative">
          <Bus className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            onFocus={() => setShowPickupDropdown(true)}
            placeholder="Enter pickup location"
            className="pl-10 px-4 py-4 bg-white text-lg border-2 border-sky-300 hover:border-red-600 outline-red-600 rounded-md placeholder:text-black/50 font-medium placeholder:text-lg w-full"
          />
          {showPickupDropdown && (
            <ul className="absolute z-50 bg-white border border-sky-300 mt-1 w-full rounded-md shadow-md">
              {cities.map((city) => (
                <li
                  key={city}
                  className="px-4 py-2 hover:bg-sky-100 cursor-pointer"
                  onClick={() => {
                    setPickup(city);
                    setShowPickupDropdown(false);
                  }}
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Dropoff */}
      <div className="md:col-span-1 xl:col-span-4 flex flex-col relative">
        <label className="mb-1 font-medium text-lg">Drop-off Point</label>
        <div className="relative">
          <MapPinHouse className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
            onFocus={() => setShowDropoffDropdown(true)}
            placeholder="Enter drop-off location"
            className="pl-10 px-4 py-4 bg-white text-lg border-2 border-sky-300 hover:border-red-600 outline-red-600 rounded-md placeholder:text-black/50 font-medium placeholder:text-lg w-full"
          />
          {showDropoffDropdown && (
            <ul className="absolute z-50 bg-white border border-sky-300 mt-1 w-full rounded-md shadow-md">
              {cities.map((city) => (
                <li
                  key={city}
                  className="px-4 py-2 hover:bg-sky-100 cursor-pointer"
                  onClick={() => {
                    setDropoff(city);
                    setShowDropoffDropdown(false);
                  }}
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Pickup Date */}
      <div className="md:col-span-1 xl:col-span-3 flex flex-col">
        <label className="mb-2 font-medium text-lg">Pickup Date</label>
        <div className="flex items-center px-4 h-16 text-lg border-2 border-sky-300 rounded-md bg-white hover:border-red-600 font-medium">
          <Calendar className="w-5 h-5 text-gray-500 mr-2 self-center flex-shrink-0" />
          <DatePicker
            selected={pickupDate}
            onChange={(date) => setPickupDate(date)}
            placeholderText="Select date"
            minDate={new Date()}
            className="w-full text-md outline-none bg-transparent h-full"
          />
        </div>
      </div>

      {/* Passengers */}
      <div className="md:col-span-1 xl:col-span-3 flex flex-col relative">
        <label className="mb-1 font-medium text-lg">Passengers</label>
        <button
          type="button"
          onClick={() => setShowPassengers((prev) => !prev)}
          className="w-full bg-white text-lg font-medium rounded-md border-2 border-sky-300 hover:border-red-600 outline-red-600 pl-10 pr-4 py-4 flex justify-between items-center cursor-pointer relative"
        >
          <Users className="absolute left-3 w-5 h-5 text-black" />
          {totalPassengers} Passenger{totalPassengers !== 1 ? "s" : ""}
          <ChevronDown className="w-5 h-5" />
        </button>

        {showPassengers && (
          <div className="absolute top-full left-0 bg-white text-black text-lg font-medium border border-sky-300 rounded-md shadow-md mt-1 w-full z-50 p-4 space-y-3">
            {[
              { label: "Men", count: men, setCount: setMen },
              { label: "Women", count: women, setCount: setWomen },
              { label: "Children", count: children, setCount: setChildren },
            ].map(({ label, count, setCount }) => (
              <div key={label} className="flex justify-between items-center">
                <span>{label}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCount(Math.max(0, count - 1))}
                    className="p-1 rounded bg-red-200 cursor-pointer"
                    type="button"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span>{count}</span>
                  <button
                    onClick={() => setCount(count + 1)}
                    className="p-1 rounded bg-sky-200 cursor-pointer"
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

      {/* Search Button */}
      <div className="flex flex-col items-end md:col-span-2 xl:col-span-1">
        <label className="block text-lg font-medium mb-1 invisible">
          Search
        </label>
        <button
          type="button"
          onClick={handleSearch}
          className="w-full h-16 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-xl font-semibold flex items-center justify-center cursor-pointer"
        >
          <Search />
        </button>
      </div>
    </div>
  );
}
