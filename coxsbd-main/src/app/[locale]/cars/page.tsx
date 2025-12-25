// cars/page.tsx

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/Newsletter";
import Image from "next/image";
import Link from "next/link";
import CarListingsClient from "@/components/car/CarListingsClient"; // Client Component for listings
import FAQClientWrapper from "@/components/car/FAQClientWrapper"; // <-- New Import
import { Car } from "@/types/Car"; // Import Car type

// Define the FAQs array outside the component logic
const faqs = [
  {
    question: "Do I need a credit card to rent a car?",
    answer:
      "Yes, a valid credit or debit card is required to book a car. The card must be in the renter's name and will be used for the security deposit.",
  },
  // ... other FAQs ...
  {
    question: "Can I modify or cancel my reservation?",
    answer:
      "Yes, you can modify or cancel your reservation free of charge up to 24 hours before your scheduled pickup time. Cancellations within 24 hours may incur a small fee.",
  },
];

// 1. Data Fetching (Server Component) - UNCHANGED
const fetchCars = async (): Promise<Car[]> => {
  // ... (existing fetchCars logic remains the same) ...
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL is not defined");

    const res = await fetch(`${apiUrl}/cars`, {
      cache: "no-store", 
    });

    if (!res.ok) {
      console.error(`API response status: ${res.status}`);
      throw new Error("Failed to fetch cars from API");
    }

    const data: Car[] = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching cars:", error);
    return []; 
  }
};

export default async function CarPage() {
  const initialCars = await fetchCars();
  
  if (initialCars.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-600 mb-2">
          Service Unavailable
        </h3>
        <p className="text-gray-500">
          We could not load car data at this time. Please try again later.
        </p>
      </div>
    );
  }
  
  // NOTE: The inline FAQClientWrapper component definition has been removed!

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section - UNCHANGED */}
        <div className="flex flex-col items-center justify-center text-center mb-6 sm:mb-8 md:mb-10">
          {/* ... existing Hero content ... */}
        </div>

        {/* 2. Car Listings (Interactive Client Component) - UNCHANGED */}
        <CarListingsClient initialCars={initialCars} />
        
        {/* Special Offers Section - UNCHANGED */}
        <section className="my-20 relative">
          {/* ... existing Offers content ... */}
        </section>

        {/* How It Works Section - UNCHANGED */}
        <section className="py-16 bg-sky-50 rounded-2xl mb-16">
          {/* ... existing How It Works content ... */}
        </section>

        {/* Testimonials Section - UNCHANGED */}
        <section className="py-16 mb-16">
          {/* ... existing Testimonials content ... */}
        </section>

        {/* Top Destinations Section - UNCHANGED */}
        <section className="py-16 bg-gray-50 rounded-2xl mb-16">
          {/* ... existing Destinations content ... */}
        </section>

        {/* Why Choose Us Section - UNCHANGED */}
        <section className="py-20 relative bg-gray-50 overflow-hidden">
          {/* ... existing Why Choose Us content ... */}
        </section>

        {/* FAQ Section (Now uses the imported Client Component) */}
        <section className="py-16 bg-gray-50 rounded-2xl mb-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 relative">
              Frequently Asked Questions
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-red-600 rounded-full"></span>
            </h2>
            {/* 💥 Uses the imported Client Component */}
            <FAQClientWrapper faqs={faqs} />
          </div>
        </section>

        <NewsletterSignup />
      </main>

      <Footer />
    </div>
  );
}