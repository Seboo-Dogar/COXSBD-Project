"use client";

import Image from "next/image";
import { FaTimes, FaShoppingCart } from "react-icons/fa";
import { useCart } from "@/context/cartContext";
import { useCurrency } from "@/context/currencyContext";
import type { Product } from "@/types/products";

export default function QuickViewModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-bold">Quick View</h3>
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
            <FaTimes className="text-xl" />
          </button>
        </div>

        <div className="p-6 md:flex">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <div className="relative h-64 md:h-80 bg-gray-200 rounded-lg overflow-hidden">
              <Image src={product.image} alt={product.title} fill className="object-cover" />
            </div>
          </div>

          <div className="md:w-1/2 md:pl-6">
            <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
            <div className="mb-4">
              <span className="text-2xl font-bold text-red-600">{formatPrice(product.priceUSD)}</span>
              {product.originalPriceUSD && (
                <span className="text-gray-500 line-through ml-2">{formatPrice(product.originalPriceUSD)}</span>
              )}
            </div>

            <p className="text-gray-700 mb-6">
              {product.description ?? "High-quality product with excellent reviews."}
            </p>

            <div className="flex space-x-4">
              <button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-md transition flex items-center justify-center"
                onClick={() => {
                  addToCart({ id: product.id, title: product.title, priceUSD: product.priceUSD, image: product.image });
                  onClose();
                }}
              >
                <FaShoppingCart className="mr-2" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
