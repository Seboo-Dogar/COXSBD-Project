"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  FaStar,
  FaFilter,
  FaChevronDown,
  FaChevronUp,
  FaSearch,
  FaTimes,
  FaShoppingCart,
  FaRegHeart,
  FaHeart,
  FaEye,
  FaShippingFast,
  FaUndo,
  FaShieldAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import NewsletterSignup from "@/components/Newsletter";
import EcommerceSearchInput from "@/components/ecommerce/EcommerceSearchForm";

// Types
interface Product {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  isNew?: boolean;
  isBestSeller?: boolean;
}

// Mock search results data
const searchResults: Product[] = [
  {
    id: 1,
    title: "Smartphone X200",
    price: 499,
    originalPrice: 599,
    image: "/api/placeholder/300/300",
    rating: 4.5,
    reviewCount: 124,
    category: "Electronics",
    isNew: true,
  },
  {
    id: 2,
    title: "Wireless Earbuds",
    price: 89,
    image: "/api/placeholder/300/300",
    rating: 4.2,
    reviewCount: 89,
    category: "Electronics",
    isBestSeller: true,
  },
  {
    id: 3,
    title: "Smart Watch Pro",
    price: 199,
    originalPrice: 249,
    image: "/api/placeholder/300/300",
    rating: 4.7,
    reviewCount: 56,
    category: "Electronics",
  },
  {
    id: 4,
    title: "Running Shoes",
    price: 120,
    image: "/api/placeholder/300/300",
    rating: 4.3,
    reviewCount: 203,
    category: "Sports & Outdoors",
  },
  {
    id: 5,
    title: "Laptop Backpack",
    price: 59,
    image: "/api/placeholder/300/300",
    rating: 4.6,
    reviewCount: 78,
    category: "Fashion",
  },
  {
    id: 6,
    title: "Bluetooth Speaker",
    price: 79,
    originalPrice: 99,
    image: "/api/placeholder/300/300",
    rating: 4.1,
    reviewCount: 45,
    category: "Electronics",
  },
  {
    id: 7,
    title: "Fitness Tracker",
    price: 69,
    image: "/api/placeholder/300/300",
    rating: 4.4,
    reviewCount: 132,
    category: "Health & Wellness",
  },
  {
    id: 8,
    title: "Gaming Headset",
    price: 129,
    image: "/api/placeholder/300/300",
    rating: 4.8,
    reviewCount: 97,
    category: "Electronics",
    isNew: true,
  },
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const [results, setResults] = useState<Product[]>([]);
  const [filteredResults, setFilteredResults] = useState<Product[]>([]);
  const [sortOption, setSortOption] = useState("relevance");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Simulate search based on query
  useEffect(() => {
    // In a real app, this would be an API call
    const filtered = searchResults.filter(
      (product) =>
        product.title.toLowerCase().includes(query?.toLowerCase() || "") ||
        product.category.toLowerCase().includes(query?.toLowerCase() || "")
    );
    setResults(filtered);
    setFilteredResults(filtered);
  }, [query]);

  // Apply filters
  useEffect(() => {
    let filtered = [...results];

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    // Price filter
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter((product) => product.rating >= minRating);
    }

    // Sort options
    switch (sortOption) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        // Assuming newer products have higher IDs
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        // Relevance - already sorted by search relevance
        break;
    }

    setFilteredResults(filtered);
    setCurrentPage(1);
  }, [results, sortOption, priceRange, selectedCategories, minRating]);

  // Toggle category selection
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Toggle wishlist
  const toggleWishlist = (productId: number) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter((id) => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  // Get unique categories from results
  const categories = Array.from(
    new Set(results.map((product) => product.category))
  );

  // Render star ratings
  const renderRating = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <FaStar
        key={index}
        className={
          index < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
        }
        size={14}
      />
    ));
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResults = filteredResults.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <>
      <Header /><br />
      <EcommerceSearchInput />
      <div className="max-w-8xl mx-auto px-4 py-8 mt-16">
        {/* Search header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">
            Search Results for "{query}"
            <span className="text-gray-600 font-normal ml-2">
              ({filteredResults.length} products)
            </span>
          </h1>

          <div className="flex items-center space-x-4">
            <button
              className="flex items-center md:hidden bg-gray-100 px-4 py-2 rounded-md"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter className="mr-2" />
              Filters
              {selectedCategories.length > 0 ||
              minRating > 0 ||
              priceRange[1] < 1000 ? (
                <span className="ml-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {selectedCategories.length +
                    (minRating > 0 ? 1 : 0) +
                    (priceRange[1] < 1000 ? 1 : 0)}
                </span>
              ) : null}
            </button>

            <div className="flex items-center">
              <span className="text-gray-600 mr-2 hidden md:block">
                Sort by:
              </span>
              <select
                className="border rounded-md px-3 py-2"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="relevance">Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters sidebar - hidden on mobile unless toggled */}
          <div
            className={`md:w-1/4 ${showFilters ? "block" : "hidden md:block"}`}
          >
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold">Filters</h2>
                <button
                  className="text-gray-500 md:hidden"
                  onClick={() => setShowFilters(false)}
                >
                  <FaTimes />
                </button>
              </div>

              {/* Price filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Price Range</h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([0, parseInt(e.target.value)])
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between">
                    <span>$0</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Category filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="mr-2"
                      />
                      <label
                        htmlFor={`category-${category}`}
                        className="text-sm"
                      >
                        {category} (
                        {results.filter((p) => p.category === category).length})
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rating filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Customer Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center">
                      <input
                        type="radio"
                        id={`rating-${rating}`}
                        name="rating"
                        checked={minRating === rating}
                        onChange={() =>
                          setMinRating(minRating === rating ? 0 : rating)
                        }
                        className="mr-2"
                      />
                      <label
                        htmlFor={`rating-${rating}`}
                        className="text-sm flex items-center"
                      >
                        {Array.from({ length: 5 }).map((_, index) => (
                          <FaStar
                            key={index}
                            className={
                              index < rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }
                            size={12}
                          />
                        ))}
                        <span className="ml-1">& Up</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
                onClick={() => {
                  setSelectedCategories([]);
                  setPriceRange([0, 1000]);
                  setMinRating(0);
                }}
              >
                Clear All Filters
              </button>
            </div>

            {/* Recently viewed or suggestions could go here */}
          </div>

          {/* Results section */}
          <div className="md:w-3/4">
  {filteredResults.length === 0 ? (
    <div className="bg-white p-8 rounded-lg border text-center">
      <FaSearch className="text-4xl text-gray-400 mx-auto mb-4" />
      <h2 className="text-xl font-bold mb-2">No products found</h2>
      <p className="text-gray-600 mb-4">
        Try adjusting your search or filter criteria
      </p>
      <button
        className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition"
        onClick={() => {
          setSelectedCategories([]);
          setPriceRange([0, 1000]);
          setMinRating(0);
        }}
      >
        Clear All Filters
      </button>
    </div>
  ) : (
    <>
      <div className="space-y-6">
        {paginatedResults.map((product) => (
          <div
            key={product.id}
            className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 relative"
          >
            <div className="flex flex-col md:flex-row">
              {/* Image and badges section */}
              <div className="md:w-1/4 relative">
                <Link href={`/ecommerce/product/${product.id}`}>
                  <div className="relative w-full h-48 md:h-full bg-gray-200 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
                
                {/* Product badges */}
                <div className="absolute top-3 left-3 flex flex-col space-y-2">
                  {product.isNew && (
                    <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                      NEW
                    </div>
                  )}
                  {product.isBestSeller && (
                    <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      BEST SELLER
                    </div>
                  )}
                  {product.originalPrice && (
                    <div className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </div>
                  )}
                </div>

                {/* Wishlist button */}
                <button
                  className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md"
                  onClick={() => toggleWishlist(product.id)}
                >
                  {wishlist.includes(product.id) ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart className="text-gray-600" />
                  )}
                </button>
              </div>

              {/* Product details section */}
              <div className="md:w-3/4 p-4 flex flex-col justify-between">
                <div>
                  <Link href={`/ecommerce/product/${product.id}`}>
                    <h3 className="text-xl font-semibold mb-2 hover:text-red-600 transition">
                      {product.title}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center mb-3">
                    <div className="flex mr-2">
                      {renderRating(product.rating)}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({product.reviewCount} reviews)
                    </span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-sm text-green-600 font-medium">In Stock</span>
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-2">
                    This premium product features high-quality materials and exceptional craftsmanship. 
                    Designed for durability and style, it's the perfect addition to your collection.
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">Free Shipping</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">30-Day Returns</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">2-Year Warranty</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4">
                  <div className="flex items-center mb-3 sm:mb-0">
                    <p className="text-red-600 font-bold text-xl">${product.price}</p>
                    {product.originalPrice && (
                      <p className="text-gray-500 line-through text-sm ml-2">
                        ${product.originalPrice}
                      </p>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                      <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition">
                        -
                      </button>
                      <span className="px-3 py-1">1</span>
                      <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition">
                        +
                      </button>
                    </div>
                    
                    <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition flex items-center justify-center min-w-[120px]">
                      <FaShoppingCart className="mr-2" />
                      Add to Cart
                    </button>
                    
                    <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 transition">
                      <FaEye />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional product details at bottom */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex flex-wrap items-center justify-between text-sm">
                <div className="flex items-center">
                  <FaShippingFast className="text-gray-500 mr-2" />
                  <span>Free delivery on orders over $50</span>
                </div>
                <div className="flex items-center">
                  <FaUndo className="text-gray-500 mr-2" />
                  <span>30-day free returns</span>
                </div>
                <div className="flex items-center">
                  <FaShieldAlt className="text-gray-500 mr-2" />
                  <span>2-year warranty included</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2">
            <button
              className="px-4 py-2 border rounded-md disabled:opacity-50 flex items-center"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FaChevronLeft className="mr-1" size={12} />
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`w-10 h-10 rounded-md ${currentPage === page ? "bg-red-600 text-white" : "border hover:bg-gray-100"}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              className="px-4 py-2 border rounded-md disabled:opacity-50 flex items-center"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <FaChevronRight className="ml-1" size={12} />
            </button>
          </div>
        </div>
      )}
    </>
  )}
</div>
        </div>
      </div>
      <NewsletterSignup /> <br />
      <br />
      <Footer />
    </>
  );
}
