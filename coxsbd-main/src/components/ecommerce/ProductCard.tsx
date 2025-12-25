"use client";

import Image from "next/image";
import Link from "next/link";
import { FaShoppingCart, FaEye, FaHeart, FaRegHeart } from "react-icons/fa";
import { useCart } from "@/context/cartContext";
import { Product } from "@/types/products";

interface Props {
  product: Product;
  wishlist?: number[];
  toggleWishlist?: (id: number) => void;
  openQuickView?: (product: Product) => void;
}

export default function ProductCard({
  product,
  wishlist = [],
  toggleWishlist,
  openQuickView,
}: Props) {
  const { addToCart } = useCart();

  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative">
      {/* Badges */}
      {product.isNew && (
        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
          NEW
        </div>
      )}
      {product.isBestSeller && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
          BEST SELLER
        </div>
      )}

      {/* Wishlist button */}
      {toggleWishlist && (
        <button
          className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md"
          onClick={() => toggleWishlist(product.id)}
        >
          {wishlist.includes(product.id) ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaRegHeart className="text-gray-600" />
          )}
        </button>
      )}

      {/* Product image */}
      <Link href={`/ecommerce/product/${product.id}`}>
        <div className="relative w-full h-48 bg-gray-200 rounded-md overflow-hidden mb-3">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover"
          />
        </div>
      </Link>

      {/* Product title */}
      <Link href={`/ecommerce/product/${product.id}`}>
        <h3 className="text-lg font-medium mb-1 hover:text-red-600 transition">
          {product.title}
        </h3>
      </Link>

      {/* Price */}
      <div className="flex items-center mb-3">
        <p className="text-red-600 font-bold text-lg">${product.price}</p>
        {product.originalPrice && (
          <p className="text-gray-500 line-through text-sm ml-2">
            ${product.originalPrice}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button
          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition flex items-center justify-center"
          onClick={() => addToCart(product)}
        >
          <FaShoppingCart className="mr-2" />
          Add to Cart
        </button>
        {openQuickView && (
          <button
            className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
            onClick={() => openQuickView(product)}
          >
            <FaEye />
          </button>
        )}
      </div>
    </div>
  );
}
