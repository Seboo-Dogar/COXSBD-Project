import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { ListCategory } from "@/utils/data";

const CategoryBanner: React.FC = () => {
  const categories = [
    {
      name: "Electronics",
      image:
        "https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      name: "Apparel & Textiles",
      image:
        "https://images.pexels.com/photos/325876/pexels-photo-325876.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      name: "Home & Garden",
      image:
        "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      name: "Beauty & Personal Care",
      image:
        "https://images.pexels.com/photos/3373739/pexels-photo-3373739.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      name: "Industrial Machinery",
      image:
        "https://images.pexels.com/photos/2760243/pexels-photo-2760243.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      name: "Vehicles & Parts",
      image:
        "https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
  ];

  const renderCategoryGrid = (title: string) => (
    <div className="container mx-auto px-4 pt-10 first:pt-8 max-w-full xl:max-w-[1280px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800">
          {title}
        </h2>
        <Link
          href="#"
          className="text-sm font-medium text-red-600 hover:text-red-700 transition duration-200"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
        {categories.map((category, index) => (
          <Link key={index} href="#" className="group">
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-200 h-full">
              <div className="h-36 overflow-hidden relative">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  width={300}
                  height={200}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-3 text-center">
                <h3 className="text-sm font-medium text-slate-700 group-hover:text-red-600 transition duration-200">
                  {category.name}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50 py-8 md:py-12">
      {renderCategoryGrid("Offers")}
      {renderCategoryGrid("Cars")}

      {ListCategory.map((category, index) => (
        <div key={`category-${index}-${category}`}>
          {renderCategoryGrid(category)}
        </div>
      ))}
    </div>
  );
};

export default CategoryBanner;
