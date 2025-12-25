"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Heart,
  Wifi,
  MapPin,
  Shield,
  Signal,
  Download,
  Upload,
  Calendar,
  Users,
  Copy,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import NewsletterSignup from "@/components/Newsletter";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useCart } from "@/context/cartContext";

// Mock data for WiFi network
const wifiData = {
  _id: "1",
  name: "MetroCity Public WiFi",
  location: "Central Square, Downtown",
  description: "High-speed public WiFi network covering Central Square and surrounding areas. Perfect for remote work, streaming, and browsing.",
  longDescription: `
    MetroCity Public WiFi is a municipal wireless network providing free internet access to residents and visitors in the downtown area.
    This network offers reliable connectivity with extensive coverage throughout Central Square and adjacent streets.
    
    Features include:
    - No time limits or data caps
    - Secure encrypted connections
    - Support for multiple device types
    - Easy authentication process
    - City-wide roaming capabilities
  `,
  images: [
    "/images/wifidata.jpg",
    "/images/wifidata.jpg",
    "/images/wifidata.jpg",
    "/images/wifidata.jpg",
  ],
  rating: 4.2,
  reviews: 86,
  security: "WPA3",
  downloadSpeed: 85,
  uploadSpeed: 25,
  latency: 12,
  frequency: "2.4GHz & 5GHz",
  coverage: "Central Square + 500m radius",
  availability: "24/7",
  passwordProtected: false,
  free: true,
  usersConnected: 142,
  maxUsers: 250,
  lastUpdated: "2023-12-01",
  ssid: "MetroCity_Public",
  bssid: "00:1A:2B:3C:4D:5E",
  channel: 11,
  encryption: "WPA3-Enterprise",
  vendor: "Cisco Systems",
  signalStrength: -55,
};

// Related WiFi networks for recommendation section
const relatedNetworks = [
  {
    id: 2,
    name: "Cafe Europa WiFi",
    location: "Europa Cafe, Downtown",
    downloadSpeed: 45,
    uploadSpeed: 15,
    free: true,
    image: "/images/wifidata.jpg",
    rating: 4.0,
    security: "WPA2",
  },
  {
    id: 3,
    name: "City Library Network",
    location: "MetroCity Central Library",
    downloadSpeed: 60,
    uploadSpeed: 20,
    free: true,
    image: "/images/wifidata.jpg",
    rating: 4.3,
    security: "WPA3",
  },
  {
    id: 4,
    name: "TechHub Coworking",
    location: "Innovation District",
    downloadSpeed: 100,
    uploadSpeed: 50,
    free: false,
    image: "/images/wifidata.jpg",
    rating: 4.7,
    security: "WPA3-Enterprise",
  },
];

export default function WifiDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showAllDetails, setShowAllDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
    const { addToCart } = useCart();


  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
// Add this inside your component
const handleAddToCart = () => {
  const item = {
    id: wifiData._id,
    name: wifiData.name,
    image: wifiData.images[0],
    price: wifiData.free ? 0 : 10, // example price for paid networks
    quantity: 1,
  };

  addToCart(item);
  alert(`${wifiData.name} has been added to your cart!`);
};

  const handleConnect = () => {
    setShowConnectModal(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(wifiData.ssid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navigateToWifi = (wifiId: string) => {
    router.push(`/wifidata/${wifiId}`);
  };

  const getSignalStrengthText = (strength: number) => {
    if (strength >= -50) return "Excellent";
    if (strength >= -60) return "Very Good";
    if (strength >= -70) return "Good";
    if (strength >= -80) return "Fair";
    return "Poor";
  };

  const getSignalStrengthColor = (strength: number) => {
    if (strength >= -50) return "text-green-600";
    if (strength >= -60) return "text-green-500";
    if (strength >= -70) return "text-yellow-500";
    if (strength >= -80) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <button onClick={() => router.push("/")} className="hover:text-purple-600">Home</button>
              <svg className="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
            <li className="flex items-center">
              <button onClick={() => router.push("/wifidata")} className="hover:text-purple-600">WiFi Networks</button>
              <svg className="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
            <li className="text-purple-600">{wifiData.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Gallery Section */}
          <div>
            <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-lg mb-4">
              <Image
                src={wifiData.images[selectedImage]}
                alt={wifiData.name}
                fill
                className="object-cover"
                priority
              />
              <button
                onClick={toggleFavorite}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart className={`w-6 h-6 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
              </button>
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImage + 1} / {wifiData.images.length}
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {wifiData.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-28 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImage === idx ? "border-purple-500" : "border-gray-200"
                  }`}
                >
                  <Image src={img} alt={`${wifiData.name} view ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{wifiData.name}</h1>
                <div className="flex items-center text-gray-600 mt-1">
                  <MapPin className="w-5 h-5 mr-1" />
                  <span>{wifiData.location}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end mt-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-gray-700">{wifiData.rating}</span>
                  <span className="mx-1">•</span>
                  <span className="text-gray-500">{wifiData.reviews} reviews</span>
                </div>
                <div className={`mt-2 text-sm font-medium ${wifiData.free ? 'text-green-600' : 'text-blue-600'}`}>
                  {wifiData.free ? 'Free Access' : 'Premium Network'}
                </div>
              </div>
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">{wifiData.description}</p>

            {/* Network Status */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Current Status</span>
                <span className="text-sm font-medium text-green-600">Online</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {wifiData.usersConnected} / {wifiData.maxUsers} users
                  </span>
                </div>
                <div className="flex items-center">
                  <Signal className={`w-4 h-4 mr-1 ${getSignalStrengthColor(wifiData.signalStrength)}`} />
                  <span className={`text-sm font-medium ${getSignalStrengthColor(wifiData.signalStrength)}`}>
                    {getSignalStrengthText(wifiData.signalStrength)} ({wifiData.signalStrength} dBm)
                  </span>
                </div>
              </div>
            </div>

            {/* Speed Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white border rounded-xl p-4 text-center">
                <Download className="w-6 h-6 mx-auto text-blue-500 mb-1" />
                <p className="text-sm text-gray-500">Download</p>
                <p className="text-xl font-bold text-gray-900">{wifiData.downloadSpeed} Mbps</p>
              </div>
              <div className="bg-white border rounded-xl p-4 text-center">
                <Upload className="w-6 h-6 mx-auto text-green-500 mb-1" />
                <p className="text-sm text-gray-500">Upload</p>
                <p className="text-xl font-bold text-gray-900">{wifiData.uploadSpeed} Mbps</p>
              </div>
            </div>

            {/* Network Details */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Network Details</h3>
                <button 
                  onClick={() => setShowAllDetails(!showAllDetails)}
                  className="text-sm text-purple-600 hover:underline flex items-center"
                >
                  {showAllDetails ? (
                    <>Show less <ChevronUp className="ml-1 w-4 h-4" /></>
                  ) : (
                    <>Show all <ChevronDown className="ml-1 w-4 h-4" /></>
                  )}
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">SSID</span>
                  <div className="flex items-center">
                    <span className="font-mono mr-2">{wifiData.ssid}</span>
                    <button 
                      onClick={copyToClipboard}
                      className="text-gray-400 hover:text-purple-600"
                      title="Copy SSID"
                    >
                      {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Security</span>
                  <span className="flex items-center font-medium">
                    <Shield className="w-4 h-4 mr-1 text-green-500" />
                    {wifiData.security}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Frequency</span>
                  <span>{wifiData.frequency}</span>
                </div>
                
                {showAllDetails && (
                  <>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">BSSID</span>
                      <span className="font-mono">{wifiData.bssid}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Channel</span>
                      <span>{wifiData.channel}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Encryption</span>
                      <span>{wifiData.encryption}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Vendor</span>
                      <span>{wifiData.vendor}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Latency</span>
                      <span>{wifiData.latency} ms</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleConnect}
                className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors flex items-center justify-center"
              >
                <Wifi className="w-5 h-5 mr-2" />
                Connect Now
              </button>
              <button onClick={handleAddToCart} className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center">
                <MapPin className="w-5 h-5 mr-2" />
                Add To Cart
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12 border-b border-gray-200">
          <nav className="flex space-x-8">
            {["overview", "coverage", "reviews", "details"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="py-8">
          {activeTab === "overview" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Network Overview</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 mb-4">{wifiData.longDescription}</p>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Features</h3>
                <ul className="list-disc pl-5 mb-4 text-gray-700">
                  <li>No time limits or data caps</li>
                  <li>Secure encrypted connections</li>
                  <li>Support for multiple device types</li>
                  <li>Easy authentication process</li>
                  <li>City-wide roaming capabilities</li>
                </ul>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Coverage Area</h3>
                <p className="text-gray-700">{wifiData.coverage}</p>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Availability</h3>
                <p className="text-gray-700">{wifiData.availability}</p>
              </div>
            </div>
          )}
          
          {activeTab === "coverage" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Coverage Map</h2>
              <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center mb-6">
                <div className="text-center text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-2" />
                  <p>Interactive coverage map would be displayed here</p>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-3">Signal Strength Areas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="font-medium">Excellent Signal</span>
                  </div>
                  <p className="text-sm text-gray-700">Central Square and immediate surrounding areas</p>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <span className="font-medium">Good Signal</span>
                  </div>
                  <p className="text-sm text-gray-700">Up to 200m from Central Square</p>
                </div>
                
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                    <span className="font-medium">Fair Signal</span>
                  </div>
                  <p className="text-sm text-gray-700">200m to 500m from Central Square</p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "reviews" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">User Reviews</h2>
              <div className="space-y-6">
                <div className="p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Alex Johnson</h4>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-500">3 days ago</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    Reliable connection throughout the square. I was able to join video calls without any issues. 
                    The speed is impressive for a public network.
                  </p>
                </div>
                
                <div className="p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Maria Rodriguez</h4>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < 3 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-500">1 week ago</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    Good coverage but the signal weakens near the edges of the square. 
                    Appreciate that it's free and doesn't require personal information to connect.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "details" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Technical Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border rounded-xl p-5">
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-green-500" />
                    Security Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Encryption</span>
                      <span className="font-medium">{wifiData.encryption}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Authentication</span>
                      <span className="font-medium">WPA3-Enterprise</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Password Protected</span>
                      <span className="font-medium">{wifiData.passwordProtected ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border rounded-xl p-5">
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <Signal className="w-5 h-5 mr-2 text-blue-500" />
                    Performance Metrics
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Download</span>
                      <span className="font-medium">{wifiData.downloadSpeed} Mbps</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Upload</span>
                      <span className="font-medium">{wifiData.uploadSpeed} Mbps</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Latency</span>
                      <span className="font-medium">{wifiData.latency} ms</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border rounded-xl p-5">
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <Wifi className="w-5 h-5 mr-2 text-purple-500" />
                    Network Specifications
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Frequency Bands</span>
                      <span className="font-medium">{wifiData.frequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Channel</span>
                      <span className="font-medium">{wifiData.channel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vendor</span>
                      <span className="font-medium">{wifiData.vendor}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border rounded-xl p-5">
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                    Administrative Info
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated</span>
                      <span className="font-medium">{wifiData.lastUpdated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Availability</span>
                      <span className="font-medium">{wifiData.availability}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Access Type</span>
                      <span className="font-medium">{wifiData.free ? 'Free' : 'Paid'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Related Networks Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Nearby WiFi Networks</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedNetworks.map((network) => (
              <motion.div
                key={network.id}
                className="border rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                whileHover={{ y: -5 }}
                onClick={() => navigateToWifi(network.id.toString())}
              >
                <div className="relative h-48">
                  <Image src={network.image} alt={network.name} fill className="object-cover" />
                  <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                    {network.free ? 'Free' : 'Premium'}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{network.name}</h3>
                  <p className="text-gray-500 text-sm">{network.location}</p>
                  <div className="flex items-center mt-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm text-gray-700">{network.rating}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-sm text-gray-500">{network.security}</span>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-gray-500">{network.downloadSpeed} Mbps</span>
                    <span className={`text-sm font-medium ${network.free ? 'text-green-600' : 'text-blue-600'}`}>
                      {network.free ? 'Free' : `$${network.id}`}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Connect Modal */}
        <AnimatePresence>
          {showConnectModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md"
              >
                <h2 className="text-2xl font-bold mb-4">Connect to {wifiData.name}</h2>

                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Network Name (SSID)</span>
                      <button 
                        onClick={copyToClipboard}
                        className="text-gray-400 hover:text-purple-600"
                        title="Copy SSID"
                      >
                        {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <code className="font-mono text-sm bg-gray-100 p-2 rounded block">
                      {wifiData.ssid}
                    </code>
                  </div>

                  {wifiData.passwordProtected ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                      <input
                        type="password"
                        placeholder="Enter network password"
                        className="w-full p-3 border rounded-lg"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        The password is usually available at the location or provided by staff.
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                      This network is open and doesn't require a password.
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConnectModal(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      alert(`Connecting to ${wifiData.ssid}...`);
                      setShowConnectModal(false);
                    }}
                    className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700"
                  >
                    Connect
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
      <NewsletterSignup /><br /><br />
      <Footer />
    </>
  );
}