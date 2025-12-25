"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Props {
  heroImages?: string[];
}

export default function HeroCarousel({ heroImages = [] }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Example images if none passed
  const slides = heroImages.length
    ? heroImages
    : ["/api/placeholder/1200/400", "/api/placeholder/1200/400"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative h-64 md:h-96 w-full overflow-hidden mt-16">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((image, index) => (
          <div key={index} className="w-full flex-shrink-0">
            <div className="relative w-full h-64 md:h-96">
              <Image src={image} alt={`Hero ${index}`} fill className="object-cover" />
            </div>
          </div>
        ))}
      </div>

      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full"
        onClick={() =>
          setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1)
        }
      >
        <FaChevronLeft className="text-gray-800" />
      </button>
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full"
        onClick={() =>
          setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1)
        }
      >
        <FaChevronRight className="text-gray-800" />
      </button>
    </div>
  );
}
