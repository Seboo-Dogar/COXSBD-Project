"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NewsletterSignup from "@/components/Newsletter";
import OffersSearchForm from "@/components/offers/OffersSearchForm";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

type Offer = {
  id: number;
  title: string;
  description: string;
  price: ReactNode;
  originalPrice?: string;
  discount?: string;
  features?: string[];
  image: string | StaticImport;
  badge?: string;
  duration?: string;
  category?: string;
  rating?: number;
};

export default function SearchOffersPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [activeStep, setActiveStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [results, setResults] = useState<Offer[]>([]);

  const categories = [
    "All Categories",
    "Web Development",
    "SEO Services",
    "E-commerce",
    "Design",
  ];

  const steps = [
    { id: 0, name: "Browse Offers", icon: "🔍" },
    { id: 1, name: "Select Offer", icon: "🛒" },
    { id: 2, name: "Checkout", icon: "💳" },
  ];

  useEffect(() => {
    const offers: Offer[] = [
      {
        id: 1,
        title: "Website Development Package",
        description: "Get a fully responsive website at a discounted price. Includes 5 pages, contact form, SEO basics, and 1 year of hosting.",
        price: "$299",
        originalPrice: "$599",
        discount: "50% OFF",
        features: [
          "5 custom designed pages",
          "Mobile responsive",
          "Contact form",
          "Basic SEO setup",
          "1 year hosting included"
        ],
        image: "/images/offers1.png",
        badge: "Popular",
        duration: "Limited time offer",
        category: "Web Development",
        rating: 4.8
      },
      {
        id: 2,
        title: "SEO Optimization Plan",
        description: "Boost your rankings with our comprehensive SEO package. Includes keyword research, on-page optimization, and monthly reporting.",
        price: "$149",
        originalPrice: "$299",
        discount: "45% OFF",
        features: [
          "Keyword research",
          "On-page optimization",
          "Technical SEO audit",
          "3 backlinks",
          "Monthly performance reports"
        ],
        image: "/images/offers1.png",
        badge: "Best Value",
        duration: "Offer ends soon",
        category: "SEO Services",
        rating: 4.5
      },
      {
        id: 3,
        title: "E-commerce Store Setup",
        description: "Start selling online with our complete e-commerce solution. Includes product setup, payment integration, and mobile optimization.",
        price: "$499",
        originalPrice: "$999",
        discount: "55% OFF",
        features: [
          "Up to 50 products",
          "Secure payment gateway",
          "Mobile optimized",
          "Inventory management",
          "Basic SEO setup"
        ],
        image: "/images/offers1.png",
        badge: "Premium",
        duration: "New customers only",
        category: "E-commerce",
        rating: 4.9
      },
    ];

    let filtered = offers;
    
    // Filter by search query
    if (query) {
      filtered = filtered.filter((offer) =>
        offer.title.toLowerCase().includes(query.toLowerCase()) ||
        offer.description.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory && selectedCategory !== "All Categories") {
      filtered = filtered.filter(offer => offer.category === selectedCategory);
    }

    setResults(filtered);
  }, [query, selectedCategory]);

  return (
    <>
      <Header />
      
      {/* Search Form placed directly under header */}
      <div className="bg-gray-50 py-8 px-4 border-b">
        <div className="max-w-6xl mx-auto">
          <OffersSearchForm />
        </div>
      </div>

      <div className="flex min-h-screen">
        {/* Multi-step Sidebar */}
        <div className="w-64 bg-gray-50 p-6 border-r border-gray-200 hidden md:block">
          <h2 className="text-xl font-bold mb-8">Purchase Steps</h2>
          <nav className="space-y-4">
            {steps.map((step) => (
              <div
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${activeStep === step.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
              >
                <span className="text-xl mr-3">{step.icon}</span>
                <span className="font-medium">{step.name}</span>
                {activeStep === step.id && (
                  <span className="ml-auto h-2 w-2 bg-blue-600 rounded-full"></span>
                )}
              </div>
            ))}
          </nav>

          <div className="mt-12">
            <h3 className="font-bold mb-4">Filter by Category</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category}
                  onClick={() => setSelectedCategory(category === "All Categories" ? null : category)}
                  className={`p-2 rounded-md cursor-pointer ${selectedCategory === category || (category === "All Categories" && !selectedCategory) ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100'}`}
                >
                  {category}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">
                {query ? (
                  <>
                    Search Results for: <span className="text-blue-600">"{query}"</span>
                  </>
                ) : (
                  "Our Premium Offers"
                )}
              </h1>
            </div>

            <div className="space-y-6">
              {results.length > 0 ? (
                results.map((offer) => (
                  <div
                    key={offer.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col md:flex-row"
                  >
                    {/* Offer Image */}
                    <div className="relative w-full md:w-1/3 h-64 md:h-auto">
                      <Image
                        src={offer.image}
                        alt={offer.title}
                        fill
                        className="object-cover"
                        priority
                      />
                      {offer.badge && (
                        <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                          {offer.badge}
                        </div>
                      )}
                    </div>

                    {/* Offer Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h2 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                          {offer.title}
                        </h2>
                        {offer.rating && (
                          <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                            <span className="text-yellow-500 mr-1">★</span>
                            <span className="font-medium">{offer.rating}</span>
                          </div>
                        )}
                      </div>

                      {offer.category && (
                        <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mb-3">
                          {offer.category}
                        </span>
                      )}

                      <p className="text-gray-600 mb-4">{offer.description}</p>

                      {/* Features List */}
                      {offer.features && (
                        <div className="mb-4">
                          <h4 className="font-semibold mb-2">Includes:</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {offer.features?.map((feature, index) => (
                              <div key={index} className="flex items-center">
                                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span className="text-gray-700">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Price and CTA */}
                      <div className="mt-auto pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <span className="text-2xl font-bold text-red-600">{offer.price}</span>
                            {offer.originalPrice && (
                              <span className="ml-2 text-sm text-gray-500 line-through">{offer.originalPrice}</span>
                            )}
                            {offer.discount && (
                              <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                                {offer.discount}
                              </span>
                            )}
                          </div>
                          {offer.duration && (
                            <span className="text-xs text-gray-500">{offer.duration}</span>
                          )}
                        </div>
                        <div className="flex space-x-3">
                          <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all shadow-md hover:shadow-lg">
                            Get This Offer
                          </button>
                          <button className="bg-white border border-gray-300 text-gray-700 font-medium px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium text-gray-600 mb-2">No offers found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <NewsletterSignup /><br /><br />
      <Footer />
    </>
  );
}