"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Heart,
  FileText,
  MapPin,
  Shield,
  Calendar,
  Users,
  Copy,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Building,
  Globe,
  Download,
  Upload,
  CreditCard,
  Clock,
  AlertCircle,
} from "lucide-react";
import NewsletterSignup from "@/components/Newsletter";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useCart } from "@/context/cartContext";

// Mock data for software license
const licenseData = {
  _id: "1",
  name: "Adobe Creative Cloud All Apps",
  publisher: "Adobe Inc.",
  description:
    "Complete suite of creative applications for design, photography, video, and web development.",
  longDescription: `
    Adobe Creative Cloud All Apps provides access to the entire collection of Adobe creative applications.
    This comprehensive license includes industry-standard tools for photography, design, video, web development, and more.
    
    Features include:
    - Access to 20+ Adobe applications
    - Regular updates and new features
    - Cloud storage (100GB)
    - Adobe Fonts portfolio
    - Portfolio website builder
    - Premium templates and assets
  `,
  images: [
    "/images/license1.jpg",
    "/images/license1.jpg",
    "/images/license1.jpg",
    "/images/license1.jpg",
  ],
  rating: 4.7,
  reviews: 342,
  category: "Creative Software",
  subscriptionType: "Annual, monthly payment",
  price: 52.99,
  billingCycle: "monthly",
  freeTrial: true,
  trialDays: 7,
  devices: 2,
  users: 1,
  lastUpdated: "2023-11-15",
  version: "2023",
  platform: "Windows, macOS",
  language: "Multiple languages",
  support: "24/7 customer support",
  cloudStorage: "100GB",
  includedApps: [
    "Photoshop",
    "Illustrator",
    "Premiere Pro",
    "After Effects",
    "InDesign",
    "Lightroom",
    "Acrobat Pro",
    "XD",
    "Audition",
    "Animate",
    "Dreamweaver",
    "Fresco",
    "Substance 3D apps",
  ],
};

// Related licenses for recommendation section
const relatedLicenses = [
  {
    id: 2,
    name: "Microsoft 365 Family",
    publisher: "Microsoft",
    price: 99.99,
    billingCycle: "yearly",
    devices: 6,
    users: 6,
    image: "/images/license1.jpg",
    rating: 4.5,
    category: "Productivity Suite",
  },
  {
    id: 3,
    name: "Final Cut Pro",
    publisher: "Apple",
    price: 299.99,
    billingCycle: "one-time",
    devices: 1,
    users: 1,
    image: "/images/license1.jpg",
    rating: 4.8,
    category: "Video Editing",
  },
  {
    id: 4,
    name: "AutoCAD",
    publisher: "Autodesk",
    price: 235,
    billingCycle: "monthly",
    devices: 3,
    users: 1,
    image: "/images/license1.jpg",
    rating: 4.4,
    category: "CAD Software",
  },
];

export default function LicenseDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showAllDetails, setShowAllDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { addToCart } = useCart();

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  const handleAddToCart = () => {
    addToCart({
      id: licenseData._id,
      name: licenseData.name,
      price: licenseData.price,
      billingCycle: licenseData.billingCycle,
      quantity: 1,
      image: licenseData.images[0],
    });
    alert(`${licenseData.name} added to cart!`);
  };

  const handlePurchase = () => {
    setShowPurchaseModal(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(licenseData.name);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navigateToLicense = (licenseId: string) => {
    router.push(`/license/${licenseId}`);
  };

  const formatPrice = (price: number, cycle: string) => {
    if (cycle === "monthly") return `$${price}/month`;
    if (cycle === "yearly") return `$${price}/year`;
    return `$${price}`;
  };

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <button
                onClick={() => router.push("/")}
                className="hover:text-purple-600"
              >
                Home
              </button>
              <svg
                className="fill-current w-3 h-3 mx-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
            <li className="flex items-center">
              <button
                onClick={() => router.push("/license")}
                className="hover:text-purple-600"
              >
                Software Licenses
              </button>
              <svg
                className="fill-current w-3 h-3 mx-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
            <li className="text-purple-600">{licenseData.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Gallery Section */}
          <div>
            <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-lg mb-4">
              <Image
                src={licenseData.images[selectedImage]}
                alt={licenseData.name}
                fill
                className="object-cover"
                priority
              />
              <button
                onClick={toggleFavorite}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                aria-label={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
              >
                <Heart
                  className={`w-6 h-6 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                />
              </button>
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImage + 1} / {licenseData.images.length}
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {licenseData.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-28 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImage === idx
                      ? "border-purple-500"
                      : "border-gray-200"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${licenseData.name} view ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {licenseData.name}
                </h1>
                <div className="flex items-center text-gray-600 mt-1">
                  <Building className="w-5 h-5 mr-1" />
                  <span>{licenseData.publisher}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end mt-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-gray-700">
                    {licenseData.rating}
                  </span>
                  <span className="mx-1">•</span>
                  <span className="text-gray-500">
                    {licenseData.reviews} reviews
                  </span>
                </div>
                <div className="mt-2 text-sm font-medium text-blue-600">
                  {licenseData.category}
                </div>
              </div>
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">
              {licenseData.description}
            </p>

            {/* Pricing */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Price</span>
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(licenseData.price, licenseData.billingCycle)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {licenseData.users} user, {licenseData.devices} devices
                  </span>
                </div>
                {licenseData.freeTrial && (
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-green-500" />
                    <span className="text-sm font-medium text-green-600">
                      {licenseData.trialDays}-day free trial
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* License Details */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">License Details</h3>
                <button
                  onClick={() => setShowAllDetails(!showAllDetails)}
                  className="text-sm text-purple-600 hover:underline flex items-center"
                >
                  {showAllDetails ? (
                    <>
                      Show less <ChevronUp className="ml-1 w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Show all <ChevronDown className="ml-1 w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Subscription Type</span>
                  <span className="font-medium">
                    {licenseData.subscriptionType}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Version</span>
                  <span className="font-medium">{licenseData.version}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Platform</span>
                  <span>{licenseData.platform}</span>
                </div>

                {showAllDetails && (
                  <>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Language</span>
                      <span>{licenseData.language}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Support</span>
                      <span>{licenseData.support}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Cloud Storage</span>
                      <span>{licenseData.cloudStorage}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Last Updated</span>
                      <span>{licenseData.lastUpdated}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handlePurchase}
                className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors flex items-center justify-center"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Purchase License
              </button>
              <button onClick={handleAddToCart} className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center">
                <Download className="w-5 h-5 mr-2" />
                Add To Cart
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12 border-b border-gray-200">
          <nav className="flex space-x-8">
            {["overview", "included", "requirements", "details"].map((tab) => (
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
              <h2 className="text-2xl font-bold mb-4">Software Overview</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 mb-4">
                  {licenseData.longDescription}
                </p>

                <h3 className="text-xl font-semibold mt-6 mb-3">
                  Key Benefits
                </h3>
                <ul className="list-disc pl-5 mb-4 text-gray-700">
                  <li>
                    Access to the complete collection of Adobe creative apps
                  </li>
                  <li>
                    Regular updates with new features and performance
                    improvements
                  </li>
                  <li>Generous cloud storage for assets and collaboration</li>
                  <li>Premium fonts, templates, and stock assets</li>
                  <li>Seamless workflow between applications</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">Ideal For</h3>
                <p className="text-gray-700">
                  Professional designers, photographers, videographers, UX/UI
                  designers, illustrators, marketing professionals, and creative
                  teams of all sizes.
                </p>
              </div>
            </div>
          )}

          {activeTab === "included" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Included Applications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {licenseData.includedApps.map((app, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg flex items-center"
                  >
                    <FileText className="w-5 h-5 mr-3 text-purple-500" />
                    <span className="font-medium">{app}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-semibold mb-3">
                Additional Benefits
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Globe className="w-5 h-5 mr-2 text-purple-600" />
                    <span className="font-medium">Adobe Fonts</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Access to thousands of premium fonts for your projects
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Upload className="w-5 h-5 mr-2 text-purple-600" />
                    <span className="font-medium">Cloud Storage</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    100GB of cloud storage for files and collaboration
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Shield className="w-5 h-5 mr-2 text-purple-600" />
                    <span className="font-medium">Portfolio Website</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Customizable portfolio website to showcase your work
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Users className="w-5 h-5 mr-2 text-purple-600" />
                    <span className="font-medium">Collaboration Tools</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Share and collaborate on projects with team members
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "requirements" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">System Requirements</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white border rounded-xl p-5">
                  <h3 className="font-semibold text-lg mb-3">Windows</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">OS Version</span>
                      <span>Windows 10 (64-bit) version 1809 or later</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Processor</span>
                      <span>Multicore Intel or AMD processor</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">RAM</span>
                      <span>8GB minimum (16GB recommended)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">GPU</span>
                      <span>DirectX 12 compatible graphics card</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Storage</span>
                      <span>4GB available space</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-xl p-5">
                  <h3 className="font-semibold text-lg mb-3">macOS</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">OS Version</span>
                      <span>macOS X v10.15 or later</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Processor</span>
                      <span>Multicore Intel processor</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">RAM</span>
                      <span>8GB minimum (16GB recommended)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">GPU</span>
                      <span>Metal compatible graphics card</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Storage</span>
                      <span>6GB available space</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      Internet Connection
                    </h3>
                    <p className="text-sm text-gray-700">
                      An internet connection is required for online services,
                      license validation, and downloading updates. Some features
                      require broadband internet (minimum 5Mbps download speed).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "details" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">License Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border rounded-xl p-5">
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-500" />
                    License Terms
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subscription</span>
                      <span className="font-medium">
                        {licenseData.subscriptionType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Billing Cycle</span>
                      <span className="font-medium">
                        {licenseData.billingCycle}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Auto-renewal</span>
                      <span className="font-medium">
                        Yes (can be canceled anytime)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">License Type</span>
                      <span className="font-medium">Subscription</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-xl p-5">
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-500" />
                    Usage Rights
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Users</span>
                      <span className="font-medium">{licenseData.users}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Devices</span>
                      <span className="font-medium">{licenseData.devices}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Commercial Use</span>
                      <span className="font-medium">Allowed</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Updates</span>
                      <span className="font-medium">Included</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-xl p-5">
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-green-500" />
                    Support & Services
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customer Support</span>
                      <span className="font-medium">{licenseData.support}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cloud Storage</span>
                      <span className="font-medium">
                        {licenseData.cloudStorage}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Community Forums</span>
                      <span className="font-medium">Access included</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tutorials</span>
                      <span className="font-medium">Extensive library</span>
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
                      <span className="font-medium">
                        {licenseData.lastUpdated}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Version</span>
                      <span className="font-medium">{licenseData.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Platform</span>
                      <span className="font-medium">
                        {licenseData.platform}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Language</span>
                      <span className="font-medium">
                        {licenseData.language}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Related Licenses Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Similar Software Licenses</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedLicenses.map((license) => (
              <motion.div
                key={license.id}
                className="border rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                whileHover={{ y: -5 }}
                onClick={() => navigateToLicense(license.id.toString())}
              >
                <div className="relative h-48">
                  <Image
                    src={license.image}
                    alt={license.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                    {license.billingCycle === "one-time"
                      ? "One-time"
                      : "Subscription"}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{license.name}</h3>
                  <p className="text-gray-500 text-sm">{license.publisher}</p>
                  <div className="flex items-center mt-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm text-gray-700">
                      {license.rating}
                    </span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-sm text-gray-500">
                      {license.category}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-gray-500">
                      {license.users} user, {license.devices} devices
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(license.price, license.billingCycle)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Purchase Modal */}
        <AnimatePresence>
          {showPurchaseModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md"
              >
                <h2 className="text-2xl font-bold mb-4">
                  Purchase {licenseData.name}
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">License Plan</span>
                    </div>
                    <div className="font-medium">
                      {licenseData.subscriptionType}
                    </div>
                    <div className="text-sm text-gray-500">
                      {licenseData.users} user, {licenseData.devices} devices
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Price</span>
                      <span className="text-xl font-bold">
                        {formatPrice(
                          licenseData.price,
                          licenseData.billingCycle
                        )}
                      </span>
                    </div>
                    {licenseData.freeTrial && (
                      <div className="text-sm text-green-600">
                        {licenseData.trialDays}-day free trial included
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <select className="w-full p-3 border rounded-lg">
                      <option>Credit/Debit Card</option>
                      <option>PayPal</option>
                      <option>Bank Transfer</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPurchaseModal(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      alert(`Processing purchase of ${licenseData.name}...`);
                      setShowPurchaseModal(false);
                    }}
                    className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700"
                  >
                    Complete Purchase
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
      <NewsletterSignup />
      <br />
      <br />
      <Footer />
    </>
  );
}
