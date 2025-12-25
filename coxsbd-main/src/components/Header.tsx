/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  Menu,
  Search,
  User,
  ShoppingCart,
  Globe,
  MessageCircle,
  Heart,
  LogOut,
  Calendar,
  Home,
  X,
  CircleUser,
  MapPin,
} from "lucide-react";
import Cookies from "js-cookie";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calender";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categoryList } from "@/utils/data";
import { useCart } from "@/context/cartContext";
import { useCurrency } from "@/context/currencyContext";
import MessageButton from "@/components/MessageButton"; // adjust path if needed
// import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

const Header: React.FC = () => {
  const [language, setLanguage] = useState("EN");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  // const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth <= 1024 : false
  );

  const languageLabels: Record<string, string> = {
    en: "English",
    bn: "বাংলা",
    IN: "हिन्दी",
    CN: "中文",
  };

  const { currency, setCurrency, currencies } = useCurrency();

  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});
  const [activeTab, setActiveTab] = useState("Home");

  // Add these state variables after the existing state declarations
  const [fromLocation, setFromLocation] = useState<
    (typeof popularLocations)[0] | null
  >(null);
  const [toLocation, setToLocation] = useState<
    (typeof popularLocations)[0] | null
  >(null);
  const [fromLocationSearch, setFromLocationSearch] = useState("");
  const [toLocationSearch, setToLocationSearch] = useState("");
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  const { totalItems } = useCart();
  // Add location data after categoryList import
  const popularLocations = [
    {
      id: "1",
      name: "Mirpur 10",
      area: "Mirpur",
      address: "Mirpur 10 Roundabout, Dhaka",
    },
    {
      id: "2",
      name: "Gulshan 1",
      area: "Gulshan",
      address: "Gulshan Circle 1, Dhaka",
    },
    {
      id: "3",
      name: "Dhanmondi 27",
      area: "Dhanmondi",
      address: "Dhanmondi 27, Dhaka",
    },
    {
      id: "4",
      name: "Uttara Sector 7",
      area: "Uttara",
      address: "Uttara Sector 7, Dhaka",
    },
    {
      id: "5",
      name: "Motijheel",
      area: "Motijheel",
      address: "Motijheel Commercial Area, Dhaka",
    },
    { id: "6", name: "Banani", area: "Banani", address: "Banani, Dhaka" },
    {
      id: "7",
      name: "Bashundhara R/A",
      area: "Bashundhara",
      address: "Bashundhara Residential Area, Dhaka",
    },
    { id: "8", name: "Wari", area: "Old Dhaka", address: "Wari, Dhaka" },
    {
      id: "9",
      name: "Tejgaon",
      area: "Tejgaon",
      address: "Tejgaon Industrial Area, Dhaka",
    },
    {
      id: "10",
      name: "Shahbagh",
      area: "Shahbagh",
      address: "Shahbagh, Dhaka",
    },
    {
      id: "11",
      name: "Dhaka Airport",
      area: "Airport",
      address: "Hazrat Shahjalal International Airport, Dhaka",
    },
    {
      id: "12",
      name: "Sadarghat",
      area: "Old Dhaka",
      address: "Sadarghat Launch Terminal, Dhaka",
    },
  ];

  // Responsive design handler
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Get current route category
  const currentRoute = pathname?.split("/")[1] || "";
  const searchCategory = currentRoute
    ? currentRoute.charAt(0).toUpperCase() + currentRoute.slice(1)
    : "Products";

  useEffect(() => {
    setIsLoggedIn(!!Cookies.get("accessToken"));
    console.log("Current route:", currentRoute);
  }, []);

  const [dropdown, setDropdown] = useState<{
    x: number;
    y: number;
    children: { label: string }[] | null;
  }>({ x: 0, y: 0, children: null });

  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    children: { label: string }[] | undefined
  ) => {
    if (!children) return;
    const { clientX, clientY } = e;
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    setDropdown({ x: clientX, y: clientY + 20, children });
  };

  const handleMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setDropdown({ x: 0, y: 0, children: null });
    }, 500);
  };

  const cancelHide = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
  };

  // Check if current route is hotels to show date pickers
  const isHotelsRoute = currentRoute === "hotels";
  const isCarsRoute = currentRoute === "cars";

  // Filter locations based on search
  const filteredFromLocations = popularLocations.filter(
    (location) =>
      location.name.toLowerCase().includes(fromLocationSearch.toLowerCase()) ||
      location.area.toLowerCase().includes(fromLocationSearch.toLowerCase()) ||
      location.address.toLowerCase().includes(fromLocationSearch.toLowerCase())
  );

  const filteredToLocations = popularLocations.filter(
    (location) =>
      location.name.toLowerCase().includes(toLocationSearch.toLowerCase()) ||
      location.area.toLowerCase().includes(toLocationSearch.toLowerCase()) ||
      location.address.toLowerCase().includes(toLocationSearch.toLowerCase())
  );

  const handleCategoryClick = (category: string) => {
    const route = category.toLowerCase().replace(/\s+/g, "-");
    router.push(`/${route}`);
    setIsMenuOpen(false);
  };

  const toggleCategoryExpansion = (label: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };
  const changeLanguage = (lang: string) => {
    if (!["en", "bn", "IN", "CN"].includes(lang)) return;

    let path = pathname;
    const langRegex = /^\/(en|bn|IN|CN)\b/; // ✅ match all supported langs
    if (langRegex.test(path)) {
      path = path.replace(langRegex, `/${lang}`);
    } else {
      path = `/${lang}${path}`;
    }
    router.push(path);
  };

  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    setIsLoggedIn(false);
    setIsMenuOpen(false);
  };

  const handleSearch = () => {
    if (isHotelsRoute) {
      // Format dates as YYYY-M-D (without leading zeros)
      const formatDate = (date?: Date) => {
        if (!date) return "";
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      };

      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.set("location", searchQuery);
      if (checkInDate) queryParams.set("checkIn", formatDate(checkInDate));
      if (checkOutDate) queryParams.set("checkOut", formatDate(checkOutDate));

      router.push(`/hotels/search?${queryParams.toString()}`);
    } else if (isCarsRoute) {
      const queryParams = new URLSearchParams();
      if (fromLocation) queryParams.set("from", fromLocation.name);
      if (toLocation) queryParams.set("to", toLocation.name);
      if (searchQuery) queryParams.set("query", searchQuery);
      router.push(`/cars/search?${queryParams.toString()}`);
    }
  };

  // Mobile top bar
  if (isMobile) {
    return (
      <div className="sticky top-0 z-50 bg-white shadow-md">
        {/* Mobile Top Bar */}
        <div className="flex justify-between items-center p-4">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="text-slate-700"
          >
            <Menu size={24} />
          </button>

          <Link href="/" className="flex items-center">
            <div className="h-8 w-auto font-bold text-lg text-red-600">
              <img
                src="https://i.ibb.co/FqCW0CCW/logo.png"
                alt="CoxsBD Logo"
                className="h-full"
              />
            </div>
          </Link>

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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
            <div className="p-4 flex justify-between items-center border-b border-slate-200">
              <div className="h-8 w-auto font-bold text-lg text-red-600">
                <img src="./logo.png" alt="Logo" className="h-full" />
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-red-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-4">
              <div className="mb-6">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full p-2 pl-10 border border-slate-300 rounded-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search
                    size={18}
                    className="absolute left-3 text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Link
                  href="/"
                  className="block py-3 px-2 font-medium text-slate-800 border-b border-slate-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>

                {categoryList
                  .filter((category) => {
                    const normalized = category.label.trim().toLowerCase();
                    const isEcommerce = normalized === "ecommerce";
                    const isOffers = normalized === "offers";
                    return !(isEcommerce || (isMobile && isOffers));
                  })
                  .map((category, index) => (
                    <button
                      key={index}
                      className="block py-3 px-2 font-medium text-slate-800 text-left w-full"
                      onClick={() => handleCategoryClick(category.label)}
                    >
                      {category.label}
                    </button>
                  ))}

                <div className="mt-4 pt-4 border-t border-slate-200">
                  {isLoggedIn ? (
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full py-2 text-sm text-slate-700 hover:text-red-600"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      className="flex items-center py-2 text-sm text-slate-700 hover:text-red-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User size={16} className="mr-2" />
                      Sign In / Register
                    </Link>
                  )}

                  <Link
                    href="/help"
                    className="flex items-center py-2 text-sm text-slate-700 hover:text-red-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <MessageCircle size={16} className="mr-2" />
                    Help Center
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop layout
  return (
    <header className="sticky top-0 z-50 w-full h-fit bg-white shadow-md ">
      {/* Main navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between px-2 xl:px-4 py-4">
        <div className="flex items-center justify-between mb-3 md:mb-0">
          <div className="flex items-center">
            <button
              className="mr-3 lg:hidden text-slate-700 hover:text-red-600 transition"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu size={24} />
            </button>
            <Link href="/" className="flex items-center">
              <div className="lg:h-9 xl:h-10 w-auto font-bold text-7xl text-red-600">
                <img
                  src="https://i.ibb.co/FqCW0CCW/logo.png"
                  alt="CoxsBD Logo"
                  className="h-full"
                />
              </div>
            </Link>
          </div>

          <div className="flex items-center md:hidden">
            <button className="text-slate-700 hover:text-red-600 transition mr-5">
              <Heart size={22} />
            </button>
            <button className="text-slate-700 hover:text-red-600 transition mr-5">
              <MessageCircle size={22} />
            </button>
            <button className="text-slate-700 hover:text-red-600 transition">
              <ShoppingCart size={22} />
            </button>
          </div>
        </div>

        {/* _____Search bar_____ */}
        <div className="flex-grow mx-0 md:mx-6 mb-4 md:mb-0">
          <div className="relative flex flex-wrap h-12 md:flex-nowrap gap-2">
            {/* {!isHotelsRoute && !isCarsRoute &&  */}
            <div className="hidden h-12 md:flex items-center">
              <Select defaultValue={currentRoute || "products"}>
                <SelectTrigger className="h-full rounded-l-md border-r-0 border border-slate-300 bg-white px-3 py-6 text-sm text-slate-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 lg:w-[120px] xl:w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    <SelectItem value="products">Products</SelectItem>
                    <SelectItem value="hotels">Hotels</SelectItem>
                    <SelectItem value="cars">Cars</SelectItem>
                    <SelectItem value="flights">Flights</SelectItem>
                    <SelectItem value="suppliers">Suppliers</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <input
              type="text"
              placeholder="What are you looking for..."
              className={`w-full px-4 py-2.5 ${isHotelsRoute ? "rounded-md md:rounded-none" : "md:rounded-l-none rounded-l-md"} border border-slate-300 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 text-slate-700`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="bg-red-600 text-white px-6 py-2.5 rounded-r-md hover:bg-red-700 transition duration-200 flex md:w-fit w-full rounded-l-md items-center justify-center"
            >
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* User navigation */}
        <div className="hidden md:flex items-center lg:space-x-3 xl:space-x-4 mr-6">
          {/* Language Selector */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="border-none shadow-none hover:bg-slate-100 p-2"
              >
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-slate-700" />
                  <span className="lg:text-xs xl:text-sm text-slate-700">
                    {languageLabels[locale] || locale}
                  </span>
                </div>
              </Button>
            </PopoverTrigger>

            <PopoverContent className="lg:w-[180px] xl:w-[200px] p-0">
              <div className="grid gap-1 p-2">
                <Button
                  variant="ghost"
                  className="justify-start font-normal text-slate-700 hover:text-red-600 hover:bg-red-50"
                  onClick={() => changeLanguage("en")}
                >
                  <span className="mr-2">🇺🇸</span> English
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start font-normal text-slate-700 hover:text-red-600 hover:bg-red-50"
                  onClick={() => changeLanguage("bn")}
                >
                  <span className="mr-2">🇧🇩</span> বাংলা
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start font-normal text-slate-700 hover:text-red-600 hover:bg-red-50"
                  onClick={() => changeLanguage("IN")}
                >
                  <span className="mr-2">🇮🇳</span> हिन्दी
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start font-normal text-slate-700 hover:text-red-600 hover:bg-red-50"
                  onClick={() => setLanguage("CN")}
                >
                  <span className="mr-2">🇨🇳</span> 中文
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Currency Selector */}
          {/* Currency Selector */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="border-slate-200 hover:bg-slate-100 flex items-center justify-center gap-1"
              >
                {currencies.length === 0 ? (
                  <span className="lg:text-xs xl:text-sm font-medium text-slate-700">
                    Loading...
                  </span>
                ) : (
                  <span className="lg:text-xs xl:text-sm font-medium text-slate-700">
                    {currency.code}{" "}
                    {currency.code === "USD"
                      ? "$"
                      : currency.code === "BDT"
                        ? "৳"
                        : currency.code === "INR"
                          ? "₹"
                          : "¥"}
                  </span>
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="lg:w-[130px] xl:w-[150px] p-0 z-50">
              <div className="flex flex-col p-2 gap-1">
                {currencies.length === 0 ? (
                  <span className="text-slate-500 text-sm text-center">
                    Loading...
                  </span>
                ) : (
                  currencies.map((c) => (
                    <Button
                      key={c.code}
                      variant="ghost"
                      className="justify-start font-normal text-slate-700 hover:text-red-600 hover:bg-red-50"
                      onClick={() => setCurrency(c)}
                    >
                      {c.code}{" "}
                      {c.code === "USD"
                        ? "$"
                        : c.code === "BDT"
                          ? "৳"
                          : c.code === "INR"
                            ? "₹"
                            : "¥"}
                    </Button>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="hidden md:flex items-center lg:space-x-7 xl:space-x-8">
          {!isLoggedIn && (
            <Link
              href="/login"
              className="flex flex-col items-center lg:text-xs xl:text-sm text-slate-700 hover:text-red-600 transition duration-200"
            >
              <User size={20} />
              <span className="mt-1">Sign In</span>
            </Link>
          )}

          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="flex flex-col items-center lg:text-xs xl:text-sm text-slate-700 hover:text-red-600 transition duration-200"
            >
              <LogOut size={20} />
              <span className="mt-1">Logout</span>
            </button>
          )}
          <div className="relative">
            <MessageButton />
          </div>

          <Link
            href="/favorites" // replace with your desired route
            className="text-slate-700 hover:text-red-600 transition mr-5 flex items-center"
          >
            <Heart size={22} />
          </Link>

          <Link
            href="/cart"
            className="relative text-slate-700 hover:text-red-600 transition"
          >
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Category menu - desktop */}
      <>
        {/* Category menu - desktop */}
        <div className="hidden lg:block bg-slate-50 border-t border-slate-200 w-full">
          <div className="relative flex justify-center px-4 xl:px-0 py-3">
            <div className="flex space-x-6 xl:space-x-9">
              {categoryList.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const routeSegment = item.label
                  .toLowerCase()
                  .replace(/\s+/g, "-");

                // ✅ Robust active check
                const pathParts = pathname?.split("/").filter(Boolean) || [];
                // If locale is first segment, ignore it
                const routePart = ["en", "bn", "IN", "CN"].includes(
                  pathParts[0]
                )
                  ? pathParts[1]
                  : pathParts[0];
                const isActive = routePart === routeSegment;

                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={(e) => handleMouseEnter(e, item.children)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      href={`/${routeSegment}`}
                      className={`flex items-center sm:text-xs xl:text-sm font-medium ${
                        isActive ? "text-red-600" : "text-slate-700"
                      } hover:text-red-600 transition duration-200 py-1`}
                    >
                      {item.label}
                      {hasChildren && (
                        <svg
                          className="w-4 h-4 ml-1.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      )}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Fixed Dropdown */}
        {dropdown.children && (
          <div
            className="fixed z-[999] bg-white border border-slate-200 rounded-lg shadow-xl p-4"
            style={{ left: dropdown.x - 200, top: dropdown.y }}
            onMouseEnter={cancelHide}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              {dropdown.children.map((child) => (
                <Link
                  key={child.label}
                  href="#"
                  className="px-3 py-2 text-sm text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors rounded-md whitespace-nowrap"
                >
                  {child.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </>
    </header>
  );
};

export default Header;

{
  /* Date pickers for hotels */
}
{
  /* {isHotelsRoute && (
              <>
                <div className="w-full md:w-auto flex-grow-0">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full h-12 md:w-[140px] justify-start text-left font-normal border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {checkInDate ? format(checkInDate, "MMM dd") : <span>Check-in</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent mode="single" selected={checkInDate} onSelect={setCheckInDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="w-full md:w-auto flex-grow-0">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full h-12 md:w-[140px] justify-start text-left font-normal border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {checkOutDate ? format(checkOutDate, "MMM dd") : <span>Check-out</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={checkOutDate}
                        onSelect={setCheckOutDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </>
            )} */
}
{
  /* {isCarsRoute && (
              <>
                <div className="w-full md:w-auto flex-grow-0">
                  <Popover open={showFromDropdown} onOpenChange={setShowFromDropdown}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full h-12 md:w-[140px] justify-start text-left font-normal border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        {fromLocation ? fromLocation.name : <span>From</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0" align="start">
                      <div className="p-3 border-b">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search locations..."
                            value={fromLocationSearch}
                            onChange={(e) => setFromLocationSearch(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                          />
                        </div>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {filteredFromLocations.map((location) => (
                          <button
                            key={location.id}
                            onClick={() => {
                              setFromLocation(location)
                              setShowFromDropdown(false)
                              setFromLocationSearch("")
                            }}
                            className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-medium text-gray-900">{location.name}</div>
                            <div className="text-sm text-gray-500">{location.address}</div>
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="w-full md:w-auto flex-grow-0">
                  <Popover open={showToDropdown} onOpenChange={setShowToDropdown}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full h-12 md:w-[140px] justify-start text-left font-normal border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        {toLocation ? toLocation.name : <span>To</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0" align="start">
                      <div className="p-3 border-b">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search locations..."
                            value={toLocationSearch}
                            onChange={(e) => setToLocationSearch(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                          />
                        </div>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {filteredToLocations.map((location) => (
                          <button
                            key={location.id}
                            onClick={() => {
                              setToLocation(location)
                              setShowToDropdown(false)
                              setToLocationSearch("")
                            }}
                            className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-medium text-gray-900">{location.name}</div>
                            <div className="text-sm text-gray-500">{location.address}</div>
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </>
            )} */
}

//  {/* Mobile Search Bar */}
//         <div className="px-4 pb-4">
//           {/* Date pickers for hotels in mobile view */}
//           {isHotelsRoute && (
//             <div className="flex gap-2 mb-2">
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className="w-1/2 h-12 justify-start text-left font-normal border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
//                   >
//                     <Calendar className="mr-2 h-4 w-4" />
//                     {checkInDate ? (
//                       format(checkInDate, "MMM dd")
//                     ) : (
//                       <span>Check-in</span>
//                     )}
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-0" align="start">
//                   <CalendarComponent
//                     mode="single"
//                     selected={checkInDate}
//                     onSelect={setCheckInDate}
//                     initialFocus
//                   />
//                 </PopoverContent>
//               </Popover>

//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className="w-1/2 h-12 justify-start text-left font-normal border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
//                   >
//                     <Calendar className="mr-2 h-4 w-4" />
//                     {checkOutDate ? (
//                       format(checkOutDate, "MMM dd")
//                     ) : (
//                       <span>Check-out</span>
//                     )}
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-0" align="start">
//                   <CalendarComponent
//                     mode="single"
//                     selected={checkOutDate}
//                     onSelect={setCheckOutDate}
//                     initialFocus
//                   />
//                 </PopoverContent>
//               </Popover>
//             </div>
//           )}

//           {/* Location selectors for cars in mobile view */}
//           {isCarsRoute && (
//             <div className="flex gap-2 mb-2">
//               <Popover
//                 open={showFromDropdown}
//                 onOpenChange={setShowFromDropdown}
//               >
//                 <PopoverTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className="w-1/2 h-12 justify-start text-left font-normal border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
//                   >
//                     <MapPin className="mr-2 h-4 w-4" />
//                     {fromLocation ? fromLocation.name : <span>From</span>}
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-80 p-0" align="start">
//                   <div className="p-3 border-b">
//                     <div className="relative">
//                       <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                       <input
//                         type="text"
//                         placeholder="Search locations..."
//                         value={fromLocationSearch}
//                         onChange={(e) => setFromLocationSearch(e.target.value)}
//                         className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
//                       />
//                     </div>
//                   </div>
//                   <div className="max-h-60 overflow-y-auto">
//                     {filteredFromLocations.map((location) => (
//                       <button
//                         key={location.id}
//                         onClick={() => {
//                           setFromLocation(location);
//                           setShowFromDropdown(false);
//                           setFromLocationSearch("");
//                         }}
//                         className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
//                       >
//                         <div className="font-medium text-gray-900">
//                           {location.name}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           {location.address}
//                         </div>
//                       </button>
//                     ))}
//                   </div>
//                 </PopoverContent>
//               </Popover>

//               <Popover open={showToDropdown} onOpenChange={setShowToDropdown}>
//                 <PopoverTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className="w-1/2 h-12 justify-start text-left font-normal border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
//                   >
//                     <MapPin className="mr-2 h-4 w-4" />
//                     {toLocation ? toLocation.name : <span>To</span>}
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-80 p-0" align="start">
//                   <div className="p-3 border-b">
//                     <div className="relative">
//                       <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                       <input
//                         type="text"
//                         placeholder="Search locations..."
//                         value={toLocationSearch}
//                         onChange={(e) => setToLocationSearch(e.target.value)}
//                         className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
//                       />
//                     </div>
//                   </div>
//                   <div className="max-h-60 overflow-y-auto">
//                     {filteredToLocations.map((location) => (
//                       <button
//                         key={location.id}
//                         onClick={() => {
//                           setToLocation(location);
//                           setShowToDropdown(false);
//                           setToLocationSearch("");
//                         }}
//                         className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
//                       >
//                         <div className="font-medium text-gray-900">
//                           {location.name}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           {location.address}
//                         </div>
//                       </button>
//                     ))}
//                   </div>
//                 </PopoverContent>
//               </Popover>
//             </div>
//           )}

//           <div className="relative flex h-12">
//             {!isHotelsRoute && !isCarsRoute && (
//               <div className="h-12 flex items-center">
//                 <Select defaultValue={currentRoute || "products"}>
//                   <SelectTrigger className="h-full rounded-l-md border-r-0 border border-slate-300 bg-white px-3 py-6 text-sm text-slate-700 w-[120px]">
//                     <SelectValue placeholder="Category" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectGroup>
//                       <SelectLabel>Categories</SelectLabel>
//                       <SelectItem value="products">Products</SelectItem>
//                       <SelectItem value="hotels">Hotels</SelectItem>
//                       <SelectItem value="cars">Cars</SelectItem>
//                       <SelectItem value="flights">Flights</SelectItem>
//                       <SelectItem value="suppliers">Suppliers</SelectItem>
//                     </SelectGroup>
//                   </SelectContent>
//                 </Select>
//               </div>
//             )}

//             <input
//               type="text"
//               placeholder="What are you looking for..."
//               className={`w-full px-4 py-2.5 ${
//                 isHotelsRoute ? "rounded-md" : "rounded-r-none"
//               } border border-slate-300 focus:outline-none text-slate-700`}
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />

//             <button className="bg-red-600 text-white px-4 ml-2 py-2.5 rounded-md">
//               <Search size={20} />
//             </button>
//           </div>
//         </div>

{
  /* Mobile menu - desktop version fallback */
}
// {isMenuOpen && !isMobile && (
//   <div className="md:hidden bg-white border-t border-slate-200 shadow-lg">
//     <div className="py-3 px-4">
//       <div className="space-y-3 mt-4">
//         {categoryList
//           .filter((item) => item.label.toLowerCase() !== "ecommerce")
//           .map((item) => (
//             <Link
//               key={item.label}
//               href={`/${item.label.toLowerCase()}`}
//               className={`block py-2 text-sm ${
//                 currentRoute === item.label.toLowerCase()
//                   ? "text-red-600"
//                   : "text-slate-700"
//               } hover:text-red-600 transition duration-200`}
//             >
//               {item.label}
//             </Link>
//           ))}
//       </div>
//       <div className="mt-4 pt-4 border-t border-slate-200">
//         <Link
//           href="#"
//           className="block py-2 text-sm text-slate-700 hover:text-red-600 transition duration-200"
//         >
//           Sign In / Register
//         </Link>
//         <Link
//           href="#"
//           className="block py-2 text-sm text-slate-700 hover:text-red-600 transition duration-200"
//         >
//           Help Center
//         </Link>
//       </div>
//     </div>
//   </div>
// )}

{
  /* Insert Bus after Cars */
}
{
  /* {isCars && (
                        <div className="relative" key="bus-button">
                          <Link
                            href="/bus"
                            className={`flex items-center text-sm font-medium ${
                              currentRoute === "bus"
                                ? "text-red-600"
                                : "text-slate-700"
                            } hover:text-red-600 transition duration-200 py-1`}
                          >
                            Bus
                          </Link>
                        </div>
                      )} */
}
