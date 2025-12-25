import React, { useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import ProductPrice from "./ProductPrice"; // import ProductPrice

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    image: string;
    priceUSD: number;
    minOrder: string;
    supplier: {
      name: string;
      country: string;
      years: number;
      verified: boolean;
    };
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? "scale-105" : "scale-100"}`}
        />

        {/* Hover actions */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center space-x-3 transition-opacity duration-200 ${isHovered ? "opacity-100" : "opacity-0"}`}
        >
          <button className="bg-white p-2 rounded-full hover:bg-gray-100 transition">
            <Heart size={18} className="text-gray-700" />
          </button>
          <button className="bg-white p-2 rounded-full hover:bg-gray-100 transition">
            <ShoppingCart size={18} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Product info */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-sm font-medium text-gray-800 hover:text-red-600 transition line-clamp-2 mb-1">
            {product.name}
          </h3>
          <div className="flex items-baseline mb-1">
            <ProductPrice priceUSD={product.priceUSD} />
            <span className="text-gray-600 text-xs ml-1">/ piece</span>
          </div>
          <div className="text-xs text-gray-500">
            {product.minOrder} min. order
          </div>
        </div>

        {/* Supplier info */}
        <div className="pt-3 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-xs">
              <div className="font-medium mb-1">{product.supplier.name}</div>
              <div className="text-gray-500 flex items-center">
                <span>{product.supplier.country}</span>
                <span className="mx-1">•</span>
                <span>{product.supplier.years} YRS</span>
              </div>
            </div>
            {product.supplier.verified && (
              <div className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-sm">
                Verified
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
