"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosConfig from "@/utils/axiosConfig";

interface Category {
  id: number;
  name: string;
}

export default function AddProductPage() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [priceUSD, setPriceUSD] = useState<string>("");
  const [originalPriceUSD, setOriginalPriceUSD] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [category, setCategory] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isNew, setIsNew] = useState<boolean>(false);
  const [isBestSeller, setIsBestSeller] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosConfig().get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
        // Fallback to hardcoded categories
        setCategories([
          { id: 1, name: "Electronics" },
          { id: 2, name: "Mobile" },
          { id: 3, name: "Computer" },
        ]);
      }
    };
    fetchCategories();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      if (description) formData.append("description", description);
      formData.append("priceUSD", priceUSD);
      if (originalPriceUSD) formData.append("originalPriceUSD", originalPriceUSD);
      if (image) formData.append("image", image);
      formData.append("category", category);
      formData.append("isNew", isNew.toString());
      formData.append("isBestSeller", isBestSeller.toString());

      const response = await axiosConfig().post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Product added successfully", response.data);

      setSuccess("Product added successfully!");
      // Clear form
      setTitle("");
      setDescription("");
      setPriceUSD("");
      setOriginalPriceUSD("");
      setImage(null);
      setCategory("");
      setIsNew(false);
      setIsBestSeller(false);

      // Redirect after showing success message
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 2000);
    } catch (error: unknown) {
      console.error("Failed to add product", error);
      const errorMessage =
        error &&
        typeof error === "object" &&
        "response" in error &&
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message;
      setError(
        typeof errorMessage === "string"
          ? errorMessage
          : "Failed to add product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-md text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-md text-sm">
            {success}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title *
          </label>
          <input
            id="title"
            type="text"
            placeholder="Product title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border text-gray-900 border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            placeholder="Product description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border text-gray-900 border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="priceUSD" className="block text-sm font-medium text-gray-700">
              Price (USD) *
            </label>
            <input
              id="priceUSD"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={priceUSD}
              onChange={(e) => setPriceUSD(e.target.value)}
              required
              className="w-full px-3 py-2 border text-gray-900 border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="originalPriceUSD" className="block text-sm font-medium text-gray-700">
              Original Price (USD)
            </label>
            <input
              id="originalPriceUSD"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={originalPriceUSD}
              onChange={(e) => setOriginalPriceUSD(e.target.value)}
              className="w-full px-3 py-2 border text-gray-900 border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Product Image *
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            required
            className="w-full px-3 py-2 border text-gray-900 border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category *
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full px-3 py-2 border text-gray-900 border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isNew}
              onChange={(e) => setIsNew(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Mark as New</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isBestSeller}
              onChange={(e) => setIsBestSeller(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Mark as Best Seller</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}