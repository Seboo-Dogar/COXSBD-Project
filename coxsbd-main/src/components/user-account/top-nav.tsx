"use client";

import { Bell, LayoutDashboard, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function TopNav({ setMobileOpen }: any) {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-base font-bold text-gray-600 dark:text-gray-400 hidden md:block">
          <span>Dashboard</span>
        </div>
        <div className="flex items-center space-x-2 text-base font-bold text-gray-600 dark:text-gray-400 sm:block md:hidden">
          <Image
            src="/logo.png"
            alt="Logo"
            width={200}
            height={200}
            className="object-contain"
          />
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Theme Toggle */}
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button> */}

          {/* Notifications */}
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          {/* User Profile */}

          {/* Mobile trigger */}

          <div className="flex items-center space-x-2 sm:block md:hidden">
            <div
              className="w-8 h-8 flex items-center justify-center"
              onClick={() => setMobileOpen(true)}
            >
              <LayoutDashboard className="h-5 w-5" />
            </div>
          </div>

          <div className="flex items-center space-x-2 hidden md:flex">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium">Account</span>
          </div>
        </div>
      </div>
    </header>
  );
}
