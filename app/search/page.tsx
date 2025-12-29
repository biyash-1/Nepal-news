"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import axiosInstance from "@/lib/axios";

interface SearchResult {
  _id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  publishedAt: string;
  author: string;
  slug: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (query) {
      searchNews(query);
    }
  }, [query]);

  const searchNews = async (searchQuery: string) => {
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.get(`/articles/search`, {
        params: { q: searchQuery },
      });

      // Axios automatically parses JSON, data is in response.data
      setResults(response.data.results || []);
    } catch (err) {
      setError("खोजीमा समस्या भयो। पुनः प्रयास गर्नुहोस्।");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-[75%] mx-auto bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="border-l-4 border-blue-600 pl-4 text-2xl font-bold text-gray-800">
            {query}
          </h1>
          <div className="h-0.5 bg-blue-600 mt-2 mb-8"></div>
          <p className="text-gray-600">
            {loading ? "खोजिँदै..." : `${results.length} वटा समाचार फेला पर्यो`}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => searchNews(query)}
              className="mt-4 bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors"
            >
              पुनः प्रयास गर्नुहोस्
            </button>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && results.length === 0 && query && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              कुनै समाचार फेला परेन
            </h3>
            <p className="text-gray-500">
              कृपया अर्को शब्दले खोज्नुहोस् वा different कीवर्ड प्रयोग
              गर्नुहोस्।
            </p>
          </div>
        )}

        {/* Search Results */}
        {!loading && results.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {results.map((result) => (
              <Link
                key={result._id}
                href={`/news/${result._id}`}
                className="  overflow-hidden  transition-shadow duration-300"
              >
                
                  <div className="relative h-48">
                    {result.image ? (
                      <img
                        src={result.image}
                        alt={result.title}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-lg">📷</span>
                      </div>
                    )}
                  </div>
                

                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 ">
                    {result.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!query && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              समाचार खोज्नुहोस्
            </h3>
            <p className="text-gray-500">
              माथिको खोज बाकसमा आफूले खोज्न चाहेको समाचारको शब्द लेख्नुहोस्।
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
