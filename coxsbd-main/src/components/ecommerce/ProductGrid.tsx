"use client";
import type { Product } from "@/types/products";
import ProductCard from "./ProductCard";

export default function ProductGrid({
  products,
  onQuickView,
}: {
  products: Product[];
  onQuickView?: (p: Product) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} openQuickView={onQuickView} />
      ))}
    </div>
  );
}
