import React from "react";
import { CheckCircle, Star } from "lucide-react";

const SupplierShowcase: React.FC = () => {
  const suppliers = [
    {
      id: 1,
      name: "Shenzhen Electronic Co., Ltd",
      image:
        "https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      country: "China",
      mainProducts: "Smartphones, Tablets, Smart Watches, Earbuds",
      responseRate: "98%",
      rating: 4.8,
      years: 7,
      verified: true,
    },
    {
      id: 2,
      name: "Global Textile Industries",
      image:
        "https://images.pexels.com/photos/3850512/pexels-photo-3850512.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      country: "India",
      mainProducts: "Cotton Fabrics, Apparel, Synthetic Textiles",
      responseRate: "95%",
      rating: 4.6,
      years: 12,
      verified: true,
    },
    {
      id: 3,
      name: "Modern Furniture Holdings",
      image:
        "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      country: "Malaysia",
      mainProducts: "Office Furniture, Home Furniture, Outdoor Furniture",
      responseRate: "92%",
      rating: 4.5,
      years: 5,
      verified: false,
    },
  ];

  return (
    <div className="bg-gray-50 py-8">
      <div className="mx-auto px-4 max-w-full xl:max-w-[1280px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl text-slate-800 font-bold">
            Featured
          </h2>
          <a href="#" className="text-red-600 text-sm hover:underline">
            View All
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {suppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="bg-white rounded-lg shadow overflow-hidden border border-gray-200"
            >
              {/* Supplier banner image */}
              <div className="h-36 overflow-hidden relative">
                <img
                  src={supplier.image}
                  alt={supplier.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Supplier information */}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium text-base text-slate-800 hover:text-red-500 transition cursor-pointer">
                    {supplier.name}
                  </h3>
                  {supplier.verified && (
                    <div className="flex items-center bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-sm">
                      <CheckCircle size={12} className="mr-1" />
                      Verified
                    </div>
                  )}
                </div>

                <div className="mt-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <span>{supplier.country}</span>
                    <span className="mx-1.5">•</span>
                    <span>{supplier.years} YRS</span>
                  </div>

                  <div className="mt-1.5">
                    <span className="font-medium text-gray-700">
                      Main products:
                    </span>{" "}
                    {supplier.mainProducts}
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center">
                      <div className="mr-2 flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={
                              i < Math.floor(supplier.rating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                      <span>{supplier.rating}</span>
                    </div>
                    <div>
                      Response:{" "}
                      <span className="text-green-600">
                        {supplier.responseRate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <button className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition">
                    Contact Supplier
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupplierShowcase;
