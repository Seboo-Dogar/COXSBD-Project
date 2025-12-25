"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LicenseSearchForm() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/licenses/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="max-w-3xl mx-auto font-medium flex flex-col md:flex-row items-stretch gap-3"
    >
      {/* Input */}
      <input
        type="text"
        placeholder="Search licenses..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full md:flex-grow rounded-md px-4 h-14 md:h-16 border-2 border-sky-300
      focus:outline-none focus:ring-2 focus:ring-red-600 text-base md:text-lg"
        required
      />

      {/* Button */}
      <button
        type="submit"
        className="w-full md:w-auto bg-red-600 h-14 md:h-16 text-white text-base md:text-xl px-6 rounded-md hover:bg-red-700 transition"
      >
        Search
      </button>
    </form>
  );
}
