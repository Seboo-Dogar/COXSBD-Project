"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import NewsletterSignup from "@/components/Newsletter";
import HostingSearchForm from "@/components/web-hosting/HostingSearchForm";
import {
  CheckCircle,
  XCircle,
  Star,
  Zap,
  Shield,
  Globe,
  Clock,
  Database,
  Cpu,
  HardDrive,
  Network,
} from "lucide-react";
import Link from "next/link";

type HostingPlan = {
  _id?: string; // backend ID (Mongo/Postgres etc.)
  id?: number; // optional fallback for dummy data
  name: string;
  type: "Shared" | "VPS" | "Dedicated" | "WordPress" | "Cloud";
  cpuCores: number | string;
  ramGB: number;
  storageGB: number;
  bandwidthTB: number;
  sslIncluded: boolean;
  freeDomain: boolean;
  emailAccounts: number;
  databases: number;
  pricePerMonth: number;
  originalPrice?: number;
  discount?: string;
  description: string;
  rating: number;
  popular: boolean;
  features: string[];
  support: string;
  uptime: string;
  backup: string;
};

export default function WebHostingPage() {
  const [plans, setPlans] = useState<HostingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  useEffect(() => {
    const fetchHostingPlans = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/web-hosting`,
          {
            cache: "no-store",
          }
        );

        if (!res.ok) throw new Error("Failed to fetch hosting plans");
        const data: HostingPlan[] = await res.json();
        setPlans(data);
      } catch (err) {
        console.error("Error fetching hosting plans:", err);
        setError("Unable to load hosting plans. Please try again later.");
        setPlans([]); // fallback empty
      } finally {
        setLoading(false);
      }
    };

    fetchHostingPlans();
  }, []);

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-medium text-gray-600">
          Loading hosting plans...
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
            src="/images/web-logo.png"
            alt="Web Hosting Logo"
            width={120}
            height={120}
            className="rounded-md object-cover mb-4"
          />
          <h1 className="text-2xl md:text-2xl font-bold mb-2">
            Your Trusted Partner for{" "}
            <span className="text-red-600 text-3xl">Web Hosting</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Reliable, fast, and secure hosting solutions for your online
            presence
          </p>
        </div>

        {/* Hosting Search Form */}
        <div className="mb-12">
          <HostingSearchForm />
        </div>

        {/* Featured Hosting Plans */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Featured Hosting Plans
              </h2>
              <p className="text-gray-600">
                Our best hosting deals available for you
              </p>
            </div>
            <button className="text-white bg-red-600 border rounded-xl px-4 py-2 font-medium hover:bg-red-700 transition-colors">
              View All Plans
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group relative ${
                  plan.popular
                    ? "ring-2 ring-red-500 transform hover:scale-105"
                    : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                    MOST POPULAR
                  </div>
                )}
                {plan.discount && (
                  <div className="absolute top-4 right-4 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                    {plan.discount}
                  </div>
                )}

                {/* Plan Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-blue-100 text-sm">{plan.type} Hosting</p>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center bg-blue-500 px-2 py-1 rounded">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-medium">{plan.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="p-6 border-b">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-red-600">
                      ৳{plan.pricePerMonth}
                    </span>
                    {plan.originalPrice && (
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        ৳{plan.originalPrice}
                      </span>
                    )}
                    <span className="block text-sm text-gray-500">
                      per month
                    </span>
                  </div>
                </div>

                {/* Specifications */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-sm">
                      <Cpu className="w-4 h-4 mr-2 text-blue-600" />
                      <span>
                        {plan.cpuCores}{" "}
                        {typeof plan.cpuCores === "number" ? "Cores" : "CPU"}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Zap className="w-4 h-4 mr-2 text-blue-600" />
                      <span>{plan.ramGB}GB RAM</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <HardDrive className="w-4 h-4 mr-2 text-blue-600" />
                      <span>{plan.storageGB}GB SSD</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Network className="w-4 h-4 mr-2 text-blue-600" />
                      <span>{plan.bandwidthTB}TB Bandwidth</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm">
                      {plan.sslIncluded ? (
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-2 text-gray-400" />
                      )}
                      <span>Free SSL Certificate</span>
                    </div>
                    <div className="flex items-center text-sm">
                      {plan.freeDomain ? (
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-2 text-gray-400" />
                      )}
                      <span>Free Domain</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      <span>{plan.emailAccounts} Email Accounts</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Database className="w-4 h-4 mr-2 text-blue-600" />
                      <span>{plan.databases} Databases</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Shield className="w-4 h-4 mr-2 text-blue-600" />
                      <span>{plan.backup} Backups</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Globe className="w-4 h-4 mr-2 text-blue-600" />
                      <span>{plan.uptime} Uptime</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-6">
                    {plan.description}
                  </p>

                  {/* Choose Plan Button */}
                  {plan.id && (
                    <Link href={`/web-hosting/${plan.id}`}>
                      <button className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white font-medium px-6 py-3 rounded-lg hover:from-red-700 hover:to-red-900 transition-all shadow-md hover:shadow-lg">
                        Choose Plan
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Special Offers Section */}
        <section className="my-20 relative">
          <div className="mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold relative inline-block">
              Special Hosting Offers
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-red-500 to-red-700 rounded-full"></span>
            </h2>
            <p className="mt-4 text-gray-600 text-lg max-w-2xl">
              Exclusive deals and limited-time promotions for your hosting needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                bigOfferTitle: "Free Domain",
                title: "First Year Free",
                desc: "Get a free domain name for the first year with any annual hosting plan.",
                gradient: "from-red-500 to-red-600",
                btnColor: "text-red-600",
                image: "/images/web-hosting.png",
              },
              {
                bigOfferTitle: "60% OFF",
                title: "Annual Plans",
                desc: "Save up to 60% when you choose annual billing instead of monthly.",
                gradient: "from-blue-500 to-blue-600",
                btnColor: "text-blue-600",
                image: "/images/web-hosting.png",
              },
              {
                bigOfferTitle: "Free Migration",
                title: "Website Transfer",
                desc: "We'll migrate your website for free from your current host to ours.",
                gradient: "from-green-500 to-green-600",
                btnColor: "text-green-600",
                image: "/images/web-hosting.png",
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
              How Our Hosting Service Works
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-red-600 rounded-full"></span>
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="p-6 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-2xl font-bold mb-6 mx-auto">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-4">Choose Plan</h3>
                <p className="text-gray-600 text-sm">
                  Select the hosting plan that best fits your website needs
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mb-6 mx-auto">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-4">Register Domain</h3>
                <p className="text-gray-600 text-sm">
                  Register your domain name or transfer an existing one
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl font-bold mb-6 mx-auto">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-4">
                  Setup & Configure
                </h3>
                <p className="text-gray-600 text-sm">
                  We set up your hosting environment and configure everything
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-2xl font-bold mb-6 mx-auto">
                  4
                </div>
                <h3 className="text-xl font-semibold mb-4">Go Live</h3>
                <p className="text-gray-600 text-sm">
                  Launch your website and enjoy reliable hosting service
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
                "Switching to their hosting was the best decision for my
                business. The speed improvement was noticeable immediately, and
                their support team is incredibly responsive."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold mr-4">
                  SJ
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-sm text-gray-500">
                    E-commerce Store Owner
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8 bg-green-50 border rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-yellow-400 text-2xl mb-4">★★★★★</div>
              <p className="text-gray-700 italic mb-6">
                "The WordPress hosting is exceptional. Automatic updates, daily
                backups, and expert support make running my blog completely
                stress-free."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-4">
                  MR
                </div>
                <div>
                  <h4 className="font-semibold">Michael Rodriguez</h4>
                  <p className="text-sm text-gray-500">
                    Blogger & Content Creator
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8 bg-green-50 border rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-yellow-400 text-2xl mb-4">★★★★☆</div>
              <p className="text-gray-700 italic mb-6">
                "Our company migrated to their VPS hosting and the performance
                difference is night and day. The scalability options have been
                crucial for our growth."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold mr-4">
                  AK
                </div>
                <div>
                  <h4 className="font-semibold">Amanda Kim</h4>
                  <p className="text-sm text-gray-500">Tech Startup CEO</p>
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
              Why Choose Our Hosting Services?
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></span>
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-red-400 to-red-600 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3">Blazing Fast Speed</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  SSD storage, LiteSpeed servers, and optimized infrastructure
                  for maximum performance
                </p>
              </div>

              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3">Top Security</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Free SSL, malware scanning, DDoS protection, and daily backups
                  included
                </p>
              </div>

              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <Clock className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3">99.9% Uptime</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Guaranteed reliability with redundant systems and 24/7
                  monitoring
                </p>
              </div>

              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <Globe className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3">24/7 Support</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Expert support team available round-the-clock via chat, phone,
                  and email
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
                    "What's the difference between shared and VPS hosting?",
                  answer:
                    "Shared hosting means your website shares server resources with other websites, making it more affordable but with limited resources. VPS hosting provides dedicated resources within a virtualized environment, offering better performance, security, and control at a higher price point.",
                },
                {
                  question: "Do you offer a money-back guarantee?",
                  answer:
                    "Yes, we offer a 30-day money-back guarantee on all our hosting plans. If you're not satisfied with our service within the first 30 days, we'll provide a full refund of your hosting fees (domain registration fees are non-refundable).",
                },
                {
                  question: "Can I upgrade my plan later?",
                  answer:
                    "Absolutely! You can upgrade your hosting plan at any time without any downtime. We'll seamlessly migrate your website to the new plan, and you'll only pay the difference prorated for the remaining billing period.",
                },
                {
                  question: "Do you provide website migration services?",
                  answer:
                    "Yes, we offer free website migration for new customers. Our expert team will handle the entire migration process for you, ensuring no downtime and that everything works perfectly on our servers.",
                },
                {
                  question: "What security measures do you have in place?",
                  answer:
                    "We employ multiple security layers including free SSL certificates, regular malware scanning, DDoS protection, firewalls, and daily backups. Our servers are monitored 24/7, and we use advanced security protocols to protect your data.",
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
