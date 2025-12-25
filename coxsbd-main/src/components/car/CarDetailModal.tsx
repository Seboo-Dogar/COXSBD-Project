// src/components/car/CarDetailModal.tsx
"use client";

import React from "react";
import { Car } from "@/types/Car";
import Image from "next/image";
import Link from "next/link";
import RatingStars from "../common/RatingStars";

interface CarDetailModalProps {
  car: Car;
  onClose: () => void;
}

export default function CarDetailModal({ car, onClose }: CarDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {car.name} {car.model}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="md:w-1/2">
              <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
                <Image
                  src={car.img}
                  alt={`${car.name} ${car.model}`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <div className="md:w-1/2">
              {/* Rating and Category */}
              <div className="flex items-center mb-4">
                <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                  <RatingStars rating={car.rating} size="sm" />
                  <span className="font-medium ml-1">{car.rating}</span>
                  <span className="text-xs text-gray-500 ml-1">
                    ({car.reviews} reviews)
                  </span>
                </div>
                <span className="ml-3 bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                  {car.category}
                </span>
              </div>

              {/* Specs */}
              <p className="text-gray-700 mb-4 font-medium">
                <span className="text-red-600 mr-2">Year:</span> {car.year} | 
                <span className="text-red-600 mx-2">Trans:</span> {car.transmission} | 
                <span className="text-red-600 mx-2">Seats:</span> {car.seats} | 
                <span className="text-red-600 mx-2">Fuel:</span> {car.fuelType}
              </p>

              {/* Price Block */}
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-3xl font-bold text-red-600">
                      {car.price}
                    </p>
                    {car.originalPrice && (
                      <p className="text-gray-500 line-through text-sm">
                        {car.originalPrice}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 mt-1">
                      Including taxes and fees
                    </p>
                  </div>
                  {car.discount && (
                    <div className="bg-green-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                      {car.discount}
                    </div>
                  )}
                </div>
              </div>

              {/* Features List */}
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Key Features</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {car.features.map((feature, index) => (
                  <li key={index} className="text-sm">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link href={`/cars/${car.id}`} onClick={onClose}>
                <button className="w-full bg-red-600 text-white font-medium px-4 py-3 rounded-lg hover:bg-red-700 transition-all shadow-md text-lg">
                  Proceed to Booking
                </button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}