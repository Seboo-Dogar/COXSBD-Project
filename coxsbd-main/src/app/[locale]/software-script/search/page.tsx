"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import NewsletterSignup from "@/components/Newsletter";
import { Footer } from "react-day-picker";
import ScriptSearchForm from "@/components/software-script/ScriptSearchForm";

// Define TypeScript interface for Script
interface Script {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  category: string;
  tech: string;
  rating: number;
  reviews: number;
  license: string;
  version: string;
  description: string;
  lastUpdated: string;
  sales: number;
}

// Mock Data with all required properties
const scripts: Script[] = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  title: `Script ${i + 1} – Premium Web Solution`,
  price: (i + 1) * 10 + 39,
  originalPrice: (i + 1) * 10 + 79,
  discount: i % 2 === 0 ? 20 : 0,
  image: `/images/script${(i % 3) + 1}.jpeg`,
  category: i % 2 === 0 ? "E-commerce" : "Booking",
  tech: i % 3 === 0 ? "React" : i % 3 === 1 ? "PHP" : "Node.js",
  rating: Math.floor(Math.random() * 5) + 1,
  reviews: Math.floor(Math.random() * 100),
  license: i % 3 === 0 ? "Single" : i % 3 === 1 ? "Multi" : "Extended",
  version: `1.${i}`,
  description: `This premium ${i % 2 === 0 ? "E-commerce" : "Booking"} solution built with ${i % 3 === 0 ? "React" : i % 3 === 1 ? "PHP" : "Node.js"} provides excellent features for your business needs.`,
  lastUpdated: `${Math.floor(Math.random() * 12) + 1} months ago`,
  sales: Math.floor(Math.random() * 500),
}));

interface SearchParams {
  q?: string;
  type?: string;
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const q = searchParams.q || "";
  const type = searchParams.type || "all";

  const [selectedCategory, setSelectedCategory] = useState(type);
  const [selectedTech, setSelectedTech] = useState("all");
  const [priceRange, setPriceRange] = useState(500);
  const [selectedLicense, setSelectedLicense] = useState("all");

  return (
    <>
      <Header />
      <br />
      <ScriptSearchForm />
      <div className="max-w-8xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <aside className="border rounded-lg p-4 space-y-12 h-fit sticky top-20">
          <div>
            <h3 className="font-semibold mb-2">Category</h3>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="all">All</option>
              <option value="ecommerce">E-commerce</option>
              <option value="booking">Booking</option>
              <option value="marketplace">Marketplace</option>
              <option value="cms">CMS</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Price Range (${priceRange})</h3>
            <input
              type="range"
              min={0}
              max={500}
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <h3 className="font-semibold mb-2">Tech Stack</h3>
            <select
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="all">All</option>
              <option value="php">PHP</option>
              <option value="react">React</option>
              <option value="node">Node.js</option>
              <option value="laravel">Laravel</option>
            </select>
          </div>

          <div>
            <h3 className="font-semibold mb-2">License</h3>
            <select
              value={selectedLicense}
              onChange={(e) => setSelectedLicense(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="all">All</option>
              <option value="single">Single License</option>
              <option value="multi">Multi License</option>
              <option value="extended">Extended License</option>
            </select>
          </div>
        </aside>

        {/* Main Content */}
        {/* Main Content */}
        <main className="md:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              Search results for:{" "}
              <span className="text-red-600">&quot;{q}&quot;</span>
            </h2>
            <div className="text-sm text-gray-500">
              {scripts.length} {scripts.length === 1 ? "result" : "results"}{" "}
              found
            </div>
          </div>

          <div className="space-y-6">
            {scripts.map((script) => (
              <div
                key={script.id}
                className="flex flex-col md:flex-row border rounded-xl p-6 shadow hover:shadow-xl transition-all bg-white"
              >
                {/* Left - Image */}
                <div className="w-full md:w-1/4 relative aspect-video md:aspect-square">
                  <Image
                    src={script.image}
                    alt={script.title}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>

                {/* Middle - Details */}
                <div className="flex-1 px-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg">{script.title}</h3>
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-3 py-1 rounded-full">
                        {script.license} License
                      </span>
                    </div>

                    <p className="text-gray-600 mt-2 line-clamp-3">
                      {script.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {script.category}
                      </span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        {script.tech}
                      </span>
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                        Version {script.version}
                      </span>
                    </div>

                    {/* Ratings */}
                    <div className="flex items-center gap-1 mt-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${i < script.rating ? "text-yellow-500" : "text-gray-300"}`}
                        >
                          ★
                        </span>
                      ))}
                      <span className="text-sm text-gray-500 ml-1">
                        ({script.reviews} reviews)
                      </span>
                    </div>
                  </div>

                  {/* Meta info */}
                  <div className="mt-4 text-xs text-gray-500 flex gap-4">
                    <span>📅 Updated {script.lastUpdated}</span>
                    <span>💰 {script.sales} sales</span>
                  </div>
                </div>

                {/* Right - Price + Buttons */}
                <div className="w-full md:w-1/4 flex flex-col justify-between border-t md:border-t-0 md:border-l md:pl-6 mt-4 md:mt-0">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      ${script.price}
                    </div>
                    {script.discount && (
                      <>
                        <div className="text-sm text-gray-500 line-through">
                          ${script.originalPrice}
                        </div>
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded">
                          {script.discount}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  <div className="mt-6 space-y-2">
                    <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition">
                      Add to Cart
                    </button>
                    <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg transition">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
      <NewsletterSignup />
      <Footer />
    </>
  );
}
