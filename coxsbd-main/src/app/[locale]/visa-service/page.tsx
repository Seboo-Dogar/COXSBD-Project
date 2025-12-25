"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import NewsletterSignup from "@/components/Newsletter";
import Footer from "@/components/Footer";
import Image from "next/image";
import VisaServiceForm from "@/components/visa-service/VisaSearchForm";
import Link from "next/link";

interface Visa {
  id: number;
  title: string;
  country: string;
  description: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  processingTime: string;
  image: string;
  rating: number;
  requirements: string[];
  visaType: string;
  validity: string;
  popularity: number;
}

export default function VisaService() {
  const [visas, setVisas] = useState<Visa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  useEffect(() => {
    const fetchVisas = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/visas`, {
          cache: "no-store", // always fetch fresh data
        });

        if (!res.ok) throw new Error("Failed to fetch visas");

        // If your backend returns raw array:
        const data: Visa[] = await res.json();


        setVisas(data);
      } catch (err: any) {
        console.error("Error fetching visas:", err);
        setError(err.message || "Something went wrong");
        setVisas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVisas();
  }, []);

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  // 🔄 Loading State
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-medium text-gray-600">
          Loading visa services...
        </p>
      </div>
    );
  }

  // ❌ Error State
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

  // ✅ No Data State
  if (visas.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-600 mb-2">
          No visa services available
        </h3>
        <p className="text-gray-500">
          Try adjusting your search criteria or check back later
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <Image
            src="/images/visa-logo.jpg"
            alt="Visa Service Logo"
            width={120}
            height={120}
            className="rounded-md object-cover mb-4"
          />
          <h1 className="text-2xl md:text-2xl font-bold mb-2">
            Global Visa Assistance{" "}
            <span className="text-red-600 text-3xl">Made Easy</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Expert guidance for your international travel documents
          </p>
        </div>

        {/* Visa Search Form */}
        <div className="mb-12">
          <VisaServiceForm />
        </div>

        {/* Featured Visa Services */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Featured Visa Services
              </h2>
              <p className="text-gray-600">
                Our most popular visa options with special processing rates
              </p>
            </div>
            <button className="text-white bg-red-600 border rounded-xl px-4 py-2 font-medium hover:bg-red-700 transition-colors">
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredVisas.map((visa) => (
              <div
                key={visa.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                {/* Visa Image */}
                <Link href={`/visa-service/${visa.id}`}>
                  <div className="relative h-48 w-full">
                    <Image
                      src={visa.image}
                      alt={visa.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority
                    />
                    {visa.discount && (
                      <div className="absolute top-4 right-4 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {visa.discount}
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
                      {visa.country}
                    </div>
                  </div>
                </Link>

                {/* Visa Details */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold">{visa.title}</h3>
                      <p className="text-gray-500 text-sm">{visa.visaType}</p>
                    </div>
                    <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="font-medium">{visa.rating}</span>
                    </div>
                  </div>

                  {/* Visa Info */}
                  <div className="flex items-center gap-4 my-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      {visa.processingTime}
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        ></path>
                      </svg>
                      {visa.validity}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {visa.description}
                  </p>

                  {/* Requirements Chips */}
                  <div className="flex flex-wrap gap-2 my-4">
                    {visa.requirements.slice(0, 3).map((requirement, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                      >
                        {requirement}
                      </span>
                    ))}
                    {visa.requirements.length > 3 && (
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        +{visa.requirements.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Price and Application */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-2xl font-bold text-red-600">
                          {visa.price}
                        </span>
                        {visa.originalPrice && (
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            {visa.originalPrice}
                          </span>
                        )}
                        <p className="text-xs text-gray-500">
                          Government fees extra
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          visa.popularity > 90
                            ? "bg-green-100 text-green-800"
                            : visa.popularity > 80
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {visa.popularity}% Success Rate
                      </span>
                    </div>
                    <Link href={`/visa-service/${visa.id}`}>
                      <button className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white font-medium px-6 py-3 rounded-lg hover:from-red-700 hover:to-red-900 transition-all shadow-md hover:shadow-lg">
                        Apply Now
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
              Special Visa Offers
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-red-500 to-red-700 rounded-full"></span>
            </h2>
            <p className="mt-4 text-gray-600 text-lg max-w-2xl">
              Exclusive discounts and priority processing for your visa
              applications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                bigOfferTitle: "Save 25%",
                title: "Family Package",
                desc: "Apply for 3+ family members and save 25% on processing fees.",
                gradient: "from-red-500 to-red-600",
                btnColor: "text-red-600",
                image: "/images/visa.png",
              },
              {
                bigOfferTitle: "Express Processing",
                title: "Urgent Applications",
                desc: "Need your visa quickly? Our express service cuts processing time by 50%.",
                gradient: "from-blue-500 to-blue-600",
                btnColor: "text-blue-600",
                image: "/images/visa.png",
              },
              {
                bigOfferTitle: "Free Consultation",
                title: "First-Time Applicants",
                desc: "Complimentary consultation for first-time visa applicants.",
                gradient: "from-green-500 to-green-600",
                btnColor: "text-green-600",
                image: "/images/visa.png",
              },
            ].map((offer, index) => (
              <div
                key={index}
                className={`relative p-6 rounded-3xl shadow-2xl bg-gradient-to-r ${offer.gradient} text-white overflow-hidden group hover:scale-105 transition-transform duration-300`}
              >
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/20 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-white/20 rounded-full animate-pulse"></div>

                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-5xl md:text-5xl font-extrabold leading-tight">
                    {offer.bigOfferTitle}
                  </h1>
                  <div className="relative w-26 h-14 md:w-44 md:h-22 flex-shrink-0">
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
              How Our Visa Service Works
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-red-600 rounded-full"></span>
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="p-6 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-2xl font-bold mb-6 mx-auto">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-4">Consultation</h3>
                <p className="text-gray-600 text-sm">
                  Free assessment of your requirements and documentation
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mb-6 mx-auto">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-4">Documentation</h3>
                <p className="text-gray-600 text-sm">
                  We prepare and verify all required documents for your
                  application
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl font-bold mb-6 mx-auto">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-4">Submission</h3>
                <p className="text-gray-600 text-sm">
                  We handle the entire application process with the embassy
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-2xl font-bold mb-6 mx-auto">
                  4
                </div>
                <h3 className="text-xl font-semibold mb-4">Collection</h3>
                <p className="text-gray-600 text-sm">
                  We deliver your visa and provide post-approval guidance
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
                "The USA visa process was incredibly smooth with their help.
                They guided me through every step and my visa was approved in
                record time!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold mr-4">
                  RJ
                </div>
                <div>
                  <h4 className="font-semibold">Robert Johnson</h4>
                  <p className="text-sm text-gray-500">USA Visa Applicant</p>
                </div>
              </div>
            </div>
            <div className="p-8 bg-green-50 border rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-yellow-400 text-2xl mb-4">★★★★★</div>
              <p className="text-gray-700 italic mb-6">
                "I was stressed about my Schengen visa application, but their
                team made it effortless. Professional service with attention to
                every detail."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-4">
                  SM
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Miller</h4>
                  <p className="text-sm text-gray-500">
                    Schengen Visa Applicant
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8 bg-green-50 border rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-yellow-400 text-2xl mb-4">★★★★☆</div>
              <p className="text-gray-700 italic mb-6">
                "The UK visa service was exceptional. They caught errors in my
                documentation that I would have missed. Highly recommended!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold mr-4">
                  DK
                </div>
                <div>
                  <h4 className="font-semibold">David Kim</h4>
                  <p className="text-sm text-gray-500">UK Visa Applicant</p>
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
              Why Choose Our Visa Services?
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></span>
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-red-400 to-red-600 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <span>📋</span>
                </div>
                <h3 className="font-bold text-xl mb-3">Expert Guidance</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Experienced consultants with knowledge of latest visa
                  regulations
                </p>
              </div>

              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <span>⚡</span>
                </div>
                <h3 className="font-bold text-xl mb-3">Fast Processing</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Priority processing options available for urgent applications
                </p>
              </div>

              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <span>💰</span>
                </div>
                <h3 className="font-bold text-xl mb-3">Transparent Pricing</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  No hidden fees with clear breakdown of all costs involved
                </p>
              </div>

              <div className="p-8 bg-white rounded-3xl shadow-lg text-center hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 bg-gradient-to-tr from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <span>📞</span>
                </div>
                <h3 className="font-bold text-xl mb-3">24/7 Support</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Round-the-clock customer support for all your visa queries
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
                  question: "How long does the visa processing take?",
                  answer:
                    "Processing times vary by country and visa type. Typically, tourist visas take 10-15 business days, while some countries offer expedited processing for an additional fee. We'll provide you with an accurate timeline during your consultation.",
                },
                {
                  question: "What documents do I need to apply for a visa?",
                  answer:
                    "Requirements vary by destination, but generally include a valid passport, recent photographs, financial documents, travel itinerary, and supporting letters. We provide a customized checklist based on your specific visa type and circumstances.",
                },
                {
                  question: "What if my visa application gets rejected?",
                  answer:
                    "In case of rejection, we analyze the reasons and provide guidance on reapplying. We offer a partial refund of our service fee according to our refund policy. Our success rate is over 95% due to our thorough documentation review process.",
                },
                {
                  question: "Do you guarantee visa approval?",
                  answer:
                    "While we cannot guarantee approval as final decisions rest with embassies, we ensure your application is complete, accurate, and presents the strongest possible case. Our expertise significantly increases your chances of approval.",
                },
                {
                  question: "Can you help with emergency visa applications?",
                  answer:
                    "Yes, we offer expedited services for urgent applications. Additional fees apply for priority processing. We've successfully handled last-minute applications for medical emergencies, business trips, and family emergencies.",
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

