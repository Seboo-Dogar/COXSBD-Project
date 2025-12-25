"use client";

import { useState, useEffect } from "react";
import DedicatedServerSearchForm from "@/components/dedicated-server/DedicatedServerSearchForm";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NewsletterSignup from "@/components/Newsletter";
import {
  Server,
  Cpu,
  MemoryStick, // ✅ replace Memory with MemoryStick
  HardDrive,
  Globe,
  Wifi,
  DollarSign,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import Image from "next/image";

interface Server {
  id: number;
  name: string;
  cpu: string;
  cores: number;
  ram: string;
  ramGB: number;
  storage: string;
  storageType: "SSD" | "NVMe" | "HDD";
  location: string;
  bandwidth: string;
  price: number;
  image: string;
  features: string[];
  availability: "In Stock" | "Low Stock" | "Pre-order";
}

const servers: Server[] = [
  {
    id: 1,
    name: "Intel Xeon E5-1650",
    cpu: "Intel Xeon E5-1650",
    cores: 6,
    ram: "32GB DDR4",
    ramGB: 32,
    storage: "1TB SSD",
    storageType: "SSD",
    location: "USA",
    bandwidth: "1Gbps Unmetered",
    price: 120,
    image: "/images/server1.jpeg",
    features: [
      "24/7 Support",
      "DDoS Protection",
      "Root Access",
      "99.9% Uptime",
    ],
    availability: "In Stock",
  },
  {
    id: 2,
    name: "AMD Ryzen 9 5950X",
    cpu: "AMD Ryzen 9 5950X",
    cores: 16,
    ram: "64GB DDR4",
    ramGB: 64,
    storage: "2TB NVMe",
    storageType: "NVMe",
    location: "Germany",
    bandwidth: "10Gbps Unmetered",
    price: 280,
    image: "/images/server2.jpeg",
    features: [
      "NVMe Storage",
      "10Gbps Port",
      "Instant Deployment",
      "Free Migration",
    ],
    availability: "Low Stock",
  },
  {
    id: 3,
    name: "Intel i9-12900K",
    cpu: "Intel i9-12900K",
    cores: 16,
    ram: "64GB DDR5",
    ramGB: 64,
    storage: "2TB SSD",
    storageType: "SSD",
    location: "Singapore",
    bandwidth: "1Gbps Unmetered",
    price: 250,
    image: "/images/server3.jpeg",
    features: [
      "DDR5 Memory",
      "High Clock Speed",
      "IPMI Access",
      "Backup Storage",
    ],
    availability: "In Stock",
  },
  {
    id: 4,
    name: "Intel Xeon Gold 6226R",
    cpu: "Intel Xeon Gold 6226R",
    cores: 16,
    ram: "128GB DDR4",
    ramGB: 128,
    storage: "4TB HDD",
    storageType: "HDD",
    location: "USA",
    bandwidth: "10Gbps Unmetered",
    price: 320,
    image: "/images/server4.jpeg",
    features: [
      "Enterprise Grade",
      "ECC Memory",
      "Hardware RAID",
      "Dual Power Supply",
    ],
    availability: "Pre-order",
  },
  {
    id: 5,
    name: "AMD EPYC 7502P",
    cpu: "AMD EPYC 7502P",
    cores: 32,
    ram: "256GB DDR4",
    ramGB: 256,
    storage: "4TB NVMe",
    storageType: "NVMe",
    location: "Germany",
    bandwidth: "10Gbps Unmetered",
    price: 480,
    image: "/images/server5.jpeg",
    features: ["64 Threads", "High Core Count", "Low Latency", "Dedicated IP"],
    availability: "In Stock",
  },
  {
    id: 6,
    name: "Intel Xeon E3-1230v6",
    cpu: "Intel Xeon E3-1230v6",
    cores: 4,
    ram: "16GB DDR4",
    ramGB: 16,
    storage: "512GB SSD",
    storageType: "SSD",
    location: "Singapore",
    bandwidth: "1Gbps Unmetered",
    price: 90,
    image: "/images/server6.jpeg",
    features: [
      "Budget Friendly",
      "Quick Setup",
      "Basic Monitoring",
      "cPanel Available",
    ],
    availability: "In Stock",
  },
];

const locations = ["USA", "Germany", "Singapore"];
const storageTypes = ["SSD", "NVMe", "HDD"];
const bandwidthOptions = ["1Gbps", "10Gbps"];

export default function DedicatedServerSearch() {
  // Filter states
  const [minCores, setMinCores] = useState<number>(0);
  const [minRam, setMinRam] = useState<number>(0);
  const [storageType, setStorageType] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [bandwidth, setBandwidth] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState<number | null>(null);

  // Filtering logic
  const filteredServers = servers.filter((server) => {
    return (
      server.cores >= minCores &&
      server.ramGB >= minRam &&
      (!storageType || server.storageType === storageType) &&
      (!location || server.location === location) &&
      (!bandwidth || server.bandwidth.includes(bandwidth)) &&
      server.price <= maxPrice
    );
  });

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800";
      case "Pre-order":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const resetFilters = () => {
    setMinCores(0);
    setMinRam(0);
    setStorageType("");
    setLocation("");
    setBandwidth("");
    setMaxPrice(500);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <DedicatedServerSearchForm />

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-">
        <div className="flex flex-col md:flex-row gap-6 mt-8">
          {/* Mobile filters button */}
          <button
            type="button"
            className="md:hidden flex items-center gap-2 text-gray-700 mb-4"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          >
            <Filter className="h-5 w-5" />
            Filters
            {mobileFiltersOpen ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>

          {/* Sidebar Filters - Desktop */}
          <aside
            className={`${mobileFiltersOpen ? "block" : "hidden"} md:block w-full md:w-72 space-y-6`}
          >
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </h3>
                <button
                  onClick={resetFilters}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Reset All
                </button>
              </div>

              <div className="space-y-6">
                {/* CPU Cores Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Cpu className="h-4 w-4" />
                    Minimum CPU Cores
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="32"
                    step="4"
                    value={minCores}
                    onChange={(e) => setMinCores(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Any</span>
                    <span>{minCores > 0 ? `${minCores}+ Cores` : "Any"}</span>
                  </div>
                </div>

                {/* RAM Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <MemoryStick className="h-4 w-4" />
                    Minimum RAM (GB)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="256"
                    step="16"
                    value={minRam}
                    onChange={(e) => setMinRam(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Any</span>
                    <span>{minRam > 0 ? `${minRam}+ GB` : "Any"}</span>
                  </div>
                </div>

                {/* Storage Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <HardDrive className="h-4 w-4" />
                    Storage Type
                  </label>
                  <select
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500"
                    value={storageType}
                    onChange={(e) => setStorageType(e.target.value)}
                  >
                    <option value="">Any</option>
                    {storageTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Location
                  </label>
                  <select
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  >
                    <option value="">Any</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bandwidth Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Wifi className="h-4 w-4" />
                    Bandwidth
                  </label>
                  <select
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500"
                    value={bandwidth}
                    onChange={(e) => setBandwidth(e.target.value)}
                  >
                    <option value="">Any</option>
                    {bandwidthOptions.map((bw) => (
                      <option key={bw} value={bw}>
                        {bw}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Max Price: ${maxPrice}
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    step="10"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$50</span>
                    <span>$500</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(minCores > 0 ||
              minRam > 0 ||
              storageType ||
              location ||
              bandwidth ||
              maxPrice < 500) && (
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Active Filters:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {minCores > 0 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {minCores}+ Cores
                      <button
                        onClick={() => setMinCores(0)}
                        className="ml-1.5 inline-flex text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {minRam > 0 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {minRam}+ GB RAM
                      <button
                        onClick={() => setMinRam(0)}
                        className="ml-1.5 inline-flex text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {storageType && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {storageType} Storage
                      <button
                        onClick={() => setStorageType("")}
                        className="ml-1.5 inline-flex text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {location && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {location}
                      <button
                        onClick={() => setLocation("")}
                        className="ml-1.5 inline-flex text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {bandwidth && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {bandwidth}
                      <button
                        onClick={() => setBandwidth("")}
                        className="ml-1.5 inline-flex text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {maxPrice < 500 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Under ${maxPrice}
                      <button
                        onClick={() => setMaxPrice(500)}
                        className="ml-1.5 inline-flex text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </aside>

          {/* Results */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Dedicated Servers
                {filteredServers.length > 0 && (
                  <span className="text-gray-500 text-sm font-normal ml-2">
                    ({filteredServers.length}{" "}
                    {filteredServers.length === 1 ? "server" : "servers"} found)
                  </span>
                )}
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select className="border-gray-300 rounded-md shadow-sm text-sm">
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>CPU Cores</option>
                  <option>RAM Size</option>
                </select>
              </div>
            </div>

            {filteredServers.length > 0 ? (
              <div className="space-y-4">
                {filteredServers.map((server) => (
                  <div
                    key={server.id}
                    className={`bg-white border rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md ${selectedServer === server.id ? "ring-2 ring-red-500" : "border-gray-200"}`}
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Server Image */}
                      <div className="md:w-1/3 h-48 relative">
                        <Image
                          src={server.image}
                          alt={server.name}
                          fill
                          className="object-cover"
                        />
                        <div
                          className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(server.availability)}`}
                        >
                          {server.availability}
                        </div>
                      </div>

                      {/* Server Details */}
                      <div className="md:w-2/3 p-6 flex flex-col">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {server.name}
                            </h3>
                            <p className="text-gray-500 text-sm mb-4">
                              {server.cpu} • {server.cores} Cores
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-red-600 font-bold text-2xl">
                              ${server.price}
                              <span className="text-gray-500 text-base font-normal">
                                /mo
                              </span>
                            </p>
                            <p className="text-gray-500 text-sm">
                              No setup fee
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                          <div className="flex items-center gap-2">
                            <MemoryStick className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">RAM</p>
                              <p className="font-medium">{server.ram}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <HardDrive className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Storage</p>
                              <p className="font-medium">{server.storage}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Location</p>
                              <p className="font-medium">{server.location}</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-auto">
                          <div className="flex flex-wrap gap-2 mb-4">
                            {server.features
                              .slice(0, 3)
                              .map((feature, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                >
                                  {feature}
                                </span>
                              ))}
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <button
                              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                              onClick={() =>
                                setSelectedServer(
                                  server.id === selectedServer
                                    ? null
                                    : server.id
                                )
                              }
                            >
                              {selectedServer === server.id
                                ? "Hide Details"
                                : "View Details"}
                            </button>
                            <button className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700">
                              Order Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {selectedServer === server.id && (
                      <div className="border-t border-gray-200 p-6 bg-gray-50">
                        <h4 className="font-medium text-gray-900 mb-4">
                          Server Specifications
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="text-sm font-medium text-gray-500 mb-2">
                              Hardware
                            </h5>
                            <ul className="space-y-2 text-sm">
                              <li className="flex justify-between">
                                <span className="text-gray-500">
                                  CPU Model:
                                </span>
                                <span className="font-medium">
                                  {server.cpu}
                                </span>
                              </li>
                              <li className="flex justify-between">
                                <span className="text-gray-500">
                                  CPU Cores/Threads:
                                </span>
                                <span className="font-medium">
                                  {server.cores} Cores
                                </span>
                              </li>
                              <li className="flex justify-between">
                                <span className="text-gray-500">RAM:</span>
                                <span className="font-medium">
                                  {server.ram}
                                </span>
                              </li>
                              <li className="flex justify-between">
                                <span className="text-gray-500">Storage:</span>
                                <span className="font-medium">
                                  {server.storage} ({server.storageType})
                                </span>
                              </li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-gray-500 mb-2">
                              Network
                            </h5>
                            <ul className="space-y-2 text-sm">
                              <li className="flex justify-between">
                                <span className="text-gray-500">
                                  Bandwidth:
                                </span>
                                <span className="font-medium">
                                  {server.bandwidth}
                                </span>
                              </li>
                              <li className="flex justify-between">
                                <span className="text-gray-500">Location:</span>
                                <span className="font-medium">
                                  {server.location}
                                </span>
                              </li>
                              <li className="flex justify-between">
                                <span className="text-gray-500">
                                  Uptime SLA:
                                </span>
                                <span className="font-medium">99.9%</span>
                              </li>
                              <li className="flex justify-between">
                                <span className="text-gray-500">
                                  DDoS Protection:
                                </span>
                                <span className="font-medium">Included</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                <Server className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No servers found
                </h3>
                <p className="mt-1 text-gray-500">
                  Try adjusting your filters to find what you're looking for.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      <NewsletterSignup /><br /><br />
      <Footer />
    </div>
  );
}
