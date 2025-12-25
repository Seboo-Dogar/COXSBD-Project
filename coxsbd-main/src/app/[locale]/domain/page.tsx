"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DomainSearchForm from "@/components/domain/DomainSearchForm";
import Image from "next/image";
import NewsletterSignup from "@/components/Newsletter";
import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

type DomainExtension = {
  _id?: string; // backend ID
  id?: number; // fallback
  extension: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  popular?: boolean;
  description: string;
  features: string[];
};

type FeaturedDomain = {
  _id?: string; // backend ID
  id?: number;
  name: string;
  price: number;
  category: string;
  rating: number;
  isPremium?: boolean;
};

export default function DomainPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [extensions, setExtensions] = useState<DomainExtension[]>([]);
  const [featuredDomains, setFeaturedDomains] = useState<FeaturedDomain[]>([]);

  useEffect(() => {
    const fetchDomainData = async () => {
      try {
        setLoading(true);

        // fetch extensions
        const resExt = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/domain-extensions`,
          { cache: "no-store" }
        );
        if (!resExt.ok) throw new Error("Failed to fetch domain extensions");
        const extData: DomainExtension[] = await resExt.json();

        // fetch featured domains
        const resFeat = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/featured-domains`,
          { cache: "no-store" }
        );
        if (!resFeat.ok) throw new Error("Failed to fetch featured domains");
        const featData: FeaturedDomain[] = await resFeat.json();

        setExtensions(extData);
        setFeaturedDomains(featData);
      } catch (err) {
        console.error("Error fetching domain data:", err);
        setError("Unable to load domain data. Please try again later.");
        setExtensions([]);
        setFeaturedDomains([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDomainData();
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
          Loading domain services...
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
            src="/images/domain-logo.png"
            alt="Domain Logo"
            width={120}
            height={120}
            className="rounded-md object-cover mb-4"
          />
          <h1 className="text-2xl md:text-2xl font-bold mb-2">
            Find Your Perfect{" "}
            <span className="text-red-600 text-3xl">Domain Name</span> Today
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Search available domains quickly and easily to build your online
            presence
          </p>
        </div>

        {/* Domain Search Form */}
        <div className="mb-12">
          <DomainSearchForm />
        </div>

        {/* Popular Domain Extensions */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Popular Domain Extensions
              </h2>
              <p className="text-gray-600">
                Choose from the most popular TLDs for your website
              </p>
            </div>
            <button className="text-white bg-red-600 border rounded-xl px-4 py-2 font-medium hover:bg-red-700 transition-colors">
              View All Extensions
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {extensions.map((extension) => (
              <div
                key={extension.id}
                className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group relative ${
                  extension.popular
                    ? "ring-2 ring-red-500 transform hover:scale-105"
                    : ""
                }`}
              >
                {extension.popular && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                    POPULAR
                  </div>
                )}
                {extension.discount && (
                  <div className="absolute top-4 right-4 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                    {extension.discount}
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                        {extension.extension}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-bold">
                          {extension.extension}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {extension.name}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">
                    {extension.description}
                  </p>

                  <div className="flex flex-wrap gap-2 my-4">
                    {extension.features.map((feature, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-2xl font-bold text-red-600">
                          ${extension.price}
                        </span>
                        {extension.originalPrice && (
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            ${extension.originalPrice}
                          </span>
                        )}
                        <p className="text-xs text-gray-500">per year</p>
                      </div>
                    </div>

                    <Link href={`/domain/${extension.id}`}>
                      <button className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white font-medium px-6 py-3 rounded-lg hover:from-red-700 hover:to-red-900 transition-all shadow-md hover:shadow-lg">
                        Register Now
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Premium Domains */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Featured Premium Domains
              </h2>
              <p className="text-gray-600">
                Exclusive domain names with high value and brand potential
              </p>
            </div>
            <button className="text-white bg-red-600 border rounded-xl px-4 py-2 font-medium hover:bg-red-700 transition-colors">
              View Premium Domains
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDomains.map((domain) => (
              <div
                key={domain.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-blue-800">
                        {domain.name}
                      </h3>
                      <p className="text-gray-500 text-sm">{domain.category}</p>
                    </div>
                    {domain.isPremium && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                        PREMIUM
                      </span>
                    )}
                  </div>

                  <div className="flex items-center mb-4">
                    <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-medium">{domain.rating}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-2xl font-bold text-red-600">
                          ${domain.price}
                        </span>
                        <p className="text-xs text-gray-500">
                          one-time purchase
                        </p>
                      </div>
                    </div>
                    <button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all shadow-md hover:shadow-lg">
                      Make Offer
                    </button>
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
              Special Domain Offers
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-red-500 to-red-700 rounded-full"></span>
            </h2>
            <p className="mt-4 text-gray-600 text-lg max-w-2xl">
              Exclusive deals and limited-time promotions for domain
              registration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                bigOfferTitle: "$0.99",
                title: "First Year Domain",
                desc: "Get your first domain for just $0.99 with any hosting plan purchase.",
                gradient: "from-red-500 to-red-600",
                btnColor: "text-red-600",
                image: "/images/domain.jpg",
              },
              {
                bigOfferTitle: "Free WHOIS",
                title: "Privacy Protection",
                desc: "Free WHOIS privacy protection with every domain registration for life.",
                gradient: "from-blue-500 to-blue-600",
                btnColor: "text-blue-600",
                image: "/images/domain.jpg",
              },
              {
                bigOfferTitle: "Free SSL",
                title: "Security Certificate",
                desc: "Free SSL certificate with every domain for enhanced security.",
                gradient: "from-green-500 to-green-600",
                btnColor: "text-green-600",
                image: "/images/domain.jpg",
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
              How Domain Registration Works
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-red-600 rounded-full"></span>
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="p-6 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-2xl font-bold mb-6 mx-auto">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-4">Search</h3>
                <p className="text-gray-600 text-sm">
                  Find your perfect domain name using our search tool
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mb-6 mx-auto">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-4">Choose</h3>
                <p className="text-gray-600 text-sm">
                  Select your domain extension and add to cart
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl font-bold mb-6 mx-auto">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-4">Register</h3>
                <p className="text-gray-600 text-sm">
                  Complete checkout and provide registration details
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-2xl font-bold mb-6 mx-auto">
                  4
                </div>
                <h3 className="text-xl font-semibold mb-4">Manage</h3>
                <p className="text-gray-600 text-sm">
                  Access your domain control panel and manage settings
                </p>
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
              Why Choose Our Domain Services?
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></span>
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-red-400 to-red-600 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <Globe className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3">Global Recognition</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Trusted domain registrar with ICANN accreditation and global
                  presence
                </p>
              </div>

              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3">Free Privacy</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Free WHOIS privacy protection to keep your personal
                  information secure
                </p>
              </div>

              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <Lock className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3">Secure Management</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Advanced security features and easy-to-use management tools
                </p>
              </div>

              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3">24/7 Support</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Expert support team available around the clock to assist you
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
                  question: "How long does domain registration take?",
                  answer:
                    "Domain registration is typically instant. Once you complete the purchase and provide the required information, your domain is usually registered within seconds to minutes. However, it can take up to 24-48 hours for the domain to propagate fully across the global DNS system.",
                },
                {
                  question: "What is WHOIS privacy protection?",
                  answer:
                    "WHOIS privacy protection replaces your personal contact information in the public WHOIS database with generic contact information. This prevents spam, identity theft, and unwanted solicitations. We provide free WHOIS privacy protection with all eligible domain registrations.",
                },
                {
                  question: "Can I transfer my domain to another registrar?",
                  answer:
                    "Yes, you can transfer your domain to another registrar. Domains must be at least 60 days old and not within 45 days of expiration to be eligible for transfer. You'll need to unlock the domain and obtain an authorization code (EPP code) from your current registrar before initiating the transfer.",
                },
                {
                  question: "How do I renew my domain?",
                  answer:
                    "Domain renewal is automatic by default. We'll send you renewal reminders starting 30 days before expiration. You can also manually renew your domain at any time through your control panel. We offer a grace period after expiration, but it's recommended to renew before the expiration date.",
                },
                {
                  question:
                    "What's the difference between domain registration and hosting?",
                  answer:
                    "Domain registration is like getting your business address - it's the name people type to find your website. Web hosting is like the physical building - it's where your website files are stored and served to visitors. You need both to have a functioning website.",
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
