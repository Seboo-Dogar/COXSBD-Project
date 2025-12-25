// components/NewsletterSignup.tsx
"use client";

import React, { useState, FormEvent } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const validateEmail = (email: string): boolean => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSubmitted(true);
    setEmail("");
    // Add your API call here if needed
  };

  return (
    <section className="max-w-4xl mx-auto bg-white p-8 rounded-md shadow-md mt-16">
      <h2 className="text-2xl font-semibold mb-2 text-center">Stay Updated</h2>
      <p className="text-gray-600 mb-6 text-center">
        Subscribe to our newsletter and get the latest flight deals and updates.
      </p>

      {!submitted ? (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4"
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-grow text-lg bg-white px-4 py-3 border border-gray-400 rounded-md focus:outline-red-600 focus:ring-1 focus:ring-red-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-red-600 text-white text-lg font-medium px-6 py-3 rounded-md  hover:bg-red-700 transition cursor-pointer"
          >
            Subscribe
          </button>
        </form>
      ) : (
        <p className="text-green-600 text-center font-medium">
          Thank you for subscribing!
        </p>
      )}

      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
    </section>
  );
}
