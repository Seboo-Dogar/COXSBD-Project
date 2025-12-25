"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import NewsletterSignup from "@/components/Newsletter";
import VpsServerSearchForm from "@/components/cloud-vps/VpsServerSearchForm";
import React, { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

type VpsPlan = {
  _id?: string; // backend ID
  id?: number; // optional fallback for mock
  title: string;
  type: "Standard" | "Performance" | "Enterprise";
  cpu: number;
  ram: number;
  storage: number;
  storageType: "SSD" | "NVMe";
  bandwidth: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  image: string;
  popular?: boolean;
  description: string;
  rating: number;
  features: string[];
  locations: string[];
  backup: string;
  support: string;
  scalability: string;
};

export default function CloudVpsPage() {
  const [plans, setPlans] = useState<VpsPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  useEffect(() => {
    const fetchVpsPlans = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/vps-plans`,
          { cache: "no-store" }
        );

        if (!res.ok) throw new Error("Failed to fetch VPS plans");
        const data: VpsPlan[] = await res.json();
        setPlans(data);
      } catch (err) {
        console.error("Failed to fetch VPS plans:", err);
        setError("Unable to load VPS plans. Please try again later.");
        setPlans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVpsPlans();
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
        <p className="text-lg font-medium text-gray-600">Loading VPS plans...</p>
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
            src="/images/vps-logo.png"
            alt="Cloud VPS Logo"
            width={120}
            height={120}
            className="rounded-md object-cover mb-4"
          />
          <h1 className="text-2xl md:text-2xl font-bold mb-2">
            Powerful Cloud VPS —{" "}
            <span className="text-red-600 text-3xl">
              Fast, Flexible, and Secure
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Deploy enterprise-grade virtual private servers with 99.9% uptime
            and 24/7 support
          </p>
        </div>

        {/* VPS Search Form */}
        <div className="mb-12">
          <VpsServerSearchForm />
        </div>

        {/* Features Banner */}
        <section className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-8 mb-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            {
              icon: <Zap className="w-10 h-10 text-red-600" />,
              text: "Instant Deployment",
              desc: "Ready in minutes",
            },
            {
              icon: <Shield className="w-10 h-10 text-red-600" />,
              text: "Secure Infrastructure",
              desc: "DDoS protection included",
            },
            {
              icon: <Globe className="w-10 h-10 text-red-600" />,
              text: "Global Data Centers",
              desc: "10+ locations worldwide",
            },
            {
              icon: <Clock className="w-10 h-10 text-red-600" />,
              text: "99.9% Uptime",
              desc: "SLA guaranteed",
            },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              {item.icon}
              <span className="font-bold text-gray-800 mt-2">{item.text}</span>
              <span className="text-sm text-gray-600 mt-1">{item.desc}</span>
            </div>
          ))}
        </section>

        {/* Featured VPS Plans */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Featured Cloud VPS Plans
              </h2>
              <p className="text-gray-600">
                Scalable virtual private servers with enterprise-grade
                performance
              </p>
            </div>
            <button className="text-white bg-red-600 border rounded-xl px-4 py-2 font-medium hover:bg-red-700 transition-colors">
              View All Plans
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
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
                    {plan.discount}
                  </div>
                )}

                {/* Plan Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
                  <h3 className="text-xl font-bold">{plan.title}</h3>
                  <p className="text-blue-100 text-sm">{plan.type} VPS</p>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center bg-blue-500 px-2 py-1 rounded">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-medium">{plan.rating}</span>
                    </div>
                  </div>
                </div>

                {/* VPS Image */}
                <Link href={`/cloud-vps/${plan.id}`}>
                  <div className="relative h-48 w-full">
                    <Image
                      src={plan.image}
                      alt={plan.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority
                    />
                  </div>
                </Link>

                {/* VPS Details */}
                <div className="p-6">
                  {/* Specifications */}
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div className="flex items-center">
                      <Cpu className="w-4 h-4 mr-2 text-blue-600" />
                      <span>{plan.cpu} vCPU</span>
                    </div>
                    <div className="flex items-center">
                      <MemoryStick className="w-4 h-4 mr-2 text-blue-600" />
                      <span>{plan.ram}GB RAM</span>
                    </div>
                    <div className="flex items-center">
                      <HardDrive className="w-4 h-4 mr-2 text-blue-600" />
                      <span>
                        {plan.storage}GB {plan.storageType}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Network className="w-4 h-4 mr-2 text-blue-600" />
                      <span>{plan.bandwidth}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4">
                    {plan.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 my-4">
                    {plan.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                    {plan.features.length > 3 && (
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        +{plan.features.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Price and Order */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <div>
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
                      <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">
                        {plan.support}
                      </span>
                    </div>

                    <Link href={`/cloud-vps/${plan.id}`}>
                      <button className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white font-medium px-6 py-3 rounded-lg hover:from-red-700 hover:to-red-900 transition-all shadow-md hover:shadow-lg">
                        Deploy Now
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Special Offers Section */}
        <section className="my-20 relative">
          <div className="mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold relative inline-block">
              Special VPS Offers
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-red-500 to-red-700 rounded-full"></span>
            </h2>
            <p className="mt-4 text-gray-600 text-lg max-w-2xl">
              Exclusive deals and limited-time promotions for cloud hosting
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                bigOfferTitle: "Free Trial",
                title: "7-Day Trial",
                desc: "Test our VPS performance with a full 7-day free trial, no credit card required.",
                gradient: "from-red-500 to-red-600",
                btnColor: "text-red-600",
                image: "/images/vps.jpg",
              },
              {
                bigOfferTitle: "50% OFF",
                title: "First Month",
                desc: "Get 50% off your first month on all annual VPS plans with instant deployment.",
                gradient: "from-blue-500 to-blue-600",
                btnColor: "text-blue-600",
                image: "/images/vps.jpg",
              },
              {
                bigOfferTitle: "Free Migration",
                title: "Server Migration",
                desc: "We'll migrate your existing VPS for free with guaranteed zero downtime.",
                gradient: "from-green-500 to-green-600",
                btnColor: "text-green-600",
                image: "/images/vps.jpg",
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
              How Our VPS Deployment Works
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-red-600 rounded-full"></span>
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="p-6 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-2xl font-bold mb-6 mx-auto">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-4">Choose Plan</h3>
                <p className="text-gray-600 text-sm">
                  Select from our range of VPS configurations and locations
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mb-6 mx-auto">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-4">Configure</h3>
                <p className="text-gray-600 text-sm">
                  Customize OS, applications, and additional services
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl font-bold mb-6 mx-auto">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-4">Deploy</h3>
                <p className="text-gray-600 text-sm">
                  Instant deployment with your server ready in minutes
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-2xl font-bold mb-6 mx-auto">
                  4
                </div>
                <h3 className="text-xl font-semibold mb-4">Scale</h3>
                <p className="text-gray-600 text-sm">
                  Easily scale resources up or down as your needs change
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
                "The scalability of their VPS platform is incredible. We easily
                handle traffic spikes during sales events without any
                performance issues."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold mr-4">
                  JT
                </div>
                <div>
                  <h4 className="font-semibold">James Thompson</h4>
                  <p className="text-sm text-gray-500">E-commerce Manager</p>
                </div>
              </div>
            </div>
            <div className="p-8 bg-green-50 border rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-yellow-400 text-2xl mb-4">★★★★★</div>
              <p className="text-gray-700 italic mb-6">
                "Migrating to their NVMe VPS cut our database query times by
                60%. The performance difference is night and day compared to
                traditional SSDs."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-4">
                  SC
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Chen</h4>
                  <p className="text-sm text-gray-500">Lead Developer</p>
                </div>
              </div>
            </div>
            <div className="p-8 bg-green-50 border rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-yellow-400 text-2xl mb-4">★★★★☆</div>
              <p className="text-gray-700 italic mb-6">
                "The automatic scaling feature has been a game-changer for our
                startup. We only pay for what we use, and it handles traffic
                spikes seamlessly."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold mr-4">
                  MR
                </div>
                <div>
                  <h4 className="font-semibold">Michael Rodriguez</h4>
                  <p className="text-sm text-gray-500">Startup Founder</p>
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
              Why Choose Our Cloud VPS?
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></span>
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-red-400 to-red-600 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3">Instant Deployment</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Get your VPS running in minutes with our automated
                  provisioning system
                </p>
              </div>

              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3">Enterprise Security</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Advanced DDoS protection, firewalls, and regular security
                  updates
                </p>
              </div>

              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <Database className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3">NVMe Storage</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Blazing-fast NVMe storage for maximum database and application
                  performance
                </p>
              </div>

              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3">24/7 Expert Support</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Round-the-clock support from cloud infrastructure experts
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
                    "What's the difference between Cloud VPS and traditional VPS?",
                  answer:
                    "Cloud VPS runs on a clustered cloud infrastructure with automatic failover and live migration capabilities, while traditional VPS is typically on a single physical server. Cloud VPS offers better reliability, scalability, and resource isolation with the ability to instantly scale resources and automatically migrate between nodes during hardware failures.",
                },
                {
                  question: "Can I upgrade my VPS plan later?",
                  answer:
                    "Yes, you can upgrade your VPS resources (CPU, RAM, storage) at any time with zero downtime. Most upgrades are performed live without requiring a reboot. We also offer automatic scaling options that can dynamically adjust resources based on your traffic patterns.",
                },
                {
                  question: "Do you provide backups and snapshots?",
                  answer:
                    "Yes, we offer automated daily backups with 7-day retention. You can also create manual snapshots at any time. Additional backup options include: Weekly backups (30-day retention), off-site backups, and point-in-time recovery for databases. All backup plans include one-click restoration.",
                },
                {
                  question: "What operating systems are available?",
                  answer:
                    "We support all major Linux distributions (Ubuntu, CentOS, Debian, Fedora) and Windows Server editions. You can choose from pre-configured images or upload your own custom ISO. We also offer optimized images for specific applications like WordPress, Docker, and development stacks.",
                },
                {
                  question: "How is the network performance?",
                  answer:
                    "Our VPS platform features high-speed SSD/NVMe storage with guaranteed IOPs, 1Gbps/10Gbps network interfaces, and low-latency global connectivity. We provide SLA-backed network uptime with multiple tier-1 bandwidth providers and Anycast DNS. All plans include DDoS protection and monitoring.",
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
