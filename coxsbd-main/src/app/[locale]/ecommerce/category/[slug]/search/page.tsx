"use client";

import { useSearchParams, useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ecommerce/ProductGrid";
import EcommerceSearchInput from "@/components/ecommerce/EcommerceSearchForm";
import { useState, useMemo } from "react";
import { Product } from "@/types/products";
import QuickViewModal from "@/components/ecommerce/QuickViewModal";
import { getCategoryBySlug, getProductsByCategoryName } from "../../../data";

export default function CategorySearchPage() {
  const { slug } = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";

  const category = getCategoryBySlug(slug);
  const [quickView, setQuickView] = useState<Product | null>(null);

  if (!category) {
    return <div className="p-10 text-xl font-semibold">Category not found.</div>;
  }

  const products = useMemo(() => {
    return getProductsByCategoryName(category.name).filter((p) =>
      p.name.toLowerCase().includes(query)
    );
  }, [category.name, query]);

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <EcommerceSearchInput categorySlug={slug} initialQuery={query} />
        <h2 className="text-2xl font-bold mb-6">
          Results for "{query}" in {category.name}
        </h2>
        {products.length ? (
          <ProductGrid products={products} onQuickView={(p) => setQuickView(p)} />
        ) : (
          <p>No products found.</p>
        )}
      </div>
      <Footer />
      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </div>
  );
}
