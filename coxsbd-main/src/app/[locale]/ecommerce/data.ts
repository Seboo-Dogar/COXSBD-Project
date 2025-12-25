import { Product } from "@/types/products";
import { FaLaptop, FaTshirt, FaCouch, FaHeartbeat, FaBasketballBall, FaBook, FaPuzzlePiece, FaAppleAlt, FaCar, FaDog, FaGem, FaBaby, FaPenFancy, FaMusic } from "react-icons/fa";

export const categories = [
  { name: "Electronics",          slug: "electronics",          icon: FaLaptop },
  { name: "Fashion",              slug: "fashion",              icon: FaTshirt },
  { name: "Home & Furniture",     slug: "home-furniture",       icon: FaCouch },
  { name: "Beauty & Personal Care", slug: "beauty-personal-care", icon: FaHeartbeat },
  { name: "Sports & Outdoors",    slug: "sports-outdoors",      icon: FaBasketballBall },
  { name: "Books & Stationery",   slug: "books-stationery",     icon: FaBook },
  { name: "Toys & Games",         slug: "toys-games",           icon: FaPuzzlePiece },
  { name: "Groceries",            slug: "groceries",            icon: FaAppleAlt },
  { name: "Automotive",           slug: "automotive",           icon: FaCar },
  { name: "Pet Supplies",         slug: "pet-supplies",         icon: FaDog },
  { name: "Jewelry & Accessories", slug: "jewelry-accessories", icon: FaGem },
  { name: "Baby Products",        slug: "baby-products",        icon: FaBaby },
  { name: "Office Supplies",      slug: "office-supplies",      icon: FaPenFancy },
  { name: "Musical Instruments",  slug: "musical-instruments",  icon: FaMusic },
];

export const products: Product[] = [
  { id: 1, title: "Smartphone X200", priceUSD: 499, originalPriceUSD: 599, image: "/api/placeholder/300/300", rating: 4.5, reviewCount: 124, category: "Electronics", isNew: true },
  { id: 2, title: "Smart Watch Pro", priceUSD: 199, image: "/api/placeholder/300/300", rating: 4.3, reviewCount: 203, category: "Electronics", isBestSeller: true },
  { id: 3, title: "Wireless Headphones", priceUSD: 149, originalPriceUSD: 199, image: "/api/placeholder/300/300", rating: 4.8, reviewCount: 167, category: "Electronics", isNew: true },
  { id: 4, title: "Bluetooth Speaker", priceUSD: 69, originalPriceUSD: 89, image: "/api/placeholder/300/300", rating: 4.6, reviewCount: 132, category: "Electronics" },

  { id: 5, title: "Leather Handbag", priceUSD: 120, originalPriceUSD: 150, image: "/api/placeholder/300/300", rating: 4.7, reviewCount: 56, category: "Fashion" },
  { id: 6, title: "Casual T-Shirt", priceUSD: 25, image: "/api/placeholder/300/300", rating: 4.1, reviewCount: 77, category: "Fashion" },
  { id: 7, title: "Denim Jacket", priceUSD: 89, image: "/api/placeholder/300/300", rating: 4.5, reviewCount: 64, category: "Fashion", isBestSeller: true },
  { id: 8, title: "Running Shoes", priceUSD: 89, image: "/api/placeholder/300/300", rating: 4.2, reviewCount: 89, category: "Fashion" },

  { id: 9, title: "Coffee Maker", priceUSD: 79, image: "/api/placeholder/300/300", rating: 4.1, reviewCount: 72, category: "Home & Furniture" },
  { id: 10, title: "Modern Sofa", priceUSD: 499, image: "/api/placeholder/300/300", rating: 4.6, reviewCount: 52, category: "Home & Furniture", isBestSeller: true },
  // ...extend as needed
];

// helpers
export const getCategoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);
export const getProductById = (id: number) => products.find((p) => p.id === id);
export const getProductsByCategoryName = (name: string) => products.filter((p) => p.category === name);
export const featuredProducts = products.slice(0, 8);
