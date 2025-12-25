"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosConfig from "@/utils/axiosConfig";

export default function AddCategoryPage() {
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await axiosConfig().post("/categories", {
        name,
      });
      console.log("Category added successfully", response.data);

      setSuccess("Category added successfully!");
      setName(""); // Clear the form

      // Redirect after showing success message
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 2000);
    } catch (error: unknown) {
      console.error("Failed to add category", error);
      const errorMessage =
        error &&
        typeof error === "object" &&
        "response" in error &&
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message;
      setError(
        typeof errorMessage === "string"
          ? errorMessage
          : "Failed to add category. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Category</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
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
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Category Name *
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border text-gray-900 border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Adding Category..." : "Add Category"}
        </button>
      </form>
    </div>
  );
}