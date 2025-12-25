"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, Users, MapPin, ChevronDown, Search } from "lucide-react";

export default function TourHomeSearch() {
  const router = useRouter();

  const [city, setCity] = useState("");
  const [pickupDate, setPickupDate] = useState<Date | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const [men, setMen] = useState(1);
  const [women, setWomen] = useState(1);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [nationality, setNationality] = useState("");

  const cities = [
    "Dhaka",
    "Chittagong",
    "Khulna",
    "Rajshahi",
    "Sylhet",
    "Cox's Bazar",
  ];

  const handleSearch = () => {
    if (!city || !pickupDate) {
      alert("Please select a city and a date");
      return;
    }

    const guests = men + women + children;

    const params = new URLSearchParams({
      location: city,
      date: pickupDate.toISOString().split("T")[0],
      guests: guests.toString(),
      rooms: rooms.toString(),
      ...(nationality && { nationality }),
    });

    router.push(`/tour-package/search?${params.toString()}`);
  };

  const filteredCities = cities.filter((c) =>
    c.toLowerCase().includes(city.toLowerCase())
  );

  return (
    <div className="bg-sky-50 p-4 rounded-md max-w-7xl mx-auto px-12 md:px-24 xl:px-6 sm:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-4 items-center justify-center">
      {/* City Search */}
      <div className="col-span-1 sm:col-span-1 lg:col-span-3 relative">
        <div className="bg-white flex items-center border-2 border-sky-300 hover:border-red-600 text-lg rounded-md px-4 h-16 min-w-0">
          <MapPin className="w-6 h-6 mr-2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by City"
            className="outline-none w-full text-base h-full placeholder:text-black/70 font-medium placeholder:text-lg"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setShowCityDropdown(true);
            }}
            onFocus={() => setShowCityDropdown(true)}
            onBlur={() => setTimeout(() => setShowCityDropdown(false), 150)}
            autoComplete="off"
          />
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </div>
        {showCityDropdown && filteredCities.length > 0 && (
          <div className="absolute inset-x-0 top-full mt-1 bg-white border border-gray-300 rounded-md shadow-md z-50 max-h-56 overflow-auto">
            {filteredCities.map((c) => (
              <div
                key={c}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setCity(c);
                  setShowCityDropdown(false);
                }}
                className="px-4 py-2 hover:bg-sky-100 cursor-pointer text-gray-700"
              >
                {c}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Date */}
      <div className="col-span-1 sm:col-span-1 lg:col-span-2 flex flex-col">
        <label className="mb-1 font-medium text-lg"></label>
        <div className="flex items-center px-4 py-4 text-lg border-2 border-sky-300 rounded-md bg-white hover:border-red-600">
          <Calendar className="w-5 h-5 text-gray-500 mr-2" />
          <DatePicker
            selected={pickupDate}
            onChange={(date) => setPickupDate(date)}
            placeholderText="Select date"
            minDate={new Date()}
            className="w-full outline-none"
            dateFormat="yyyy-MM-dd"
          />
        </div>
      </div>

      {/* Travellers & Rooms */}
      <div className="col-span-1 sm:col-span-1 lg:col-span-2 bg-white relative border-2 border-sky-300 hover:border-red-600 text-lg rounded-md px-4 h-16 min-w-0">
        <button
          className="flex items-center justify-between w-full text-sm font-medium h-full cursor-pointer"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <span className="flex items-center gap-2 font-medium text-base">
            <Users className="w-5 h-5 text-gray-500" />
            Tourist {men + women + children} Rooms {rooms}
          </span>
          <ChevronDown className="w-6 h-6 text-gray-500" />
        </button>

        {showDropdown && (
          <div className="absolute top-full left-0 mt-2 w-full z-10 bg-white text-lg font-medium border rounded-md shadow-md p-4 space-y-3">
            <DropdownItem label="Men" value={men} setValue={setMen} />
            <DropdownItem label="Women" value={women} setValue={setWomen} />
            <DropdownItem
              label="Children"
              value={children}
              setValue={setChildren}
            />
            <DropdownItem label="Rooms" value={rooms} setValue={setRooms} />
            <div>
              <label className="text-sm block mb-1">Nationality</label>
              <input
                type="text"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="border rounded-md px-3 py-2 w-full text-sm"
                placeholder="Enter nationality"
              />
            </div>
          </div>
        )}
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="col-span-1 sm:col-span-1 bg-red-600 text-white px-6 rounded-md hover:bg-red-700 flex items-center gap-2 cursor-pointer h-16 justify-center"
      >
        <span className="font-medium text-xl">
          <Search />
        </span>
      </button>
    </div>
  );
}

function DropdownItem({
  label,
  value,
  setValue,
}: {
  label: string;
  value: number;
  setValue: (val: number) => void;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setValue(Math.max(0, value - 1))}
          className="px-2 py-1 bg-gray-200 rounded"
        >
          -
        </button>
        <span className="w-5 text-center text-sm">{value}</span>
        <button
          onClick={() => setValue(value + 1)}
          className="px-2 py-1 bg-gray-200 rounded"
        >
          +
        </button>
      </div>
    </div>
  );
}
