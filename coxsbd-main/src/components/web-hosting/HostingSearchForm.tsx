"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DollarSign, Database, Wifi, Search } from "lucide-react";

export default function HostingSearchForm() {
  const router = useRouter();

  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [storageMin, setStorageMin] = useState("");
  const [bandwidthMin, setBandwidthMin] = useState("");
  const [planTypes, setPlanTypes] = useState<string[]>([]);

  const allPlanTypes = ["Shared", "VPS", "Dedicated"];

  const togglePlanType = (type: string) => {
    if (planTypes.includes(type)) {
      setPlanTypes(planTypes.filter((t) => t !== type));
    } else {
      setPlanTypes([...planTypes, type]);
    }
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (
      !priceMin &&
      !priceMax &&
      !storageMin &&
      !bandwidthMin &&
      planTypes.length === 0
    ) {
      alert("Please enter at least one search criteria");
      return;
    }

    const params = new URLSearchParams();
    if (priceMin) params.append("priceMin", priceMin);
    if (priceMax) params.append("priceMax", priceMax);
    if (storageMin) params.append("storageMin", storageMin);
    if (bandwidthMin) params.append("bandwidthMin", bandwidthMin);
    if (planTypes.length) params.append("planTypes", planTypes.join(","));

    router.push(`/web-hosting/search?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white p-6 rounded-lg shadow-md mx-auto space-y-6 max-w-7xl"
    >
      {/* Plan Types */}
      <fieldset>
        <legend className="font-semibold text-gray-800 mb-3">Plan Type</legend>
        <div className="flex gap-6 flex-wrap">
          {allPlanTypes.map((type) => (
            <label
              key={type}
              className="inline-flex items-center space-x-2 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={planTypes.includes(type)}
                onChange={() => togglePlanType(type)}
                className="w-5 h-5 text-red-600 border-gray-300 rounded"
              />
              <span className="font-medium text-gray-800">{type}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-13 gap-4 items-center">
        {/* Price Min */}
        <div className="md:col-span-1 xl:col-span-3 flex items-center border-2 border-sky-300 rounded-md px-12 md:px-24 xl:px-6 h-16 focus-within:border-red-600 transition-colors">
          <DollarSign className="w-5 h-5 text-gray-500 mr-3" />
          <input
            type="number"
            min={0}
            placeholder="Min Price (৳/month)"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="outline-none w-full text-base font-medium placeholder:text-gray-400 rounded"
          />
        </div>

        {/* Price Max */}
        <div className="md:col-span-1 xl:col-span-3 flex items-center border-2 border-sky-300 rounded-md px-4 h-16 focus-within:border-red-600 transition-colors">
          <DollarSign className="w-5 h-5 text-gray-500 mr-3" />
          <input
            type="number"
            min={0}
            placeholder="Max Price (৳/month)"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="outline-none w-full text-base font-medium placeholder:text-gray-400 rounded"
          />
        </div>

        {/* Storage Min */}
        <div className="md:col-span-1 xl:col-span-3 flex items-center border-2 border-sky-300 rounded-md px-4 h-16 focus-within:border-red-600 transition-colors">
          <Database className="w-5 h-5 text-gray-500 mr-3" />
          <input
            type="number"
            min={0}
            placeholder="Min Storage (GB)"
            value={storageMin}
            onChange={(e) => setStorageMin(e.target.value)}
            className="outline-none w-full text-base font-medium placeholder:text-gray-400 rounded"
          />
        </div>

        {/* Bandwidth Min */}
        <div className="md:col-span-1 xl:col-span-3 flex items-center border-2 border-sky-300 rounded-md px-4 h-16 focus-within:border-red-600 transition-colors">
          <Wifi className="w-5 h-5 text-gray-500 mr-3" />
          <input
            type="number"
            min={0}
            placeholder="Min Bandwidth (TB)"
            value={bandwidthMin}
            onChange={(e) => setBandwidthMin(e.target.value)}
            className="outline-none w-full text-base font-medium placeholder:text-gray-400 rounded"
          />
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="col-span-1 w-full h-16 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-xl font-semibold flex items-center justify-center"
        >
          <Search />
        </button>
      </div>
    </form>
  );
}
