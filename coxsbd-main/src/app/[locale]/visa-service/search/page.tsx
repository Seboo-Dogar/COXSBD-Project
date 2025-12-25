"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/Newsletter";
import Image from "next/image";
import VisaServiceForm from "@/components/visa-service/VisaSearchForm";
import {
  Clock,
  Globe,
  Briefcase,
  GraduationCap,
  Plane,
  CheckCircle,
  XCircle,
  SlidersHorizontal,
} from "lucide-react";

type VisaServiceType = {
  id: number;
  title: string;
  country: string;
  description: string;
  price: string;
  image: string;
  type: string;
  processingTime: string;
  requirements?: string[];
  benefits?: string[];
};

const mockVisas: VisaServiceType[] = [
  {
    id: 1,
    title: "USA Tourist Visa (B-2)",
    country: "United States",
    description:
      "Experience the wonders of America with our streamlined tourist visa application process. Visit iconic landmarks, national parks, and vibrant cities.",
    price: "From $160",
    image: "/images/visa1.png",
    type: "Tourist",
    processingTime: "15",
    requirements: [
      "Valid passport (6+ months)",
      "Proof of financial means",
      "Travel itinerary",
      "Hotel bookings",
    ],
    benefits: [
      "Multiple entries allowed",
      "Up to 6 months stay",
      "Fast-track processing available",
      "Online application tracking",
    ],
  },
  {
    id: 2,
    title: "UK Business Visa",
    country: "United Kingdom",
    description:
      "Conduct business activities in the UK with our comprehensive business visa service. Includes support for documentation and interview preparation.",
    price: "From £120",
    image: "/images/visa2.png",
    type: "Business",
    processingTime: "10",
    requirements: [
      "Business invitation letter",
      "Company registration documents",
      "Bank statements",
      "Travel insurance",
    ],
    benefits: [
      "Valid for 2 years",
      "24/7 customer support",
      "Document review service",
      "Priority appointments",
    ],
  },
  {
    id: 3,
    title: "Schengen Work Visa",
    country: "Germany",
    description:
      "Legal employment authorization for the Schengen area with full compliance support. We handle all paperwork and embassy coordination.",
    price: "From €200",
    image: "/images/visa3.png",
    type: "Work",
    processingTime: "30",
    requirements: [
      "Employment contract",
      "Professional qualifications",
      "Health insurance",
      "Clean criminal record",
    ],
    benefits: [
      "Family inclusion possible",
      "Path to residency",
      "Legal consultation included",
      "Multi-country validity",
    ],
  },
  {
    id: 4,
    title: "Australia Student Visa (Subclass 500)",
    country: "Australia",
    description:
      "Pursue your education in Australia with our specialized student visa service. We assist with university coordination and documentation.",
    price: "From $450",
    image: "/images/visa4.png",
    type: "Student",
    processingTime: "20",
    requirements: [
      "University acceptance letter",
      "English proficiency proof",
      "Financial capacity proof",
      "Health examination",
    ],
    benefits: [
      "Work part-time (40hrs/fortnight)",
      "Post-study work options",
      "Dependent visas available",
      "Education pathway support",
    ],
  },
  {
    id: 5,
    title: "Canada Tourist Visa",
    country: "Canada",
    description:
      "Explore Canada's diverse landscapes and cities with our hassle-free tourist visa application service. We maximize your approval chances.",
    price: "From $100",
    image: "/images/visa5.png",
    type: "Tourist",
    processingTime: "12",
    requirements: [
      "Travel history",
      "Proof of ties to home country",
      "Financial documents",
      "Purpose of visit",
    ],
    benefits: [
      "Multiple entries possible",
      "Up to 6 months per stay",
      "Super visa options available",
      "Family applications supported",
    ],
  },
];

const visaTypeIcons = {
  Tourist: <Plane className="w-4 h-4" />,
  Business: <Briefcase className="w-4 h-4" />,
  Student: <GraduationCap className="w-4 h-4" />,
  Work: <Briefcase className="w-4 h-4" />,
  Transit: <Plane className="w-4 h-4" />,
};

export default function VisaSearchPage() {
  const searchParams = useSearchParams();
  const [filteredVisas, setFilteredVisas] =
    useState<VisaServiceType[]>(mockVisas);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  // filters
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [maxProcessingTime, setMaxProcessingTime] = useState<number>(30);

  // unique country list
  const countries = Array.from(new Set(mockVisas.map((v) => v.country)));

  // prefill from URL if available
  useEffect(() => {
    const typeParam = searchParams.get("visaType");
    if (typeParam) setSelectedTypes([typeParam]);
  }, [searchParams]);

  // filter logic
  useEffect(() => {
    let result = mockVisas;

    if (selectedTypes.length > 0) {
      result = result.filter((v) => selectedTypes.includes(v.type));
    }

    if (selectedCountries.length > 0) {
      result = result.filter((v) => selectedCountries.includes(v.country));
    }

    if (maxProcessingTime) {
      result = result.filter(
        (v) => parseInt(v.processingTime) <= maxProcessingTime
      );
    }

    setFilteredVisas(result);
  }, [selectedTypes, selectedCountries, maxProcessingTime]);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleCountry = (country: string) => {
    setSelectedCountries((prev) =>
      prev.includes(country)
        ? prev.filter((c) => c !== country)
        : [...prev, country]
    );
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedCountries([]);
    setMaxProcessingTime(30);
  };

  const toggleExpandCard = (id: number) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <>
      <Header />
      <br />
      <VisaServiceForm />

      <div className="max-w-8xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <aside className="bg-white rounded-lg shadow p-6 border space-y-8 sticky top-4 h-fit">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-xl flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </h3>
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:underline"
            >
              Clear All
            </button>
          </div>

          {/* Visa Type Filter */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Visa Type
            </h4>
            <div className="space-y-2">
              {["Tourist", "Business", "Student", "Work", "Transit"].map(
                (type) => (
                  <label
                    key={type}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={type}
                      checked={selectedTypes.includes(type)}
                      onChange={() => toggleType(type)}
                      className="h-4 w-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                    />
                    <span className="flex items-center gap-2">
                      {visaTypeIcons[type as keyof typeof visaTypeIcons]}
                      {type}
                    </span>
                  </label>
                )
              )}
            </div>
          </div>

          {/* Country Filter */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Destination
            </h4>
            <div className="space-y-2">
              {countries.map((country) => (
                <label
                  key={country}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={country}
                    checked={selectedCountries.includes(country)}
                    onChange={() => toggleCountry(country)}
                    className="h-4 w-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                  />
                  {country}
                </label>
              ))}
            </div>
          </div>

          {/* Processing Time Filter */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Processing Time
            </h4>
            <div className="px-2">
              <input
                type="range"
                min={3}
                max={30}
                value={maxProcessingTime}
                onChange={(e) => setMaxProcessingTime(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>3 days</span>
                <span className="font-medium text-red-600">
                  {maxProcessingTime} days
                </span>
                <span>30 days</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Visa Cards */}
        <main className="md:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {filteredVisas.length} Visa{filteredVisas.length !== 1 ? "s" : ""}{" "}
              Available
            </h2>
            <p className="text-sm text-gray-500">
              Showing {filteredVisas.length} of {mockVisas.length} visas
            </p>
          </div>

          {filteredVisas.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">No visas found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search filters
              </p>
              <button
                onClick={clearFilters}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredVisas.map((visa) => (
                <div
                  key={visa.id}
                  className="border border-gray-200 rounded-xl overflow-hidden shadow hover:shadow-md transition-all duration-300 bg-white"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="relative md:w-1/3 h-48 md:h-auto">
                      <Image
                        src={visa.image}
                        alt={visa.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <div className="flex items-center gap-2 text-white">
                          <Globe className="w-4 h-4" />
                          <span className="font-medium">{visa.country}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold">{visa.title}</h3>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                {
                                  visaTypeIcons[
                                    visa.type as keyof typeof visaTypeIcons
                                  ]
                                }
                                {visa.type}
                              </span>
                              <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                <Clock className="w-3 h-3" />
                                {visa.processingTime} days processing
                              </span>
                            </div>
                          </div>
                          <span className="text-xl font-bold text-red-600">
                            {visa.price}
                          </span>
                        </div>

                        <p className="mt-3 text-gray-600">{visa.description}</p>

                        {/* Always visible details (no expand/collapse) */}
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              Benefits
                            </h4>
                            <ul className="space-y-2">
                              {visa.benefits?.map((benefit, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm">{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <XCircle className="w-4 h-4 text-red-500" />
                              Requirements
                            </h4>
                            <ul className="space-y-2">
                              {visa.requirements?.map((req, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm">{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end">
                        <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                          Apply Now
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <NewsletterSignup />
      <br />
      <br />
      <Footer />
    </>
  );
}
