// src/components/car/FAQClientWrapper.tsx
"use client"; // Essential directive at the very top

import React, { useState } from "react";
// Assuming you define the FAQ type elsewhere or infer it
type FAQItem = { question: string; answer: string };

interface FAQClientWrapperProps {
  faqs: FAQItem[];
}

export const FAQClientWrapper: React.FC<FAQClientWrapperProps> = ({ faqs }) => {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300"
        >
          <button
            className="w-full p-6 text-left font-semibold flex justify-between items-center"
            onClick={() => toggleFAQ(index)}
            aria-expanded={activeFAQ === index}
          >
            {faq.question}
            <span
              className={`transform transition-transform duration-300 ${
                activeFAQ === index ? "rotate-180" : ""
              }`}
            >
              &#9660; 
            </span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              activeFAQ === index ? "max-h-96" : "max-h-0"
            }`}
          >
            <div className="p-6 pt-0 text-gray-600">{faq.answer}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Export default if you prefer, but named export is fine too
export default FAQClientWrapper;