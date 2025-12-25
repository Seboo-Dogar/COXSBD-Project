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
  CpuIcon,
} from "lucide-react";
import NewsletterSignup from "@/components/Newsletter";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useCart } from "@/context/cartContext";

// Mock data for cloud VPS
const cloudVPS = {
  "1": {
    _id: "1",
    name: "Business Cloud VPS",
    provider: "CloudHost",
    price: 29.99,
    renewalPrice: 39.99,
    description:
      "High-performance cloud VPS with scalable resources, perfect for growing businesses and applications.",
    images: [
      "/images/vps.jpg",
      "/images/vps.jpg",
      "/images/vps.jpg",
      "/images/vps.jpg",
    ],
    rating: 4.8,
    reviews: 156,
    features: [
      "SSD Storage",
      "Scalable Resources",
      "Root Access",
      "Multiple OS Options",
      "DDoS Protection",
      "24/7 Monitoring",
      "Snapshot Backups",
      "99.99% Uptime SLA",
      "Instant Deployment",
      "API Access",
    ],
    specifications: {
      cpu: "4 vCPU Cores",
      ram: "8 GB DDR4",
      storage: "80 GB NVMe SSD",
      bandwidth: "5 TB Monthly",
      port: "1 Gbps",
      ips: "1 Dedicated IP",
    },
    available: true,
    bestFor:
      "Small to medium businesses, web applications, development environments",
    serverType: "Business",
  },
  "2": {
    _id: "2",
    name: "Developer Cloud VPS",
    provider: "DevCloud",
    price: 9.99,
    renewalPrice: 14.99,
    description:
      "Affordable cloud VPS solution for developers, students, and small projects with essential features.",
    images: [
      "/images/dev-vps.jpg",
      "/images/dev-dashboard.jpg",
      "/images/code-server.jpg",
      "/images/dev-setup.jpg",
    ],
    rating: 4.5,
    reviews: 283,
    features: [
      "SSD Storage",
      "Root Access",
      "Multiple OS Options",
      "Basic DDoS Protection",
      "99.9% Uptime SLA",
      "Snapshot Backups",
      "API Access",
      "Free SSL Certificate",
      "One-Click Apps",
      "Developer Tools",
    ],
    specifications: {
      cpu: "2 vCPU Cores",
      ram: "4 GB DDR4",
      storage: "40 GB NVMe SSD",
      bandwidth: "2 TB Monthly",
      port: "1 Gbps",
      ips: "1 Dedicated IP",
    },
    available: true,
    bestFor: "Developers, students, small projects, testing environments",
    serverType: "Developer",
  },
  "3": {
    _id: "3",
    name: "Enterprise Cloud VPS",
    provider: "EnterpriseCloud",
    price: 79.99,
    renewalPrice: 99.99,
    description:
      "High-availability enterprise-grade cloud VPS with premium resources and support for critical applications.",
    images: [
      "/images/enterprise-vps.jpg",
      "/images/enterprise-dashboard.jpg",
      "/images/ha-cluster.jpg",
      "/images/enterprise-management.jpg",
    ],
    rating: 4.9,
    reviews: 94,
    features: [
      "High Availability",
      "Premium SSD Storage",
      "Scalable Resources",
      "Root Access",
      "Advanced DDoS Protection",
      "24/7 Priority Support",
      "Automated Backups",
      "99.99% Uptime SLA",
      "Instant Deployment",
      "Dedicated Resources",
    ],
    specifications: {
      cpu: "8 vCPU Cores",
      ram: "16 GB DDR4",
      storage: "160 GB NVMe SSD",
      bandwidth: "10 TB Monthly",
      port: "2.5 Gbps",
      ips: "2 Dedicated IPs",
    },
    available: true,
    bestFor:
      "Enterprise applications, high-traffic websites, databases, mission-critical systems",
    serverType: "Enterprise",
  },
};

// Related servers for recommendation section
const relatedVPS = [
  {
    id: "2",
    name: "Developer Cloud VPS",
    provider: "DevCloud",
    price: 9.99,
    image: "/images/vps.jpg",
    rating: 4.5,
  },
  {
    id: "3",
    name: "Enterprise Cloud VPS",
    provider: "EnterpriseCloud",
    price: 79.99,
    image: "/images/vps.jpg",
    rating: 4.9,
  },
  {
    id: "4",
    name: "GPU Cloud VPS",
    provider: "GPUCloud",
    price: 129.99,
    image: "/images/vps.jpg",
    rating: 4.7,
  },
];

export default function CloudVPSPage() {
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
    backup: "weekly",
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
  const vpsId = (params?.id as string) || "1";

  // Get VPS data based on ID
  const vpsData = cloudVPS[vpsId as keyof typeof cloudVPS] || cloudVPS["1"];

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleAddToCart = () => {
    const totalPrice = calculateTotal(); // Calculate total based on plan/addons/config
    addToCart({
      id: vpsData._id,
      name: vpsData.name,
      price: totalPrice,
      image: vpsData.images[0],
      days: 1, // You can adjust if needed
    });
    alert(`${vpsData.name} added to cart!`);
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
      `Order confirmed for ${vpsData.name}! You will receive configuration details at ${formData.email}`
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

  const navigateToVPS = (vpsId: string) => {
    router.push(`/servers/cloud-vps/${vpsId}`);
  };

  // Calculate total price based on plan, configuration and addons
  const calculateTotal = () => {
    const planMultiplier =
      selectedPlan === "1mo" ? 1 : selectedPlan === "12mo" ? 12 : 24;
    const basePrice = vpsData.price * planMultiplier;

    // Configuration costs
    let configCost = 0;
    if (selectedConfiguration.controlPanel === "cpanel") configCost += 10;
    if (selectedConfiguration.controlPanel === "plesk") configCost += 8;
    if (selectedConfiguration.backup === "daily") configCost += 5;

    const configPrice = configCost * planMultiplier;

    // Addon costs
    const addonsPrice = selectedAddons.reduce((total, addon) => {
      switch (addon) {
        case "managed":
          return (
            total +
            (selectedPlan === "1mo" ? 19.99 : 19.99 * planMultiplier * 0.8)
          );
        case "monitoring":
          return (
            total +
            (selectedPlan === "1mo" ? 9.99 : 9.99 * planMultiplier * 0.8)
          );
        case "ssl":
          return (
            total +
            (selectedPlan === "1mo" ? 4.99 : 4.99 * planMultiplier * 0.8)
          );
        case "ip":
          return (
            total +
            (selectedPlan === "1mo" ? 1.99 : 1.99 * planMultiplier * 0.8)
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
                onClick={() => router.push("/servers/cloud-vps")}
                className="hover:text-green-600"
              >
                Cloud VPS
              </button>
              <svg
                className="fill-current w-3 h-3 mx-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
            <li className="text-green-600">{vpsData.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Gallery Section */}
          <div>
            <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-lg mb-4">
              <Image
                src={vpsData.images[selectedImage] || "/images/cloud-vps.jpg"}
                alt={vpsData.name}
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
              {!vpsData.available && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Not Available
                </div>
              )}
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImage + 1} / {vpsData.images.length}
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {vpsData.images.map((img, idx) => (
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
                    src={img || "/images/cloud-vps.jpg"}
                    alt={`${vpsData.name} view ${idx + 1}`}
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
                  {vpsData.name}
                </h1>
                <p className="text-gray-500 text-lg">{vpsData.provider}</p>
                <div className="inline-block mt-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md">
                  {vpsData.serverType} VPS
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-green-600">
                  ${vpsData.price}
                  <span className="text-base font-normal text-gray-500">
                    /mo
                  </span>
                </p>
                <p className="text-sm text-gray-500 line-through">
                  ${vpsData.renewalPrice}/mo renewal
                </p>
                <div className="flex items-center justify-end mt-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-gray-700">{vpsData.rating}</span>
                  <span className="mx-1">•</span>
                  <span className="text-gray-500">
                    {vpsData.reviews} reviews
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center text-gray-600 mb-6">
              <Cloud className="w-5 h-5 mr-1" />
              <span>Cloud VPS</span>
            </div>

            <p className="text-gray-700 mb-8 leading-relaxed">
              {vpsData.description}
            </p>

            {/* Best For */}
            <div className="mb-6 p-4 bg-green-50 rounded-xl">
              <h3 className="font-semibold text-green-800 mb-2">
                Perfect For:
              </h3>
              <p className="text-green-700">{vpsData.bestFor}</p>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-gray-50 rounded-xl flex items-center">
                <CpuIcon className="w-6 h-6 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">vCPU</p>
                  <p className="font-medium">{vpsData.specifications.cpu}</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl flex items-center">
                <Database className="w-6 h-6 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">RAM</p>
                  <p className="font-medium">{vpsData.specifications.ram}</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl flex items-center">
                <HardDrive className="w-6 h-6 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Storage</p>
                  <p className="font-medium">
                    {vpsData.specifications.storage}
                  </p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl flex items-center">
                <Zap className="w-6 h-6 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Bandwidth</p>
                  <p className="font-medium">
                    {vpsData.specifications.bandwidth}
                  </p>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Key Features</h3>
              <div className="grid grid-cols-1 gap-2">
                {vpsData.features.map((feature, index) => (
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
                disabled={!vpsData.available}
                className="flex-1 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {vpsData.available ? "Order Now" : "Not Available"}
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
                <h3 className="font-semibold mb-3 text-lg">Resources</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-gray-600">vCPU Cores</span>
                    <span className="font-medium">
                      {vpsData.specifications.cpu}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Memory</span>
                    <span className="font-medium">
                      {vpsData.specifications.ram}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Storage</span>
                    <span className="font-medium">
                      {vpsData.specifications.storage}
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-lg">Network</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Bandwidth</span>
                    <span className="font-medium">
                      {vpsData.specifications.bandwidth}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Port Speed</span>
                    <span className="font-medium">
                      {vpsData.specifications.port}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">IP Addresses</span>
                    <span className="font-medium">
                      {vpsData.specifications.ips}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Related Servers Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Other Cloud VPS Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedVPS.map((vps) => (
              <motion.div
                key={vps.id}
                className="border rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                whileHover={{ y: -5 }}
                onClick={() => navigateToVPS(vps.id)}
              >
                <div className="relative h-48">
                  <Image
                    src={vps.image || "/images/cloud-vps.jpg"}
                    alt={vps.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{vps.name}</h3>
                  <p className="text-gray-500">{vps.provider}</p>
                  <div className="flex items-center mt-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm text-gray-700">
                      {vps.rating}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-gray-500">Cloud VPS</span>
                    <p className="text-green-600 font-bold">${vps.price}/mo</p>
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
                question: "What is a Cloud VPS?",
                answer:
                  "A Cloud VPS (Virtual Private Server) is a virtualized server that runs on cloud infrastructure. It provides dedicated resources with the flexibility and scalability of cloud computing.",
              },
              {
                question: "How quickly can I deploy a Cloud VPS?",
                answer:
                  "Cloud VPS instances are typically deployed within minutes after order completion, allowing you to get started almost immediately.",
              },
              {
                question: "Can I scale my resources?",
                answer:
                  "Yes, most Cloud VPS plans allow you to easily scale CPU, RAM, and storage resources as your needs change, often with minimal downtime.",
              },
              {
                question: "What kind of support is included?",
                answer:
                  "We provide 24/7 infrastructure monitoring and support. For managed plans, we also offer OS and application support.",
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
                  Order {vpsData.name}
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
                          price: vpsData.price,
                          save: 0,
                        },
                        {
                          id: "12mo",
                          name: "12 Months",
                          price: vpsData.price * 12 * 0.8,
                          save: 20,
                        },
                        {
                          id: "24mo",
                          name: "24 Months",
                          price: vpsData.price * 24 * 0.7,
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
                            ${vpsData.price}/mo
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
                      Configure Your VPS
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
                            price: 10,
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
                          { id: "cpanel", name: "cPanel", price: 10 },
                          { id: "plesk", name: "Plesk", price: 8 },
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
                          { id: "weekly", name: "Weekly", price: 0 },
                          { id: "daily", name: "Daily", price: 5 },
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
                          name: "Managed Support",
                          desc: "24/7 server management and support",
                          price: 19.99,
                        },
                        {
                          id: "monitoring",
                          name: "Advanced Monitoring",
                          desc: "Real-time performance monitoring",
                          price: 9.99,
                        },
                        {
                          id: "ssl",
                          name: "SSL Certificate",
                          desc: "Secure your services with SSL",
                          price: 4.99,
                        },
                        {
                          id: "ip",
                          name: "Additional IP Address",
                          desc: "Extra dedicated IP address",
                          price: 1.99,
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
                            {vpsData.name} ({selectedPlan})
                          </span>
                          <span>${vpsData.price}/mo</span>
                        </div>

                        {/* Configuration costs */}
                        {selectedConfiguration.os === "windows" && (
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>+ Windows Server 2022</span>
                            <span>$10/mo</span>
                          </div>
                        )}
                        {selectedConfiguration.controlPanel === "cpanel" && (
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>+ cPanel License</span>
                            <span>$10/mo</span>
                          </div>
                        )}
                        {selectedConfiguration.controlPanel === "plesk" && (
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>+ Plesk License</span>
                            <span>$8/mo</span>
                          </div>
                        )}
                        {selectedConfiguration.backup === "daily" && (
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>+ Daily Backups</span>
                            <span>$5/mo</span>
                          </div>
                        )}

                        {/* Addon costs */}
                        {selectedAddons.map((addonId) => {
                          const addon = [
                            {
                              id: "managed",
                              name: "Managed Support",
                              price: 19.99,
                            },
                            {
                              id: "monitoring",
                              name: "Advanced Monitoring",
                              price: 9.99,
                            },
                            { id: "ssl", name: "SSL Certificate", price: 4.99 },
                            {
                              id: "ip",
                              name: "Additional IP Address",
                              price: 1.99,
                            },
                          ].find((a) => a.id === addonId);

                          return (
                            <div
                              key={addonId}
                              className="flex justify-between text-sm text-gray-600"
                            >
                              <span>+ {addon?.name}</span>
                              <span>${addon?.price}/mo</span>
                            </div>
                          );
                        })}

                        {/* Discount for longer plans */}
                        {selectedPlan !== "1mo" && (
                          <div className="flex justify-between text-green-600">
                            <span>
                              {selectedPlan === "12mo"
                                ? "20% Discount"
                                : "30% Discount"}
                            </span>
                            <span>
                              -$
                              {selectedPlan === "12mo"
                                ? (vpsData.price * 12 * 0.2).toFixed(2)
                                : (vpsData.price * 24 * 0.3).toFixed(2)}
                            </span>
                          </div>
                        )}

                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between font-bold">
                            <span>
                              Total (
                              {selectedPlan === "1mo"
                                ? "Monthly"
                                : selectedPlan === "12mo"
                                  ? "Yearly"
                                  : "2 Years"}
                              ):
                            </span>
                            <span>${calculateTotal().toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h4 className="font-medium mt-6 mb-3">
                      Account Information
                    </h4>
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Server Hostname
                        </label>
                        <input
                          type="text"
                          name="hostname"
                          value={formData.hostname}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg"
                          placeholder="e.g., myserver"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Your Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Root Password
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg"
                          placeholder="Set root password for your server"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Payment Method
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="creditCard"
                              checked={formData.paymentMethod === "creditCard"}
                              onChange={handleInputChange}
                              className="mr-2"
                            />
                            <CreditCard className="w-5 h-5 mr-2" />
                            Credit Card
                          </label>

                          <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="paypal"
                              checked={formData.paymentMethod === "paypal"}
                              onChange={handleInputChange}
                              className="mr-2"
                            />
                            <svg
                              className="w-5 h-5 mr-2"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M7.5 14.25c-.5 0-.9.3-1.1.8L5 17.8l1.2.1c2.3.1 4.2-.4 5.5-1.5 1.3-1.1 2-2.7 2-4.6v-2.8h-1.5c-1.2 0-2.2.4-3 1.2-.8.8-1.2 1.8-1.2 3v1.5zm8.3-2.3c-.5-.6-1.2-.9-2.1-.9h-1.2v3.8c0 .6 .2 1.1 .6 1.5 .4 .4 .9 .6 1.5 .6h1.2c.6 0 1.1-.2 1.5-.6 .4-.4 .6-.9 .6-1.5v-1.5c0-.9-.3-1.6-.9-2.1z" />
                            </svg>
                            PayPal
                          </label>

                          <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="crypto"
                              checked={formData.paymentMethod === "crypto"}
                              onChange={handleInputChange}
                              className="mr-2"
                            />
                            <svg
                              className="w-5 h-5 mr-2"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2 .8-1.3-4.5-2.7V7z" />
                            </svg>
                            Cryptocurrency
                          </label>
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  {orderStep > 1 ? (
                    <button
                      onClick={handlePrevStep}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Back
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowOrderModal(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  )}

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

      {/* Newsletter and Footer */}
      <NewsletterSignup />
      <br />
      <br />
      <Footer />
    </>
  );
}
