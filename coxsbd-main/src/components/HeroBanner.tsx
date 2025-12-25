"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

const HeroBanner: React.FC = () => {
  const t = useTranslations("HeroBanner"); // Reference translations under "HeroBanner"

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-full xl:max-w-[1280px]">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Left side with content */}
          <div className="w-full md:w-1/2 space-y-6">
            <div className="inline-block bg-red-50 text-red-700 px-3 py-1 text-sm font-medium rounded-full mb-2">
              {t("label")}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
              {t("title")}
            </h1>

            <p className="text-gray-700 text-base md:text-lg max-w-xl">
              {t("description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="#"
                className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition duration-200 text-center font-medium flex items-center justify-center gap-2 shadow-sm"
              >
                {t("requestQuote")}
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="#"
                className="border border-gray-300 bg-white text-gray-800 px-6 py-3 rounded-md hover:bg-gray-50 transition duration-200 text-center font-medium shadow-sm"
              >
                {t("readyToShip")}
              </Link>
            </div>
          </div>

          {/* Right side with banner image */}
          <div className="w-full md:w-1/2 mt-8 md:mt-0">
            <div className="relative rounded-xl overflow-hidden shadow-lg">
              <Image
                src="https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt={t("title")}
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
