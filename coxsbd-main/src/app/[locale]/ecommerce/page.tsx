"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/Newsletter";
import HeroCarousel from "@/components/ecommerce/HeroCarousel";
import CategoryMenu from "@/components/ecommerce/CategoryMenu";
import ProductGrid from "@/components/ecommerce/ProductGrid";
import QuickViewModal from "@/components/ecommerce/QuickViewModal";
import SpecialOffers from "@/components/ecommerce/SpecialOffers";
import ValuePropositions from "@/components/ecommerce/ValuePropositions";
import EcommerceSearchInput from "@/components/ecommerce/EcommerceSearchForm";
import { categories, featuredProducts } from "./data";
import { useState } from "react";
import type { Product } from "@/types/products";

export default function EcommerceHome() {
  const [quickView, setQuickView] = useState<Product | null>(null);

  return (
    <div>
      <Header />
      <HeroCarousel
        heroImages={[
          "/images/hero1.png",
          "/images/hero2.jpg",
          "/images/hero3.jpg",
        ]}
      />
      
      {/* images={["/api/placeholder/1200/400", "/api/placeholder/1200/400"]} */}

      <div className="pt-8 pb-4">
        <EcommerceSearchInput />
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center">
        E-Commerce <span className="text-red-600">Marketplace</span>
      </h1>

      <CategoryMenu categories={categories} />

      <ValuePropositions />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <span className="text-gray-600">
            {featuredProducts.length} products
          </span>
        </div>

        <ProductGrid
          products={featuredProducts}
          onQuickView={(p) => setQuickView(p)}
        />
      </div>

      <SpecialOffers />
      <NewsletterSignup /><br /><br />
      <Footer />

      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </div>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import EcommerceSearchInput from "@/components/ecommerce/EcommerceSearchForm";
// import Footer from "@/components/Footer";
// import Header from "@/components/Header";
// import NewsletterSignup from "@/components/Newsletter";
// import {
//   FaLaptop,
//   FaTshirt,
//   FaCouch,
//   FaHeartbeat,
//   FaBasketballBall,
//   FaBook,
//   FaPuzzlePiece,
//   FaAppleAlt,
//   FaCar,
//   FaHeartbeat as FaHealth,
//   FaDog,
//   FaGem,
//   FaBaby,
//   FaPenFancy,
//   FaMusic,
//   FaStar,
//   FaRegHeart,
//   FaHeart,
//   FaShoppingCart,
//   FaEye,
//   FaChevronLeft,
//   FaChevronRight,
//   FaTimes,
//   FaCheck,
//   FaShippingFast,
//   FaShieldAlt,
//   FaUndo,
//   FaHeadset,
// } from "react-icons/fa";

// // Types
// interface Product {
//   id: number;
//   title: string;
//   price: number;
//   originalPrice?: number;
//   image: string;
//   rating: number;
//   reviewCount: number;
//   category: string;
//   isNew?: boolean;
//   isBestSeller?: boolean;
// }

// interface CartItem extends Product {
//   quantity: number;
// }

// export default function EcommercePage() {
//   const categories = [
//     { name: "Electronics", icon: FaLaptop, slug: "electronics" },
//     { name: "Fashion", icon: FaTshirt, slug: "fashion" },
//     { name: "Home & Furniture", icon: FaCouch, slug: "home-furniture" },
//     {
//       name: "Beauty & Personal Care",
//       icon: FaHeartbeat,
//       slug: "beauty-personal-care",
//     },
//     {
//       name: "Sports & Outdoors",
//       icon: FaBasketballBall,
//       slug: "sports-outdoors",
//     },
//     { name: "Books & Stationery", icon: FaBook, slug: "books-stationery" },
//     { name: "Toys & Games", icon: FaPuzzlePiece, slug: "toys-games" },
//     { name: "Groceries", icon: FaAppleAlt, slug: "groceries" },
//     { name: "Automotive", icon: FaCar, slug: "automotive" },
//     { name: "Health & Wellness", icon: FaHealth, slug: "health-wellness" },
//     { name: "Pet Supplies", icon: FaDog, slug: "pet-supplies" },
//     { name: "Jewelry & Accessories", icon: FaGem, slug: "jewelry-accessories" },
//     { name: "Baby Products", icon: FaBaby, slug: "baby-products" },
//     { name: "Office Supplies", icon: FaPenFancy, slug: "office-supplies" },
//     { name: "Musical Instruments", icon: FaMusic, slug: "musical-instruments" },
//   ];

//   const featuredProducts: Product[] = [
//     // Electronics
//     {
//       id: 1,
//       title: "Smartphone X200",
//       price: 499,
//       originalPrice: 599,
//       image: "/api/placeholder/300/300",
//       rating: 4.5,
//       reviewCount: 124,
//       category: "Electronics",
//       isNew: true,
//     },
//     {
//       id: 2,
//       title: "Smart Watch Pro",
//       price: 199,
//       image: "/api/placeholder/300/300",
//       rating: 4.3,
//       reviewCount: 203,
//       category: "Electronics",
//       isBestSeller: true,
//     },
//     {
//       id: 3,
//       title: "Wireless Headphones",
//       price: 149,
//       originalPrice: 199,
//       image: "/api/placeholder/300/300",
//       rating: 4.8,
//       reviewCount: 167,
//       category: "Electronics",
//       isNew: true,
//     },
//     {
//       id: 4,
//       title: "Bluetooth Speaker",
//       price: 69,
//       originalPrice: 89,
//       image: "/api/placeholder/300/300",
//       rating: 4.6,
//       reviewCount: 132,
//       category: "Electronics",
//     },

//     // Fashion
//     {
//       id: 5,
//       title: "Leather Handbag",
//       price: 120,
//       originalPrice: 150,
//       image: "/api/placeholder/300/300",
//       rating: 4.7,
//       reviewCount: 56,
//       category: "Fashion",
//     },
//     {
//       id: 6,
//       title: "Casual T-Shirt",
//       price: 25,
//       image: "/api/placeholder/300/300",
//       rating: 4.1,
//       reviewCount: 77,
//       category: "Fashion",
//     },
//     {
//       id: 7,
//       title: "Denim Jacket",
//       price: 89,
//       image: "/api/placeholder/300/300",
//       rating: 4.5,
//       reviewCount: 64,
//       category: "Fashion",
//       isBestSeller: true,
//     },
//     {
//       id: 8,
//       title: "Running Shoes",
//       price: 89,
//       image: "/api/placeholder/300/300",
//       rating: 4.2,
//       reviewCount: 89,
//       category: "Fashion",
//     },

//     // Home & Furniture
//     {
//       id: 9,
//       title: "Coffee Maker",
//       price: 79,
//       image: "/api/placeholder/300/300",
//       rating: 4.1,
//       reviewCount: 72,
//       category: "Home & Furniture",
//     },
//     {
//       id: 10,
//       title: "Modern Sofa",
//       price: 499,
//       image: "/api/placeholder/300/300",
//       rating: 4.6,
//       reviewCount: 52,
//       category: "Home & Furniture",
//       isBestSeller: true,
//     },
//     {
//       id: 11,
//       title: "Wooden Dining Table",
//       price: 350,
//       image: "/api/placeholder/300/300",
//       rating: 4.4,
//       reviewCount: 41,
//       category: "Home & Furniture",
//     },
//     {
//       id: 12,
//       title: "Bedside Lamp",
//       price: 45,
//       image: "/api/placeholder/300/300",
//       rating: 4.7,
//       reviewCount: 23,
//       category: "Home & Furniture",
//     },

//     // Beauty & Personal Care
//     {
//       id: 13,
//       title: "Luxury Perfume",
//       price: 89,
//       image: "/api/placeholder/300/300",
//       rating: 4.9,
//       reviewCount: 301,
//       category: "Beauty & Personal Care",
//       isBestSeller: true,
//     },
//     {
//       id: 14,
//       title: "Skincare Kit",
//       price: 49,
//       image: "/api/placeholder/300/300",
//       rating: 4.3,
//       reviewCount: 144,
//       category: "Beauty & Personal Care",
//     },
//     {
//       id: 15,
//       title: "Hair Dryer Pro",
//       price: 59,
//       image: "/api/placeholder/300/300",
//       rating: 4.5,
//       reviewCount: 67,
//       category: "Beauty & Personal Care",
//     },
//     {
//       id: 16,
//       title: "Makeup Palette",
//       price: 39,
//       image: "/api/placeholder/300/300",
//       rating: 4.6,
//       reviewCount: 212,
//       category: "Beauty & Personal Care",
//     },

//     // Sports & Outdoors
//     {
//       id: 17,
//       title: "Mountain Bike",
//       price: 499,
//       image: "/api/placeholder/300/300",
//       rating: 4.7,
//       reviewCount: 84,
//       category: "Sports & Outdoors",
//       isBestSeller: true,
//     },
//     {
//       id: 18,
//       title: "Camping Tent",
//       price: 120,
//       image: "/api/placeholder/300/300",
//       rating: 4.5,
//       reviewCount: 60,
//       category: "Sports & Outdoors",
//     },
//     {
//       id: 19,
//       title: "Football",
//       price: 25,
//       image: "/api/placeholder/300/300",
//       rating: 4.8,
//       reviewCount: 132,
//       category: "Sports & Outdoors",
//     },
//     {
//       id: 20,
//       title: "Yoga Mat",
//       price: 35,
//       image: "/api/placeholder/300/300",
//       rating: 4.4,
//       reviewCount: 91,
//       category: "Sports & Outdoors",
//     },

//     // Books & Stationery
//     {
//       id: 21,
//       title: "Novel: The Great Adventure",
//       price: 15,
//       image: "/api/placeholder/300/300",
//       rating: 4.7,
//       reviewCount: 132,
//       category: "Books & Stationery",
//     },
//     {
//       id: 22,
//       title: "Notebook Set",
//       price: 12,
//       image: "/api/placeholder/300/300",
//       rating: 4.4,
//       reviewCount: 88,
//       category: "Books & Stationery",
//     },
//     {
//       id: 23,
//       title: "Ballpoint Pen Pack",
//       price: 8,
//       image: "/api/placeholder/300/300",
//       rating: 4.2,
//       reviewCount: 64,
//       category: "Books & Stationery",
//     },
//     {
//       id: 24,
//       title: "Desk Organizer",
//       price: 29,
//       image: "/api/placeholder/300/300",
//       rating: 4.5,
//       reviewCount: 73,
//       category: "Books & Stationery",
//     },

//     // (and repeat for Toys & Games, Groceries, Automotive, Health, Pets, Jewelry, Baby, Office, Music...)
//   ];

//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [wishlist, setWishlist] = useState<number[]>([]);
//   const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
//     null
//   );
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [showCartNotification, setShowCartNotification] = useState(false);
//   const [currentSlide, setCurrentSlide] = useState(0);

//   // Hero carousel images
//   const heroImages = [
//     "/api/placeholder/1200/400",
//     "/api/placeholder/1200/400",
//     "/api/placeholder/1200/400",
//   ];

//   // Add to cart function
//   const addToCart = (product: Product) => {
//     const existingItem = cart.find((item) => item.id === product.id);

//     if (existingItem) {
//       setCart(
//         cart.map((item) =>
//           item.id === product.id
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         )
//       );
//     } else {
//       setCart([...cart, { ...product, quantity: 1 }]);
//     }

//     setShowCartNotification(true);
//     setTimeout(() => setShowCartNotification(false), 3000);
//   };

//   // Toggle wishlist function
//   const toggleWishlist = (productId: number) => {
//     if (wishlist.includes(productId)) {
//       setWishlist(wishlist.filter((id) => id !== productId));
//     } else {
//       setWishlist([...wishlist, productId]);
//     }
//   };

//   // Quick view function
//   const openQuickView = (product: Product) => {
//     setQuickViewProduct(product);
//   };

//   // Filter products by category
//   const filteredProducts =
//     selectedCategory === "All"
//       ? featuredProducts
//       : featuredProducts.filter(
//           (product) => product.category === selectedCategory
//         );

//   // Hero carousel autoplay
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) =>
//         prev === heroImages.length - 1 ? 0 : prev + 1
//       );
//     }, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   // Render star ratings
//   const renderRating = (rating: number) => {
//     return Array.from({ length: 5 }).map((_, index) => (
//       <FaStar
//         key={index}
//         className={
//           index < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
//         }
//       />
//     ));
//   };

//   return (
//     <>
//       <Header cartItems={cart} />

//       {/* Hero Banner Carousel */}
//       <div className="relative h-64 md:h-96 w-full overflow-hidden mt-16">
//         <div
//           className="flex transition-transform duration-700 ease-in-out"
//           style={{ transform: `translateX(-${currentSlide * 100}%)` }}
//         >
//           {heroImages.map((image, index) => (
//             <div key={index} className="w-full flex-shrink-0">
//               <div className="relative w-full h-64 md:h-96">
//                 <Image
//                   src={image}
//                   alt={`Hero Banner ${index + 1}`}
//                   fill
//                   className="object-cover"
//                 />
//                 <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
//                   <div className="text-center text-white px-4">
//                     <h2 className="text-3xl md:text-5xl font-bold mb-4">
//                       Summer Sale
//                     </h2>
//                     <p className="text-xl md:text-2xl mb-6">
//                       Up to 50% off on selected items
//                     </p>
//                     <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300">
//                       Shop Now
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Carousel Controls */}
//         <button
//           className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full"
//           onClick={() =>
//             setCurrentSlide(
//               currentSlide === 0 ? heroImages.length - 1 : currentSlide - 1
//             )
//           }
//         >
//           <FaChevronLeft className="text-gray-800" />
//         </button>
//         <button
//           className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full"
//           onClick={() =>
//             setCurrentSlide(
//               currentSlide === heroImages.length - 1 ? 0 : currentSlide + 1
//             )
//           }
//         >
//           <FaChevronRight className="text-gray-800" />
//         </button>

//         {/* Indicators */}
//         <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
//           {heroImages.map((_, index) => (
//             <button
//               key={index}
//               className={`w-3 h-3 rounded-full ${currentSlide === index ? "bg-white" : "bg-white bg-opacity-50"}`}
//               onClick={() => setCurrentSlide(index)}
//             />
//           ))}
//         </div>
//       </div>

//       <div className="pt-8 pb-4">
//         <EcommerceSearchInput />
//       </div>

//       {/* Title */}
//       <h1 className="text-3xl font-bold mb-6 text-center">
//         E-Commerce <span className="text-red-600">Marketplace</span>
//       </h1>

//       {/* Category menu */}
//       <div className="w-full bg-white border-t border-b border-gray-200 sticky top-16 z-10">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="flex overflow-x-auto justify-start md:justify-center space-x-3 py-3">
//             <button
//               onClick={() => setSelectedCategory("All")}
//               className={`flex flex-col items-center p-3 w-20 flex-shrink-0 border rounded-md transition ${
//                 selectedCategory === "All"
//                   ? "border-red-500 bg-red-50"
//                   : "border-gray-300 hover:shadow-md"
//               }`}
//             >
//               <div className="text-3xl text-sky-600 mb-1">All</div>
//               <span className="text-xs font-medium text-center">All</span>
//             </button>

//             {categories.map(({ name, icon: Icon, slug }) => (
//               <button
//                 key={name}
//                 onClick={() => setSelectedCategory(name)}
//                 className={`flex flex-col items-center p-3 w-20 flex-shrink-0 border rounded-md transition ${
//                   selectedCategory === name
//                     ? "border-red-500 bg-red-50"
//                     : "border-gray-300 hover:shadow-md"
//                 }`}
//               >
//                 <Icon className="text-3xl text-sky-600 mb-1" />
//                 <span className="text-xs font-medium text-center">{name}</span>
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Value Propositions */}
//       <div className="bg-gray-100 py-8">
//         <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
//           <div className="flex flex-col items-center text-center p-4">
//             <FaShippingFast className="text-3xl text-red-600 mb-2" />
//             <h3 className="font-semibold">Free Shipping</h3>
//             <p className="text-sm text-gray-600">On orders over $50</p>
//           </div>
//           <div className="flex flex-col items-center text-center p-4">
//             <FaUndo className="text-3xl text-red-600 mb-2" />
//             <h3 className="font-semibold">Easy Returns</h3>
//             <p className="text-sm text-gray-600">30-day return policy</p>
//           </div>
//           <div className="flex flex-col items-center text-center p-4">
//             <FaShieldAlt className="text-3xl text-red-600 mb-2" />
//             <h3 className="font-semibold">Secure Payment</h3>
//             <p className="text-sm text-gray-600">Safe and encrypted</p>
//           </div>
//           <div className="flex flex-col items-center text-center p-4">
//             <FaHeadset className="text-3xl text-red-600 mb-2" />
//             <h3 className="font-semibold">24/7 Support</h3>
//             <p className="text-sm text-gray-600">Dedicated support</p>
//           </div>
//         </div>
//       </div>

//       {/* Content container with max width */}
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {/* Section title with product count */}
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-3xl font-bold">
//             {selectedCategory === "All"
//               ? "Featured Products"
//               : selectedCategory}
//           </h2>
//           <span className="text-gray-600">
//             {filteredProducts.length} products
//           </span>
//         </div>

//         {/* Products grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {filteredProducts.map((product) => (
//             <div
//               key={product.id}
//               className="border rounded-lg p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative"
//             >
//               {/* Product badges */}
//               {product.isNew && (
//                 <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
//                   NEW
//                 </div>
//               )}
//               {product.isBestSeller && (
//                 <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
//                   BEST SELLER
//                 </div>
//               )}

//               {/* Wishlist button */}
//               <button
//                 className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md"
//                 onClick={() => toggleWishlist(product.id)}
//               >
//                 {wishlist.includes(product.id) ? (
//                   <FaHeart className="text-red-500" />
//                 ) : (
//                   <FaRegHeart className="text-gray-600" />
//                 )}
//               </button>

//               {/* Product image */}
//               <Link href={`/ecommerce/product/${product.id}`}>
//                 <div className="relative w-full h-48 bg-gray-200 rounded-md overflow-hidden mb-3">
//                   <Image
//                     src={product.image}
//                     alt={product.title}
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
//               </Link>

//               {/* Product info */}
//               <Link href={`/ecommerce/product/${product.id}`}>
//                 <h3 className="text-lg font-medium mb-1 hover:text-red-600 transition">
//                   {product.title}
//                 </h3>
//               </Link>

//               {/* Rating */}
//               <div className="flex items-center mb-2">
//                 <div className="flex mr-2">{renderRating(product.rating)}</div>
//                 <span className="text-sm text-gray-600">
//                   ({product.reviewCount})
//                 </span>
//               </div>

//               {/* Price */}
//               <div className="flex items-center mb-3">
//                 <p className="text-red-600 font-bold text-lg">
//                   ${product.price}
//                 </p>
//                 {product.originalPrice && (
//                   <p className="text-gray-500 line-through text-sm ml-2">
//                     ${product.originalPrice}
//                   </p>
//                 )}
//               </div>

//               {/* Action buttons */}
//               <div className="flex space-x-2">
//                 <button
//                   className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition flex items-center justify-center"
//                   onClick={() => addToCart(product)}
//                 >
//                   <FaShoppingCart className="mr-2" />
//                   Add to Cart
//                 </button>
//                 <button
//                   className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
//                   onClick={() => openQuickView(product)}
//                 >
//                   <FaEye />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Special Offers Section */}
//       <div className="bg-gray-100 py-12">
//         <div className="max-w-7xl mx-auto px-4">
//           <h2 className="text-3xl font-bold mb-8 text-center">
//             Special Offers
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="bg-white rounded-lg overflow-hidden shadow-md">
//               <div className="relative h-48">
//                 <Image
//                   src="/api/placeholder/400/300"
//                   alt="Electronics Sale"
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//               <div className="p-4">
//                 <h3 className="text-xl font-bold mb-2">Electronics Sale</h3>
//                 <p className="text-gray-600 mb-4">
//                   Up to 30% off on all electronics
//                 </p>
//                 <button className="text-red-600 font-semibold hover:underline">
//                   Shop Now →
//                 </button>
//               </div>
//             </div>
//             <div className="bg-white rounded-lg overflow-hidden shadow-md">
//               <div className="relative h-48">
//                 <Image
//                   src="/api/placeholder/400/300"
//                   alt="Summer Fashion"
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//               <div className="p-4">
//                 <h3 className="text-xl font-bold mb-2">Summer Fashion</h3>
//                 <p className="text-gray-600 mb-4">
//                   New arrivals with 25% discount
//                 </p>
//                 <button className="text-red-600 font-semibold hover:underline">
//                   Shop Now →
//                 </button>
//               </div>
//             </div>
//             <div className="bg-white rounded-lg overflow-hidden shadow-md">
//               <div className="relative h-48">
//                 <Image
//                   src="/api/placeholder/400/300"
//                   alt="Home Essentials"
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//               <div className="p-4">
//                 <h3 className="text-xl font-bold mb-2">Home Essentials</h3>
//                 <p className="text-gray-600 mb-4">
//                   Buy one get one free on selected items
//                 </p>
//                 <button className="text-red-600 font-semibold hover:underline">
//                   Shop Now →
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <NewsletterSignup />
//       <br />
//       <br />
//       <Footer />

//       {/* Quick View Modal */}
//       {quickViewProduct && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center p-4 border-b">
//               <h3 className="text-xl font-bold">Quick View</h3>
//               <button
//                 className="text-gray-500 hover:text-gray-700"
//                 onClick={() => setQuickViewProduct(null)}
//               >
//                 <FaTimes className="text-xl" />
//               </button>
//             </div>

//             <div className="p-6 md:flex">
//               <div className="md:w-1/2 mb-6 md:mb-0">
//                 <div className="relative h-64 md:h-80 bg-gray-200 rounded-lg overflow-hidden">
//                   <Image
//                     src={quickViewProduct.image}
//                     alt={quickViewProduct.title}
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
//               </div>

//               <div className="md:w-1/2 md:pl-6">
//                 <h2 className="text-2xl font-bold mb-2">
//                   {quickViewProduct.title}
//                 </h2>

//                 <div className="flex items-center mb-4">
//                   <div className="flex mr-2">
//                     {renderRating(quickViewProduct.rating)}
//                   </div>
//                   <span className="text-gray-600">
//                     ({quickViewProduct.reviewCount} reviews)
//                   </span>
//                 </div>

//                 <div className="mb-4">
//                   <span className="text-2xl font-bold text-red-600">
//                     ${quickViewProduct.price}
//                   </span>
//                   {quickViewProduct.originalPrice && (
//                     <span className="text-gray-500 line-through ml-2">
//                       ${quickViewProduct.originalPrice}
//                     </span>
//                   )}
//                 </div>

//                 <p className="text-gray-700 mb-6">
//                   Lorem ipsum dolor sit amet, consectetur adipiscing elit.
//                   Nullam eget felis eget urna ultrices ultricies. Sed tempor
//                   libero quis ligula interdum, at aliquet quam aliquam.
//                 </p>

//                 <div className="flex space-x-4 mb-6">
//                   <div className="flex items-center">
//                     <FaCheck className="text-green-500 mr-2" />
//                     <span className="text-sm">In stock</span>
//                   </div>
//                   <div className="flex items-center">
//                     <FaShippingFast className="text-blue-500 mr-2" />
//                     <span className="text-sm">Free shipping</span>
//                   </div>
//                 </div>

//                 <div className="flex space-x-4">
//                   <button
//                     className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-md transition flex items-center justify-center"
//                     onClick={() => {
//                       addToCart(quickViewProduct);
//                       setQuickViewProduct(null);
//                     }}
//                   >
//                     <FaShoppingCart className="mr-2" />
//                     Add to Cart
//                   </button>
//                   <Link
//                     href={`/ecommerce/product/${quickViewProduct.id}`}
//                     className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-100 transition flex items-center"
//                     onClick={() => setQuickViewProduct(null)}
//                   >
//                     View Details
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Cart Notification */}
//       {showCartNotification && (
//         <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-3 rounded-md shadow-lg flex items-center z-50">
//           <FaCheck className="mr-2" />
//           <span>Item added to cart successfully!</span>
//         </div>
//       )}
//     </>
//   );
// }
