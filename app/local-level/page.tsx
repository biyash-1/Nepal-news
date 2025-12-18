"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocalData } from "@/app/hooks/useLocalData";

export default function LocalLevelPage() {
  const { articles, featuredArticles, loading, error, refreshData } =
    useLocalData();
  const [displayCount, setDisplayCount] = useState(12); // Show 12 initially (4x3 grid)
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    setDisplayCount(12);
  }, [articles.length]);

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setDisplayCount((prev) => prev + 12);
    setIsLoadingMore(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">समाचार लोड हुँदैछ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={refreshData}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            पुनः प्रयास गर्नुहोस्
          </button>
        </div>
      </div>
    );
  }

  const mainFeatured = featuredArticles[2];
  const otherFeatured = featuredArticles.slice(1, 4);
  const remainingArticles = articles.slice(4);
  const displayedArticles = remainingArticles.slice(0, displayCount);
  const hasMoreArticles = displayCount < remainingArticles.length;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className=" bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              स्थानीय तह
            </h1>
            <p className="text-lg text-gray-600 mb-3">
              स्थानीय सरकार, विकास कार्य, समुदाय समाचार र स्थानीय स्तरका
              जानकारीहरू
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Featured News */}
        {mainFeatured && (
          <div className="mb-10">
            <div className="flex flex-col lg:flex-row">
              {/* Left - Image */}
              <div className="lg:w-1/2">
                <Link href={`/news/${mainFeatured._id}`}>
                  <img
                    src={mainFeatured.image}
                    alt={mainFeatured.title}
                    className="w-full h-[400px] object-cover rounded hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              </div>

              {/* Right - Content */}
              <div className="lg:w-1/2 lg:pl-0 border">
                <div className="h-full p-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight hover:text-green-600 transition-colors">
                    <Link href={`/news/${mainFeatured._id}`}>
                      {mainFeatured.title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {mainFeatured.content}...
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {otherFeatured.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 border-b pb-2">
              ताजा स्थानीय समाचार
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {otherFeatured.map((news) => (
                <Link
                  key={news._id}
                  href={`/news/${news._id}`}
                  className="group"
                >
                  {/* Image Container */}
                  <div className="h-48 mb-3 overflow-hidden rounded">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2">
                      {news.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* थप स्थानीय समाचार - 4 cards per row */}
        {displayedArticles.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 border-b pb-2">
                थप स्थानीय समाचार
              </h2>
              <div className="text-sm text-gray-500">
                {displayedArticles.length} समाचार
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {displayedArticles.map((news) => (
                <Link
                  key={news._id}
                  href={`/news/${news._id}`}
                  className="group"
                >
                  {/* Smaller Square Image */}
                  <div className="h-40 mb-3 overflow-hidden rounded">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 text-sm">
                      {news.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More Button */}
            {hasMoreArticles && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed inline-flex items-center"
                >
                  {isLoadingMore ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      लोड हुँदैछ
                    </>
                  ) : (
                    <>
                      थप समाचार हेर्नुहोस्
                      <svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Show message when all articles are loaded */}
            {!hasMoreArticles && remainingArticles.length > 0 && (
              <div className="text-center mt-6 p-4 bg-green-50 rounded border border-green-100">
                <p className="text-green-700 text-sm">
                  सबै समाचार हेरिसक्नुभयो!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Show message when no articles */}
        {remainingArticles.length === 0 && articles.length > 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              तपाईंले सबै स्थानीय समाचार हेरिसक्नुभयो।
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
