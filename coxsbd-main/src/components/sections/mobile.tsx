"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";

import {
  Home,
  MessageCircle,
  CircleUser,
  ShoppingCart,
  Menu,
  X,
  Search,
  Heart,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";

const categoryList = [
  { label: "Cars" },
  { label: "Bus" },
  { label: "Hotels" },
  { label: "Flights" },
  { label: "Tour Package" },
  { label: "Visa Service" },
  {
    label: "Ecommerce",
    children: [
      { label: "Electronics" },
      { label: "Mobile" },
      { label: "Computer" },
    ],
  },
  {
    label: "Web Hosting",
    children: [{ label: "Boost Hosting" }, { label: "Reseller Hosting" }],
  },
  {
    label: "Cloud VPS",
    children: [
      { label: "Linux VPS" },
      { label: "Windows VPS" },
      { label: "Storage VPS" },
    ],
  },
  { label: "Dedicated Server" },
  { label: "Domain" },
  {
    label: "Software Script",
    children: [
      { label: "NodeJS" },
      { label: "NextJS" },
      { label: "Laravel" },
      { label: "PHP" },
    ],
  },
  { label: "Wifi Data" },
  { label: "Licenses" },
  // { label: "Offers" },
  { label: "About" },
];

const HomePage: React.FC = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");
  const [selectedHosting, setSelectedHosting] = useState<number | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});

  // Function to get border gradient based on index
  const getBorderGradient = (index: number) => {
    const gradients = [
      "border-gradient-red",
      "border-gradient-purple",
      "border-gradient-orange",
      "border-gradient-pink",
      "border-gradient-rose",
      "border-gradient-crimson",
    ];
    return gradients[index % gradients.length];
  };

  // Function to get background gradient based on index
  const getBackgroundGradient = (index: number) => {
    const gradients = [
      "bg-gradient-to-r from-red-600 to-red-500",
      "bg-gradient-to-r from-purple-600 to-red-500",
      "bg-gradient-to-r from-red-700 to-orange-500",
      "bg-gradient-to-r from-rose-600 to-pink-500",
      "bg-gradient-to-r from-red-800 to-red-600",
      "bg-gradient-to-r from-red-600 to-rose-500",
    ];
    return gradients[index % gradients.length];
  };

  // Extract all hosting options from the category list
  const hostingOptions = categoryList
    .filter((cat) => cat.children)
    .flatMap((cat) => cat.children?.map((child) => child.label) || []);

  // Handle category click
  const handleCategoryClick = (category: string) => {
    const route = category.toLowerCase().replace(/\s+/g, "-");
    router.push(`/${route}`);
  };

  // Toggle category expansion in mobile menu
  const toggleCategoryExpansion = (label: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <div className="font-sans lg:hidden relative pb-20">
      {/* Header with logo and search bar */}
      <div className="flex w-full justify-between items-center p-4 bg-white sticky top-0 z-10 shadow-sm">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="mr-2 text-slate-700"
        >
          <Menu size={24} />
        </button>
        <div className="h-8 w-auto font-bold text-lg text-red-600">
          <img
            src={"./logo.png"}
            alt="Logo"
            className="h-full w-full object-contain"
          />
        </div>
        <div className="flex items-center space-x-5">
          <Search size={18} className="text-slate-700" />
          {/* Sign In */}
          <Link
            href="/login"
            className="flex items-center text-sm gap-2 py-3 px-2 font-medium text-slate-800 border-b border-slate-200 hover:text-red-600 transition"
          >
            <span>Sign In</span>
          </Link>

          {/* Language */}
          <a
            href="#"
            className="block py-3 px-2 text-sm font-medium text-slate-800 border-b border-slate-200 hover:text-red-600 transition"
          >
            EN
          </a>

          {/* Currency */}
          <a
            href="#"
            className="block py-3 px-2 text-sm font-medium text-slate-800 border-b border-slate-200 hover:text-red-600 transition"
          >
            USD
          </a>
          {/* <Heart size={20} className="text-slate-700" /> */}
          {/* <ShoppingCart size={20} className="text-slate-700" /> */}
        </div>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
          {/* Header */}
          <div className="p-4 flex justify-between items-center border-b border-slate-200">
            <div className="h-8 w-auto">
              <img
                src="./logo.png"
                alt="Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-slate-700 hover:text-red-600 transition"
            >
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-6">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full p-2 pl-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

            {/* Menu Links */}
            <nav className="space-y-1">
              {/* Home */}
              <a
                href="#"
                className="block py-3 px-2 font-medium text-slate-800 border-b border-slate-200 hover:text-red-600 transition"
                onClick={() => {
                  setIsMenuOpen(false);
                  setActiveTab("Home");
                }}
              >
                Home
              </a>

              {/* Categories */}
              {categoryList.map((category, index) => (
                <div key={index} className="border-b border-slate-200">
                  {category.children ? (
                    <>
                      <button
                        className="w-full flex justify-between items-center py-3 px-2 font-medium text-slate-800 hover:text-red-600 transition"
                        onClick={() => toggleCategoryExpansion(category.label)}
                      >
                        <span>{category.label}</span>
                        <svg
                          className={`w-5 h-5 transition-transform ${
                            expandedCategories[category.label]
                              ? "rotate-90"
                              : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                      {expandedCategories[category.label] && (
                        <div className="pl-6 pb-2 space-y-1">
                          {category.children.map((subcat, subIndex) => (
                            <a
                              key={subIndex}
                              href="#"
                              className="block py-2 text-slate-600 hover:text-red-600 transition"
                              onClick={(e) => {
                                e.preventDefault();
                                setIsMenuOpen(false);
                                handleCategoryClick(subcat.label);
                              }}
                            >
                              {subcat.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <a
                      href="#"
                      className="block py-3 px-2 font-medium text-slate-800 hover:text-red-600 transition"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsMenuOpen(false);
                        handleCategoryClick(category.label);
                      }}
                    >
                      {category.label}
                    </a>
                  )}
                </div>
              ))}

              {/* My Account */}
              <a
                href="#"
                className="block py-3 px-2 font-medium text-slate-800 border-b border-slate-200 hover:text-red-600 transition"
              >
                My Account
              </a>

              {/* Contact */}
              <a
                href="#"
                className="block py-3 px-2 font-medium text-slate-800 border-b border-slate-200 hover:text-red-600 transition"
              >
                Contact Us
              </a>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-4 w-full bg-slate-50">
        {/* Category Navigation - Grid Layout */}
        <div className="mb-6">
          <div className="grid grid-cols-3 gap-2">
            {categoryList.map((category, index) => (
              <button
                key={index}
                onClick={() => handleCategoryClick(category.label)}
                className={`px-2 py-2 rounded-md text-center text-xs sm:text-sm ${
                  activeTab === category.label
                    ? "bg-red-600 text-white"
                    : "bg-white text-slate-700 border border-slate-200"
                }`}
              >
                <span className="line-clamp-1">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* For your business section */}
        {/* <h3 className="text-lg font-bold text-slate-800 mb-3">For your business</h3> */}
        {false && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {hostingOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedHosting((prev) => (prev === index ? null : index));
                  handleCategoryClick(option);
                }}
                className={`${getBorderGradient(index)} border-1 relative group overflow-hidden flex justify-center items-center px-3 h-12 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                  selectedHosting === index
                    ? `${getBackgroundGradient(index)} text-white`
                    : "bg-white text-slate-700 hover:text-white"
                }`}
              >
                {/* Hover effect only when not selected */}
                {selectedHosting !== index && (
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${getBackgroundGradient(index)}`}
                  ></div>
                )}
                <span className="relative z-10 line-clamp-1 text-center">
                  {option}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Featured categories section */}
        {categoryList.slice(1, 5).map((category, index) => (
          <div key={index} className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-slate-800">
                {category.label}
              </h3>
              <button
                className="text-red-600 text-sm font-medium"
                onClick={() => handleCategoryClick(category.label)}
              >
                See all
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer"
                  onClick={() => handleCategoryClick(category.label)}
                >
                  <img
                    src="/hotel.jpg"
                    alt={`Product ${item}`}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-2">
                    <h4 className="text-sm font-bold text-slate-800">
                      $647.5-$84.7
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {category.label} deals and offers
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white h-16 w-full flex justify-around items-center shadow-lg border-t border-slate-200 z-10">
        <button
          onClick={() => setActiveTab("Home")}
          className={`flex flex-col items-center p-2 ${activeTab === "Home" ? "text-red-600" : "text-slate-600"}`}
        >
          <Home size={20} />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button
          onClick={() => {
            setActiveTab("Offers");
            handleCategoryClick("Offers");
          }}
          className={`flex flex-col items-center p-2 ${activeTab === "Offers" ? "text-red-600" : "text-slate-600"}`}
        >
          <Menu size={20} />
          <span className="text-xs mt-1">Offers</span>
        </button>
        <button
          onClick={() => setActiveTab("Chat")}
          className={`flex flex-col items-center p-2 ${activeTab === "Chat" ? "text-red-600" : "text-slate-600"}`}
        >
          <MessageCircle size={20} />
          <span className="text-xs mt-1">Chat</span>
        </button>
        <button
          onClick={() => setActiveTab("Cart")}
          className={`flex flex-col items-center p-2 ${activeTab === "Cart" ? "text-red-600" : "text-slate-600"}`}
        >
          <ShoppingCart size={20} />
          <span className="text-xs mt-1">Cart</span>
        </button>
        <button
          onClick={() => setActiveTab("Account")}
          className={`flex flex-col items-center p-2 ${activeTab === "Account" ? "text-red-600" : "text-slate-600"}`}
        >
          <CircleUser size={20} />
          <span className="text-xs mt-1">Account</span>
        </button>
      </nav>
    </div>
  );
};

export default HomePage;
