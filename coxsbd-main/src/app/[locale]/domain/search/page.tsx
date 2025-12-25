"use client";

import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import DomainSearchForm from "@/components/domain/DomainSearchForm";
import NewsletterSignup from "@/components/Newsletter";

type DomainResult = {
  domain: string;
  available: boolean;
};

export default function DomainSearchResultsPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "";
  const ext = searchParams.get("ext") || "com";

  const [results, setResults] = useState<DomainResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate domain availability check (replace with real API call)
    setLoading(true);
    setTimeout(() => {
      // Just a mock result logic for demonstration
      const simulatedResults: DomainResult[] = [
        { domain: `${name}.${ext}`, available: Math.random() > 0.5 },
        { domain: `${name}online.${ext}`, available: Math.random() > 0.5 },
        { domain: `${name}shop.${ext}`, available: Math.random() > 0.5 },
      ];
      setResults(simulatedResults);
      setLoading(false);
    }, 1000);
  }, [name, ext]);

  return (
    <>
      <Header /><br />
      <DomainSearchForm />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 text-center opacity-80">
          Domain Search Results for{" "}
          <span className="text-red-600">
            {name}.{ext}
          </span>
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Check availability of domains related to your search.
        </p>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map(({ domain, available }) => (
              <div
                key={domain}
                className={`p-4 rounded-md shadow-md flex justify-between items-center ${
                  available ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <span className="font-medium">{domain}</span>
                <span
                  className={`font-semibold ${
                    available ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {available ? "Available" : "Unavailable"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      <NewsletterSignup /><br /><br />
      <Footer />
    </>
  );
}
