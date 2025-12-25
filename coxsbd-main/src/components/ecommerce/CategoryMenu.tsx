"use client";

import Link from "next/link";

interface Category {
  name: string;
  slug: string;
  icon: any;
}

interface Props {
  categories: Category[];
  selectedCategory?: string;
}

export default function CategoryMenu({ categories, selectedCategory }: Props) {
  return (
    <div className="w-full bg-white border-t border-b border-gray-200 sticky top-16 z-10">
      <div className="max-w-8xl mx-auto px-6">
        <div className="flex overflow-x-auto justify-start md:justify-center space-x-3 py-3">
          <Link href={`/ecommerce`}>
            <button
              className={`flex flex-col items-center p-3 w-20 flex-shrink-0 border rounded-md transition ${
                selectedCategory === undefined
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 hover:shadow-md"
              }`}
            >
              All
            </button>
          </Link>

          {categories.map(({ name, slug, icon: Icon }) => (
            <Link key={slug} href={`/ecommerce/category/${slug}`}>
              <button
                className={`flex flex-col items-center p-3 w-20 flex-shrink-0 border rounded-md transition ${
                  selectedCategory === name
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:shadow-md"
                }`}
              >
                <Icon className="text-3xl text-sky-600 mb-1" />
                <span className="text-xs font-medium text-center">{name}</span>
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
