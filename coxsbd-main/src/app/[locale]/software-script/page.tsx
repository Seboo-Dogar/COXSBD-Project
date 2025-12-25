"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import NewsletterSignup from "@/components/Newsletter";
import Footer from "@/components/Footer";
import ScriptSearchForm from "@/components/software-script/ScriptSearchForm";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type Script = {
  _id?: string; // backend ID
  id?: number; // fallback
  title: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  image: string;
  popular?: boolean;
  description: string;
  rating: number;
  reviews: number;
  sales: number;
  lastUpdated: string;
  features: string[];
  technology: string[];
  support: string;
  documentation: string;
  demo: string;
  version: string;
  requirements: string[];
};

export default function ScriptLandingPage() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  useEffect(() => {
    const fetchScripts = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scripts`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to fetch scripts");
        const data: Script[] = await res.json();
        setScripts(data);
      } catch (err) {
        console.error("Error fetching scripts:", err);
        setError("Unable to load scripts. Please try again later.");
        setScripts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchScripts();
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
        <p className="text-lg font-medium text-gray-600">Loading scripts...</p>
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
            src="/images/script-logo.png"
            alt="Software Scripts Logo"
            width={120}
            height={120}
            className="rounded-md object-cover mb-4"
          />
          <h1 className="text-2xl md:text-2xl font-bold mb-2">
            Software Scripts –{" "}
            <span className="text-red-600 text-3xl">
              Ready-to-Use Web & App Solutions
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Premium scripts and software solutions to launch your business
            quickly and efficiently
          </p>
        </div>

        {/* Script Search Form */}
        <div className="mb-12">
          <ScriptSearchForm />
        </div>

        {/* Features Banner */}
        <section className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-8 mb-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            {
              icon: <Download className="w-10 h-10 text-red-600" />,
              text: "Instant Download",
              desc: "Get immediate access",
            },
            {
              icon: <Code className="w-10 h-10 text-red-600" />,
              text: "Clean Code",
              desc: "Well-structured and documented",
            },
            {
              icon: <Shield className="w-10 h-10 text-red-600" />,
              text: "Regular Updates",
              desc: "Lifetime free updates",
            },
            {
              icon: <Zap className="w-10 h-10 text-red-600" />,
              text: "Fast Support",
              desc: "24/7 technical support",
            },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              {item.icon}
              <span className="font-bold text-gray-800 mt-2">{item.text}</span>
              <span className="text-sm text-gray-600 mt-1">{item.desc}</span>
            </div>
          ))}
        </section>

        {/* Featured Scripts */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Featured Software Scripts
              </h2>
              <p className="text-gray-600">
                Premium scripts and software solutions for various business
                needs
              </p>
            </div>
            <button className="text-white bg-red-600 border rounded-xl px-4 py-2 font-medium hover:bg-red-700 transition-colors">
              View All Scripts
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {scripts.map((script) => (
              <div
                key={script.id}
                className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group relative ${
                  script.popular
                    ? "ring-2 ring-red-500 transform hover:scale-105"
                    : ""
                }`}
              >
                {script.popular && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                    POPULAR
                  </div>
                )}
                {script.discount && (
                  <div className="absolute top-4 right-4 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                    {script.discount}
                  </div>
                )}

                {/* Script Image */}
                <Link href={`/software-script/${script.id}`}>
                  <div className="relative h-48 w-full">
                    <Image
                      src={script.image}
                      alt={script.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority
                    />
                  </div>
                </Link>

                {/* Script Details */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold">{script.title}</h3>
                      <p className="text-gray-500 text-sm">{script.category}</p>
                    </div>
                    <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-medium">{script.rating}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {script.description}
                  </p>

                  {/* Technology Stack */}
                  <div className="flex flex-wrap gap-2 my-4">
                    {script.technology.slice(0, 3).map((tech, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {script.technology.length > 3 && (
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        +{script.technology.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 my-4">
                    {script.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                    {script.features.length > 3 && (
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        +{script.features.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Price and Purchase */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-2xl font-bold text-red-600">
                          ${script.price}
                        </span>
                        {script.originalPrice && (
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            ${script.originalPrice}
                          </span>
                        )}
                        <p className="text-xs text-gray-500">
                          one-time purchase
                        </p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">
                        {script.sales} sales
                      </span>
                    </div>

                    <Link href={`/software-script/${script.id}`}>
                      <button className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white font-medium px-6 py-3 rounded-lg hover:from-red-700 hover:to-red-900 transition-all shadow-md hover:shadow-lg">
                        Buy Now
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
              Special Script Offers
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-red-500 to-red-700 rounded-full"></span>
            </h2>
            <p className="mt-4 text-gray-600 text-lg max-w-2xl">
              Exclusive deals and limited-time promotions on premium software
              scripts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                bigOfferTitle: "50% OFF",
                title: "Bundle Packages",
                desc: "Get 50% off when you purchase any 3 scripts together in our bundle package.",
                gradient: "from-red-500 to-red-600",
                btnColor: "text-red-600",
                image: "/images/script.jpeg",
              },
              {
                bigOfferTitle: "Free Support",
                title: "Extended Support",
                desc: "Get 12 months of free technical support with any script purchase this month.",
                gradient: "from-blue-500 to-blue-600",
                btnColor: "text-blue-600",
                image: "/images/script.jpeg",
              },
              {
                bigOfferTitle: "Source Code",
                title: "Full Ownership",
                desc: "Get complete source code access and full ownership rights with every purchase.",
                gradient: "from-green-500 to-green-600",
                btnColor: "text-green-600",
                image: "/images/script.jpeg",
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
              How Our Script Service Works
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-red-600 rounded-full"></span>
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="p-6 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-2xl font-bold mb-6 mx-auto">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-4">Browse & Select</h3>
                <p className="text-gray-600 text-sm">
                  Explore our collection of premium scripts and choose the
                  perfect solution
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mb-6 mx-auto">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-4">Purchase</h3>
                <p className="text-gray-600 text-sm">
                  Complete your purchase and get instant access to downloads
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl font-bold mb-6 mx-auto">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-4">
                  Install & Configure
                </h3>
                <p className="text-gray-600 text-sm">
                  Follow our documentation to install and configure your script
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-2xl font-bold mb-6 mx-auto">
                  4
                </div>
                <h3 className="text-xl font-semibold mb-4">Launch & Support</h3>
                <p className="text-gray-600 text-sm">
                  Launch your project and get support from our technical team
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
                "The e-commerce script saved us months of development time. The
                code quality is excellent and the support team helped us
                customize it perfectly for our needs."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold mr-4">
                  SC
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Chen</h4>
                  <p className="text-sm text-gray-500">
                    E-commerce Store Owner
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8 bg-green-50 border rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-yellow-400 text-2xl mb-4">★★★★★</div>
              <p className="text-gray-700 italic mb-6">
                "The hotel booking system is incredibly robust. We launched our
                booking platform in just 2 weeks and have already processed over
                500 bookings seamlessly."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-4">
                  MJ
                </div>
                <div>
                  <h4 className="font-semibold">Michael Johnson</h4>
                  <p className="text-sm text-gray-500">Hotel Manager</p>
                </div>
              </div>
            </div>
            <div className="p-8 bg-green-50 border rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-yellow-400 text-2xl mb-4">★★★★☆</div>
              <p className="text-gray-700 italic mb-6">
                "The marketplace script is feature-rich and scalable. Our
                vendors love the dashboard, and the commission system works
                perfectly. Great value for money!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold mr-4">
                  RK
                </div>
                <div>
                  <h4 className="font-semibold">Robert Kim</h4>
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
              Why Choose Our Software Scripts?
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></span>
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-red-400 to-red-600 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <Code className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3">Clean Code</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Professionally written, well-documented, and easily
                  customizable code
                </p>
              </div>

              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3">Secure & Stable</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Regular security updates and thoroughly tested for stability
                </p>
              </div>

              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <Download className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3">Instant Access</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Immediate download access after purchase with no waiting time
                </p>
              </div>

              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3">Expert Support</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Dedicated technical support team to help with installation and
                  customization
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
                  question: "What's included in the script purchase?",
                  answer:
                    "When you purchase a script, you receive: the complete source code, detailed documentation, installation guide, 6-12 months of technical support (depending on the script), free updates for the supported period, and a license for single use. Some scripts also include bonus materials like PSD files, additional plugins, or API documentation.",
                },
                {
                  question: "Can I customize the scripts?",
                  answer:
                    "Yes, all scripts are fully customizable. You have complete access to the source code and can modify it to fit your specific needs. We provide documentation to help with customization, and our support team can assist with minor modifications. For major customizations, we offer paid customization services.",
                },
                {
                  question: "Do you offer refunds?",
                  answer:
                    "Due to the digital nature of our products, we offer a 7-day refund policy for technical issues that cannot be resolved by our support team. Refunds are not provided for change of mind, not reading the documentation, or compatibility issues with your server environment. Please test the demo thoroughly before purchasing.",
                },
                {
                  question: "What are the technical requirements?",
                  answer:
                    "Requirements vary by script but typically include: PHP 7.4+ or Node.js 14+, MySQL 5.7+ or MongoDB, Apache/Nginx web server, and specific PHP extensions or Node modules. Each script listing includes detailed requirements. We recommend checking the requirements against your server environment before purchase.",
                },
                {
                  question: "Is the license transferable?",
                  answer:
                    "Our standard license allows you to use the script for one project or website. The license is not transferable to another person or company. If you need to use the script for multiple projects, we offer extended licenses. Reselling or redistributing the source code is strictly prohibited under our terms of service.",
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
