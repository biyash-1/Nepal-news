"use client";
import { useCategoryNews } from "@/app/hooks/useCategoryNews";
import Link from "next/link";
import { useState, useMemo } from "react";

interface Props {
  category: string;
  title: string;
  gradient?: string;
}

const CategoryNewsPage = ({ category, title, gradient }: Props) => {
  const { news, loading, error } = useCategoryNews(category);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Deduplicate news array as safety net
  const deduplicatedNews = useMemo(() => {
    const seen = new Set<string>();
    return news.filter((article) => {
      if (seen.has(article._id)) {
        console.warn(`Duplicate detected: ${article._id}`);
        return false;
      }
      seen.add(article._id);
      return true;
    });
  }, [news]);

  const getImageSrc = (img?: string) => {
    return img && img.trim() !== ""
      ? img
      : `https://images.unsplash.com/photo-${category === 'technology' ? '1550745165' : category === 'health' ? '1576091160399' : '1495020689067'}-?auto=format&fit=crop&w=800&q=80`;
  };

  const getCategoryColor = () => {
    const colors = {
      technology: {
        gradient: "from-blue-500 to-blue-600",
      },
      health: {
        gradient: "from-green-500 to-green-600",
      },
      education: {
        gradient: "from-purple-500 to-purple-600",
      },
      default: {
        gradient: "from-indigo-500 to-indigo-600",
      },
    };
    return colors[category as keyof typeof colors] || colors.default;
  };

  const { gradient: catGradient } = getCategoryColor();

  // Pagination logic
  const totalPages = Math.ceil(deduplicatedNews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNews = deduplicatedNews.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && deduplicatedNews.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-16 h-16 rounded-full border-4 border-gray-200"></div>
            <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-6 text-lg text-gray-600 font-medium">समाचार लोड हुँदैछ...</p>
          <p className="text-gray-400 text-sm mt-2">कृपया प्रतिक्षा गर्नुहोस्</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-500 text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">समाचार लोड गर्न असफल</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            पुन: प्रयास गर्नुहोस्
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Category Header */}
      <div className={`bg-gradient-to-r ${catGradient} shadow-lg`}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-semibold text-white">
              {title}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* News Grid - 4 columns */}
        {currentNews.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentNews.map((article) => (
                <Link
                  href={`/news/${article._id}`}
                  key={article._id}
                  className="group transition-all duration-300"
                >
                  <div className="bg-white rounded overflow-hidden  hover transition-shadow">
                    <div className="relative overflow-hidden">
                      <img
                        src={getImageSrc(article.featuredImage || article.image)}
                        alt={article.title}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors line-clamp-3">
                        {article.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  पछाडि
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-4 py-2 rounded font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  अगाडि
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-gray-400 text-6xl mb-4">📰</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">कुनै समाचार फेला परेन</h3>
            <p className="text-gray-600">यो श्रेणीमा अहिले कुनै समाचार उपलब्ध छैन।</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryNewsPage;