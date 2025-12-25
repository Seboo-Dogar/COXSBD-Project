"use client";

import CategoryBanner from "@/components/CategoryBanner";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import RequestQuotation from "@/components/RequestQuotation";
import HomePage from "@/components/sections/mobile";
import SupplierShowcase from "@/components/SupplierShowcase";
import TrustBadges from "@/components/TrustBadges";

export default function Home() {
  return (
    <>
      <div className="min-h-screen bg-gray-100 hidden lg:block">
        <Header />
        <main>
          <HeroBanner />
          <CategoryBanner />
          <TrustBadges />
          <SupplierShowcase />
          <RequestQuotation />
        </main>
        <Footer />
      </div>
      <HomePage />
    </>
  );
}
