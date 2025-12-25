"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { categoryList } from "@/utils/data";

interface CategoryMenuProps {
  isMobile?: boolean;
}

const CategoryMenu: React.FC<CategoryMenuProps> = ({ isMobile = false }) => {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {},
  );

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <div
      className={`${isMobile ? "" : "border border-slate-200 rounded-lg overflow-hidden"}`}
    >
      {categoryList.map((category) => (
        <div
          key={category.label}
          className="border-b border-slate-100 last:border-b-0"
        >
          <div
            className={`flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-slate-50 ${
              openCategories[category.label] ? "bg-slate-50" : ""
            }`}
            onClick={() => toggleCategory(category.label)}
          >
            <span className="text-sm font-medium text-slate-700">
              {category.label}
            </span>
            {category.children && (
              <span className="text-slate-400">
                {openCategories[category.label] ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
              </span>
            )}
          </div>
          {category.children && openCategories[category.label] && (
            <div className="bg-slate-50 pl-6 pr-4 py-2">
              {category.children.map((subCategory) => (
                <Link
                  key={subCategory.label}
                  href="#"
                  className="block py-2 text-sm text-slate-600 hover:text-red-600 transition duration-200"
                >
                  {subCategory.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CategoryMenu;
