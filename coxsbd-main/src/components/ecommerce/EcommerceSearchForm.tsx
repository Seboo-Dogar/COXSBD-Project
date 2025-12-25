"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    // Extract category slug if exists
    const segments = pathname.split("/").filter(Boolean); // e.g. ["ecommerce", "electronics"]

    let categorySlug: string | null = null;
    if (
      segments.length >= 2 &&
      segments[0] === "ecommerce" &&
      segments[1] !== "search"
    ) {
      categorySlug = segments[1];
    }

    if (categorySlug) {
      // Redirect to category-specific search
      router.push(
        `/ecommerce/${categorySlug}/search?q=${encodeURIComponent(query)}`
      );
    } else {
      // Redirect to global search
      router.push(`/ecommerce/search?q=${encodeURIComponent(query)}`);
    }
  }

  return (
    <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex gap-2">
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow h-16 px-4 border-2 border-sky-300 font-medium rounded-l-md focus:outline-none focus:ring-2 focus:ring-red-600"
      />
      <button
        type="submit"
        className="h-16 px-6 bg-red-600 text-xl text-white rounded-r-md hover:bg-red-700 transition"
      >
        Search
      </button>
    </form>
  );
}
