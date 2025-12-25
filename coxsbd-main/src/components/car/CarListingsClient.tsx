// src/components/car/CarListingsClient.tsx
"use client";

import React, { useState, useMemo } from "react";
import { Car } from "@/types/Car";
import Image from "next/image";
import Link from "next/link";
import { FaRegStar } from "react-icons/fa"; // Imported only for placeholder in original code, but we will use the RatingStars component.
import RatingStars from "../common/RatingStars";
import CarDetailModal from "./CarDetailModal";
import CarSearchForm from "@/components/car/CarSearchForm"; // Assuming this handles the search input

interface CarListingsClientProps {
  initialCars: Car[];
}

export default function CarListingsClient({ initialCars }: CarListingsClientProps) {
  const [cars] = useState<Car[]>(initialCars);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Assuming CarSearchForm handles the main search/filters externally or needs integration
  const [filteredCategory, setFilteredCategory] = useState<string>("All");

  const viewCarDetails = (car: Car) => {
    setSelectedCar(car);
    setShowDetailModal(true);
  };

  const closeModal = () => {
    setShowDetailModal(false);
    setSelectedCar(null);
  };
  
  // Use useMemo for efficient filtering based on search/category
  const filteredCars = useMemo(() => {
    return cars
      .filter((car) =>
        filteredCategory === "All" ? true : car.category === filteredCategory
      )
      .filter((car) =>
        car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.model.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [cars, filteredCategory, searchQuery]);

  // Note: The original code handled loading/no results logic in CarPage.tsx, 
  // but since data is fetched upstream, we handle 'no filtered results' here.

  if (filteredCars.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-600 mb-2">
          No cars match your criteria
        </h3>
        <p className="text-gray-500">
          Try adjusting your search criteria or checking a different category.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Search Form (Could integrate search/filter state here later) */}
      <div className="mb-12">
        {/* Placeholder for CarSearchForm integration. 
            For now, we assume CarSearchForm is a static component 
            or manages its own state for initial search fields. 
            If you want live filtering, you would pass setSearchQuery and setFilteredCategory here.
        */}
        <CarSearchForm />
      </div>

      {/* Featured Cars Section */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
              Featured Cars
            </h2>
            <p className="text-gray-600">
              Top-rated vehicles with special deals ({filteredCars.length} results)
            </p>
          </div>
          <button className="text-white bg-red-600 hover:bg-red-700 transition-colors rounded-xl px-4 py-2 font-medium">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group border border-gray-100"
            >
              {/* Image with badge */}
              <Link href={`/cars/${car.id}`} className="block">
                <div className="relative h-56 w-full cursor-pointer group">
                  <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 2xl:h-96">
                    <Image
                      // IMPORTANT FIX: Use car.img, not the hardcoded path!
                      src={car.img || "/images/car.png"} 
                      alt={car.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority
                    />
                  </div>

                  {car.discount && (
                    <div className="absolute top-4 right-4 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {car.discount}
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white text-sm font-medium px-2 py-1 rounded">
                    {car.category}
                  </div>
                </div>
              </Link>

              {/* Car details */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold">
                      {car.name} {car.model}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {car.year} • {car.transmission} • {car.seats} Seats
                    </p>
                  </div>
                  <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                    <RatingStars rating={car.rating} size="sm" />
                    <span className="font-medium ml-1">{car.rating}</span>
                    <span className="text-xs text-gray-500 ml-1">
                      ({car.reviews})
                    </span>
                  </div>
                </div>

                {/* Features chips */}
                <div className="flex flex-wrap gap-2 my-4">
                  {car.features.slice(0, 3).map((feature, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                    >
                      {feature}
                    </span>
                  ))}
                  {car.features.length > 3 && (
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded cursor-pointer" onClick={() => viewCarDetails(car)}>
                      +{car.features.length - 3} more
                    </span>
                  )}
                </div>

                {/* Price and CTA */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-2xl font-bold text-red-600">
                        {car.price}
                      </span>
                      {car.originalPrice && (
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          {car.originalPrice}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {car.fuelType}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => viewCarDetails(car)}
                      className="flex-1 border border-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition text-center"
                    >
                      Details
                    </button>

                    <Link 
                      href={`/cars/${car.id}`}
                      className="flex-1 bg-gradient-to-r from-red-600 to-red-800 text-white font-medium px-4 py-2 rounded-lg hover:from-red-700 hover:to-red-900 transition-all shadow-md hover:shadow-lg text-center"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Car Detail Modal */}
      {showDetailModal && selectedCar && (
        <CarDetailModal car={selectedCar} onClose={closeModal} />
      )}
    </>
  );
}