"use client";
import { useCategoryNews } from "@/app/hooks/useCategoryNews";
import Link from "next/link";
import { useState, useEffect, useRef, useMemo } from "react";

interface Props {
  category: string;
  title: string;
  gradient?: string;
}

const CategoryNewsPage = ({ category, title, gradient }: Props) => {
  const { news, popularNews, trendingNews, loading, error, loadMore, totalPages, currentPage } =
    useCategoryNews(category);
  const [email, setEmail] = useState("");
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const previousCategoryRef = useRef(category);
  const observerRef = useRef<IntersectionObserver | null>(null);

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

  // Reset scroll and cleanup observer when category changes
  useEffect(() => {
    if (previousCategoryRef.current !== category) {
      console.log(`Category changed: ${previousCategoryRef.current} -> ${category}`);
      previousCategoryRef.current = category;
      
      // Disconnect old observer
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      
      // Reset scroll position
      window.scrollTo(0, 0);
    }
  }, [category]);

  // Setup IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current) return;

    // Disconnect previous observer if exists
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (
          first.isIntersecting &&
          !loading &&
          currentPage < totalPages
        ) {
          console.log(`Loading page ${currentPage + 1}...`);
          loadMore();
        }
      },
      {
        rootMargin: "200px",
      }
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [loading, currentPage, totalPages, loadMore]);

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
      : `https://images.unsplash.com/photo-${category === 'technology' ? '1550745165' : category === 'health' ? '1576091160399' : '1495020689067'}-?auto=format&fit=crop&w=800&q=80`;
  };

  const getCategoryColor = () => {
    const colors = {
      technology: {
        primary: "bg-blue-600",
        light: "bg-blue-50",
        text: "text-blue-600",
        border: "border-blue-200",
        hover: "hover:bg-blue-50",
        gradient: "from-blue-500 to-blue-600",
      },
      health: {
        primary: "bg-green-600",
        light: "bg-green-50",
        text: "text-green-600",
        border: "border-green-200",
        hover: "hover:bg-green-50",
        gradient: "from-green-500 to-green-600",
      },
      education: {
        primary: "bg-purple-600",
        light: "bg-purple-50",
        text: "text-purple-600",
        border: "border-purple-200",
        hover: "hover:bg-purple-50",
        gradient: "from-purple-500 to-purple-600",
      },
      default: {
        primary: "bg-indigo-600",
        light: "bg-indigo-50",
        text: "text-indigo-600",
        border: "border-indigo-200",
        hover: "hover:bg-indigo-50",
        gradient: "from-indigo-500 to-indigo-600",
      },
    };
    return colors[category as keyof typeof colors] || colors.default;
  };

  const { primary, light, text, border, hover, gradient: catGradient } = getCategoryColor();

  const getCategoryIcon = () => {
    const icons = {
      technology: "💻",
      health: "🏥",
      education: "📚",
      default: "📰"
    };
    return icons[category as keyof typeof icons] || icons.default;
  };

  // Use deduplicated news
  const featuredNews = deduplicatedNews.length > 0 ? deduplicatedNews[0] : null;
  const headlineNews = deduplicatedNews.slice(1, 6);
  const moreNews = deduplicatedNews.slice(6);

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
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-500 text-6xl mb-6">⚠️</div>
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
          <div className="flex flex-col md:flex-row md:items-center text-center justify-between gap-4">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-3xl md:text-4xl font-semibold mb-3 text-white">
                {title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container w-[75%] mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <h3 className="text-3xl border-l-4 border-blue-600 font-bold text-gray-900 pl-3">{title}</h3>
          <Link href="/category/music" className="text-blue-600 hover:text-red-700 font-medium">
            सबै हेर्नुहोस् →
          </Link>
        </div>
        <div className="h-0.5 bg-blue-600 mt-2 mb-8"></div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Main Content (75%) */}
          <div className="lg:w-3/4">
            {/* Featured News Section */}
            {featuredNews && headlineNews.length > 0 && (
              <div className="mb-12 grid gap-6">
                {/* Upper Row */}
                <div className="grid grid-cols-3 gap-6">
                  {/* Left Column: Featured news spans 2/3 */}
                  <div className="col-span-2 h-full">
                    <Link href={`/news/${featuredNews._id}`} className="group block h-full">
                      <div className="relative h-full rounded overflow-hidden">
                        <img
                          src={getImageSrc(featuredNews.featuredImage || featuredNews.image)}
                          alt={featuredNews.title}
                          className="absolute inset-0 w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-white leading-tight mb-4 group-hover:text-blue-600 transition-colors">
                            {featuredNews.title}
                          </h2>
                        </div>
                      </div>
                    </Link>
                  </div>

                  {/* Right Column: 2 stacked news */}
                  <div className="flex flex-col gap-6">
                    {headlineNews.slice(0, 2).map((newsItem) => (
                      <Link key={newsItem._id} href={`/news/${newsItem._id}`} className="group block">
                        <div className="rounded overflow-hidden">
                          <img
                            src={getImageSrc(newsItem.featuredImage || newsItem.image)}
                            alt={newsItem.title}
                            className="w-full h-40 object-cover"
                            loading="lazy"
                          />
                          <h3 className="pl-2 mt-2 text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                            {newsItem.title}
                          </h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Lower Row: 3 equal columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {headlineNews.slice(2, 5).map((newsItem) => (
                    <Link key={newsItem._id} href={`/news/${newsItem._id}`} className="group block w-full">
                      <div className="flex h-20 w-full">
                        <img
                          src={getImageSrc(newsItem.featuredImage || newsItem.image)}
                          alt={newsItem.title}
                          className="w-26 h-full object-cover rounded"
                          loading="lazy"
                        />
                        <div className="p-4 flex items-center flex-1">
                          <h3 className="text-base font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                            {newsItem.title}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Latest News Grid */}
            {moreNews.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl border-l-4 border-blue-600 font-bold text-gray-900 pl-3">ताजा समाचार</h3>
                </div>
                <div className="h-0.5 bg-blue-600 mt-2 mb-8"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {moreNews.slice(0, currentPage * 30).map((article) => (
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

            {/* Infinite Scroll Sentinel */}
            {currentPage < totalPages && (
              <div ref={loadMoreRef} className="flex justify-center py-10">
                {loading && (
                  <div className="flex items-center gap-3 text-gray-500">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-transparent"></div>
                    समाचार लोड हुँदैछ...
                  </div>
                )}
              </div>
            )}

            {currentPage === totalPages && totalPages > 1 && (
              <div className="text-center py-12">
                <div className={`inline-flex items-center justify-center w-16 h-16 ${light} rounded-full mb-4`}>
                  <span className="text-2xl">🎉</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">धन्यवाद!</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  तपाईंले {deduplicatedNews.length} समाचारहरू हेर्नुभयो। नयाँ समाचारहरूको लागि फेरि भेटौंला।
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar (25%) */}
          <div className="lg:w-1/4 space-y-8">
            <div className="sticky top-24">
              <div className="overflow-hidden">
                <div className={`px-5 py-1`}>
                  <h4 className="text-lg font-bold flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                    लोकप्रिय समाचार
                  </h4>
                </div>
                <div className="divide-y divide-gray-100">
                  {popularNews.length > 0 ? (
                    popularNews.map((article, index) => (
                      <Link
                        href={`/news/${article._id}`}
                        key={article._id}
                        className="group block p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 bg-gray-100">
                            <img
                              src={article.image}
                              alt={article.title}
                              className="w-26 h-18 object-cover rounded"
                              loading="lazy"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-gray-900 text-base leading-tight group-hover:text-blue-600 transition-colors line-clamp-3">
                              {article.title}
                            </h5>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      कुनै लोकप्रिय समाचार छैन
                    </div>
                  )}
                </div>
              </div>

              <div className={`${light} border ${border} rounded-xl p-5 overflow-hidden`}>
                <div className="px-5 py-1">
                  <h4 className="text-lg font-bold flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                    </svg>
                    हाल ट्रेन्डिङ
                  </h4>
                </div>
                <div className="divide-y divide-gray-100 mt-3">
                  {trendingNews.length > 0 ? (
                    trendingNews.map((article) => (
                      <Link
                        key={article._id}
                        href={`/news/${article._id}`}
                        className="group block p-2"
                      >
                        <div className="flex items-start gap-3">
                          {article.image && (
                            <div className="w-26 h-18 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                              <img
                                src={article.image}
                                alt={article.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-gray-900 text-base leading-tight group-hover:text-blue-600 transition-colors line-clamp-3">
                              {article.title}
                            </h5>
                          </div>
                          {article.isTrending && (
                            <span className="text-xs ml-2 flex-shrink-0">🔥</span>
                          )}
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      कुनै ट्रेन्डिङ समाचार छैन
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryNewsPage;