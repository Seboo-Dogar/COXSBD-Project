"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function DomainSearchForm() {
  const router = useRouter();
  const [domainName, setDomainName] = useState("");
  const [extension, setExtension] = useState("com");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    router.push(
      `/domain/search?name=${encodeURIComponent(domainName)}&ext=${extension}`
    );
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col md:flex-row items-stretch gap-3 bg-sky-50 p-4 rounded-md max-w-4xl mx-auto"
    >
      {/* Domain input */}
      <input
        type="text"
        placeholder="Enter domain name..."
        value={domainName}
        onChange={(e) => setDomainName(e.target.value)}
        className="w-full md:flex-1 h-14 md:h-16 px-4 border-2 border-sky-300 bg-white rounded-md text-base md:text-lg placeholder:text-black/50
        outline-none focus:border-red-600 transition font-medium"
        required
      />

      {/* Extension dropdown */}
      <select
        value={extension}
        onChange={(e) => setExtension(e.target.value)}
        className="w-full md:w-32 h-14 md:h-16 text-base md:text-lg font-medium px-4 border-2 border-sky-300 rounded-md bg-white
        outline-none focus:border-red-600 transition cursor-pointer"
      >
        <option value="com">.com</option>
        <option value="net">.net</option>
        <option value="org">.org</option>
        <option value="io">.io</option>
      </select>

      {/* Search button */}
      <button
        type="submit"
        className="w-full md:w-auto h-14 md:h-16 px-6 bg-red-600 text-white text-base md:text-lg rounded-md hover:bg-red-700 font-medium transition cursor-pointer flex items-center justify-center"
      >
        <Search className="w-5 h-5 md:w-6 md:h-6" />
      </button>
    </form>
  );
}
