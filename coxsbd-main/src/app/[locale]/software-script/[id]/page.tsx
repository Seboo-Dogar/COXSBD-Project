"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Heart,
  Download,
  Code,
  Clock,
  User,
  Calendar,
  Shield,
  GitBranch,
  Tag,
  ChevronDown,
  ChevronUp,
  Copy,
  CheckCircle,
} from "lucide-react";
import NewsletterSignup from "@/components/Newsletter";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useCart } from "@/context/cartContext";

// Mock data for software script
const scriptData = {
  _id: "1",
  title: "Advanced Data Analytics Dashboard",
  author: "CodeCrafters",
  price: 49,
  description:
    "A comprehensive React-based dashboard for data visualization and analytics. Features real-time data updates, multiple chart types, and customizable widgets. Built with TypeScript, Redux Toolkit, and D3.js for optimal performance.",
  longDescription: `
    This advanced analytics dashboard provides businesses with powerful tools to visualize and understand their data. 
    The script includes 10+ chart types, customizable layouts, and real-time data synchronization. 
    It's built with modern React best practices and includes full TypeScript support for type safety.
    
    Key features include:
    - Real-time data updates via WebSocket integration
    - Responsive design that works on all device sizes
    - Customizable themes and color schemes
    - Export functionality for charts and data
    - User authentication and role-based access control
    - Comprehensive documentation with examples
  `,
  images: [
    "/images/script.jpeg",
    "/images/script.jpeg",
    "/images/script.jpeg",
    "/images/script.jpeg",
  ],
  rating: 4.9,
  reviews: 128,
  category: "Dashboard & Analytics",
  technology: ["React", "TypeScript", "Redux Toolkit", "D3.js", "WebSocket"],
  tags: [
    "analytics",
    "dashboard",
    "data visualization",
    "business intelligence",
  ],
  lastUpdated: "2023-11-15",
  version: "2.3.1",
  requirements: "Node.js 16+, React 18+",
  license: "MIT",
  downloads: 1247,
  compatibility: ["Chrome", "Firefox", "Safari", "Edge"],
  supportIncluded: true,
  documentation: "Comprehensive",
  numberOfComponents: 15,
  codeQuality: "Production-ready",
};

// Related scripts for recommendation section
const relatedScripts = [
  {
    id: 2,
    title: "E-Commerce Admin Panel",
    author: "DevSolutions",
    price: 59,
    image: "/images/script.jpeg",
    rating: 4.7,
    category: "E-Commerce",
  },
  {
    id: 3,
    title: "Task Management System",
    author: "ProductivityLabs",
    price: 39,
    image: "/images/script.jpeg",
    rating: 4.5,
    category: "Productivity",
  },
  {
    id: 4,
    title: "Social Media Analytics",
    author: "DataInsight",
    price: 69,
    image: "/images/script.jpeg",
    rating: 4.8,
    category: "Analytics",
  },
];

export default function ScriptDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [licenseType, setLicenseType] = useState("single");
  const [showAllTech, setShowAllTech] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const { addToCart } = useCart();

  const licensePrices = {
    single: scriptData.price,
    extended: scriptData.price * 2,
    enterprise: scriptData.price * 5,
  };

  const totalPrice = licensePrices[licenseType as keyof typeof licensePrices];

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handlePurchase = () => {
    setShowPurchaseModal(true);
  };

  const handleAddToCart = () => {
    addToCart({
      id: scriptData._id,
      name: scriptData.title,
      price: totalPrice,
      image: scriptData.images[0],
    });
    alert(`${scriptData.title} added to cart!`);
  };

  const handleConfirmPurchase = () => {
    alert(
      `Script purchased with ${licenseType} license! Total: $${totalPrice}`
    );
    setShowPurchaseModal(false);
  };

  const navigateToScript = (scriptId: string) => {
    router.push(`/software-script/${scriptId}`);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      `npm install ${scriptData.title.toLowerCase().replace(/\s+/g, "-")}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
                className="hover:text-blue-600"
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
                onClick={() => router.push("/software-scripts")}
                className="hover:text-blue-600"
              >
                Scripts
              </button>
              <svg
                className="fill-current w-3 h-3 mx-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
            <li className="text-blue-600">{scriptData.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Gallery Section */}
          <div>
            <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-lg mb-4">
              <Image
                src={scriptData.images[selectedImage]}
                alt={scriptData.title}
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
                {selectedImage + 1} / {scriptData.images.length}
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {scriptData.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-28 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImage === idx
                      ? "border-blue-500"
                      : "border-gray-200"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${scriptData.title} view ${idx + 1}`}
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
                  {scriptData.title}
                </h1>
                <p className="text-gray-500 text-lg">by {scriptData.author}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-600">
                  ${scriptData.price}
                  <span className="text-base font-normal text-gray-500">
                    /license
                  </span>
                </p>
                <div className="flex items-center justify-end mt-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-gray-700">
                    {scriptData.rating}
                  </span>
                  <span className="mx-1">•</span>
                  <span className="text-gray-500">
                    {scriptData.reviews} reviews
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center text-gray-600 mb-6">
              <Tag className="w-5 h-5 mr-1" />
              <span>{scriptData.category}</span>
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">
              {scriptData.description}
            </p>

            {/* Script Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-medium">{scriptData.lastUpdated}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500">Version</p>
                <p className="font-medium">{scriptData.version}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500">Downloads</p>
                <p className="font-medium">
                  {scriptData.downloads.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500">License</p>
                <p className="font-medium">{scriptData.license}</p>
              </div>
            </div>

            {/* Technology Stack */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Technology Stack</h3>
              <div className="flex flex-wrap gap-2">
                {scriptData.technology
                  .slice(0, showAllTech ? scriptData.technology.length : 4)
                  .map((tech, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                {scriptData.technology.length > 4 && (
                  <button
                    onClick={() => setShowAllTech(!showAllTech)}
                    className="text-blue-600 text-sm flex items-center"
                  >
                    {showAllTech ? (
                      <>
                        Show less <ChevronUp className="ml-1 w-4 h-4" />
                      </>
                    ) : (
                      <>
                        +{scriptData.technology.length - 4} more{" "}
                        <ChevronDown className="ml-1 w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {scriptData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Installation Command */}
            <div className="mb-8 p-4 bg-gray-800 rounded-xl text-white">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Install via npm</span>
                <button
                  onClick={copyToClipboard}
                  className="text-sm bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded flex items-center"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-1" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" /> Copy
                    </>
                  )}
                </button>
              </div>
              <code className="text-sm font-mono block overflow-x-auto p-2 bg-gray-900 rounded">
                npm install{" "}
                {scriptData.title.toLowerCase().replace(/\s+/g, "-")}
              </code>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handlePurchase}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Download className="w-5 h-5 mr-2" />
                Purchase Now
              </button>
              <button onClick={handleAddToCart} className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center">
                <Code className="w-5 h-5 mr-2" />
                Add To Cart
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12 border-b border-gray-200">
          <nav className="flex space-x-8">
            {["description", "features", "documentation", "reviews"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              )
            )}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="py-8">
          {activeTab === "description" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Detailed Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 mb-4">
                  {scriptData.longDescription}
                </p>

                <h3 className="text-xl font-semibold mt-6 mb-3">
                  Key Features
                </h3>
                <ul className="list-disc pl-5 mb-4 text-gray-700">
                  <li>Real-time data updates via WebSocket integration</li>
                  <li>Responsive design that works on all device sizes</li>
                  <li>Customizable themes and color schemes</li>
                  <li>Export functionality for charts and data</li>
                  <li>User authentication and role-based access control</li>
                  <li>Comprehensive documentation with examples</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">
                  Requirements
                </h3>
                <p className="text-gray-700">{scriptData.requirements}</p>
              </div>
            </div>
          )}

          {activeTab === "features" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Complete Feature List</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">
                    Dashboard Features
                  </h3>
                  <ul className="list-disc pl-5 text-gray-700">
                    <li>Interactive data visualizations</li>
                    <li>Customizable widget system</li>
                    <li>Drag-and-drop interface</li>
                    <li>Real-time data updates</li>
                    <li>Multiple layout options</li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">
                    Technical Features
                  </h3>
                  <ul className="list-disc pl-5 text-gray-700">
                    <li>Built with TypeScript for type safety</li>
                    <li>Redux Toolkit for state management</li>
                    <li>WebSocket integration for real-time updates</li>
                    <li>Responsive design with Tailwind CSS</li>
                    <li>Optimized performance with lazy loading</li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">
                    Data Management
                  </h3>
                  <ul className="list-disc pl-5 text-gray-700">
                    <li>Multiple data source integration</li>
                    <li>CSV/JSON import functionality</li>
                    <li>Data filtering and sorting</li>
                    <li>Export to PDF/PNG/CSV</li>
                    <li>Historical data tracking</li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">
                    User Management
                  </h3>
                  <ul className="list-disc pl-5 text-gray-700">
                    <li>Role-based access control</li>
                    <li>User authentication system</li>
                    <li>Customizable user permissions</li>
                    <li>User activity logging</li>
                    <li>Team collaboration features</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === "documentation" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Documentation</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 mb-4">
                  Our comprehensive documentation includes setup instructions,
                  API references, and usage examples to help you get started
                  quickly.
                </p>

                <h3 className="text-xl font-semibold mt-6 mb-3">
                  Getting Started
                </h3>
                <ol className="list-decimal pl-5 mb-4 text-gray-700">
                  <li>Install the package using npm or yarn</li>
                  <li>Import the components into your project</li>
                  <li>Configure the dashboard with your data sources</li>
                  <li>Customize the appearance to match your brand</li>
                  <li>Deploy and start analyzing your data</li>
                </ol>

                <h3 className="text-xl font-semibold mt-6 mb-3">
                  API Reference
                </h3>
                <p className="text-gray-700 mb-4">
                  The complete API reference is available in our documentation
                  portal, including all props, methods, and events.
                </p>

                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  View Full Documentation
                </button>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">User Reviews</h2>
              <div className="space-y-6">
                <div className="p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Sarah Johnson</h4>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < 5 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-500">
                          2 days ago
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    This dashboard has transformed how we analyze our business
                    data. The real-time updates are incredibly useful for our
                    team, and the customization options allowed us to match our
                    brand perfectly.
                  </p>
                </div>

                <div className="p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Michael Chen</h4>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-500">
                          1 week ago
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    The code quality is exceptional. As a senior developer, I
                    appreciate the TypeScript implementation and well-structured
                    components. The documentation made integration seamless.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Related Scripts Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedScripts.map((script) => (
              <motion.div
                key={script.id}
                className="border rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                whileHover={{ y: -5 }}
                onClick={() => navigateToScript(script.id.toString())}
              >
                <div className="relative h-48">
                  <Image
                    src={script.image}
                    alt={script.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{script.title}</h3>
                  <p className="text-gray-500">by {script.author}</p>
                  <div className="flex items-center mt-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm text-gray-700">
                      {script.rating}
                    </span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-sm text-gray-500">
                      {script.category}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-gray-500"></span>
                    <p className="text-blue-600 font-bold">${script.price}</p>
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
                  Purchase {scriptData.title}
                </h2>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      License Type
                    </label>
                    <div className="space-y-2">
                      {[
                        {
                          id: "single",
                          label: "Single Site",
                          desc: "Use on one domain",
                        },
                        {
                          id: "extended",
                          label: "Extended",
                          desc: "Use on up to 5 domains",
                        },
                        {
                          id: "enterprise",
                          label: "Enterprise",
                          desc: "Unlimited domains",
                        },
                      ].map((license) => (
                        <div
                          key={license.id}
                          className={`flex justify-between items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                            licenseType === license.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-300"
                          }`}
                          onClick={() => setLicenseType(license.id)}
                        >
                          <div>
                            <p className="font-medium">{license.label}</p>
                            <p className="text-sm text-gray-500">
                              {license.desc}
                            </p>
                          </div>
                          <p className="font-semibold">
                            $
                            {
                              licensePrices[
                                license.id as keyof typeof licensePrices
                              ]
                            }
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <Shield className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm text-green-700">
                      Includes 6 months of support and updates
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span>License fee</span>
                    <span>
                      $
                      {licensePrices[licenseType as keyof typeof licensePrices]}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2 text-sm text-gray-600">
                    <span>Taxes</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-2">
                    <span>Total</span>
                    <span>${totalPrice}</span>
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
                    onClick={handleConfirmPurchase}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700"
                  >
                    Confirm Purchase
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
