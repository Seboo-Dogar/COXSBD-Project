"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Server,
  Cpu,
  Database,
  HardDrive,
  Zap,
  Shield,
  Globe,
  Users,
  Clock,
  Star,
  Heart,
  CheckCircle,
  ArrowRight,
  CreditCard,
  Calendar,
  BarChart3,
  Network,
  Cloud,
  ServerCrash,
} from "lucide-react";
import NewsletterSignup from "@/components/Newsletter";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useCart } from "@/context/cartContext";

// Mock data for dedicated servers
const dedicatedServers = {
  "1": {
    _id: "1",
    name: "Enterprise Dedicated Server",
    provider: "ServerMax",
    price: 199,
    renewalPrice: 249,
    description:
      "High-performance dedicated servers with full root access, ideal for resource-intensive applications.",
    images: [
      "/images/server.jpeg",
      "/images/server.jpeg",
      "/images/server.jpeg",
      "/images/server.jpeg",
    ],
    rating: 4.9,
    reviews: 128,
    features: [
      "Dedicated Resources",
      "Full Root Access",
      "Hardware RAID",
      "IPMI Access",
      "DDoS Protection",
      "24/7 Monitoring",
      "Hardware Replacement",
      "Choice of OS",
      "Multiple IP Addresses",
      "99.99% Uptime SLA",
    ],
    specifications: {
      cpu: "Intel Xeon E-2236 (6 cores, 3.4 GHz)",
      ram: "32 GB ECC DDR4",
      storage: "2x 1 TB NVMe SSD (RAID 1)",
      bandwidth: "10 TB Monthly",
      port: "1 Gbps",
      ips: "5 Dedicated IPs",
    },
    available: true,
    bestFor: "Large enterprises, gaming servers, high-traffic sites",
    serverType: "Enterprise",
  },
  "2": {
    _id: "2",
    name: "GPU Dedicated Server",
    provider: "ServerMax",
    price: 399,
    renewalPrice: 499,
    description:
      "High-performance GPU servers optimized for AI, machine learning, and graphics-intensive applications.",
    images: [
      "/images/gpu-server.jpg",
      "/images/gpu-rack.jpg",
      "/images/ai-server.jpg",
      "/images/rendering-server.jpg",
    ],
    rating: 4.9,
    reviews: 92,
    features: [
      "NVIDIA RTX 4090 GPU",
      "Dedicated Resources",
      "CUDA Support",
      "Full Root Access",
      "Hardware RAID",
      "DDoS Protection",
      "24/7 Monitoring",
      "AI-Optimized",
      "Multiple IP Addresses",
      "99.99% Uptime SLA",
    ],
    specifications: {
      cpu: "AMD Ryzen Threadripper 3970X (32 cores, 3.7 GHz)",
      ram: "64 GB DDR4",
      gpu: "NVIDIA RTX 4090 24GB",
      storage: "2x 2 TB NVMe SSD (RAID 1)",
      bandwidth: "15 TB Monthly",
      port: "2.5 Gbps",
      ips: "5 Dedicated IPs",
    },
    available: true,
    bestFor: "AI/ML workloads, video rendering, gaming servers",
    serverType: "GPU",
  },
  "3": {
    _id: "3",
    name: "Budget Dedicated Server",
    provider: "ServerValue",
    price: 89,
    renewalPrice: 109,
    description:
      "Affordable dedicated server solution for small to medium businesses with reliable performance.",
    images: [
      "/images/budget-server.jpg",
      "/images/value-rack.jpg",
      "/images/small-business-server.jpg",
      "/images/economy-data-center.jpg",
    ],
    rating: 4.6,
    reviews: 215,
    features: [
      "Dedicated Resources",
      "Root Access",
      "Basic DDoS Protection",
      "24/7 Monitoring",
      "Choice of OS",
      "Free Setup",
      "99.9% Uptime SLA",
      "Basic Support",
      "1 Dedicated IP",
      "Remote Reboot",
    ],
    specifications: {
      cpu: "Intel Xeon E3-1230 (4 cores, 3.3 GHz)",
      ram: "16 GB DDR4",
      storage: "2x 500 GB SSD (RAID 1)",
      bandwidth: "5 TB Monthly",
      port: "1 Gbps",
      ips: "1 Dedicated IP",
    },
    available: true,
    bestFor: "Small businesses, development servers, medium-traffic websites",
    serverType: "Budget",
  },
};

// Related servers for recommendation section
const relatedServers = [
  {
    id: "2",
    name: "GPU Dedicated Server",
    provider: "ServerMax",
    price: 399,
    image: "/images/server.jpeg",
    rating: 4.9,
  },
  {
    id: "3",
    name: "Budget Dedicated Server",
    provider: "ServerValue",
    price: 89,
    image: "/images/server.jpeg",
    rating: 4.6,
  },
  {
    id: "4",
    name: "High Memory Server",
    provider: "DataMax",
    price: 299,
    image: "/images/server.jpeg",
    rating: 4.8,
  },
];

export default function DedicatedServerPage() {
  const params = useParams();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderStep, setOrderStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState("12mo");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [selectedConfiguration, setSelectedConfiguration] = useState({
    os: "ubuntu",
    controlPanel: "none",
    backup: "none",
  });
  const { addToCart } = useCart();
  
  const [formData, setFormData] = useState({
    hostname: "",
    name: "",
    email: "",
    password: "",
    paymentMethod: "creditCard",
  });

  // Safely get parameters with fallbacks
  const serverId = (params?.id as string) || "1";

  // Get server data based on ID
  const serverData =
    dedicatedServers[serverId as keyof typeof dedicatedServers] ||
    dedicatedServers["1"];

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

const handleAddToCart = () => {
  // Use serverData instead of hostingData
  addToCart({
    id: serverData._id,
    name: serverData.name,
    price: serverData.price,
    image: serverData.images[0], // use the first image
    duration: selectedPlan, // selectedPlan instead of undefined selectedDuration
  });

  alert(`${serverData.name} added to cart!`);
};

  const handleOrderNow = () => {
    setShowOrderModal(true);
    setOrderStep(1);
  };

  const handleNextStep = () => {
    if (orderStep < 4) {
      setOrderStep(orderStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (orderStep > 1) {
      setOrderStep(orderStep - 1);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `Order confirmed for ${serverData.name}! You will receive configuration details at ${formData.email}`
    );
    setShowOrderModal(false);
    setFormData({
      hostname: "",
      name: "",
      email: "",
      password: "",
      paymentMethod: "creditCard",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfigChange = (name: string, value: string) => {
    setSelectedConfiguration((prev) => ({ ...prev, [name]: value }));
  };

  const toggleAddon = (addon: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addon)
        ? prev.filter((item) => item !== addon)
        : [...prev, addon]
    );
  };

  const navigateToServer = (serverId: string) => {
    router.push(`/servers/dedicated/${serverId}`);
  };

  // Calculate total price based on plan, configuration and addons
  const calculateTotal = () => {
    const planMultiplier =
      selectedPlan === "1mo" ? 1 : selectedPlan === "12mo" ? 12 : 24;
    const basePrice = serverData.price * planMultiplier;

    // Configuration costs
    let configCost = 0;
    if (selectedConfiguration.controlPanel === "cpanel") configCost += 15;
    if (selectedConfiguration.controlPanel === "plesk") configCost += 12;
    if (selectedConfiguration.backup === "daily") configCost += 9;
    if (selectedConfiguration.backup === "weekly") configCost += 5;

    const configPrice = configCost * planMultiplier;

    // Addon costs
    const addonsPrice = selectedAddons.reduce((total, addon) => {
      switch (addon) {
        case "managed":
          return (
            total +
            (selectedPlan === "1mo" ? 49.99 : 49.99 * planMultiplier * 0.8)
          );
        case "monitoring":
          return (
            total +
            (selectedPlan === "1mo" ? 14.99 : 14.99 * planMultiplier * 0.8)
          );
        case "ssl":
          return (
            total +
            (selectedPlan === "1mo" ? 5.99 : 5.99 * planMultiplier * 0.8)
          );
        case "ip":
          return (
            total +
            (selectedPlan === "1mo" ? 2.99 : 2.99 * planMultiplier * 0.8)
          );
        default:
          return total;
      }
    }, 0);

    return basePrice + configPrice + addonsPrice;
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
                className="hover:text-green-600"
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
                onClick={() => router.push("/servers")}
                className="hover:text-green-600"
              >
                Servers
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
                onClick={() => router.push("/servers/dedicated")}
                className="hover:text-green-600"
              >
                Dedicated Servers
              </button>
              <svg
                className="fill-current w-3 h-3 mx-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
            <li className="text-green-600">{serverData.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Gallery Section */}
          <div>
            <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-lg mb-4">
              <Image
                src={
                  serverData.images[selectedImage] ||
                  "/images/dedicated-server.jpg"
                }
                alt={serverData.name}
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
              {!serverData.available && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Not Available
                </div>
              )}
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImage + 1} / {serverData.images.length}
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {serverData.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-28 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImage === idx
                      ? "border-green-500"
                      : "border-gray-200"
                  }`}
                >
                  <Image
                    src={img || "/images/dedicated-server.jpg"}
                    alt={`${serverData.name} view ${idx + 1}`}
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
                  {serverData.name}
                </h1>
                <p className="text-gray-500 text-lg">{serverData.provider}</p>
                <div className="inline-block mt-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md">
                  {serverData.serverType} Server
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-green-600">
                  ${serverData.price}
                  <span className="text-base font-normal text-gray-500">
                    /mo
                  </span>
                </p>
                <p className="text-sm text-gray-500 line-through">
                  ${serverData.renewalPrice}/mo renewal
                </p>
                <div className="flex items-center justify-end mt-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-gray-700">
                    {serverData.rating}
                  </span>
                  <span className="mx-1">•</span>
                  <span className="text-gray-500">
                    {serverData.reviews} reviews
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center text-gray-600 mb-6">
              <Server className="w-5 h-5 mr-1" />
              <span>Dedicated Server</span>
            </div>

            <p className="text-gray-700 mb-8 leading-relaxed">
              {serverData.description}
            </p>

            {/* Best For */}
            <div className="mb-6 p-4 bg-green-50 rounded-xl">
              <h3 className="font-semibold text-green-800 mb-2">
                Perfect For:
              </h3>
              <p className="text-green-700">{serverData.bestFor}</p>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-gray-50 rounded-xl flex items-center">
                <Cpu className="w-6 h-6 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">CPU</p>
                  <p className="font-medium">{serverData.specifications.cpu}</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl flex items-center">
                <Database className="w-6 h-6 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">RAM</p>
                  <p className="font-medium">{serverData.specifications.ram}</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl flex items-center">
                <HardDrive className="w-6 h-6 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Storage</p>
                  <p className="font-medium">
                    {serverData.specifications.storage}
                  </p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl flex items-center">
                <Zap className="w-6 h-6 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Bandwidth</p>
                  <p className="font-medium">
                    {serverData.specifications.bandwidth}
                  </p>
                </div>
              </div>
              {"gpu" in serverData.specifications && (
                <div className="p-4 bg-gray-50 rounded-xl flex items-center col-span-2">
                  <BarChart3 className="w-6 h-6 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">GPU</p>
                    <p className="font-medium">
                      {serverData.specifications.gpu}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Key Features */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Key Features</h3>
              <div className="grid grid-cols-1 gap-2">
                {serverData.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleOrderNow}
                disabled={!serverData.available}
                className="flex-1 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {serverData.available ? "Order Now" : "Not Available"}
              </button>
              <button onClick={handleAddToCart} className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                Add To Cart
              </button>
            </div>
          </div>
        </div>

        {/* Technical Specifications Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Technical Specifications</h2>
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 text-lg">Hardware</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Processor</span>
                    <span className="font-medium">
                      {serverData.specifications.cpu}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Memory</span>
                    <span className="font-medium">
                      {serverData.specifications.ram}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Storage</span>
                    <span className="font-medium">
                      {serverData.specifications.storage}
                    </span>
                  </li>
                  {"gpu" in serverData.specifications && (
                    <li className="flex justify-between">
                      <span className="text-gray-600">Graphics</span>
                      <span className="font-medium">
                        {serverData.specifications.gpu}
                      </span>
                    </li>
                  )}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-lg">Network</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Bandwidth</span>
                    <span className="font-medium">
                      {serverData.specifications.bandwidth}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Port Speed</span>
                    <span className="font-medium">
                      {serverData.specifications.port}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">IP Addresses</span>
                    <span className="font-medium">
                      {serverData.specifications.ips}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Related Servers Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Other Dedicated Servers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedServers.map((server) => (
              <motion.div
                key={server.id}
                className="border rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                whileHover={{ y: -5 }}
                onClick={() => navigateToServer(server.id)}
              >
                <div className="relative h-48">
                  <Image
                    src={server.image || "/images/dedicated-server.jpg"}
                    alt={server.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{server.name}</h3>
                  <p className="text-gray-500">{server.provider}</p>
                  <div className="flex items-center mt-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm text-gray-700">
                      {server.rating}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-gray-500">
                      Dedicated Server
                    </span>
                    <p className="text-green-600 font-bold">
                      ${server.price}/mo
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                question: "What is a dedicated server?",
                answer:
                  "A dedicated server is a physical server exclusively allocated to a single client. You get full access to all server resources without sharing with other customers.",
              },
              {
                question: "How long does it take to provision my server?",
                answer:
                  "Most dedicated servers are provisioned within 2-4 hours after payment verification. Custom configurations may take up to 24 hours.",
              },
              {
                question: "Do I get root access to my server?",
                answer:
                  "Yes, all our dedicated servers come with full root/administrator access, giving you complete control over your server environment.",
              },
              {
                question: "What kind of support is included?",
                answer:
                  "We provide 24/7/365 hardware support and network monitoring. For OS and software support, we offer managed support plans as an addon.",
              },
            ].map((faq, index) => (
              <div key={index} className="border rounded-xl overflow-hidden">
                <button className="w-full p-4 text-left font-medium bg-gray-50 hover:bg-gray-100 flex justify-between items-center">
                  {faq.question}
                  <svg
                    className="w-5 h-5 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div className="p-4 bg-white">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Order Modal */}
        <AnimatePresence>
          {showOrderModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <h2 className="text-2xl font-bold mb-4">
                  Order {serverData.name}
                </h2>

                {/* Progress Steps */}
                <div className="flex justify-between mb-6 relative">
                  <div className="absolute top-3 left-0 right-0 h-1 bg-gray-200 z-0"></div>
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="relative z-10">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${orderStep >= step ? "bg-green-600 text-white" : "bg-gray-200 text-gray-500"}`}
                      >
                        {step}
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs whitespace-nowrap hidden md:block">
                        Step {step}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Form Steps */}
                {orderStep === 1 && (
                  <div className="space-y-6 mb-6">
                    <h3 className="font-semibold text-lg">
                      Choose Billing Cycle
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        {
                          id: "1mo",
                          name: "1 Month",
                          price: serverData.price,
                          save: 0,
                        },
                        {
                          id: "12mo",
                          name: "12 Months",
                          price: serverData.price * 12 * 0.8,
                          save: 20,
                        },
                        {
                          id: "24mo",
                          name: "24 Months",
                          price: serverData.price * 24 * 0.7,
                          save: 30,
                        },
                      ].map((plan) => (
                        <div
                          key={plan.id}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            selectedPlan === plan.id
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200"
                          }`}
                          onClick={() => setSelectedPlan(plan.id)}
                        >
                          <h4 className="font-medium">{plan.name}</h4>
                          <p className="text-lg font-bold text-green-600">
                            ${plan.price.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            ${serverData.price}/mo
                          </p>
                          {plan.save > 0 && (
                            <p className="text-sm text-green-500 mt-1">
                              Save {plan.save}%
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {orderStep === 2 && (
                  <div className="space-y-6 mb-6">
                    <h3 className="font-semibold text-lg">
                      Configure Your Server
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Operating System
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: "ubuntu", name: "Ubuntu 22.04 LTS", price: 0 },
                          { id: "centos", name: "CentOS 8", price: 0 },
                          {
                            id: "windows",
                            name: "Windows Server 2022",
                            price: 15,
                          },
                          { id: "debian", name: "Debian 11", price: 0 },
                        ].map((os) => (
                          <div
                            key={os.id}
                            className={`border rounded-lg p-3 cursor-pointer transition-all ${
                              selectedConfiguration.os === os.id
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200"
                            }`}
                            onClick={() => handleConfigChange("os", os.id)}
                          >
                            <div className="flex justify-between items-center">
                              <span>{os.name}</span>
                              {os.price > 0 && (
                                <span className="text-green-600">
                                  +${os.price}/mo
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Control Panel
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: "none", name: "None", price: 0 },
                          { id: "cpanel", name: "cPanel", price: 15 },
                          { id: "plesk", name: "Plesk", price: 12 },
                        ].map((panel) => (
                          <div
                            key={panel.id}
                            className={`border rounded-lg p-3 cursor-pointer transition-all ${
                              selectedConfiguration.controlPanel === panel.id
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200"
                            }`}
                            onClick={() =>
                              handleConfigChange("controlPanel", panel.id)
                            }
                          >
                            <div className="flex justify-between items-center">
                              <span>{panel.name}</span>
                              {panel.price > 0 && (
                                <span className="text-green-600">
                                  +${panel.price}/mo
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Backup Solution
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: "none", name: "None", price: 0 },
                          { id: "weekly", name: "Weekly", price: 5 },
                          { id: "daily", name: "Daily", price: 9 },
                        ].map((backup) => (
                          <div
                            key={backup.id}
                            className={`border rounded-lg p-3 cursor-pointer transition-all ${
                              selectedConfiguration.backup === backup.id
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200"
                            }`}
                            onClick={() =>
                              handleConfigChange("backup", backup.id)
                            }
                          >
                            <div className="flex justify-between items-center">
                              <span>{backup.name}</span>
                              {backup.price > 0 && (
                                <span className="text-green-600">
                                  +${backup.price}/mo
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {orderStep === 3 && (
                  <div className="space-y-6 mb-6">
                    <h3 className="font-semibold text-lg">
                      Add Additional Services
                    </h3>
                    <div className="space-y-3">
                      {[
                        {
                          id: "managed",
                          name: "Fully Managed Support",
                          desc: "24/7 server management and support",
                          price: 49.99,
                        },
                        {
                          id: "monitoring",
                          name: "Advanced Monitoring",
                          desc: "Real-time performance monitoring",
                          price: 14.99,
                        },
                        {
                          id: "ssl",
                          name: "SSL Certificate",
                          desc: "Secure your services with SSL",
                          price: 5.99,
                        },
                        {
                          id: "ip",
                          name: "Additional IP Address",
                          desc: "Extra dedicated IP address",
                          price: 2.99,
                        },
                      ].map((addon) => (
                        <div
                          key={addon.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            selectedAddons.includes(addon.id)
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200"
                          }`}
                          onClick={() => toggleAddon(addon.id)}
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedAddons.includes(addon.id)}
                              onChange={() => {}}
                              className="mr-3"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">{addon.name}</h4>
                              <p className="text-sm text-gray-600">
                                {addon.desc}
                              </p>
                            </div>
                            <p className="text-green-600 font-medium">
                              ${addon.price}/mo
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {orderStep === 4 && (
                  <div className="space-y-6 mb-6">
                    <h3 className="font-semibold text-lg">
                      Review & Complete Order
                    </h3>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-3">Order Summary</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>
                            {serverData.name} ({selectedPlan})
                          </span>
                          <span>${serverData.price}/mo</span>
                        </div>

                        {/* Configuration costs */}
                        {selectedConfiguration.os === "windows" && (
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>+ Windows Server 2022</span>
                            <span>$15/mo</span>
                          </div>
                        )}
                        {selectedConfiguration.controlPanel === "cpanel" && (
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>+ cPanel License</span>
                            <span>$15/mo</span>
                          </div>
                        )}
                        {selectedConfiguration.controlPanel === "plesk" && (
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>+ Plesk License</span>
                            <span>$12/mo</span>
                          </div>
                        )}
                        {selectedConfiguration.backup === "daily" && (
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>+ Daily Backups</span>
                            <span>$9/mo</span>
                          </div>
                        )}
                        {selectedConfiguration.backup === "weekly" && (
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>+ Weekly Backups</span>
                            <span>$5/mo</span>
                          </div>
                        )}

                        {/* Addon costs */}
                        {selectedAddons.map((addonId) => {
                          const addon = [
                            {
                              id: "managed",
                              name: "Managed Support",
                              price: 49.99,
                            },
                            {
                              id: "monitoring",
                              name: "Advanced Monitoring",
                              price: 14.99,
                            },
                            { id: "ssl", name: "SSL Certificate", price: 5.99 },
                            { id: "ip", name: "Additional IP", price: 2.99 },
                          ].find((a) => a.id === addonId);

                          return addon ? (
                            <div
                              key={addon.id}
                              className="flex justify-between text-sm text-gray-600"
                            >
                              <span>+ {addon.name}</span>
                              <span>${addon.price}/mo</span>
                            </div>
                          ) : null;
                        })}

                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between font-semibold">
                            <span>Total ({selectedPlan})</span>
                            <span className="text-green-600">
                              ${calculateTotal().toFixed(2)}
                            </span>
                          </div>
                          {selectedPlan !== "1mo" && (
                            <p className="text-sm text-gray-500 mt-1">
                              {selectedPlan === "12mo"
                                ? "20% discount applied"
                                : "30% discount applied"}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      <h4 className="font-medium">Account Information</h4>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Server Hostname
                        </label>
                        <input
                          type="text"
                          name="hostname"
                          value={formData.hostname}
                          onChange={handleInputChange}
                          placeholder="e.g., myserver"
                          className="w-full p-3 border border-gray-300 rounded-lg"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                          className="w-full p-3 border border-gray-300 rounded-lg"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your@email.com"
                          className="w-full p-3 border border-gray-300 rounded-lg"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Account Password
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Create a secure password"
                          className="w-full p-3 border border-gray-300 rounded-lg"
                          required
                          minLength={8}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Payment Method
                        </label>
                        <select
                          name="paymentMethod"
                          value={formData.paymentMethod}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg"
                        >
                          <option value="creditCard">Credit Card</option>
                          <option value="paypal">PayPal</option>
                          <option value="crypto">Cryptocurrency</option>
                          <option value="bankTransfer">Bank Transfer</option>
                        </select>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="terms"
                          className="mr-2"
                          required
                        />
                        <label
                          htmlFor="terms"
                          className="text-sm text-gray-600"
                        >
                          I agree to the Terms of Service and Privacy Policy
                        </label>
                      </div>
                    </form>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4 border-t">
                  <button
                    onClick={handlePrevStep}
                    disabled={orderStep === 1}
                    className="px-6 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Back
                  </button>

                  {orderStep < 4 ? (
                    <button
                      onClick={handleNextStep}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      onClick={handleFormSubmit}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Complete Order
                    </button>
                  )}
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
