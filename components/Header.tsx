"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaCalendarAlt } from "react-icons/fa";
import { useAuthStore } from "@/app/store/useAuthStore";
import AuthModal from "./AuthModel";
import UserProfileDropdown from "./UserProfileDropdown";

export default function Header() {
  const [currentDate, setCurrentDate] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    } as const;
    const date = new Date().toLocaleDateString("ne-NP", options);
    setCurrentDate(date);
  }, []);

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50 w-[80%] mx-auto">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-red-600 hover:text-red-700">
                नेपाल समाचार
              </Link>
            </div>

            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-1/3">
              <input
                type="text"
                placeholder="समाचार खोज्नुहोस्..."
                className="bg-transparent w-full focus:outline-none text-sm"
              />
              <button className="text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <UserProfileDropdown />
              ) : (
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  Login
                </button>
              )}
            </div>

            {/* Date */}
            <div className="hidden md:block text-sm text-gray-600">
              <span>{currentDate}</span>
            </div>
          </div>
        </div>

        <nav className="border-t border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center overflow-x-auto space-x-6 py-3">
              <Link
                href="/"
                className="whitespace-nowrap text-red-600 font-medium border-b-2 border-red-600 pb-1"
              >
                गृहपृष्ठ
              </Link>
              <Link
                href="/politics"
                className="whitespace-nowrap text-gray-700 hover:text-red-600"
              >
                राजनीति
              </Link>
              <Link
                href="/sports"
                className="whitespace-nowrap text-gray-700 hover:text-red-600"
              >
                खेलकुद
              </Link>
              <Link
                href="#"
                className="whitespace-nowrap text-gray-700 hover:text-red-600"
              >
                अर्थतन्त्र
              </Link>
              <Link
                href="#"
                className="whitespace-nowrap text-gray-700 hover:text-red-600"
              >
                स्वास्थ्य
              </Link>
              <Link
                href="/technology"
                className="whitespace-nowrap text-gray-700 hover:text-red-600"
              >
                विज्ञान र प्रविधि
              </Link>
              <Link
                href="#"
                className="whitespace-nowrap text-gray-700 hover:text-red-600"
              >
                मनोरञ्जन
              </Link>
              <Link
                href="/global"
                className="whitespace-nowrap text-gray-700 hover:text-red-600"
              >
                विश्व
              </Link>
              <Link
                href="#"
                className="whitespace-nowrap text-gray-700 hover:text-red-600"
              >
                ब्लग
              </Link>

              <div className="relative">
                <FaCalendarAlt className="text-gray-600" />
              </div>
            </div>
          </div>
        </nav>
      </header>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
}