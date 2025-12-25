"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, ChevronDown, Globe, Search } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function VisaServiceForm() {
  const router = useRouter();

  const [destination, setDestination] = useState("");
  const [fromCountry, setFromCountry] = useState(""); // ✅ new state
  const [visaType, setVisaType] = useState("Tourist");
  const [travelDate, setTravelDate] = useState<Date | null>(null);
  const [nationality, setNationality] = useState("");
  const [showVisaDropdown, setShowVisaDropdown] = useState(false);

  const visaTypes = ["Tourist", "Business", "Student", "Work", "Transit"];

  const handleSearch = () => {
    if (!nationality || !destination || !fromCountry || !travelDate) {
      alert("Please fill Nationality, From Country, Destination, and Travel Date");
      return;
    }

    const params = new URLSearchParams({
      ...(destination && { destination }),
      ...(fromCountry && { fromCountry }), // ✅ include in query
      ...(visaType && { visaType }),
      ...(travelDate && {
        travelDate: travelDate.toISOString().split("T")[0],
      }),
      ...(nationality && { nationality }),
    });

    router.push(`/visa-service/search?${params.toString()}`);
  };

  return (
    <div className="bg-sky-50 p-4 rounded-md max-w-7xl mx-auto px-12 md:px-24 xl:px-6 grid md:grid-cols-4 xl:grid-cols-14 gap-4 items-center">
      {/* Nationality */}
      <div className="md:col-span-2 xl:col-span-3 bg-white flex items-center border-2 border-sky-300 hover:border-red-600 rounded-md px-4 h-16">
        <input
          type="text"
          placeholder="Your Nationality"
          className="outline-none w-full text-base font-medium placeholder:text-black/50"
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
        />
      </div>

      {/* From Country ✅ new input */}
      <div className="md:col-span-2 xl:col-span-3 bg-white flex items-center border-2 border-sky-300 hover:border-red-600 rounded-md px-4 h-16">
        <MapPin className="w-6 h-6 mr-2 text-gray-500" />
        <input
          type="text"
          placeholder="From Country"
          className="outline-none w-full text-base font-medium placeholder:text-black/70"
          value={fromCountry}
          onChange={(e) => setFromCountry(e.target.value)}
        />
      </div>

      {/* Destination Country */}
      <div className="md:col-span-2 xl:col-span-3 bg-white flex items-center border-2 border-sky-300 hover:border-red-600 rounded-md px-4 h-16">
        <MapPin className="w-6 h-6 mr-2 text-gray-500" />
        <input
          type="text"
          placeholder="Destination Country"
          className="outline-none w-full text-base font-medium placeholder:text-black/70"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </div>

      {/* Visa Type Dropdown */}
      <div className="md:col-span-2 xl:col-span-2 bg-white relative border-2 border-sky-300 hover:border-red-600 rounded-md px-4 h-16">
        <button
          type="button"
          className="flex items-center justify-between w-full h-full text-base font-medium"
          onClick={() => setShowVisaDropdown(!showVisaDropdown)}
        >
          <span className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-gray-500" />
            {visaType} Visa
          </span>
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </button>

        {showVisaDropdown && (
          <div className="absolute top-full left-0 mt-2 w-full z-10 bg-white text-base border rounded-md shadow-md">
            {visaTypes.map((type) => (
              <button
                key={type}
                className="block w-full px-4 py-2 hover:bg-sky-100 text-left"
                onClick={() => {
                  setVisaType(type);
                  setShowVisaDropdown(false);
                }}
              >
                {type}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Travel Date */}
      <div className="md:col-span-2 xl:col-span-2 bg-white flex items-center px-4 border-2 border-sky-300 hover:border-red-600 rounded-md h-16">
        <Calendar className="w-5 h-5 text-gray-500 mr-2" />
        <DatePicker
          selected={travelDate}
          onChange={(date) => setTravelDate(date)}
          placeholderText="Travel Date"
          minDate={new Date()}
          dateFormat="yyyy-MM-dd"
          className="w-full outline-none"
        />
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="md:col-span-2 xl:col-span-1 bg-red-600 text-white px-6 rounded-md hover:bg-red-700 flex items-center gap-2 cursor-pointer h-16 justify-center"
      >
        <span className="font-medium text-xl"><Search/></span>
      </button>
    </div>
  );
}
