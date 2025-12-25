"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import NewsletterSignup from "@/components/Newsletter";
import DedicatedServerSearchForm from "@/components/dedicated-server/DedicatedServerSearchForm";
import {
  Server,
  Cpu,
  HardDrive,
  MemoryStick,
  Zap,
  Shield,
  Clock,
  CheckCircle,
  Wifi,
  Database,
  Network,
  Star,
  Globe,
  Users,
  CreditCard,
} from "lucide-react";
import Link from "next/link";

type DedicatedServer = {
  _id?: string; // backend ID
  id?: number; // optional fallback for mock
  title: string;
  cpu: string;
  cores: number;
  threads: number;
  ram: number;
  storage: string;
  storageType: "SSD" | "NVMe" | "HDD";
  bandwidth: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  image: string;
  bestSeller?: boolean;
  features: string[];
  availability: "In Stock" | "Limited" | "Pre-order";
  rating: number;
  location: string;
  networkSpeed: string;
  ipv4: number;
  ipv6: boolean;
  raid: string;
  support: string;
};

export default function DedicatedServerPage() {
  const [servers, setServers] = useState<DedicatedServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/dedicated-servers`,
          { cache: "no-store" }
        );

        if (!res.ok) throw new Error("Failed to fetch dedicated servers");
        const data: DedicatedServer[] = await res.json();
        setServers(data);
      } catch (err) {
        console.error("Error fetching dedicated servers:", err);
        setError("Unable to load dedicated servers. Please try again later.");
        setServers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, []);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800";
      case "Limited":
        return "bg-yellow-100 text-yellow-800";
      case "Pre-order":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-medium text-gray-600">Loading servers...</p>
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
            src="/images/server-logo.png"
            alt="Dedicated Server Logo"
            width={120}
            height={120}
            className="rounded-md object-cover mb-4"
          />
          <h1 className="text-2xl md:text-2xl font-bold mb-2">
            Ultimate{" "}
            <span className="text-red-600 text-3xl">Dedicated Servers</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enterprise-grade hardware for maximum performance and reliability
          </p>
        </div>

        {/* Server Search Form */}
        <div className="mb-12">
          <DedicatedServerSearchForm />
        </div>

        {/* Features Banner */}
        <section className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-8 mb-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            {
              icon: <Server className="w-10 h-10 text-red-600" />,
              text: "Dedicated Resources",
              desc: "Exclusive hardware for your needs",
            },
            {
              icon: <Cpu className="w-10 h-10 text-red-600" />,
              text: "High Performance",
              desc: "Latest generation processors",
            },
            {
              icon: <HardDrive className="w-10 h-10 text-red-600" />,
              text: "Fast Storage",
              desc: "SSD & NVMe options available",
            },
            {
              icon: <Shield className="w-10 h-10 text-red-600" />,
              text: "Enterprise Security",
              desc: "DDoS protection & monitoring",
            },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              {item.icon}
              <span className="font-bold text-gray-800 mt-2">{item.text}</span>
              <span className="text-sm text-gray-600 mt-1">{item.desc}</span>
            </div>
          ))}
        </section>

        {/* Featured Dedicated Servers */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Featured Dedicated Servers
              </h2>
              <p className="text-gray-600">
                Bare metal servers with full root access and enterprise hardware
              </p>
            </div>
            <button className="text-white bg-red-600 border rounded-xl px-4 py-2 font-medium hover:bg-red-700 transition-colors">
              View All Servers
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servers.map((server) => (
              <div
                key={server.id}
                className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group relative ${
                  server.bestSeller
                    ? "ring-2 ring-red-500 transform hover:scale-105"
                    : ""
                }`}
              >
                {server.bestSeller && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                    POPULAR
                  </div>
                )}
                {server.discount && (
                  <div className="absolute top-4 right-4 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                    {server.discount}
                  </div>
                )}
                <div className="absolute top-12 left-4 bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded z-10">
                  {server.availability}
                </div>

                {/* Server Image */}
                <Link href={`/dedicated-server/${server.id}`}>
                  <div className="relative h-48 w-full">
                    <Image
                      src={server.image}
                      alt={server.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority
                    />
                  </div>
                </Link>

                {/* Server Details */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold">{server.title}</h3>
                      <p className="text-gray-500 text-sm">{server.location}</p>
                    </div>
                    <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-medium">{server.rating}</span>
                    </div>
                  </div>

                  {/* Server Specs */}
                  <div className="grid grid-cols-2 gap-4 my-4 text-sm">
                    <div className="flex items-center">
                      <Cpu className="w-4 h-4 mr-2 text-blue-600" />
                      <span>
                        {server.cores}C/{server.threads}T
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MemoryStick className="w-4 h-4 mr-2 text-blue-600" />
                      <span>{server.ram}GB RAM</span>
                    </div>
                    <div className="flex items-center">
                      <HardDrive className="w-4 h-4 mr-2 text-blue-600" />
                      <span>{server.storage}</span>
                    </div>
                    <div className="flex items-center">
                      <Wifi className="w-4 h-4 mr-2 text-blue-600" />
                      <span>{server.bandwidth}</span>
                    </div>
                  </div>

                  {/* Additional Features */}
                  <div className="flex flex-wrap gap-2 my-4">
                    {server.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                    {server.features.length > 3 && (
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        +{server.features.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Price and Configuration */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-2xl font-bold text-red-600">
                          {formatPrice(server.price)}
                        </span>
                        {server.originalPrice && (
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            {formatPrice(server.originalPrice)}
                          </span>
                        )}
                        <p className="text-xs text-gray-500">per month</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">
                        {server.networkSpeed}
                      </span>
                    </div>

                    <Link href={`/dedicated-server/${server.id}`}>
                      <button className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white font-medium px-6 py-3 rounded-lg hover:from-red-700 hover:to-red-900 transition-all shadow-md hover:shadow-lg">
                        Configure Server
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Special Offers Section */}
        <section className="my-20 relative">
          <div className="mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold relative inline-block">
              Special Server Offers
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-red-500 to-red-700 rounded-full"></span>
            </h2>
            <p className="mt-4 text-gray-600 text-lg max-w-2xl">
              Exclusive deals and limited-time promotions for enterprise hosting
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                bigOfferTitle: "Free Setup",
                title: "Zero Setup Fees",
                desc: "Get free server setup and configuration worth $199 with any annual plan.",
                gradient: "from-red-500 to-red-600",
                btnColor: "text-red-600",
                image: "/images/server.jpeg",
              },
              {
                bigOfferTitle: "50% OFF",
                title: "First Month",
                desc: "Get 50% off your first month on all dedicated server plans.",
                gradient: "from-blue-500 to-blue-600",
                btnColor: "text-blue-600",
                image: "/images/server.jpeg",
              },
              {
                bigOfferTitle: "Free Migration",
                title: "Server Migration",
                desc: "We'll migrate your existing servers for free with guaranteed zero downtime.",
                gradient: "from-green-500 to-green-600",
                btnColor: "text-green-600",
                image: "/images/server.jpeg",
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
        <section className="py-16 bg-gray-50 rounded-2xl mb-16">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 relative">
              How Our Server Deployment Works
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-red-600 rounded-full"></span>
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="p-6 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-2xl font-bold mb-6 mx-auto">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-4">Choose Server</h3>
                <p className="text-gray-600 text-sm">
                  Select from our range of dedicated server configurations
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mb-6 mx-auto">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-4">Customize</h3>
                <p className="text-gray-600 text-sm">
                  Configure hardware, storage, and network options
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl font-bold mb-6 mx-auto">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-4">Deploy</h3>
                <p className="text-gray-600 text-sm">
                  We provision and configure your server within hours
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-2xl font-bold mb-6 mx-auto">
                  4
                </div>
                <h3 className="text-xl font-semibold mb-4">Manage</h3>
                <p className="text-gray-600 text-sm">
                  Access and manage your server with full root access
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 relative">
            Client Testimonials
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-red-600 rounded-full"></span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-green-50 border rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-yellow-400 text-2xl mb-4">★★★★★</div>
              <p className="text-gray-700 italic mb-6">
                "The performance of our dedicated servers has been exceptional.
                Our website load times improved by 300% after migrating to their
                infrastructure."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold mr-4">
                  JT
                </div>
                <div>
                  <h4 className="font-semibold">James Thompson</h4>
                  <p className="text-sm text-gray-500">CTO, Tech Startup</p>
                </div>
              </div>
            </div>
            <div className="p-8 bg-green-50 border rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-yellow-400 text-2xl mb-4">★★★★★</div>
              <p className="text-gray-700 italic mb-6">
                "Their enterprise support is outstanding. We had a complex
                migration that was handled seamlessly with zero downtime."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-4">
                  SC
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Chen</h4>
                  <p className="text-sm text-gray-500">
                    IT Director, E-commerce
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8 bg-green-50 border rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-yellow-400 text-2xl mb-4">★★★★☆</div>
              <p className="text-gray-700 italic mb-6">
                "The NVMe storage performance is incredible. Our database
                queries are now 5x faster compared to our previous hosting
                provider."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold mr-4">
                  MR
                </div>
                <div>
                  <h4 className="font-semibold">Michael Rodriguez</h4>
                  <p className="text-sm text-gray-500">DevOps Engineer</p>
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
              Why Choose Our Dedicated Servers?
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></span>
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-red-400 to-red-600 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3">Maximum Performance</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Dedicated resources with latest generation hardware and
                  processors
                </p>
              </div>

              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3">Enterprise Security</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Advanced DDoS protection, hardware firewalls, and 24/7
                  monitoring
                </p>
              </div>

              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <Clock className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3">99.99% Uptime</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Guaranteed reliability with redundant networks and power
                  systems
                </p>
              </div>

              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3">Expert Support</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  24/7 dedicated support team with server administration
                  expertise
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
                    "What's the difference between dedicated and cloud hosting?",
                  answer:
                    "Dedicated servers provide exclusive access to physical hardware with maximum performance and control, while cloud hosting uses virtualized resources across multiple machines. Dedicated servers are ideal for high-traffic websites, databases, and applications requiring consistent performance, while cloud offers more scalability and flexibility.",
                },
                {
                  question: "How quickly can I get my server provisioned?",
                  answer:
                    "Most dedicated servers are provisioned within 2-4 hours during business hours. Custom configurations may take 24-48 hours. We offer instant deployment options for select configurations, and emergency deployment within 1 hour is available for enterprise customers.",
                },
                {
                  question: "Do you provide server management services?",
                  answer:
                    "Yes, we offer fully managed dedicated server plans that include OS updates, security patches, monitoring, and 24/7 support. We also have self-managed options for clients who prefer full control. Our management services include proactive monitoring, regular backups, and performance optimization.",
                },
                {
                  question: "Can I upgrade my server hardware later?",
                  answer:
                    "Absolutely! We offer flexible upgrade options including RAM upgrades, additional storage, and CPU upgrades. Most hardware upgrades can be performed with minimal downtime. We also provide migration services to more powerful servers when needed.",
                },
                {
                  question: "What kind of support do you offer?",
                  answer:
                    "We provide 24/7/365 support through multiple channels including phone, email, and live chat. Our support tiers include: Basic (monitoring and alerts), Managed (proactive management), and Enterprise (dedicated engineer). All plans include hardware support and network monitoring.",
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
