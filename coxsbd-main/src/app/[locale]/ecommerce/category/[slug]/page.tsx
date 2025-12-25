"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryMenu from "@/components/ecommerce/CategoryMenu";
import ProductGrid from "@/components/ecommerce/ProductGrid";
import QuickViewModal from "@/components/ecommerce/QuickViewModal";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Product } from "@/types/products";
import NewsletterSignup from "@/components/Newsletter";
import EcommerceSearchInput from "@/components/ecommerce/EcommerceSearchForm";
import { categories, getCategoryBySlug, getProductsByCategoryName } from "../../data";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = getCategoryBySlug(slug);
  const [quickView, setQuickView] = useState<Product | null>(null);

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold">Category not found.</h1>
      </div>
    );
  }

  const products = getProductsByCategoryName(category.name);

  return (
    <div>
      <Header /><br /><br />
      <EcommerceSearchInput/><br /><br />
      <CategoryMenu categories={categories} selectedCategory={category.name} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">{category.name}</h2>
        <ProductGrid products={products} onQuickView={(p) => setQuickView(p)} />
      </div>
        <NewsletterSignup/><br /><br />
      <Footer />
      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </div>
  );
}
