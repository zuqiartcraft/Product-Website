"use client";

import { useAdminAuth } from "@/admin/contexts/AdminAuthContext";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import { LogOut } from "lucide-react";

export default function AdminHeader() {
  const { logout } = useAdminAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/admin");
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ZuqiArt&Crafts Admin
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Product Management
            </p>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
