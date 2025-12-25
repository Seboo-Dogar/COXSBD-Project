import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BusSearchClient from "@/components/bus/BusSearchClient";
import { BusTrip } from "@/lib/bus-utils";

async function fetchTrips(): Promise<BusTrip[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL is not defined");

    const res = await fetch(`${apiUrl}/bus-trips`, { // Change to your endpoint
      cache: "no-store", 
    });

    if (!res.ok) throw new Error("Failed to fetch bus trips");
    return await res.json();
  } catch (error) {
    console.error("Error fetching bus trips:", error);
    return []; 
  }
}

export default async function BusSearchPage() {
  const initialTrips = await fetchTrips();

  if (initialTrips.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <h3 className="text-xl font-medium text-gray-600 mb-2">No Service Available</h3>
          <p className="text-gray-500">We couldn't load bus data. Please try again later.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />
      <BusSearchClient initialTrips={initialTrips} />
      <Footer />
    </div>
  );
}