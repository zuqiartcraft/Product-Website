"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { Search } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50 transition-colors">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold text-blue-600 dark:text-blue-400"
          >
            ZuqiArt&Crafts
          </Link>

          <div className="flex items-center gap-4 flex-1 max-w-2xl mx-8">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
