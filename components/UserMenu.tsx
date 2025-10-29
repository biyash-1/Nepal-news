"use client";

import { useState } from "react";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
import { useAuthStore } from "@/app/store/useAuthStore";

export default function UserMenu() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
  };

  if (!isAuthenticated || !user) {
    return (
      <button
        onClick={() =>
          alert("Open AuthModal here (Login / Signup modal)")
        }
        className="text-sm bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition"
      >
        Login / Signup
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full hover:bg-gray-200 transition"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt="User Avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <FaUserCircle className="w-6 h-6 text-gray-600" />
        )}
        <span className="text-sm font-medium text-gray-700 hidden sm:block">
          {user.name}
        </span>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <Link
            href="/profile"
            onClick={() => setDropdownOpen(false)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            View Profile
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
