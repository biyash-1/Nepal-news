"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useEconomy } from "@/app/hooks/useEconomy";

export default function EconomyPage() {
  const { articles, featuredArticles, loading, error, refreshData } = useEconomy("all");
  const [displayCount, setDisplayCount] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    setDisplayCount(12);
  }, [articles.length]);

  const mainFeatured = featuredArticles[0];
  const middleSectionNews = featuredArticles.slice(1, 6);
  // FIX: Changed from slice(7) to slice(6) to match middleSectionNews end
  const remainingArticles = articles.slice(3);
  const displayedArticles = remainingArticles.slice(0, displayCount);
  const hasMoreArticles = displayCount < remainingArticles.length;

  const loadMoreArticles = useCallback(() => {
    if (isLoadingMore || !hasMoreArticles) return;
    
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayCount((prev) => prev + 12);
      setIsLoadingMore(false);
    }, 500);
  }, [isLoadingMore, hasMoreArticles]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "200px",
      threshold: 0.1,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMoreArticles && !isLoadingMore) {
        loadMoreArticles();
      }
    }, options);

    const currentLoadMoreRef = loadMoreRef.current;
    if (currentLoadMoreRef) {
      observerRef.current.observe(currentLoadMoreRef);
    }

    return () => {
      if (observerRef.current && currentLoadMoreRef) {
        observerRef.current.unobserve(currentLoadMoreRef);
      }
    };
  }, [hasMoreArticles, isLoadingMore, loadMoreArticles]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-20" style={{ width: '75%' }}>
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">समाचार लोड हुँदैछ...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-20" style={{ width: '75%' }}>
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6" style={{ width: '75%' }}>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            अर्थतन्त्र
          </h1>
          <p className="text-lg text-gray-600">
            बैंकिङ, बजार, रोजगारी, व्यापार र आर्थिक नीतिसम्बन्धी ताजा समाचारहरू
          </p>
        </div>

      {/* Main Featured News */}
{mainFeatured && (
  <div className="mb-10">
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="lg:w-1/2">
        <Link href={`/news/${mainFeatured._id}`}>
          <img
            src={mainFeatured.image}
            alt={mainFeatured.title}
            className="w-full h-[400px] object-cover rounded"
          />
        </Link>
      </div>

      <div className="lg:w-1/2 border">
        <div className="h-full p-4 flex flex-col justify-center items-center text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight hover:text-green-600 transition-colors">
            <Link href={`/news/${mainFeatured._id}`}>
              {mainFeatured.title}
            </Link>
          </h2>
          <p className="text-gray-600 mb-4">
            {mainFeatured.excerpt || mainFeatured.content}
          </p>
        </div>
      </div>
    </div>
  </div>
)}

        {/* Middle Section - ताजा आर्थिक समाचार */}
        {middleSectionNews.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
              ताजा आर्थिक समाचार
            </h2>

            <hr className="w-full border-t-2 border-red-600 mt-1 mb-5" />

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Column - Large featured news */}
              {middleSectionNews[0] && (
                <div className="lg:w-1/2">
                  <Link href={`/news/${middleSectionNews[0]._id}`} className="group">
                    <div className="mb-3 overflow-hidden rounded">
                      <img
                        src={middleSectionNews[0].image}
                        alt={middleSectionNews[0].title}
                        className="w-full h-[300px] object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-green-600 transition-colors">
                      {middleSectionNews[0].title}
                    </h3>
                  </Link>
                </div>
              )}

              {/* Middle Column - 2 medium news */}
              <div className="lg:w-1/4 space-y-6">
                {middleSectionNews.slice(1, 3).map((news) => (
                  <Link key={news._id} href={`/news/${news._id}`} className="group block">
                    <div className="mb-2 overflow-hidden rounded">
                      <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-[130px] object-cover"
                      />
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm leading-tight group-hover:text-green-600 transition-colors">
                      {news.title}
                    </h4>
                  </Link>
                ))}
              </div>

              {/* Right Column - 2 small news */}
              <div className="lg:w-1/4 space-y-4">
                {middleSectionNews.slice(0, 6).map((news) => (
                  <Link key={news._id} href={`/news/${news._id}`} className="group flex gap-3">
                    <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded">
                      <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-green-600 transition-colors line-clamp-3">
                        {news.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* थप आर्थिक समाचार - Infinite Scroll */}
        {displayedArticles.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 whitespace-nowrap">
                थप आर्थिक समाचार
              </h2>
              <div className="flex-grow h-0.5 bg-red-600 ml-4"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {displayedArticles.map((news, index) => (
                <Link
                  key={news._id}
                  href={`/news/${news._id}`}
                  className="group animate-fadeIn"
                  style={{
                    animationDelay: `${(index % 12) * 50}ms`,
                    opacity: 0,
                    animation: 'fadeIn 0.5s ease-in forwards'
                  }}
                >
                  <div className="h-40 mb-3 overflow-hidden rounded">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-full object-cover"
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

            {/* Infinite Scroll Trigger */}
            {hasMoreArticles && (
              <div ref={loadMoreRef} className="text-center mt-8 py-4">
                {isLoadingMore && (
                  <div className="flex justify-center items-center">
                    <svg
                      className="animate-spin h-8 w-8 text-green-600"
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
                    <span className="ml-3 text-gray-600">थप समाचार लोड हुँदैछ...</span>
                  </div>
                )}
              </div>
            )}

            {/* All articles loaded message */}
            {!hasMoreArticles && remainingArticles.length > 0 && (
              <div className="text-center mt-6 p-4 bg-green-50 rounded border border-green-100">
                <p className="text-green-700 text-sm">
                  सबै समाचार हेरिसक्नुभयो!
                </p>
              </div>
            )}
          </div>
        )}

        {remainingArticles.length === 0 && articles.length > 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              तपाईंले सबै आर्थिक समाचार हेरिसक्नुभयो।
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}