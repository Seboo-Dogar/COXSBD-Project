"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ScriptSearchForm() {
  const router = useRouter();
  const [scriptName, setScriptName] = useState("");
  const [scriptType, setScriptType] = useState("all");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      `/software-script/search?q=${encodeURIComponent(scriptName)}&type=${scriptType}`
    );
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col md:flex-row items-stretch gap-3 bg-sky-50 p-4 rounded-md max-w-4xl mx-auto"
    >
      {/* Input field */}
      <input
        type="text"
        placeholder="Enter script name..."
        value={scriptName}
        onChange={(e) => setScriptName(e.target.value)}
        className="w-full md:flex-1 h-14 md:h-16 px-4 border-2 border-sky-300 bg-white rounded-md placeholder:text-black/70
      outline-none focus:border-red-600 transition text-base md:text-lg"
        required
      />

      {/* Dropdown */}
      <select
        value={scriptType}
        onChange={(e) => setScriptType(e.target.value)}
        className="w-full md:w-40 h-14 md:h-16 text-base md:text-lg font-medium px-4 border-2 border-sky-300 rounded-md bg-white
      outline-none focus:border-red-600 transition cursor-pointer"
      >
        <option value="all">All Types</option>
        <option value="ecommerce">E-commerce</option>
        <option value="booking">Booking</option>
        <option value="marketplace">Marketplace</option>
        <option value="cms">CMS</option>
        <option value="custom">Custom</option>
      </select>

      {/* Button */}
      <button
        type="submit"
        className="w-full md:w-auto h-14 md:h-16 px-6 bg-red-600 text-white text-base md:text-lg rounded-md hover:bg-red-700 font-medium transition"
      >
        Search
      </button>
    </form>
  );
}
