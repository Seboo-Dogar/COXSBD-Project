"use client";

import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LicenseSearchForm from "@/components/license/LicenseSearchForm";
import NewsletterSignup from "@/components/Newsletter";
import Image from "next/image";
import {
  FaStar,
  FaRegStar,
  FaGlobe,
  FaShieldAlt,
  FaCertificate,
} from "react-icons/fa";
import { MdSupportAgent, MdSpeed, MdVerified } from "react-icons/md";
import { HiStar } from "react-icons/hi";
import { RiVipCrownFill, Ri24HoursFill } from "react-icons/ri";

interface License {
  _id?: string; // backend Mongo ID
  id?: number;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  image: string;
  rating: number;
  isFeatured?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  validity?: string;
  processingTime?: string;
  requirements?: string[];
  features: { text: string; icon: JSX.Element }[];
  bestFor: string;
  discount?: number;
}

export default function LicensesPage() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedLicenses, setSavedLicenses] = useState<string[]>([]);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  const toggleSaved = (id: string) => {
    setSavedLicenses((prev) =>
      prev.includes(id) ? prev.filter((lid) => lid !== id) : [...prev, id]
    );
  };

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }).map((_, i) =>
      i < Math.floor(rating) || (i === Math.floor(rating) && rating % 1 >= 0.5) ? (
        <FaStar key={i} className="text-yellow-400" />
      ) : (
        <FaRegStar key={i} className="text-yellow-400" />
      )
    );

  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/licenses`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to fetch licenses");
        const data: License[] = await res.json();
        setLicenses(data);
      } catch (err) {
        console.error("Error fetching licenses:", err);
        setError("Unable to load licenses. Please try again later.");
        setLicenses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLicenses();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-medium text-gray-600">Loading licenses...</p>
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
            src="/images/license-logo.png"
            alt="License Logo"
            width={120}
            height={120}
            className="rounded-md object-cover mb-4"
          />
          <h1 className="text-2xl md:text-2xl font-bold mb-2">
            Official{" "}
            <span className="text-red-600 text-3xl">
              Licenses & Registrations
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fast, reliable, and hassle-free license services for businesses,
            professionals, and individuals
          </p>
        </div>

        {/* License Search Form */}
        <div className="mb-12">
          <LicenseSearchForm />
        </div>

        {/* Features Banner */}
        <section className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-8 mb-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            {
              icon: <FaCertificate className="w-10 h-10 text-red-600" />,
              text: "Verified Services",
              desc: "Government-approved",
            },
            {
              icon: <FaClock className="w-10 h-10 text-red-600" />,
              text: "Fast Processing",
              desc: "Quick turnaround",
            },
            {
              icon: <FaShieldAlt className="w-10 h-10 text-red-600" />,
              text: "Secure Process",
              desc: "Data protection",
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

        {/* Featured Licenses */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Featured Licenses
              </h2>
              <p className="text-gray-600">
                Professional license services for every need and budget
              </p>
            </div>
            <button className="text-white bg-red-600 border rounded-xl px-4 py-2 font-medium hover:bg-red-700 transition-colors">
              View All Licenses
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {licenses.map((license) => (
              <motion.div
                key={license.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group relative ${
                  license.isPopular
                    ? "ring-2 ring-red-500 transform hover:scale-105"
                    : ""
                }`}
              >
                {license.isPopular && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                    POPULAR
                  </div>
                )}
                {license.discount && (
                  <div className="absolute top-4 right-4 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                    {license.discount}% OFF
                  </div>
                )}

                {/* License Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
                  <h3 className="text-xl font-bold">{license.name}</h3>
                  <p className="text-blue-100 text-sm">{license.bestFor}</p>
                </div>

                {/* License Details */}
                <div className="p-6">
                  {/* Price and Rating */}
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                      <div className="flex mr-2">
                        {renderStars(license.rating)}
                      </div>
                      <span className="text-sm text-gray-600">
                        {license.rating.toFixed(1)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-red-600">
                        {license.price}
                      </span>
                      {license.originalPrice && (
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          {license.originalPrice}
                        </span>
                      )}
                      <p className="text-xs text-gray-500">one-time fee</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-6">
                    {license.description}
                  </p>

                  {/* Technical Specifications */}
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    {license.validity && (
                      <div className="flex items-center">
                        <FaInfoCircle className="w-4 h-4 mr-2 text-blue-600" />
                        <span>{license.validity}</span>
                      </div>
                    )}
                    {license.processingTime && (
                      <div className="flex items-center">
                        <FaClock className="w-4 h-4 mr-2 text-blue-600" />
                        <span>{license.processingTime}</span>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 my-4">
                    {license.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                      >
                        {feature.text}
                      </span>
                    ))}
                    {license.features.length > 3 && (
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        +{license.features.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Link href={`/licenses/${license.id}`}>
                    <button className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white font-medium px-6 py-3 rounded-lg hover:from-red-700 hover:to-red-900 transition-all shadow-md hover:shadow-lg">
                      Apply Now
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
              Special License Offers
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-red-500 to-red-700 rounded-full"></span>
            </h2>
            <p className="mt-4 text-gray-600 text-lg max-w-2xl">
              Exclusive deals and limited-time promotions on license services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                bigOfferTitle: "Free Consultation",
                title: "Expert Guidance",
                desc: "Get a free professional consultation with any business license application.",
                gradient: "from-red-500 to-red-600",
                btnColor: "text-red-600",
                image: "/images/license1.jpg",
              },
              {
                bigOfferTitle: "20% OFF",
                title: "Bundle Packages",
                desc: "Save 20% when you bundle multiple license services together.",
                gradient: "from-blue-500 to-blue-600",
                btnColor: "text-blue-600",
                image: "/images/license1.jpg",
              },
              {
                bigOfferTitle: "Express Processing",
                title: "Priority Service",
                desc: "Free express processing for all license applications this month.",
                gradient: "from-green-500 to-green-600",
                btnColor: "text-green-600",
                image: "/images/license1.jpg",
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
              How Our License Service Works
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-red-600 rounded-full"></span>
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="p-6 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-2xl font-bold mb-6 mx-auto">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-4">Select License</h3>
                <p className="text-gray-600 text-sm">
                  Choose the license service that matches your requirements
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mb-6 mx-auto">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-4">Submit Documents</h3>
                <p className="text-gray-600 text-sm">
                  Upload required documents through our secure portal
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl font-bold mb-6 mx-auto">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-4">We Process</h3>
                <p className="text-gray-600 text-sm">
                  Our experts handle all paperwork and government submissions
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-2xl font-bold mb-6 mx-auto">
                  4
                </div>
                <h3 className="text-xl font-semibold mb-4">Receive License</h3>
                <p className="text-gray-600 text-sm">
                  Get your approved license delivered digitally or physically
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
                "The business license service saved me countless hours of
                paperwork. Their experts handled everything efficiently and kept
                me updated throughout the process."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold mr-4">
                  SC
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Chen</h4>
                  <p className="text-sm text-gray-500">Startup Founder</p>
                </div>
              </div>
            </div>
            <div className="p-8 bg-green-50 border rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-yellow-400 text-2xl mb-4">★★★★★</div>
              <p className="text-gray-700 italic mb-6">
                "I needed multiple software licenses for my development team.
                The bundle discount was great, and the process was incredibly
                smooth with expert guidance."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-4">
                  MJ
                </div>
                <div>
                  <h4 className="font-semibold">Michael Johnson</h4>
                  <p className="text-sm text-gray-500">CTO</p>
                </div>
              </div>
            </div>
            <div className="p-8 bg-green-50 border rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-yellow-400 text-2xl mb-4">★★★★☆</div>
              <p className="text-gray-700 italic mb-6">
                "Driver's license renewal was surprisingly easy. I uploaded my
                documents in the morning and had my renewed license by the next
                day. Excellent service!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold mr-4">
                  RK
                </div>
                <div>
                  <h4 className="font-semibold">Robert Kim</h4>
                  <p className="text-sm text-gray-500">Freelancer</p>
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
              Why Choose Our License Services?
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></span>
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-red-400 to-red-600 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <MdVerified className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3">Government Approved</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  All our services are officially recognized and
                  government-approved
                </p>
              </div>

              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <Ri24HoursFill className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3">Fast Processing</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Expedited processing with most licenses completed in days, not
                  weeks
                </p>
              </div>

              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <FaShieldAlt className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3">Secure Handling</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Your documents and data are protected with enterprise-grade
                  security
                </p>
              </div>

              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <MdSupportAgent className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3">Expert Support</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Dedicated license experts guide you through every step of the
                  process
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
                  question: "How long does it take to get a license?",
                  answer:
                    "Processing times vary by license type. Standard business licenses typically take 3-5 business days, while expedited processing can reduce this to 1-2 days. Driver's license renewals are often processed within 24 hours. We provide realistic timelines upfront based on current government processing times.",
                },
                {
                  question: "What documents do I need to provide?",
                  answer:
                    "Document requirements vary by license type. Generally, you'll need identification proof, address verification, and specific documents related to the license (business plans, qualifications, etc.). Our system provides a customized checklist after you select your license service, and our experts can help if you're missing any documents.",
                },
                {
                  question: "Are your services available nationwide?",
                  answer:
                    "Yes, we serve clients across the country. While some local licenses may have specific regional requirements, our network of experts covers all states and territories. We stay updated on local regulations to ensure compliance wherever your business or needs are located.",
                },
                {
                  question: "What if my application gets rejected?",
                  answer:
                    "We have a 98% success rate due to our thorough pre-screening process. In the rare case of rejection, we analyze the reasons, help you address any issues, and resubmit at no additional cost for most services. Our success guarantee means you only pay when your application is approved.",
                },
                {
                  question: "Can I track my application status?",
                  answer:
                    "Yes, our portal provides real-time status updates on your application. You'll receive notifications at each stage of the process, and can message your dedicated license expert directly with any questions. We believe in transparent communication throughout the entire process.",
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
