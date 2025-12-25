import React from "react";
import ProductCard from "./ProductCard";

const products = [
  {
    id: 1,
    name: "Product A",
    image: "https://via.placeholder.com/300x200",
    priceUSD: 50,
    minOrder: "1",
    supplier: { name: "Supplier A", country: "USA", years: 5, verified: true },
  },
  {
    id: 2,
    name: "Product B",
    image: "https://via.placeholder.com/300x200",
    priceUSD: 100,
    minOrder: "2",
    supplier: { name: "Supplier B", country: "India", years: 3, verified: false },
  },
];

export default function ProductList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

