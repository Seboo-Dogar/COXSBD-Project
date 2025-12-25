"use client";

import { useState, useEffect } from "react";
import VpsServerSearchForm from "@/components/cloud-vps/VpsServerSearchForm";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NewsletterSignup from "@/components/Newsletter";

interface VPS {
  id: number;
  name: string;
  cpu: string;
  cpuCores: number;
  ram: string;
  ramGB: number;
  storage: string;
  storageGB: number;
  storageType: string;
  location: string;
  bandwidth: string;
  bandwidthGbps: number;
  price: number;
  image: string;
  osOptions: string[];
  features: string[];
  description: string;
  popularity: number;
}

const vpsList: VPS[] = [
  // ... (your VPS data remains the same)
];

export default function CloudVPSSearch() {
  // Filter states
  const [cpu, setCpu] = useState("");
  const [ram, setRam] = useState("");
  const [storage, setStorage] = useState("");
  const [location, setLocation] = useState("");
  const [bandwidth, setBandwidth] = useState("");
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sortBy, setSortBy] = useState("popularity");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list"); // Default to list view
  const [selectedVPS, setSelectedVPS] = useState<VPS | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Filtering logic
  const filteredVPS = vpsList.filter((vps) => {
    return (
      (!cpu || vps.cpu === cpu) &&
      (!ram || vps.ram === ram) &&
      (!storage || vps.storage === storage) &&
      (!location || vps.location === location) &&
      (!bandwidth || vps.bandwidth === bandwidth) &&
      vps.price <= maxPrice
    );
  });

  // Sort results
  const sortedVPS = [...filteredVPS].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "popularity") return b.popularity - a.popularity;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  // View VPS details
  const viewVPSDetails = (vps: VPS) => {
    setSelectedVPS(vps);
    setShowDetailModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowDetailModal(false);
    setSelectedVPS(null);
  };

  // Reset filters
  const resetFilters = () => {
    setCpu("");
    setRam("");
    setStorage("");
    setLocation("");
    setBandwidth("");
    setMaxPrice(2000);
  };

  return (
    <>
      <Header />
      <VpsServerSearchForm />

      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 border rounded-lg p-4 bg-white shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Filters</h2>
              <button
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Reset All
              </button>
            </div>

            <div>
              <h3 className="font-bold mb-2">CPU</h3>
              <select
                className="w-full border p-2 rounded"
                value={cpu}
                onChange={(e) => setCpu(e.target.value)}
              >
                <option value="">Any CPU</option>
                <option value="2 Cores">2 Cores</option>
                <option value="4 Cores">4 Cores</option>
                <option value="8 Cores">8 Cores</option>
                <option value="12 Cores">12 Cores</option>
                <option value="16 Cores">16 Cores</option>
                <option value="24 Cores">24 Cores</option>
                <option value="32 Cores">32 Cores</option>
                <option value="48 Cores">48 Cores</option>
                <option value="64 Cores">64 Cores</option>
              </select>
            </div>

            <div>
              <h3 className="font-bold mb-2">RAM</h3>
              <select
                className="w-full border p-2 rounded"
                value={ram}
                onChange={(e) => setRam(e.target.value)}
              >
                <option value="">Any RAM</option>
                <option value="4GB">4GB</option>
                <option value="8GB">8GB</option>
                <option value="16GB">16GB</option>
                <option value="32GB">32GB</option>
                <option value="64GB">64GB</option>
                <option value="128GB">128GB</option>
                <option value="256GB">256GB</option>
                <option value="512GB">512GB</option>
                <option value="1TB">1TB</option>
              </select>
            </div>

            <div>
              <h3 className="font-bold mb-2">Storage</h3>
              <select
                className="w-full border p-2 rounded"
                value={storage}
                onChange={(e) => setStorage(e.target.value)}
              >
                <option value="">Any Storage</option>
                <option value="80GB SSD">80GB SSD</option>
                <option value="160GB SSD">160GB SSD</option>
                <option value="320GB SSD">320GB SSD</option>
                <option value="640GB NVMe">640GB NVMe</option>
                <option value="1TB NVMe">1TB NVMe</option>
                <option value="2TB NVMe">2TB NVMe</option>
                <option value="4TB NVMe">4TB NVMe</option>
                <option value="8TB NVMe">8TB NVMe</option>
                <option value="12TB NVMe">12TB NVMe</option>
              </select>
            </div>

            <div>
              <h3 className="font-bold mb-2">Location</h3>
              <select
                className="w-full border p-2 rounded"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="">Any Location</option>
                <option value="USA">USA</option>
                <option value="Germany">Germany</option>
                <option value="Singapore">Singapore</option>
              </select>
            </div>

            <div>
              <h3 className="font-bold mb-2">Bandwidth</h3>
              <select
                className="w-full border p-2 rounded"
                value={bandwidth}
                onChange={(e) => setBandwidth(e.target.value)}
              >
                <option value="">Any Bandwidth</option>
                <option value="1Gbps">1Gbps</option>
                <option value="10Gbps">10Gbps</option>
                <option value="20Gbps">20Gbps</option>
                <option value="40Gbps">40Gbps</option>
              </select>
            </div>

            <div>
              <h3 className="font-bold mb-2">Max Price: ${maxPrice}</h3>
              <input
                type="range"
                min="20"
                max="2000"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>$20</span>
                <span>$2000</span>
              </div>
            </div>
          </aside>

          {/* Results Section */}
          <main className="flex-1">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h2 className="text-2xl font-bold">Cloud VPS Servers</h2>

              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <div className="flex items-center">
                  <span className="mr-2 text-gray-700">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border p-2 rounded"
                  >
                    <option value="popularity">Popularity</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name</option>
                  </select>
                </div>

                <div className="flex border rounded overflow-hidden">
                  <button
                    className={`p-2 ${viewMode === "grid" ? "bg-blue-100 text-blue-700" : "bg-white"}`}
                    onClick={() => setViewMode("grid")}
                  >
                    Grid
                  </button>
                  <button
                    className={`p-2 ${viewMode === "list" ? "bg-blue-100 text-blue-700" : "bg-white"}`}
                    onClick={() => setViewMode("list")}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              {sortedVPS.length} {sortedVPS.length === 1 ? "server" : "servers"}{" "}
              found
            </p>

            {sortedVPS.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedVPS.map((vps) => (
                    <div
                      key={vps.id}
                      className="border rounded-lg shadow-md bg-white overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="h-48 relative">
                        <img
                          src={vps.image || "/images/vps1.jpg"}
                          alt={vps.name}
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute top-0 right-0 bg-blue-600 text-white px-2 py-1 text-sm font-bold">
                          {vps.popularity}% Popular
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="font-bold text-xl mb-2">{vps.name}</h3>
                        <div className="text-gray-700 space-y-1 mb-4">
                          <div className="flex justify-between">
                            <span>CPU:</span>
                            <span className="font-medium">{vps.cpu}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>RAM:</span>
                            <span className="font-medium">{vps.ram}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Storage:</span>
                            <span className="font-medium">{vps.storage}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Location:</span>
                            <span className="font-medium">{vps.location}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                          <p className="text-red-600 font-bold text-xl">
                            ${vps.price}{" "}
                            <span className="text-sm font-normal">/ month</span>
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => viewVPSDetails(vps)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Details
                            </button>
                            <button className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition text-sm">
                              Buy Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {sortedVPS.map((vps) => (
                    <div
                      key={vps.id}
                      className="w-full border rounded-lg shadow-md bg-white overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/4 h-48 md:h-auto relative">
                          <img
                            src={vps.image || "/images/vps1.jpg"}
                            alt={vps.name}
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute top-0 right-0 bg-blue-600 text-white px-2 py-1 text-sm font-bold">
                            {vps.popularity}% Popular
                          </div>
                        </div>

                        <div className="md:w-3/4 p-6">
                          <div className="flex flex-col md:flex-row justify-between">
                            <div className="md:w-2/3">
                              <h3 className="font-bold text-xl mb-2">{vps.name}</h3>
                              <p className="text-gray-600 mb-4">{vps.description}</p>
                              
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center">
                                  <span className="font-medium mr-2">CPU:</span>
                                  <span>{vps.cpu}</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="font-medium mr-2">RAM:</span>
                                  <span>{vps.ram}</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="font-medium mr-2">Storage:</span>
                                  <span>{vps.storage}</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="font-medium mr-2">Location:</span>
                                  <span>{vps.location}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="md:w-1/3 flex flex-col items-end justify-between">
                              <p className="text-red-600 font-bold text-2xl mb-4">
                                ${vps.price}{" "}
                                <span className="text-sm font-normal">/ month</span>
                              </p>
                              <div className="flex flex-col gap-2 w-full md:w-auto">
                                <button
                                  onClick={() => viewVPSDetails(vps)}
                                  className="border border-blue-600 text-blue-600 py-2 px-4 rounded hover:bg-blue-50 transition w-full"
                                >
                                  View Details
                                </button>
                                <button className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition w-full">
                                  Buy Now
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t">
                            <h4 className="font-medium mb-2">OS Options:</h4>
                            <div className="flex flex-wrap gap-2">
                              {vps.osOptions.slice(0, 4).map((os, idx) => (
                                <span
                                  key={idx}
                                  className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                                >
                                  {os}
                                </span>
                              ))}
                              {vps.osOptions.length > 4 && (
                                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                  +{vps.osOptions.length - 4} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold mb-2">
                  No VPS servers match your filters
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search criteria
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* VPS Detail Modal */}
      {showDetailModal && selectedVPS && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">{selectedVPS.name}</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="md:w-1/2">
                  <img
                    src={selectedVPS.image || "/images/vps1.jpg"}
                    alt={selectedVPS.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>

                <div className="md:w-1/2">
                  <p className="text-gray-700 mb-4">
                    {selectedVPS.description}
                  </p>

                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold text-red-600">
                          ${selectedVPS.price}/mo
                        </p>
                        <p className="text-gray-600">Billed monthly</p>
                      </div>
                      <button className="bg-red-600 text-white py-2 px-6 rounded hover:bg-red-700 transition">
                        Order Now
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <span className="inline-block w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
                    <span>
                      {selectedVPS.popularity}% of customers choose this plan
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-xl font-bold mb-4">Specifications</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">CPU:</span>
                      <span className="font-medium">{selectedVPS.cpu}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">RAM:</span>
                      <span className="font-medium">{selectedVPS.ram}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Storage:</span>
                      <span className="font-medium">{selectedVPS.storage}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Bandwidth:</span>
                      <span className="font-medium">
                        {selectedVPS.bandwidth}
                      </span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">
                        {selectedVPS.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">Operating Systems</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedVPS.osOptions.map((os, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-100 p-3 rounded text-center"
                      >
                        {os}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold mb-4">Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedVPS.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center bg-green-50 p-3 rounded"
                    >
                      <span className="text-green-600 mr-2">✓</span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <NewsletterSignup />
      <br />
      <br />
      <Footer />
    </>
  );
}