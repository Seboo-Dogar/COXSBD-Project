"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Cpu, Database, MapPin } from "lucide-react";

const VpsServerSearchForm: React.FC = () => {
  const router = useRouter();
  const [cpu, setCpu] = useState("");
  const [ram, setRam] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!cpu && !ram && !location) {
      alert("Please enter at least one search criteria");
      return;
    }

    router.push(`/cloud-vps/search?cpu=${cpu}&ram=${ram}&location=${location}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md mx-auto max-w-6xl mt-6 space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
        {/* CPU Model */}
        <div className="col-span-3 flex items-center border-2 border-sky-300 rounded-md px-4 h-16 focus-within:border-red-600 transition-colors">
          <Cpu className="w-5 h-5 text-gray-500 mr-3" />
          <input
            type="text"
            placeholder="CPU Model"
            value={cpu}
            onChange={(e) => setCpu(e.target.value)}
            className="outline-none w-full text-base font-medium placeholder:text-gray-400 rounded"
          />
        </div>

        {/* RAM Size */}
        <div className="col-span-3 flex items-center border-2 border-sky-300 rounded-md px-4 h-16 focus-within:border-red-600 transition-colors">
          <Database className="w-5 h-5 text-gray-500 mr-3" />
          <input
            type="text"
            placeholder="RAM Size"
            value={ram}
            onChange={(e) => setRam(e.target.value)}
            className="outline-none w-full text-base font-medium placeholder:text-gray-400 rounded"
          />
        </div>

        {/* Location */}
        <div className="col-span-3 flex items-center border-2 border-sky-300 rounded-md px-4 h-16 focus-within:border-red-600 transition-colors">
          <MapPin className="w-5 h-5 text-gray-500 mr-3" />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="outline-none w-full text-base font-medium placeholder:text-gray-400 rounded"
          />
        </div>

        {/* Search Button */}
        <div className="col-span-1 flex">
          <button
            type="submit"
            className="w-full h-16 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-xl font-semibold flex items-center justify-center"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
};

export default VpsServerSearchForm;
