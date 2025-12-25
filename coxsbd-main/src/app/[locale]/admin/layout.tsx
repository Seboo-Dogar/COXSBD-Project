"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import axiosConfig from "@/utils/axiosConfig";
import {
  LayoutDashboard,
  Server,
  ShoppingCart,
  Car,
  Bus, // <-- NEW: Import Bus icon
  Code,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  LogOut,
  Hotel,
  Plane,
  Gift,
  Wifi,
  Globe,
  Cloud,
  CpuIcon,
  Package,
  FileText,
  Plus,
} from "lucide-react";

interface SidebarItemProps {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; icon?: React.ReactNode }[];
  isOpen: boolean;
  sidebarOpen: boolean;
  toggleOpen: () => void;
}

function SidebarItem({
  name,
  icon,
  path,
  subItems,
  isOpen,
  sidebarOpen,
  toggleOpen,
}: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = path ? pathname === path : false;
  const isSubActive = subItems?.some((item) => pathname === item.path);
  const isNotSubActiveButActive = path
    ? pathname.startsWith(path) && !isSubActive
    : false;

  return (
    <div className="mb-1">
      <div
        className={`px-4 py-3 flex items-center justify-between cursor-pointer rounded-md transition-colors ${
          isActive || isSubActive || isNotSubActiveButActive
            ? "bg-red-100 text-red-800"
            : "text-gray-700 hover:bg-gray-100 hover:text-red-600"
        }`}
        onClick={subItems ? toggleOpen : undefined}
      >
        <Link href={path || "#"} className="flex items-center w-full">
          <div className="flex items-center">
            <div
              className={`${isActive || isSubActive ? "text-red-600" : "text-gray-500"} mr-3`}
            >
              {icon}
            </div>
            {sidebarOpen && <span className="font-medium">{name}</span>}
          </div>
        </Link>
        {subItems && sidebarOpen && (
          <div className="text-gray-400">
            {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </div>
        )}
      </div>

      {subItems && isOpen && sidebarOpen && (
        <div className="ml-8 mt-1 space-y-1">
          {subItems.map((item) => {
            const isSubItemActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm ${
                  isSubItemActive
                    ? "bg-red-50 text-red-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-red-600"
                }`}
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosConfig().get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  const categorySidebarItems = [
    {
      name: "Cars",
      icon: <Car size={20} />,
      path: "/admin/car",
    },
    // --- ADDED: Bus below Cars ---
    {
      name: "Bus", 
      icon: <Bus size={20} />,
      path: "/admin/bus",
    },
    // -----------------------------
    {
      name: "Hotels",
      icon: <Hotel size={20} />,
      path: "/admin/hotel",
    },
    {
      name: "Flights",
      icon: <Plane size={20} />,
      key: "flights",
      subItems: [
        { name: "Flights", path: "/admin/flights" },
        { name: "Flights Airports", path: "/admin/flights/airports" },
        { name: "Flights Airlines", path: "/admin/flights/airlines" },
        { name: "Flights Featured", path: "/admin/flights/featured" },
        { name: "Flights Suggestions", path: "/admin/flights/suggestions" },
      ],
    },
    {
      name: "Tour Package",
      icon: <Globe size={20} />,
      key: "tours",
      subItems: [
        { name: "Tours", path: "/admin/tours" },
        { name: "Tour Suggestions", path: "/admin/tours/suggestions" },
        { name: "Tour Settings", path: "/admin/tours/settings" },
      ],
    },
    {
      name: "Visa Service",
      icon: <Package size={20} />,
      key: "visa-service",
      subItems: [
        { name: "Visa Countries", path: "/admin/visa/countries" },
        { name: "Visa Bookings", path: "/admin/visa/bookings" },
      ],
    },
    {
      name: "Ecommerce",
      icon: <ShoppingCart size={20} />,
      key: "ecommerce",
      subItems: [
        { name: "Add Product", path: "/admin/add-product", icon: <Plus size={16} /> },
        { name: "Add Category", path: "/admin/add-category", icon: <Plus size={16} /> },
        ...categories.map((category) => ({
          name: category.name,
          path: `/admin/ecommerce/category/${category.id}`,
          icon: <Package size={16} />,
        })),
      ],
    },
    {
      name: "Web Hosting",
      icon: <Server size={20} />,
      path: "/admin/web-hosting",
    },
    {
      name: "Dedicated Server",
      icon: <Server size={20} />,
      path: "/admin/dedicated-server",
    },
    {
      name: "Cloud VPS",
      icon: <Server size={20} />,
      path: "/admin/cloud-vps",
    },
    {
      name: "Domain",
      icon: <Globe size={20} />,
      path: "/admin/domain",
    },
    {
      name: "Software Script",
      icon: <Code size={20} />,
      key: "software-script",
      subItems: [],
    },
    {
      name: "Wifi Data",
      icon: <Wifi size={20} />,
      path: "/admin/wifi-data",
    },
    {
      name: "Licenses",
      icon: <FileText size={20} />,
      path: "/admin/license",
    },
    {
      name: "Offers",
      icon: <Gift size={20} />,
      path: "/admin/offers",
    },
  ];

  const adminSidebarItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/admin/dashboard",
    },
    ...categorySidebarItems,
    {
      name: "Users",
      icon: <Users size={20} />,
      path: "/admin/users",
    },
    // --- ADDED: Modules above Settings ---
    {
      name: "Modules",
      icon: <CpuIcon size={20} />,
      path: "/admin/modules",
    },
    // -------------------------------------
    {
      name: "Settings",
      icon: <Settings size={20} />,
      path: "/admin/settings",
    },
  ];

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-white shadow-lg transition-all duration-300 overflow-y-auto fixed h-full z-10`}
      >
        <div className="p-4 bg-gradient-to-r from-red-700 to-red-600 text-white flex items-center justify-between">
          <img
            src="/logo.png"
            alt="Coxsbd Logo"
            className={`h-8 ${!sidebarOpen && "hidden"}`}
          />
          {!sidebarOpen && <Server size={24} />}
        </div>

        <div className="p-4">
          <nav className="mt-2 space-y-1">
            {adminSidebarItems.map((item) => (
              <SidebarItem
                key={item.name}
                name={item.name}
                icon={item.icon}
                path={item.path}
                subItems={item.subItems}
                isOpen={item.key ? openItems[item.key] || false : false}
                sidebarOpen={sidebarOpen}
                toggleOpen={() => item.key && toggleItem(item.key)}
              />
            ))}
          </nav>

          <div className="mt-8 pt-4 border-t border-gray-200">
            <Link
              href="/login"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-red-600 rounded-md"
            >
              <LogOut size={20} className="text-gray-500 mr-3" />
              {sidebarOpen && <span className="font-medium">Logout</span>}
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 ${sidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300 bg-white`}
      >
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded-md hover:bg-gray-100 text-gray-600"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 hidden md:block">
              Admin Dashboard
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 text-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              <svg
                className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center text-white">
              <Users size={20} />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 bg-white">{children}</main>
      </div>
    </div>
  );
}
