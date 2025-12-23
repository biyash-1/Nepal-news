"use client";
import { useCategoryNews } from "@/app/hooks/useCategoryNews";
import Link from "next/link";
import { useState, useMemo, useRef } from "react";

interface Props {
  category: string;
  title: string;
  gradient?: string;
}

const CategoryNewsPage = ({ category, title, gradient }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { news, loading, error, totalPages } = useCategoryNews(category, currentPage);
  const tajaSamacharRef = useRef<HTMLDivElement>(null);

  const deduplicatedNews = useMemo(() => {
    const seen = new Set<string>();
    return news.filter((article) => {
      if (seen.has(article._id)) return false;
      seen.add(article._id);
      return true;
    });
  }, [news]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "अहिलै";
    if (diffInHours < 24) return `${diffInHours} घण्टा अघि`;
    return `${Math.floor(diffInHours / 24)} दिन अघि`;
  };

  const getImageSrc = (img?: string) => {
    return img && img.trim() !== ""
      ? img
      : `https://images.unsplash.com/photo-${
          category === "technology"
            ? "1550745165"
            : category === "health"
            ? "1576091160399"
            : "1495020689067"
        }-?auto=format&fit=crop&w=800&q=80`;
  };

  const getCategoryColor = () => {
    const colors = {
      technology: {
        primary: "bg-blue-600",
        light: "bg-blue-50",
        text: "text-blue-600",
        gradient: "from-blue-500 to-blue-600",
      },
      health: {
        primary: "bg-green-600",
        light: "bg-green-50",
        text: "text-green-600",
        gradient: "from-green-500 to-green-600",
      },
      education: {
        primary: "bg-purple-600",
        light: "bg-purple-50",
        text: "text-purple-600",
        gradient: "from-purple-500 to-purple-600",
      },
      default: {
        primary: "bg-indigo-600",
        light: "bg-indigo-50",
        text: "text-indigo-600",
        gradient: "from-indigo-500 to-indigo-600",
      },
    };
    return colors[category as keyof typeof colors] || colors.default;
  };

  const { primary, light, text, gradient: catGradient } = getCategoryColor();

  const featuredNews = deduplicatedNews[0] || null;
  const headlineNews = deduplicatedNews.slice(1, 5);
  const moreNews = deduplicatedNews.slice(5);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    
    // Scroll to the "ताजा समाचार" section smoothly
    setTimeout(() => {
      tajaSamacharRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-lg font-medium transition-all ${
          currentPage === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : `${primary} text-white hover:opacity-90`
        }`}
      >
        पछाडि
      </button>
    );

    // First page
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            currentPage === 1
              ? `${primary} text-white`
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
          }`}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="dots1" className="px-2 text-gray-500">
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            currentPage === i
              ? `${primary} text-white`
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="dots2" className="px-2 text-gray-500">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            currentPage === totalPages
              ? `${primary} text-white`
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-lg font-medium transition-all ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : `${primary} text-white hover:opacity-90`
        }`}
      >
        अगाडि
      </button>
    );

    return (
      <div className="flex items-center justify-center gap-2 my-8">
        {pages}
      </div>
    );
  };

  if (loading && deduplicatedNews.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-16 h-16 rounded-full border-4 border-gray-200"></div>
            <div className={`absolute top-0 left-0 w-16 h-16 rounded-full border-4 ${primary} border-t-transparent animate-spin`}></div>
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
        <div className="text-center max-w-md mx-auto p-4">
          <div className="text-red-500 text-6xl">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">समाचार लोड गर्न असफल</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className={`${primary} text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity`}
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
      <div className={`sticky top-0 z-10 bg-gradient-to-r ${catGradient} shadow-lg`}>
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-semibold text-white">{title}</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-0.5 bg-blue-600 mt-2 mb-8"></div>

        {/* Featured News Section */}
        {featuredNews && headlineNews.length > 0 && (
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Featured news */}
              <div className="lg:w-2/3">
                <Link href={`/news/${featuredNews._id}`} className="group block">
                  <div className="relative h-[400px] rounded overflow-hidden">
                    <img
                      src={getImageSrc(featuredNews.featuredImage || featuredNews.image)}
                      alt={featuredNews.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-white leading-tight mb-4 group-hover:text-blue-400 transition-colors">
                        {featuredNews.title}
                      </h2>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Headline news grid */}
              <div className="lg:w-1/3">
                <div className="grid grid-cols-2 gap-3">
                  {headlineNews.slice(0, 4).map((newsItem) => (
                    <Link key={newsItem._id} href={`/news/${newsItem._id}`} className="group block">
                      <div className="rounded overflow-hidden">
                        <img
                          src={getImageSrc(newsItem.featuredImage || newsItem.image)}
                          alt={newsItem.title}
                          className="w-full h-40 object-cover"
                          loading="lazy"
                        />
                        <h3 className="mt-2 text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {newsItem.title}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Latest News Grid */}
        {moreNews.length > 0 && (
          <div className="mb-12" ref={tajaSamacharRef}>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl border-l-4 border-blue-600 font-bold text-gray-900 pl-3">
                ताजा समाचार
              </h3>
            </div>
            <div className="h-0.5 bg-blue-600 mt-2 mb-8"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {moreNews.map((article) => (
                <Link
                  href={`/news/${article._id}`}
                  key={article._id}
                  className="group transition-all duration-300 overflow-hidden"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={getImageSrc(article.featuredImage || article.image)}
                      alt={article.title}
                      className="w-full h-48 object-cover rounded"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-2">
                    <h4 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                      {article.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        {renderPagination()}
      </div>
    </div>
  );
};

export default CategoryNewsPage;