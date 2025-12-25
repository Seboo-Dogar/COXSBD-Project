"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import NewsletterSignup from "@/components/Newsletter";
import Footer from "@/components/Footer";
import WifiDataSearchForm from "@/components/wifi-data/WifidataSearchForm";
import Image from "next/image";
import {
  FaWifi,
  FaShieldAlt,
  FaInfinity,
  FaUserFriends,
  FaGamepad,
  FaVideo,
  FaDownload,
} from "react-icons/fa";
import { HiCheckCircle, HiStar } from "react-icons/hi";
import { IoMdSpeedometer, IoMdPricetag } from "react-icons/io";
import { RiVipCrownFill, Ri24HoursFill } from "react-icons/ri";
import { MdSignalWifi4Bar, MdSecurity, MdSupportAgent } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Plan {
  _id?: string; // backend ID
  id?: number; // fallback
  name: string;
  speed: string;
  speedValue: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  description: string;
  features: { text: string; icon: JSX.Element }[];
  bestFor: string;
  popular: boolean;
  dataCap: string;
  devices: number;
  latency: string;
  uploadSpeed: string;
  technology: string;
  coverage: string;
  installation: string;
  contract: string;
}

export default function WifiDataPage() {
  const [wifiData, setWifiData] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  useEffect(() => {
    const fetchWifiPlans = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/wifi-plans`,
          {
            cache: "no-store",
          }
        );

        if (!res.ok) throw new Error("Failed to fetch WiFi plans");

        const data: Plan[] = await res.json();
        setWifiData(data);
      } catch (err) {
        console.error("Error fetching WiFi plans:", err);
        setError("Unable to load WiFi plans. Please try again later.");
        setWifiData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWifiPlans();
  }, []);

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-medium text-gray-600">
          Loading WiFi plans...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        {error}
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <Image
            src="/images/wifi-logo.png"
            alt="WiFi Data Logo"
            width={120}
            height={120}
            className="rounded-md object-cover mb-4"
          />
          <h1 className="text-2xl md:text-2xl font-bold mb-2">
            WiFi Data{" "}
            <span className="text-red-600 text-3xl">Plans & Offers</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            High-speed internet solutions for homes, businesses, and gamers with
            reliable connectivity
          </p>
        </div>

        {/* WiFi Search Form */}
        <div className="mb-12">
          <WifiDataSearchForm />
        </div>

        {/* Features Banner */}
        <section className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-8 mb-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            {
              icon: <MdSignalWifi4Bar className="w-10 h-10 text-red-600" />,
              text: "High Speed",
              desc: "Fiber optic technology",
            },
            {
              icon: <FaInfinity className="w-10 h-10 text-red-600" />,
              text: "Unlimited Data",
              desc: "No data caps",
            },
            {
              icon: <MdSecurity className="w-10 h-10 text-red-600" />,
              text: "Secure Connection",
              desc: "Advanced protection",
            },
            {
              icon: <Ri24HoursFill className="w-10 h-10 text-red-600" />,
              text: "24/7 Support",
              desc: "Expert assistance",
            },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              {item.icon}
              <span className="font-bold text-gray-800 mt-2">{item.text}</span>
              <span className="text-sm text-gray-600 mt-1">{item.desc}</span>
            </div>
          ))}
        </section>

        {/* Featured WiFi Plans */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Featured WiFi Plans
              </h2>
              <p className="text-gray-600">
                High-speed internet solutions for every need and budget
              </p>
            </div>
            <button className="text-white bg-red-600 border rounded-xl px-4 py-2 font-medium hover:bg-red-700 transition-colors">
              View All Plans
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wifiData.map((plan) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group relative ${
                  plan.popular
                    ? "ring-2 ring-red-500 transform hover:scale-105"
                    : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                    POPULAR
                  </div>
                )}
                {plan.discount && (
                  <div className="absolute top-4 right-4 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                    {plan.discount}% OFF
                  </div>
                )}

                {/* Plan Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-blue-100 text-sm">{plan.bestFor}</p>
                </div>

                {/* Plan Details */}
                <div className="p-6">
                  {/* Speed and Price */}
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                      <IoMdSpeedometer className="w-6 h-6 text-blue-600 mr-2" />
                      <span className="text-2xl font-bold">{plan.speed}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-red-600">
                        ${plan.price}
                      </span>
                      {plan.originalPrice && (
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          ${plan.originalPrice}
                        </span>
                      )}
                      <p className="text-xs text-gray-500">per month</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-6">
                    {plan.description}
                  </p>

                  {/* Technical Specifications */}
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div className="flex items-center">
                      <FaUserFriends className="w-4 h-4 mr-2 text-blue-600" />
                      <span>Up to {plan.devices} devices</span>
                    </div>
                    <div className="flex items-center">
                      <FaDownload className="w-4 h-4 mr-2 text-blue-600" />
                      <span>{plan.uploadSpeed} upload</span>
                    </div>
                    <div className="flex items-center">
                      <FaGamepad className="w-4 h-4 mr-2 text-blue-600" />
                      <span>{plan.latency} latency</span>
                    </div>
                    <div className="flex items-center">
                      <FaInfinity className="w-4 h-4 mr-2 text-blue-600" />
                      <span>{plan.dataCap}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 my-4">
                    {plan.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                      >
                        {feature.text}
                      </span>
                    ))}
                    {plan.features.length > 3 && (
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        +{plan.features.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Link href={`/wifi-data/${plan.id}`}>
                    <button className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white font-medium px-6 py-3 rounded-lg hover:from-red-700 hover:to-red-900 transition-all shadow-md hover:shadow-lg">
                      Choose Plan
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Special Offers Section */}
        <section className="my-20 relative">
          <div className="mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold relative inline-block">
              Special WiFi Offers
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-red-500 to-red-700 rounded-full"></span>
            </h2>
            <p className="mt-4 text-gray-600 text-lg max-w-2xl">
              Exclusive deals and limited-time promotions on high-speed internet
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                bigOfferTitle: "Free Router",
                title: "Hardware Included",
                desc: "Get a free premium WiFi 6 router with any annual plan subscription.",
                gradient: "from-red-500 to-red-600",
                btnColor: "text-red-600",
                image: "/images/wifidata.jpg",
              },
              {
                bigOfferTitle: "50% OFF",
                title: "First 3 Months",
                desc: "Enjoy 50% off your first three months with any new internet plan.",
                gradient: "from-blue-500 to-blue-600",
                btnColor: "text-blue-600",
                image: "/images/wifidata.jpg",
              },
              {
                bigOfferTitle: "Free Installation",
                title: "Professional Setup",
                desc: "Free professional installation worth $199 with any premium plan.",
                gradient: "from-green-500 to-green-600",
                btnColor: "text-green-600",
                image: "/images/wifidata.jpg",
              },
            ].map((offer, index) => (
              <div
                key={index}
                className={`relative p-6 rounded-3xl shadow-2xl bg-gradient-to-r ${offer.gradient} text-white overflow-hidden group hover:scale-105 transition-transform duration-300`}
              >
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/20 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-white/20 rounded-full animate-pulse"></div>

                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                    {offer.bigOfferTitle}
                  </h1>
                  <div className="relative w-20 h-20 md:w-28 md:h-28 flex-shrink-0">
                    <Image
                      src={offer.image}
                      alt={offer.bigOfferTitle}
                      fill
                      className="object-contain transition-transform duration-500 group-hover:scale-105"
                      priority
                    />
                  </div>
                </div>

                <div className="mt-auto">
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">
                    {offer.title}
                  </h3>
                  <p className="mb-4 opacity-90 leading-relaxed">
                    {offer.desc}
                  </p>
                  <button
                    className={`w-full bg-white ${offer.btnColor} font-semibold py-3 rounded-lg hover:bg-gray-100 transition shadow-md`}
                  >
                    Claim Offer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-blue-50 rounded-2xl mb-16">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 relative">
              How Our WiFi Service Works
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-red-600 rounded-full"></span>
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="p-6 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-2xl font-bold mb-6 mx-auto">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-4">Choose Plan</h3>
                <p className="text-gray-600 text-sm">
                  Select the perfect internet plan for your needs and budget
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mb-6 mx-auto">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-4">
                  Schedule Installation
                </h3>
                <p className="text-gray-600 text-sm">
                  Book a convenient time for professional installation
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl font-bold mb-6 mx-auto">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-4">Get Connected</h3>
                <p className="text-gray-600 text-sm">
                  Our technicians install and configure your high-speed internet
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-2xl font-bold mb-6 mx-auto">
                  4
                </div>
                <h3 className="text-xl font-semibold mb-4">Enjoy Internet</h3>
                <p className="text-gray-600 text-sm">
                  Start enjoying reliable, high-speed internet immediately
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 relative">
            Customer Testimonials
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-red-600 rounded-full"></span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-green-50 border rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-yellow-400 text-2xl mb-4">★★★★★</div>
              <p className="text-gray-700 italic mb-6">
                "The 300 Mbps plan has been incredible for our family of five.
                We can all stream, game, and work from home without any lag or
                buffering issues."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold mr-4">
                  SC
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Chen</h4>
                  <p className="text-sm text-gray-500">Remote Worker</p>
                </div>
              </div>
            </div>
            <div className="p-8 bg-green-50 border rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-yellow-400 text-2xl mb-4">★★★★★</div>
              <p className="text-gray-700 italic mb-6">
                "As a competitive gamer, the low latency and stable connection
                have significantly improved my gameplay. No more disconnections
                during tournaments!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-4">
                  MJ
                </div>
                <div>
                  <h4 className="font-semibold">Michael Johnson</h4>
                  <p className="text-sm text-gray-500">Professional Gamer</p>
                </div>
              </div>
            </div>
            <div className="p-8 bg-green-50 border rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-yellow-400 text-2xl mb-4">★★★★☆</div>
              <p className="text-gray-700 italic mb-6">
                "The business plan has been rock-solid for our small office. The
                symmetrical upload speeds make large file transfers and video
                conferences seamless."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold mr-4">
                  RK
                </div>
                <div>
                  <h4 className="font-semibold">Robert Kim</h4>
                  <p className="text-sm text-gray-500">Business Owner</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 relative bg-gray-50 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-16 relative">
              Why Choose Our WiFi Service?
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></span>
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-red-400 to-red-600 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <MdSignalWifi4Bar className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3">
                  Fiber Optic Technology
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Latest fiber optic infrastructure for maximum speed and
                  reliability
                </p>
              </div>

              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <Ri24HoursFill className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3">24/7 Support</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Round-the-clock technical support from networking experts
                </p>
              </div>

              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <MdSecurity className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3">Advanced Security</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Built-in security features and optional advanced protection
                </p>
              </div>

              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <FaInfinity className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3">No Data Caps</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Truly unlimited data with no throttling or hidden limits
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50 rounded-2xl mb-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 relative">
              Frequently Asked Questions
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-red-600 rounded-full"></span>
            </h2>
            <div className="space-y-4">
              {[
                {
                  question:
                    "What's the difference between download and upload speed?",
                  answer:
                    "Download speed refers to how quickly data is transferred from the internet to your device (important for streaming, browsing, downloading files). Upload speed is how quickly data is sent from your device to the internet (important for video calls, gaming, cloud backups). Most activities require good download speeds, while upload speeds are crucial for content creation and remote work.",
                },
                {
                  question:
                    "Do I need a special router for high-speed internet?",
                  answer:
                    "For speeds above 100 Mbps, we recommend a WiFi 6 router for optimal performance. Our premium plans include a compatible router. Basic plans work with most modern routers, but for the best experience with gigabit speeds, a WiFi 6 or better router is essential to handle the bandwidth and provide stable connectivity throughout your home or office.",
                },
                {
                  question: "How is the installation process handled?",
                  answer:
                    "Our professional installation includes: site survey, fiber optic cable installation (if needed), router setup, network configuration, and testing. The technician will ensure optimal placement for best signal strength and provide a brief tutorial on using your new internet service. Installation typically takes 2-4 hours and is scheduled at your convenience.",
                },
                {
                  question: "What happens during outages or service issues?",
                  answer:
                    "We offer 24/7 network monitoring and proactive maintenance. In case of outages, our automated systems detect issues immediately, and technicians are dispatched if needed. Customers receive SMS/email updates about service status and estimated resolution times. Our SLA guarantees 99.9% uptime for business plans with credits for extended outages.",
                },
                {
                  question: "Can I upgrade or downgrade my plan later?",
                  answer:
                    "Yes, you can change your plan at any time. Upgrades are immediate, while downgrades typically take effect at your next billing cycle. There are no fees for plan changes. If you need more speed temporarily, we also offer daily boost packages for special events like gaming tournaments or large file transfers.",
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300"
                >
                  <button
                    className="w-full p-6 text-left font-semibold flex justify-between items-center"
                    onClick={() => toggleFAQ(index)}
                  >
                    {faq.question}
                    <span
                      className={`transform transition-transform duration-300 ${
                        activeFAQ === index ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      activeFAQ === index ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <div className="p-6 pt-0 text-gray-600">{faq.answer}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <NewsletterSignup />
      </main>
      <Footer />
    </div>
  );
}
