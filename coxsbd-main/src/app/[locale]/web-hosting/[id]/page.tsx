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

// Mock data for hosting services
const hostingServices = {
  webHosting: {
    _id: "1",
    name: "Business Web Hosting",
    provider: "CloudHost Pro",
    price: 9.99,
    renewalPrice: 14.99,
    description:
      "Perfect for small to medium websites with optimized performance, security, and 99.9% uptime guarantee.",
    images: [
      "/images/web-hosting.png",
      "/images/web-hosting.png",
      "/images/web-hosting.png",
      "/images/web-hosting.png",
    ],
    rating: 4.7,
    reviews: 356,
    features: [
      "Unlimited Websites",
      "100 GB SSD Storage",
      "Unlimited Bandwidth",
      "Free SSL Certificate",
      "Free Domain (1 year)",
      "cPanel Control Panel",
      "One-Click WordPress Install",
      "Email Accounts",
      "Website Builder",
      "Daily Backups",
    ],
    specifications: {
      cpu: "2 Cores",
      ram: "4 GB",
      storage: "100 GB SSD",
      bandwidth: "Unmetered",
      databases: "Unlimited",
      domains: "Unlimited",
    },
    available: true,
    bestFor: "Small businesses, blogs, portfolios",
  },
  dedicatedServer: {
    _id: "2",
    name: "Enterprise Dedicated Server",
    provider: "ServerMax",
    price: 199,
    renewalPrice: 249,
    description:
      "High-performance dedicated servers with full root access, ideal for resource-intensive applications.",
    images: [
      "/images/dedicated-server.jpg",
      "/images/server-rack.jpg",
      "/images/data-center.jpg",
      "/images/server-management.jpg",
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
  },
  cloudVps: {
    _id: "3",
    name: "Scalable Cloud VPS",
    provider: "CloudFlex",
    price: 29.99,
    renewalPrice: 39.99,
    description:
      "Flexible cloud VPS with scalable resources, SSD storage, and instant scalability for growing businesses.",
    images: [
      "/images/cloud-vps.jpg",
      "/images/vps-dashboard.jpg",
      "/images/cloud-scalability.jpg",
      "/images/server-monitoring.jpg",
    ],
    rating: 4.8,
    reviews: 284,
    features: [
      "Scalable Resources",
      "SSD Storage",
      "Root Access",
      "Multiple OS Choices",
      "Instant Deployment",
      "API Access",
      "Auto Backups",
      "Free Snapshotting",
      "Load Balancers",
      "99.95% Uptime SLA",
    ],
    specifications: {
      cpu: "4 vCPU Cores",
      ram: "8 GB",
      storage: "160 GB SSD",
      bandwidth: "5 TB Monthly",
      virtualization: "KVM",
      ips: "1 Dedicated IP",
    },
    available: true,
    bestFor: "Developers, growing businesses, applications",
  },
};

// Related services for recommendation section
const relatedServices = [
  {
    id: 4,
    name: "WordPress Optimized Hosting",
    provider: "WPHost",
    price: 14.99,
    image: "/images/web-hosting.png",
    type: "webHosting",
    rating: 4.8,
  },
  {
    id: 5,
    name: "GPU Dedicated Server",
    provider: "ServerMax",
    price: 399,
    image: "/images/web-hosting.png",
    type: "dedicatedServer",
    rating: 4.9,
  },
  {
    id: 6,
    name: "Managed Cloud VPS",
    provider: "CloudFlex",
    price: 49.99,
    image: "/images/web-hosting.png",
    type: "cloudVps",
    rating: 4.7,
  },
];

// Helper function to format service type for display
const formatServiceType = (type: string | undefined) => {
  if (!type) return "Web Hosting";
  return type
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

export default function HostingServicePage() {
  const params = useParams();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderStep, setOrderStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState("12mo");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    domain: "",
    name: "",
    email: "",
    password: "",
    paymentMethod: "creditCard",
  });
  const { addToCart } = useCart();

  // Safely get parameters with fallbacks
  const serviceType =
    (params?.type as keyof typeof hostingServices) || "webHosting";
  const serviceId = (params?.id as string) || "1";

  // Determine which service to show based on URL params
  const serviceData =
    hostingServices[serviceType] || hostingServices.webHosting;

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleAddToCart = () => {
    const totalPrice = calculateTotal(); // use your existing function

    addToCart({
      id: serviceData._id,
      name: serviceData.name,
      provider: serviceData.provider,
      price: totalPrice,
      image: serviceData.images[0],
      type: serviceType, // e.g. "webHosting" | "cloudVps" | "dedicatedServer"
      plan: selectedPlan, // "1mo" | "12mo" | "24mo"
      addons: selectedAddons, // ["ssl", "backup"] etc.
    });

    alert(`${serviceData.name} (${selectedPlan}) added to cart!`);
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
      `Order confirmed for ${serviceData.name}! You will receive confirmation at ${formData.email}`
    );
    setShowOrderModal(false);
    setFormData({
      domain: "",
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

  const toggleAddon = (addon: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addon)
        ? prev.filter((item) => item !== addon)
        : [...prev, addon]
    );
  };

  const navigateToService = (serviceId: string, serviceType: string) => {
    router.push(`/hosting/${serviceType}/${serviceId}`);
  };

  // Calculate total price based on plan and addons
  const calculateTotal = () => {
    const planMultiplier =
      selectedPlan === "1mo" ? 1 : selectedPlan === "12mo" ? 12 : 24;
    const basePrice = serviceData.price * planMultiplier;

    const addonsPrice = selectedAddons.reduce((total, addon) => {
      switch (addon) {
        case "ssl":
          return (
            total +
            (selectedPlan === "1mo" ? 5.99 : 5.99 * planMultiplier * 0.8)
          );
        case "backup":
          return (
            total +
            (selectedPlan === "1mo" ? 3.99 : 3.99 * planMultiplier * 0.8)
          );
        case "cdn":
          return (
            total +
            (selectedPlan === "1mo" ? 9.99 : 9.99 * planMultiplier * 0.8)
          );
        case "support":
          return (
            total +
            (selectedPlan === "1mo" ? 14.99 : 14.99 * planMultiplier * 0.8)
          );
        default:
          return total;
      }
    }, 0);

    return basePrice + addonsPrice;
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
                onClick={() => router.push("/hosting")}
                className="hover:text-green-600"
              >
                Hosting
              </button>
              <svg
                className="fill-current w-3 h-3 mx-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
            <li className="text-green-600">{formatServiceType(serviceType)}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Gallery Section */}
          <div>
            <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-lg mb-4">
              <Image
                src={
                  serviceData.images[selectedImage] || "/images/web-hosting.png"
                }
                alt={serviceData.name}
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
              {!serviceData.available && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Not Available
                </div>
              )}
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImage + 1} / {serviceData.images.length}
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {serviceData.images.map((img, idx) => (
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
                    src={img || "/images/web-hosting.png"}
                    alt={`${serviceData.name} view ${idx + 1}`}
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
                  {serviceData.name}
                </h1>
                <p className="text-gray-500 text-lg">{serviceData.provider}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-green-600">
                  ${serviceData.price}
                  <span className="text-base font-normal text-gray-500">
                    /mo
                  </span>
                </p>
                <p className="text-sm text-gray-500 line-through">
                  ${serviceData.renewalPrice}/mo renewal
                </p>
                <div className="flex items-center justify-end mt-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-gray-700">
                    {serviceData.rating}
                  </span>
                  <span className="mx-1">•</span>
                  <span className="text-gray-500">
                    {serviceData.reviews} reviews
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center text-gray-600 mb-6">
              <Server className="w-5 h-5 mr-1" />
              <span>{formatServiceType(serviceType)} Service</span>
            </div>

            <p className="text-gray-700 mb-8 leading-relaxed">
              {serviceData.description}
            </p>

            {/* Best For */}
            <div className="mb-6 p-4 bg-green-50 rounded-xl">
              <h3 className="font-semibold text-green-800 mb-2">
                Perfect For:
              </h3>
              <p className="text-green-700">{serviceData.bestFor}</p>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-gray-50 rounded-xl flex items-center">
                <Cpu className="w-6 h-6 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">CPU</p>
                  <p className="font-medium">
                    {serviceData.specifications.cpu}
                  </p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl flex items-center">
                <Database className="w-6 h-6 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">RAM</p>
                  <p className="font-medium">
                    {serviceData.specifications.ram}
                  </p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl flex items-center">
                <HardDrive className="w-6 h-6 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Storage</p>
                  <p className="font-medium">
                    {serviceData.specifications.storage}
                  </p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl flex items-center">
                <Zap className="w-6 h-6 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Bandwidth</p>
                  <p className="font-medium">
                    {serviceData.specifications.bandwidth}
                  </p>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Key Features</h3>
              <div className="grid grid-cols-1 gap-2">
                {serviceData.features.map((feature, index) => (
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
                disabled={!serviceData.available}
                className="flex-1 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {serviceData.available ? "Order Now" : "Not Available"}
              </button>
              <button onClick={handleAddToCart} className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                Add To Cart
              </button>
            </div>
          </div>
        </div>

        {/* Comparison Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Hosting Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 text-left border-b">Feature</th>
                  <th className="p-4 text-center border-b">Web Hosting</th>
                  <th className="p-4 text-center border-b">Cloud VPS</th>
                  <th className="p-4 text-center border-b">Dedicated Server</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    feature: "Price",
                    web: "$9.99/mo",
                    vps: "$29.99/mo",
                    dedicated: "$199/mo",
                  },
                  {
                    feature: "Performance",
                    web: "Good",
                    vps: "Very Good",
                    dedicated: "Excellent",
                  },
                  {
                    feature: "Control",
                    web: "Limited",
                    vps: "Full Root",
                    dedicated: "Full Root",
                  },
                  {
                    feature: "Scalability",
                    web: "Limited",
                    vps: "Easy Scaling",
                    dedicated: "Hardware Upgrade",
                  },
                  {
                    feature: "Security",
                    web: "Shared",
                    vps: "Isolated",
                    dedicated: "Dedicated",
                  },
                  {
                    feature: "Maintenance",
                    web: "Managed",
                    vps: "Self-Managed",
                    dedicated: "Self-Managed",
                  },
                  {
                    feature: "Best For",
                    web: "Beginners, Small Sites",
                    vps: "Developers, Growing Sites",
                    dedicated: "Enterprise, High Traffic",
                  },
                ].map((row, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="p-4 font-medium border-b">{row.feature}</td>
                    <td className="p-4 text-center border-b">{row.web}</td>
                    <td className="p-4 text-center border-b">{row.vps}</td>
                    <td className="p-4 text-center border-b">
                      {row.dedicated}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Related Services Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Other Hosting Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedServices.map((service) => (
              <motion.div
                key={service.id}
                className="border rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                whileHover={{ y: -5 }}
                onClick={() =>
                  navigateToService(service.id.toString(), service.type)
                }
              >
                <div className="relative h-48">
                  <Image
                    src={service.image || "/images/web-hosting.png"}
                    alt={service.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{service.name}</h3>
                  <p className="text-gray-500">{service.provider}</p>
                  <div className="flex items-center mt-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm text-gray-700">
                      {service.rating}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-gray-500 capitalize">
                      {formatServiceType(service.type)}
                    </span>
                    <p className="text-green-600 font-bold">
                      ${service.price}/mo
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
                question: "What is the difference between these hosting types?",
                answer:
                  "Web hosting is shared hosting perfect for beginners, VPS offers dedicated resources with more control, and dedicated servers provide entire physical servers for maximum performance.",
              },
              {
                question: "Do you offer money-back guarantee?",
                answer:
                  "Yes, we offer a 30-day money-back guarantee on all our hosting plans. No questions asked.",
              },
              {
                question: "Can I upgrade my plan later?",
                answer:
                  "Absolutely! You can upgrade your hosting plan at any time without any downtime. Our migration team will handle everything for you.",
              },
              {
                question: "What kind of support do you provide?",
                answer:
                  "We provide 24/7/365 support via live chat, email, and phone. Our average response time is under 10 minutes for critical issues.",
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
                  Order {serviceData.name}
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
                          price: serviceData.price,
                          save: 0,
                        },
                        {
                          id: "12mo",
                          name: "12 Months",
                          price: serviceData.price * 12 * 0.8,
                          save: 20,
                        },
                        {
                          id: "24mo",
                          name: "24 Months",
                          price: serviceData.price * 24 * 0.7,
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
                            ${serviceData.price}/mo
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
                      Add Additional Services
                    </h3>
                    <div className="space-y-3">
                      {[
                        {
                          id: "ssl",
                          name: "SSL Certificate",
                          desc: "Secure your website with SSL",
                          price: 5.99,
                        },
                        {
                          id: "backup",
                          name: "Daily Backups",
                          desc: "Automated daily backups",
                          price: 3.99,
                        },
                        {
                          id: "cdn",
                          name: "CDN Integration",
                          desc: "Speed up your website globally",
                          price: 9.99,
                        },
                        {
                          id: "support",
                          name: "Priority Support",
                          desc: "24/7 priority technical support",
                          price: 14.99,
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

                {orderStep === 3 && (
                  <div className="space-y-4 mb-6">
                    <h3 className="font-semibold text-lg">
                      Configure Your Service
                    </h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Domain Name
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          name="domain"
                          value={formData.domain}
                          onChange={handleInputChange}
                          className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="yourdomain"
                        />
                        <select className="p-3 border border-l-0 border-gray-300 rounded-r-lg bg-gray-50">
                          <option>.com</option>
                          <option>.net</option>
                          <option>.org</option>
                          <option>.io</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Server Location
                      </label>
                      <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        <option>United States (East)</option>
                        <option>United States (West)</option>
                        <option>Europe (Germany)</option>
                        <option>Asia (Singapore)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Operating System
                      </label>
                      <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        <option>Ubuntu 22.04 LTS</option>
                        <option>CentOS 8</option>
                        <option>Debian 11</option>
                        <option>Windows Server 2022</option>
                      </select>
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
                            {serviceData.name} ({selectedPlan})
                          </span>
                          <span>${serviceData.price}/mo</span>
                        </div>

                        {selectedAddons.map((addon) => {
                          const addonInfo = [
                            { id: "ssl", name: "SSL Certificate", price: 5.99 },
                            {
                              id: "backup",
                              name: "Daily Backups",
                              price: 3.99,
                            },
                            { id: "cdn", name: "CDN Integration", price: 9.99 },
                            {
                              id: "support",
                              name: "Priority Support",
                              price: 14.99,
                            },
                          ].find((a) => a.id === addon);

                          return (
                            <div
                              key={addon}
                              className="flex justify-between text-sm text-gray-600"
                            >
                              <span>+ {addonInfo?.name}</span>
                              <span>${addonInfo?.price}/mo</span>
                            </div>
                          );
                        })}

                        <div className="pt-2 border-t border-gray-200 mt-2">
                          <div className="flex justify-between font-bold">
                            <span>Total</span>
                            <span className="text-green-600">
                              ${calculateTotal().toFixed(2)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Billed every{" "}
                            {selectedPlan.replace("mo", " month(s)")}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Method
                      </label>
                      <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="creditCard">Credit Card</option>
                        <option value="paypal">PayPal</option>
                        <option value="crypto">Cryptocurrency</option>
                        <option value="bankTransfer">Bank Transfer</option>
                      </select>
                    </div>

                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="terms"
                        className="mt-1 mr-2"
                        required
                      />
                      <label htmlFor="terms" className="text-sm text-gray-600">
                        I agree to the terms of service, acceptable use policy,
                        and privacy policy.
                      </label>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  {orderStep > 1 && (
                    <button
                      onClick={handlePrevStep}
                      className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                  )}

                  {orderStep < 4 ? (
                    <button
                      onClick={handleNextStep}
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      onClick={handleFormSubmit}
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
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

      <NewsletterSignup />
      <br />
      <br />
      <Footer />
    </>
  );
}
