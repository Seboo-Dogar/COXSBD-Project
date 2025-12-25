// app/ecommerce/product/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  FaStar,
  FaShoppingCart,
  FaHeart,
  FaRegHeart,
  FaShare,
  FaTruck,
  FaUndo,
  FaShieldAlt,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaMinus,
  FaPlus,
} from "react-icons/fa";

// Mock product data - in a real app, this would come from an API
const productData = {
  id: 1,
  name: "Smartphone Pro X",
  price: 899,
  originalPrice: 999,
  images: [
    "/api/placeholder/600/600",
    "/api/placeholder/600/600",
    "/api/placeholder/600/600",
    "/api/placeholder/600/600",
  ],
  category: "Electronics",
  rating: 4.7,
  reviewCount: 124,
  description:
    "The latest flagship smartphone with cutting-edge technology, featuring an advanced camera system, powerful processor, and all-day battery life.",
  specifications: {
    display: "6.7-inch Super Retina XDR",
    processor: "A15 Bionic chip",
    storage: "128GB, 256GB, 512GB",
    camera: "Triple 12MP camera system",
    battery: "Up to 28 hours video playback",
    os: "iOS 15",
  },
  colors: ["Space Gray", "Silver", "Gold", "Blue"],
  sizes: ["128GB", "256GB", "512GB"],
  inStock: true,
  isNew: true,
  isBestSeller: true,
  sku: "SPX-2023-001",
  tags: ["Smartphone", "Electronics", "Mobile", "5G"],
  shipping: {
    free: true,
    delivery: "2-4 business days",
    returns: "30-day return policy",
  },
};

const relatedProducts = [
  {
    id: 2,
    name: "Gaming Laptop",
    price: 1499,
    image: "/api/placeholder/300/300",
    category: "Electronics",
  },
  {
    id: 3,
    name: "Noise Cancelling Headphones",
    price: 299,
    image: "/api/placeholder/300/300",
    category: "Electronics",
  },
  {
    id: 4,
    name: "4K Smart TV",
    price: 799,
    image: "/api/placeholder/300/300",
    category: "Electronics",
  },
  {
    id: 5,
    name: "Smartwatch Series 7",
    price: 199,
    image: "/api/placeholder/300/300",
    category: "Electronics",
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id;

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [product, setProduct] = useState(productData);
  const [loading, setLoading] = useState(true);

  // In a real app, you would fetch product data based on the ID
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProduct(productData);
      setSelectedColor(productData.colors[0]);
      setSelectedSize(productData.sizes[0]);
      setLoading(false);
    }, 500);
  }, [productId]);

  const handleQuantityChange = (action: "increase" | "decrease") => {
    if (action === "increase") {
      setQuantity(quantity + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const toggleWishlist = () => {
    setIsInWishlist(!isInWishlist);
  };

  const renderRating = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <FaStar
        key={index}
        className={
          index < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
        }
      />
    ));
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8 mt-16">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2 h-96 bg-gray-200 rounded"></div>
              <div className="md:w-1/2 space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-12 bg-gray-200 rounded w-full mt-8"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8 mt-16">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <Link href="/" className="hover:text-red-600">
                Home
              </Link>
              <FaChevronRight className="mx-2 text-gray-400" size={10} />
            </li>
            <li className="flex items-center">
              <Link href="/ecommerce" className="hover:text-red-600">
                Ecommerce
              </Link>
              <FaChevronRight className="mx-2 text-gray-400" size={10} />
            </li>
            <li className="flex items-center">
              <Link
                href={`/ecommerce/category/${product.category.toLowerCase()}`}
                className="hover:text-red-600"
              >
                {product.category}
              </Link>
              <FaChevronRight className="mx-2 text-gray-400" size={10} />
            </li>
            <li className="text-gray-800">{product.name}</li>
          </ol>
        </nav>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Images */}
          <div className="md:w-1/2">
            <div className="relative h-96 mb-4 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-contain"
              />

              {/* Product badges */}
              {product.isNew && (
                <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                  NEW
                </div>
              )}
              {product.isBestSeller && (
                <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  BEST SELLER
                </div>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`h-24 bg-gray-100 rounded-md overflow-hidden border-2 ${selectedImage === index ? "border-red-500" : "border-transparent"}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    width={100}
                    height={100}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

            <div className="flex items-center mb-4">
              <div className="flex mr-2">{renderRating(product.rating)}</div>
              <span className="text-gray-600 text-sm">
                ({product.reviewCount} reviews)
              </span>
              <span className="mx-2 text-gray-300">•</span>
              <span className="text-green-600 text-sm font-medium">
                In Stock
              </span>
            </div>

            <div className="flex items-center mb-6">
              <span className="text-2xl font-bold text-red-600">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-gray-500 line-through text-lg ml-2">
                  ${product.originalPrice}
                </span>
              )}
              {product.originalPrice && (
                <span className="bg-red-100 text-red-600 text-sm font-medium ml-3 px-2 py-1 rounded">
                  Save ${product.originalPrice - product.price}
                </span>
              )}
            </div>

            <p className="text-gray-700 mb-6">{product.description}</p>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">
                  Color: <span className="font-bold">{selectedColor}</span>
                </h3>
                <div className="flex space-x-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      className={`w-10 h-10 rounded-full border-2 ${selectedColor === color ? "border-red-500" : "border-gray-300"}`}
                      style={{
                        backgroundColor:
                          color.toLowerCase() === "space gray"
                            ? "#4C4C4C"
                            : color.toLowerCase() === "silver"
                              ? "#C0C0C0"
                              : color.toLowerCase() === "gold"
                                ? "#FFD700"
                                : color.toLowerCase() === "blue"
                                  ? "#007AFF"
                                  : "#FFF",
                      }}
                      onClick={() => setSelectedColor(color)}
                      aria-label={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">
                  Storage: <span className="font-bold">{selectedSize}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`px-4 py-2 border rounded-md ${selectedSize === size ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Quantity</h3>
              <div className="flex items-center border border-gray-300 rounded-md w-32">
                <button
                  className="px-3 py-2 text-gray-600"
                  onClick={() => handleQuantityChange("decrease")}
                >
                  <FaMinus size={12} />
                </button>
                <span className="flex-1 text-center">{quantity}</span>
                <button
                  className="px-3 py-2 text-gray-600"
                  onClick={() => handleQuantityChange("increase")}
                >
                  <FaPlus size={12} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-md transition flex items-center justify-center">
                <FaShoppingCart className="mr-2" />
                Add to Cart
              </button>
              <button className="flex-1 border border-red-600 text-red-600 hover:bg-red-50 py-3 px-6 rounded-md transition">
                Buy Now
              </button>
              <button
                className="p-3 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                onClick={toggleWishlist}
              >
                {isInWishlist ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart />
                )}
              </button>
              <button className="p-3 border border-gray-300 rounded-md hover:bg-gray-100 transition">
                <FaShare />
              </button>
            </div>

            {/* Shipping Info */}
            <div className="border-t border-b border-gray-200 py-4">
              <div className="flex items-center mb-2">
                <FaTruck className="text-gray-500 mr-2" />
                <span className="text-sm">
                  {product.shipping.free
                    ? "Free Shipping"
                    : "Shipping calculated at checkout"}
                </span>
              </div>
              <div className="flex items-center mb-2">
                <FaUndo className="text-gray-500 mr-2" />
                <span className="text-sm">{product.shipping.returns}</span>
              </div>
              <div className="flex items-center">
                <FaShieldAlt className="text-gray-500 mr-2" />
                <span className="text-sm">2-year warranty included</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-12">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === "description" ? "border-red-500 text-red-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>
              <button
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === "specifications" ? "border-red-500 text-red-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("specifications")}
              >
                Specifications
              </button>
              <button
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === "reviews" ? "border-red-500 text-red-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews ({product.reviewCount})
              </button>
            </nav>
          </div>

          <div className="py-6">
            {activeTab === "description" && (
              <div>
                <p className="text-gray-700 mb-4">{product.description}</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Advanced camera system for stunning photos and videos</li>
                  <li>Powerful processor for seamless performance</li>
                  <li>All-day battery life for uninterrupted usage</li>
                  <li>Beautiful design with premium materials</li>
                </ul>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex">
                    <span className="font-medium text-gray-700 w-32 capitalize">
                      {key}:
                    </span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
                <div className="flex">
                  <span className="font-medium text-gray-700 w-32">SKU:</span>
                  <span className="text-gray-600">{product.sku}</span>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <div className="flex items-center mb-6">
                  <div className="mr-4">
                    <div className="text-4xl font-bold">{product.rating}</div>
                    <div className="flex">{renderRating(product.rating)}</div>
                    <div className="text-sm text-gray-600">
                      {product.reviewCount} reviews
                    </div>
                  </div>
                  <div className="flex-1">
                    {/* Rating breakdown would go here */}
                  </div>
                </div>

                {/* Sample review */}
                <div className="border-b border-gray-200 pb-6 mb-6">
                  <div className="flex items-center mb-2">
                    <div className="flex mr-2">{renderRating(5)}</div>
                    <span className="font-medium">Excellent product!</span>
                  </div>
                  <p className="text-gray-700 mb-2">
                    This is the best smartphone I've ever owned. The camera
                    quality is outstanding and the battery lasts all day.
                  </p>
                  <div className="text-sm text-gray-500">
                    By John D. • October 15, 2023
                  </div>
                </div>

                <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-md transition">
                  Write a Review
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">You may also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg p-4 hover:shadow-lg transition"
              >
                <Link href={`/ecommerce/product/${product.id}`}>
                  <div className="relative w-full h-48 bg-gray-200 rounded-md overflow-hidden mb-3">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-medium mb-1">{product.name}</h3>
                </Link>
                <p className="text-red-600 font-bold">${product.price}</p>
                <button className="mt-3 w-full bg-gray-100 text-gray-800 py-2 rounded-md hover:bg-gray-200 transition">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
