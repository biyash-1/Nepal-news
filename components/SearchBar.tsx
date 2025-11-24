"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  return (
   <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-1/3">
  <input
    type="text"
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    onKeyPress={handleKeyPress}
    placeholder="समाचार खोज्नुहोस्..."
    className="bg-transparent focus:outline-none text-sm flex-1"
  />

  <button
    onClick={handleSearch}
    className="text-gray-500 hover:text-red-600 transition-colors"
    aria-label="search"
  >
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

  );
}