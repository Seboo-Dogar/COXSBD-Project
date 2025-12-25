"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/Newsletter";
import Image from "next/image";
import Link from "next/link";

export default function OfferDetailPage({ params }: { params: { id: string } }) {
  type Offer = {
    id: number;
    title: string;
    bigOfferTitle: string;
    description: string;
    discount: string;
    originalPrice?: string;
    price: string;
    numericPrice: number;
    category: string;
    image: string;
    validUntil: string;
    terms: string[];
    included: string[];
    excluded: string[];
    hotels: number[];
    featured: boolean;
  };

  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  useEffect(() => {
    // Simulate API fetch based on ID
    setTimeout(() => {
      const offers = [
        {
          id: 1,
          title: "Weekend Special",
          bigOfferTitle: "Save 20%",
          description: "Book Friday–Sunday & save 20% on all hotel stays. Perfect for a quick getaway with premium accommodations.",
          discount: "20% OFF",
          originalPrice: "$249/night",
          price: "$199/night",
          numericPrice: 199,
          category: "Weekend Deal",
          image: "/images/offers1.png",
          validUntil: "2024-12-31",
          terms: [
            "Valid for stays between Friday and Sunday only",
            "Minimum 2-night stay required",
            "Subject to availability",
            "Cannot be combined with other offers"
          ],
          included: [
            "Complimentary breakfast",
            "Free WiFi",
            "Resort access",
            "Swimming pool"
          ],
          excluded: [
            "Spa treatments",
            "Airport transfers",
            "Room service (additional charge)"
          ],
          hotels: [1, 2, 3],
          featured: true
        },
        {
          id: 2,
          title: "Long-Distance Discount",
          bigOfferTitle: "15% OFF",
          description: "Stay 5+ nights & enjoy 15% OFF on extended vacations. Perfect for longer getaways and business trips.",
          discount: "15% OFF",
          originalPrice: "$329/night",
          price: "$279/night",
          numericPrice: 279,
          category: "Extended Stay",
          image: "/images/offers1.jpg",
          validUntil: "2024-11-30",
          terms: [
            "Minimum 5-night stay required",
            "Advance booking required (7 days)",
            "Subject to availability",
            "Non-refundable rate"
          ],
          included: [
            "Daily housekeeping",
            "Fitness center access",
            "Business center",
            "Welcome drink"
          ],
          excluded: [
            "Laundry services",
            "Mini-bar items",
            "Parking fees"
          ],
          hotels: [1, 3],
          featured: true
        },
        {
          id: 3,
          title: "First-Time Guest",
          bigOfferTitle: "Free Upgrade",
          description: "First-time customers get a complimentary room upgrade and special welcome amenities upon arrival.",
          discount: "FREE UPGRADE",
          price: "Complimentary",
          numericPrice: 0,
          category: "New Guest",
          image: "/images/offers1.jpg",
          validUntil: "2024-10-31",
          terms: [
            "First-time guests only",
            "Verification required",
            "Subject to availability",
            "Upgrade to next category"
          ],
          included: [
            "Room upgrade",
            "Welcome amenities",
            "Late checkout (upon availability)",
            "Priority check-in"
          ],
          excluded: [
            "Additional nights at upgraded rate",
            "Premium suite upgrades"
          ],
          hotels: [1, 2, 3],
          featured: false
        }
      ];

      const foundOffer = offers.find(o => o.id.toString() === params.id);
      setOffer(foundOffer || null);
      setLoading(false);
    }, 800);
  }, [params.id]);

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-medium text-gray-600">Loading offer details...</p>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-600 mb-2">
          Offer not found
        </h3>
        <p className="text-gray-500">
          The offer you're looking for doesn't exist or has expired
        </p>
        <Link href="/offers" className="text-red-600 hover:text-red-700 mt-4 inline-block">
          ← Back to all offers
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-red-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/offers" className="hover:text-red-600">Special Offers</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{offer.title}</span>
        </nav>

        {/* Offer Header */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          <div className="lg:w-1/2">
            <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden">
              <Image
                src={offer.image}
                alt={offer.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute top-4 left-4 bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-full">
                {offer.discount}
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 rounded-2xl mb-6">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{offer.bigOfferTitle}</h1>
              <h2 className="text-2xl md:text-3xl font-semibold">{offer.title}</h2>
            </div>
            
            <p className="text-gray-700 text-lg mb-6">{offer.description}</p>
            
            <div className="bg-gray-50 p-6 rounded-2xl mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-3xl font-bold text-red-600">{offer.price}</span>
                  {offer.originalPrice && (
                    <span className="ml-3 text-lg text-gray-500 line-through">
                      {offer.originalPrice}
                    </span>
                  )}
                </div>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {offer.category}
                </span>
              </div>
              
              <div className="text-sm text-gray-600 mb-4">
                <p>Valid until: {new Date(offer.validUntil).toLocaleDateString()}</p>
              </div>
              
              <button className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white font-bold py-4 px-6 rounded-xl hover:from-red-700 hover:to-red-900 transition-all shadow-lg hover:shadow-xl">
                Claim This Offer Now
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                Limited availability
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></span>
                {offer.featured ? "Featured offer" : "Special promotion"}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("details")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "details"
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Offer Details
            </button>
            <button
              onClick={() => setActiveTab("terms")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "terms"
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Terms & Conditions
            </button>
            <button
              onClick={() => setActiveTab("hotels")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "hotels"
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Participating Hotels
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "details" && (
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div>
              <h3 className="text-2xl font-bold mb-6">What's Included</h3>
              <div className="space-y-3">
                {offer.included.map((item, index) => (
                  <div key={index} className="flex items-center p-4 bg-green-50 rounded-lg">
                    <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center mr-3 flex-shrink-0">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-6">Not Included</h3>
              <div className="space-y-3">
                {offer.excluded.map((item, index) => (
                  <div key={index} className="flex items-center p-4 bg-gray-100 rounded-lg">
                    <span className="w-6 h-6 bg-gray-500 text-white rounded-full flex items-center justify-center mr-3 flex-shrink-0">×</span>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "terms" && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-6">Terms & Conditions</h3>
            <div className="bg-gray-50 p-6 rounded-2xl">
              <ul className="space-y-3">
                {offer.terms.map((term, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700">{term}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-8 p-6 bg-blue-50 rounded-2xl">
              <h4 className="font-bold text-lg mb-3">Important Notes</h4>
              <p className="text-gray-700">
                This offer is subject to availability and may be withdrawn at any time without notice. 
                Blackout dates may apply during peak seasons and holidays. Please contact our customer 
                service team for specific questions about this promotion.
              </p>
            </div>
          </div>
        )}

        {activeTab === "hotels" && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-6">Participating Hotels</h3>
            <p className="text-gray-600 mb-8">
              This offer is available at the following premium hotels. Click to view details and book your stay.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  id: 1,
                  name: "Grand Plaza Hotel",
                  location: "New York City",
                  rating: 4.9,
                  price: "$199/night",
                  image: "/images/hotel1.jpg"
                },
                {
                  id: 2,
                  name: "Beachside Resort",
                  location: "Miami Beach",
                  rating: 4.7,
                  price: "$279/night",
                  image: "/images/hotel2.jpg"
                },
                {
                  id: 3,
                  name: "Mountain View Lodge",
                  location: "Aspen, Colorado",
                  rating: 4.8,
                  price: "$159/night",
                  image: "/images/hotel3.jpg"
                }
              ].filter(hotel => offer.hotels.includes(hotel.id))
              .map(hotel => (
                <Link key={hotel.id} href={`/hotels/${hotel.id}`}>
                  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                    <div className="relative h-48">
                      <Image
                        src={hotel.image}
                        alt={hotel.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-lg mb-1">{hotel.name}</h4>
                      <p className="text-gray-600 text-sm mb-2">{hotel.location}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-yellow-500 mr-1">★</span>
                          <span className="font-medium">{hotel.rating}</span>
                        </div>
                        <span className="text-red-600 font-bold">{hotel.price}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

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
                  question: "How do I redeem this offer?",
                  answer: "Simply click the 'Claim This Offer' button and complete your booking. The discount will be automatically applied to your reservation."
                },
                {
                  question: "Can I combine this offer with other promotions?",
                  answer: "This offer cannot be combined with other discounts or promotions unless specifically stated in the terms and conditions."
                },
                {
                  question: "What if I need to cancel my booking?",
                  answer: "Cancellation policies vary by hotel. Please refer to the specific terms of your selected property. Some offers may have special cancellation conditions."
                },
                {
                  question: "Is this offer available for all room types?",
                  answer: "The offer may be limited to specific room categories. Availability is subject to the participating hotels' inventory at the time of booking."
                }
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

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl p-8 md:p-12 text-center text-white mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Experience This Offer?</h2>
          <p className="text-red-100 mb-8 max-w-2xl mx-auto">
            Don't miss out on this exclusive deal. Book now and enjoy premium accommodations at special rates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-red-600 font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-all shadow-lg">
              Claim Offer Now
            </button>
            <button className="border-2 border-white text-white font-bold py-4 px-8 rounded-xl hover:bg-white hover:text-red-600 transition-all">
              Contact Support
            </button>
          </div>
          <p className="text-red-100 text-sm mt-6">
            Offer expires: {new Date(offer.validUntil).toLocaleDateString()}
          </p>
        </section>

        <NewsletterSignup />
      </main>

      <Footer />
    </div>
  );
}