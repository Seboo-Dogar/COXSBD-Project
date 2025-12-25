"use client";

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import {
  Calendar,
  ChevronDown,
  Minus,
  PlaneLanding,
  PlaneTakeoff,
  Plus,
  Search,
} from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";

export default function FlightSearchForm() {
  const [tripType, setTripType] = useState<"one-way" | "round-trip">("one-way");
  const [cabinClass, setCabinClass] = useState("Economy");
  const [showDropdown, setShowDropdown] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [pickupDate, setPickupDate] = useState<Date | null>(null);
  const [showTravellers, setShowTravellers] = useState(false);
  const [men, setMen] = useState(1);
  const [women, setWomen] = useState(0);
  const [children, setChildren] = useState(0);

  const router = useRouter();

  const airports = [
    "Dhaka (DAC)",
    "Chittagong (CGP)",
    "Sylhet (ZYL)",
    "Cox's Bazar (CXB)",
    "Jessore (JSR)",
    "Khulna (KHL)",
  ];
  const cabinOptions = ["Economy", "Economy Premium", "Business", "First"];
  const totalTravellers = men + women + children;

  // Updated handleSearch
  const handleSearch = () => {
    if (!from || !to || (!selectedDate && !pickupDate)) {
      alert("Please fill From, To locations and Departure Date");
      return;
    }

    const departureStr =
      (selectedDate || pickupDate)?.toISOString().split("T")[0] || "";
    const returnStr = returnDate?.toISOString().split("T")[0] || "";

    router.push(
      `/flights/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(
        to
      )}&tripType=${encodeURIComponent(tripType)}&cabinClass=${encodeURIComponent(
        cabinClass
      )}&departureDate=${encodeURIComponent(departureStr)}&returnDate=${encodeURIComponent(
        returnStr
      )}&men=${men}&women=${women}&children=${children}`
    );
  };

  return (
    <div>
      {/* Trip Type & Cabin */}
      <div className="flex justify-between items-center mt-12 mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setTripType("one-way")}
            className={`px-4 py-2 rounded-full text-base font-medium border cursor-pointer ${
              tripType === "one-way"
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-white text-gray-800 border border-sky-300 hover:bg-sky-50"
            }`}
          >
            One Way
          </button>
          <button
            onClick={() => setTripType("round-trip")}
            className={`px-4 py-2 rounded-full text-base font-medium border cursor-pointer ${
              tripType === "round-trip"
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-white text-gray-800 border border-sky-300 hover:bg-sky-50"
            }`}
          >
            Round Trip
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className="flex items-center gap-2 px-4 py-2 border border-sky-300 rounded-full text-base font-medium bg-white hover:bg-sky-50 text-gray-800 cursor-pointer"
          >
            {cabinClass} <ChevronDown className="w-4 h-4" />
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border font-medium text-base border-sky-300 rounded-lg shadow-md z-10">
              {cabinOptions.map((option) => (
                <div
                  key={option}
                  onClick={() => {
                    setCabinClass(option);
                    setShowDropdown(false);
                  }}
                  className={`px-4 py-2 text-base cursor-pointer hover:bg-sky-50 rounded-lg ${
                    option === cabinClass ? "bg-sky-50" : ""
                  }`}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Search Inputs */}
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-15 gap-4 mb-10 items-center bg-sky-50 rounded-xl px-12 md:px-24 xl:px-6 py-3">
        {/* Fly From */}
        <div className="relative md:col-span-1 xl:col-span-4 flex flex-col">
          <label className="block text-lg font-medium mb-1">Fly From</label>
          <div className="relative flex items-center">
            {/* Left Icon */}
            <PlaneTakeoff className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />

            {/* Input */}
            <input
              type="text"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setShowFromDropdown(true);
              }}
              onFocus={() => setShowFromDropdown(true)}
              className="w-full bg-white text-lg border-2 border-sky-300 hover:border-red-600 focus:border-red-600 focus:ring-2 focus:ring-red-300 outline-none pl-10 pr-10 py-4 rounded-md placeholder:text-black/70 font-medium placeholder:text-lg"
              placeholder="Search airport"
              aria-label="Search departure airport"
            />

            {/* Right Icon */}
            <ChevronDown className="w-5 h-5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {showFromDropdown && (
            <div className="absolute top-full left-0 bg-white border border-sky-300 rounded-md shadow-md mt-1 w-full z-50 max-h-48 overflow-y-auto">
              {airports
                .filter((a) => a.toLowerCase().includes(from.toLowerCase()))
                .map((a) => (
                  <div
                    key={a}
                    onClick={() => {
                      setFrom(a);
                      setShowFromDropdown(false);
                    }}
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                  >
                    {a}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Destination To */}
        <div className="relative md:col-span-1 xl:col-span-4 flex flex-col">
          <label className="block text-lg font-medium mb-1">
            Destination To
          </label>
          <div className="relative flex items-center">
            {/* Left Icon */}
            <PlaneLanding className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />

            {/* Input */}
            <input
              type="text"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                setShowToDropdown(true);
              }}
              onFocus={() => setShowToDropdown(true)}
              className="w-full bg-white text-lg border-2 border-sky-300 hover:border-red-600 focus:border-red-600 focus:ring-2 focus:ring-red-300 outline-none pl-10 pr-10 py-4 rounded-md placeholder:text-black/70 font-medium placeholder:text-lg"
              placeholder="Search destination"
              aria-label="Search destination airport"
            />

            {/* Right Icon */}
            <ChevronDown className="w-5 h-5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {showToDropdown && (
            <div className="absolute top-full left-0 bg-white border-2 border-sky-300 rounded-md shadow-md mt-1 w-full z-50 max-h-48 overflow-y-auto">
              {airports
                .filter((a) => a.toLowerCase().includes(to.toLowerCase()))
                .map((a) => (
                  <div
                    key={a}
                    onClick={() => {
                      setTo(a);
                      setShowToDropdown(false);
                    }}
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer"
                  >
                    {a}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Dates */}
        <div className="md:col-span-1 xl:col-span-3 flex flex-col">
          <label className="block text-lg font-medium mb-1">
            {tripType === "round-trip"
              ? "Departure & Return Date"
              : "Departure Date"}
          </label>
          {tripType === "round-trip" ? (
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <div className="flex text-lg items-center rounded-md bg-white border-2 border-sky-300 hover:border-red-600 outline-red-600 px-4 py-4 font-medium shadow-sm transition">
                  <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    placeholderText="Select date"
                    minDate={new Date()}
                    className="w-full text-md outline-none bg-transparent h-full"
                  />
                </div>
              </div>
              <div className="flex-1 relative">
                <div className="flex text-lg items-center rounded-md bg-white border-2 border-sky-300 hover:border-red-600 outline-red-600 px-4 py-4 font-medium shadow-sm  transition">
                  <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                  <DatePicker
                    selected={returnDate}
                    onChange={(date) => setReturnDate(date)}
                    placeholderText="Select date"
                    minDate={new Date()}
                    className="w-full text-md outline-none bg-transparent h-full"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="flex items-center text-lg bg-white border-2 border-sky-300 hover:border-red-600 outline-red-600 px-4 py-4 rounded-md font-medium shadow-sm  transition">
                <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                <DatePicker
                  selected={pickupDate}
                  onChange={(date) => setPickupDate(date)}
                  placeholderText="Select date"
                  minDate={new Date()}
                  className="w-full text-md outline-none bg-transparent h-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Travellers */}
        <div className="relative md:col-span-1 xl:col-span-3 flex flex-col">
          <label className="block text-xl font-medium mb-1">Travellers</label>
          <button
            onClick={() => setShowTravellers((prev) => !prev)}
            className="w-full bg-white text-lg font-medium rounded-md border-2 border-sky-300 hover:border-red-600 outline-red-600 px-4 py-4 flex justify-between items-center cursor-pointer"
          >
            {totalTravellers} Traveller{totalTravellers !== 1 ? "s" : ""}
            <ChevronDown className="w-5 h-5" />
          </button>
          {showTravellers && (
            <div className="absolute top-full left-0 bg-white text-lg font-medium border border-sky-300 hover:border-sky-400 rounded-md shadow-md mt-1 w-full z-50 p-4 space-y-3">
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
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span>{count}</span>
                    <button
                      onClick={() => setCount(count + 1)}
                      className="p-1 rounded bg-sky-200 cursor-pointer"
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
    </div>
  );
}
