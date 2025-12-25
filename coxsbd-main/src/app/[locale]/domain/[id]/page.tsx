"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Shield,
  Users,
  Clock,
  Star,
  Heart,
  CheckCircle,
  ArrowRight,
  CreditCard,
  Calendar,
  BarChart3,
  Lock,
  RefreshCw,
  Search,
  Eye,
  Server,
  Cpu,
  Database,
} from "lucide-react";
import NewsletterSignup from "@/components/Newsletter";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useCart } from "@/context/cartContext";

// Mock data for domains
const domains = {
  "example-com": {
    _id: "example-com",
    name: "example.com",
    extension: ".com",
    price: 12.99,
    renewalPrice: 19.99,
    description:
      "The world's most popular domain extension. Perfect for businesses, blogs, and personal websites.",
    images: ["/images/domain.jpg", "/images/domain.jpg", "/images/domain.jpg"],
    rating: 4.7,
    reviews: 243,
    features: [
      "Free WHOIS Privacy Protection",
      "Free SSL Certificate",
      "Domain Forwarding",
      "Email Forwarding",
      "DNS Management",
      "24/7 Support",
      "Easy Transfer",
      "Auto-Renewal Protection",
      "Domain Lock",
      "Two-Factor Authentication",
    ],
    specifications: {
      registration: "1-10 years",
      transfer: "Easy transfer process",
      renewal: "Auto-renew available",
      privacy: "Free WHOIS privacy",
      dns: "Advanced DNS management",
    },
    available: true,
    bestFor: "Businesses, portfolios, blogs, and professional websites",
    popularity: "Most popular TLD worldwide",
  },
  "example-io": {
    _id: "example-io",
    name: "example.io",
    extension: ".io",
    price: 39.99,
    renewalPrice: 49.99,
    description:
      "Popular with tech companies and startups. The .io domain has become a symbol of innovation.",
    images: ["/images/domain.jpg", "/images/domain.jpg", "/images/domain.jpg"],
    rating: 4.8,
    reviews: 187,
    features: [
      "Free WHOIS Privacy Protection",
      "Free SSL Certificate",
      "Domain Forwarding",
      "Email Forwarding",
      "DNS Management",
      "24/7 Support",
      "Easy Transfer",
      "Auto-Renewal Protection",
      "Domain Lock",
      "Two-Factor Authentication",
    ],
    specifications: {
      registration: "1-10 years",
      transfer: "Easy transfer process",
      renewal: "Auto-renew available",
      privacy: "Free WHOIS privacy",
      dns: "Advanced DNS management",
    },
    available: true,
    bestFor: "Tech companies, startups, SaaS products, and developers",
    popularity: "Popular among tech companies",
  },
  "example-app": {
    _id: "example-app",
    name: "example.app",
    extension: ".app",
    price: 19.99,
    renewalPrice: 29.99,
    description:
      "The perfect domain for mobile apps, web apps, and application developers. Includes built-in security.",
    images: [
      "/images/domain-app.jpg",
      "/images/app-domain.jpg",
      "/images/developer-domain.jpg",
    ],
    rating: 4.6,
    reviews: 124,
    features: [
      "Free WHOIS Privacy Protection",
      "Free SSL Certificate (HTTPS required)",
      "Domain Forwarding",
      "Email Forwarding",
      "DNS Management",
      "24/7 Support",
      "Easy Transfer",
      "Auto-Renewal Protection",
      "Domain Lock",
      "Two-Factor Authentication",
    ],
    specifications: {
      registration: "1-10 years",
      transfer: "Easy transfer process",
      renewal: "Auto-renew available",
      privacy: "Free WHOIS privacy",
      dns: "Advanced DNS management",
    },
    available: true,
    bestFor: "Mobile apps, web applications, developers, and tech products",
    popularity: "Rising popularity for app developers",
  },
};

// Related domains for recommendation section
const relatedDomains = [
  {
    id: "example-io",
    name: "example.io",
    price: 39.99,
    image: "/images/domain.jpg",
    rating: 4.8,
  },
  {
    id: "example-app",
    name: "example.app",
    price: 19.99,
    image: "/images/domain.jpg",
    rating: 4.6,
  },
  {
    id: "example-dev",
    name: "example.dev",
    price: 14.99,
    image: "/images/domain.jpg",
    rating: 4.5,
  },
];

export default function DomainPage() {
  const params = useParams();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderStep, setOrderStep] = useState(1);
  const [selectedPeriod, setSelectedPeriod] = useState("1year");
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
  const domainId = (params?.id as string) || "example-com";

  // Get domain data based on ID
  const domainData =
    domains[domainId as keyof typeof domains] || domains["example-com"];

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleAddToCart = () => {
    addToCart({
      id: domainData._id,
      name: domainData.name,
      price: calculateTotal(),
      image: domainData.images[0] || "/images/domain-default.jpg",
      period: selectedPeriod, // instead of 'days'
    });

    alert(`${domainData.name} added to cart!`);
  };

  const handleOrderNow = () => {
    setShowOrderModal(true);
    setOrderStep(1);
  };

  const handleNextStep = () => {
    if (orderStep < 3) {
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
      `Domain registration confirmed for ${domainData.name}! You will receive confirmation at ${formData.email}`
    );
    setShowOrderModal(false);
    setFormData({
      domain: domainData.name,
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

  const navigateToDomain = (domainId: string) => {
    router.push(`/domains/${domainId}`);
  };

  // Calculate total price based on period and addons
  const calculateTotal = () => {
    const periodMultiplier =
      selectedPeriod === "1year" ? 1 : selectedPeriod === "2years" ? 2 : 5;
    const basePrice = domainData.price * periodMultiplier;

    // Addon costs
    const addonsPrice = selectedAddons.reduce((total, addon) => {
      switch (addon) {
        case "privacy":
          return (
            total +
            (selectedPeriod === "1year" ? 9.99 : 9.99 * periodMultiplier * 0.9)
          );
        case "email":
          return (
            total +
            (selectedPeriod === "1year" ? 4.99 : 4.99 * periodMultiplier * 0.9)
          );
        case "ssl":
          return (
            total +
            (selectedPeriod === "1year"
              ? 12.99
              : 12.99 * periodMultiplier * 0.9)
          );
        case "backup":
          return (
            total +
            (selectedPeriod === "1year" ? 6.99 : 6.99 * periodMultiplier * 0.9)
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
                onClick={() => router.push("/domains")}
                className="hover:text-green-600"
              >
                Domains
              </button>
              <svg
                className="fill-current w-3 h-3 mx-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
            <li className="text-green-600">{domainData.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Gallery Section */}
          <div>
            <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-lg mb-4">
              <Image
                src={
                  domainData.images[selectedImage] ||
                  "/images/domain-default.jpg"
                }
                alt={domainData.name}
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
              {!domainData.available && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Not Available
                </div>
              )}
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImage + 1} / {domainData.images.length}
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {domainData.images.map((img, idx) => (
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
                    src={img || "/images/domain-default.jpg"}
                    alt={`${domainData.name} view ${idx + 1}`}
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
                  {domainData.name}
                </h1>
                <p className="text-gray-500 text-lg">
                  Domain Extension: {domainData.extension}
                </p>
                <div className="inline-block mt-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md">
                  {domainData.popularity}
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-green-600">
                  ${domainData.price}
                  <span className="text-base font-normal text-gray-500">
                    /year
                  </span>
                </p>
                <p className="text-sm text-gray-500 line-through">
                  ${domainData.renewalPrice}/year renewal
                </p>
                <div className="flex items-center justify-end mt-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-gray-700">
                    {domainData.rating}
                  </span>
                  <span className="mx-1">•</span>
                  <span className="text-gray-500">
                    {domainData.reviews} reviews
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center text-gray-600 mb-6">
              <Globe className="w-5 h-5 mr-1" />
              <span>Top-Level Domain (TLD)</span>
            </div>

            <p className="text-gray-700 mb-8 leading-relaxed">
              {domainData.description}
            </p>

            {/* Best For */}
            <div className="mb-6 p-4 bg-green-50 rounded-xl">
              <h3 className="font-semibold text-green-800 mb-2">
                Perfect For:
              </h3>
              <p className="text-green-700">{domainData.bestFor}</p>
            </div>

            {/* Key Features */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Key Features</h3>
              <div className="grid grid-cols-1 gap-2">
                {domainData.features.map((feature, index) => (
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
                disabled={!domainData.available}
                className="flex-1 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {domainData.available ? "Register Now" : "Not Available"}
              </button>
              <button onClick={handleAddToCart} className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                Add To Cart
              </button>
            </div>
          </div>
        </div>

        {/* Technical Specifications Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Domain Specifications</h2>
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 text-lg">
                  Registration Details
                </h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Registration Period</span>
                    <span className="font-medium">
                      {domainData.specifications.registration}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Transfer Process</span>
                    <span className="font-medium">
                      {domainData.specifications.transfer}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Renewal Options</span>
                    <span className="font-medium">
                      {domainData.specifications.renewal}
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-lg">
                  Security & Management
                </h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-gray-600">WHOIS Privacy</span>
                    <span className="font-medium">
                      {domainData.specifications.privacy}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">DNS Management</span>
                    <span className="font-medium">
                      {domainData.specifications.dns}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Domain Lock</span>
                    <span className="font-medium">Included</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Related Domains Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">
            Other Popular Domain Extensions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedDomains.map((domain) => (
              <motion.div
                key={domain.id}
                className="border rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                whileHover={{ y: -5 }}
                onClick={() => navigateToDomain(domain.id)}
              >
                <div className="relative h-48">
                  <Image
                    src={domain.image || "/images/domain-default.jpg"}
                    alt={domain.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{domain.name}</h3>
                  <div className="flex items-center mt-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm text-gray-700">
                      {domain.rating}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-gray-500">Domain</span>
                    <p className="text-green-600 font-bold">
                      ${domain.price}/year
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
                question: "How long does domain registration take?",
                answer:
                  "Domain registration is typically instant. Once you complete the registration process, your domain is usually active within a few minutes to a few hours.",
              },
              {
                question: "Can I transfer my domain to another registrar?",
                answer:
                  "Yes, you can transfer your domain to another registrar after 60 days of registration. The process is straightforward and we provide free transfer assistance.",
              },
              {
                question: "What is WHOIS privacy protection?",
                answer:
                  "WHOIS privacy protection hides your personal contact information from the public WHOIS database, reducing spam and protecting your privacy.",
              },
              {
                question: "How do I manage my domain's DNS settings?",
                answer:
                  "We provide an easy-to-use DNS management interface where you can update your domain's nameservers, create DNS records, and manage all domain settings.",
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
                  Register {domainData.name}
                </h2>

                {/* Progress Steps */}
                <div className="flex justify-between mb-6 relative">
                  <div className="absolute top-3 left-0 right-0 h-1 bg-gray-200 z-0"></div>
                  {[1, 2, 3].map((step) => (
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
                      Choose Registration Period
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        {
                          id: "1year",
                          name: "1 Year",
                          price: domainData.price,
                          save: 0,
                        },
                        {
                          id: "2years",
                          name: "2 Years",
                          price: domainData.price * 2 * 0.9,
                          save: 10,
                        },
                        {
                          id: "5years",
                          name: "5 Years",
                          price: domainData.price * 5 * 0.8,
                          save: 20,
                        },
                      ].map((period) => (
                        <div
                          key={period.id}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            selectedPeriod === period.id
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200"
                          }`}
                          onClick={() => setSelectedPeriod(period.id)}
                        >
                          <h4 className="font-medium">{period.name}</h4>
                          <p className="text-lg font-bold text-green-600">
                            ${period.price.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            ${domainData.price}/year
                          </p>
                          {period.save > 0 && (
                            <p className="text-sm text-green-500 mt-1">
                              Save {period.save}%
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
                          id: "privacy",
                          name: "WHOIS Privacy Protection",
                          desc: "Keep your personal information private",
                          price: 9.99,
                        },
                        {
                          id: "email",
                          name: "Professional Email",
                          desc: "5 email accounts with your domain",
                          price: 4.99,
                        },
                        {
                          id: "ssl",
                          name: "Premium SSL Certificate",
                          desc: "Enhanced security for your website",
                          price: 12.99,
                        },
                        {
                          id: "backup",
                          name: "Website Backup",
                          desc: "Automatic daily backups",
                          price: 6.99,
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
                              ${addon.price}/year
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {orderStep === 3 && (
                  <div className="space-y-6 mb-6">
                    <h3 className="font-semibold text-lg">
                      Review & Complete Registration
                    </h3>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-3">Order Summary</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>
                            {domainData.name} Registration ({selectedPeriod})
                          </span>
                          <span>${domainData.price}/year</span>
                        </div>

                        {/* Addon costs */}
                        {selectedAddons.map((addonId) => {
                          const addon = [
                            {
                              id: "privacy",
                              name: "WHOIS Privacy",
                              price: 9.99,
                            },
                            {
                              id: "email",
                              name: "Professional Email",
                              price: 4.99,
                            },
                            {
                              id: "ssl",
                              name: "SSL Certificate",
                              price: 12.99,
                            },
                            {
                              id: "backup",
                              name: "Website Backup",
                              price: 6.99,
                            },
                          ].find((a) => a.id === addonId);

                          return (
                            <div
                              key={addonId}
                              className="flex justify-between text-sm text-gray-600"
                            >
                              <span>+ {addon?.name}</span>
                              <span>${addon?.price}/year</span>
                            </div>
                          );
                        })}

                        {/* Discount for longer periods */}
                        {selectedPeriod !== "1year" && (
                          <div className="flex justify-between text-green-600">
                            <span>
                              {selectedPeriod === "2years"
                                ? "10% Discount"
                                : "20% Discount"}
                            </span>
                            <span>
                              -$
                              {selectedPeriod === "2years"
                                ? (domainData.price * 2 * 0.1).toFixed(2)
                                : (domainData.price * 5 * 0.2).toFixed(2)}
                            </span>
                          </div>
                        )}

                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between font-bold">
                            <span>
                              Total (
                              {selectedPeriod === "1year"
                                ? "1 Year"
                                : selectedPeriod === "2years"
                                  ? "2 Years"
                                  : "5 Years"}
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
                          Domain Name
                        </label>
                        <input
                          type="text"
                          name="domain"
                          value={domainData.name}
                          readOnly
                          className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
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
                          Account Password
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg"
                          placeholder="Create account password"
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

                  {orderStep < 3 ? (
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
                      Complete Registration
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
      br
      <Footer />
    </>
  );
}
