import React, { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

const RequestQuotation: React.FC = () => {
  const [formData, setFormData] = useState({
    product: "",
    quantity: "",
    unit: "Pieces",
    name: "",
    email: "",
    company: "",
    details: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data:", formData);
    setFormData({
      product: "",
      quantity: "",
      unit: "Pieces",
      name: "",
      email: "",
      company: "",
      details: "",
    });
    alert("Your quotation request has been submitted!");
  };

  const benefits = [
    "One request, multiple quotes",
    "Verified suppliers matching",
    "Secure and fast communication",
    "Personalized sourcing support",
  ];

  return (
    <div className="bg-white py-10 border-t border-gray-200">
      <div className="mx-auto px-4 max-w-full xl:max-w-[1280px]">
        <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12">
          {/* Left content */}
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
              Request for Quotation
            </h2>
            <p className="text-gray-600 mb-6">
              Get customized quotes quickly from verified suppliers for your
              specific sourcing needs.
            </p>

            <div className="space-y-4 mb-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle2
                    size={20}
                    className="text-green-600 mr-2 mt-0.5"
                  />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>

            <div>
              <img
                src="https://media.licdn.com/dms/image/v2/C5112AQG87VUgljNNSQ/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1553661830399?e=2147483647&v=beta&t=ymqV2JX4rwRPsYNrLvgmZIIWXAA2VRfHX_G6K2HzgZ0"
                alt="Global trade partners"
                className="w-full rounded-lg shadow"
              />
            </div>
          </div>

          {/* Right form */}
          <div className="w-full md:w-1/2">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    What are you looking for?
                  </label>
                  <input
                    type="text"
                    name="product"
                    placeholder="Product name or description"
                    value={formData.product}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border text-slate-800 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      placeholder="Enter quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border text-slate-800 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
                      required
                    />
                  </div>

                  <div className="w-full sm:w-1/3">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Unit
                    </label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border text-slate-800 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600 bg-white"
                    >
                      <option value="Pieces">Pieces</option>
                      <option value="Kilograms">Kilograms</option>
                      <option value="Tons">Tons</option>
                      <option value="Meters">Meters</option>
                      <option value="Sets">Sets</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Full name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border text-slate-800 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
                      required
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Business email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border text-slate-800 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    placeholder="Your company name"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border text-slate-800 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Additional Details
                  </label>
                  <textarea
                    name="details"
                    placeholder="Describe your requirements in detail..."
                    value={formData.details}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border text-slate-800 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition flex items-center justify-center font-medium"
                >
                  <Send size={18} className="mr-2" />
                  Request for Quotation
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestQuotation;
