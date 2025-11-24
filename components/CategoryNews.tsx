"use client";
import { useCategoryNews } from "@/app/hooks/useCategoryNews";
import Link from "next/link";

interface Props {
  category: string;
  title: string;
  gradient?: string;
}

const CategoryNewsPage = ({ category, title, gradient }: Props) => {
  const { news, popularNews, loading, error, loadMore, totalPages, currentPage } =
    useCategoryNews(category);

  console.log(`News for category "${category}":`, news);
  console.log("Popular news:", popularNews);

  const bg = gradient || "from-green-50 to-blue-50";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "अहिलै";
    } else if (diffInHours < 24) {
      return `${diffInHours} घण्टा अघि`;
    } else {
      return `${Math.floor(diffInHours / 24)} दिन अघि`;
    }
  };

  const getCategoryColor = () => {
    const colors = {
      technology: { primary: "blue", badge: "blue" },
      health: { primary: "green", badge: "green" },
      education: { primary: "purple", badge: "purple" },
      default: { primary: "green", badge: "green" },
    };

    return colors[category as keyof typeof colors] || colors.default;
  };

  const { primary, badge } = getCategoryColor();

  if (loading && news.length === 0) {
    return (
      <section className={`py-7 bg-gradient-to-br ${bg}`}>
        <div className="container mx-auto px-8">
          <div className="text-center py-4">
            <div
              className={`animate-spin rounded-full h-12 w-12 border-b-2 border-${primary}-600 mx-auto`}
            ></div>
            <p className="mt-4 text-gray-600">समाचार लोड हुँदैछ...</p>
          </div>
        </div>
      </section>
    );
  }

  const featuredNews = news[0];
  const otherNews = news.slice(1);

  return (
    <section className={`py-8 bg-gradient-to-br ${bg} min-h-screen`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-gray-200 pb-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className={`p-3 bg-${primary}-600 rounded-lg`}>
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9m0 0v3m0-3V6a2 2 0 012-2h2a2 2 0 012 2v3"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {featuredNews && (
              <div className="mb-10 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <Link href={`/news/${featuredNews.id}`}>
                  <div className="relative cursor-pointer group">
                    <img
                      src={featuredNews.featuredImage || featuredNews.image}
                      alt={featuredNews.title}
                      className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    <div className="absolute top-6 left-6"></div>

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                      <div className="flex items-center space-x-4 text-white/90 text-sm mb-3"></div>

                      <h2 className="text-white text-3xl font-bold mb-4 leading-tight hover:text-red-300 transition-colors">
                        {featuredNews.title}
                      </h2>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherNews.map((article, index) => (
                <Link
                  href={`/news/${article.id}`}
                  key={article.id}
                  className="group cursor-pointer border-gray-100 pb-6 hover:border-gray-300 transition-all duration-300"
                >
                  <div className="relative mb-4 overflow-hidden">
                    <img
                      src={article.featuredImage || article.image}
                      alt={article.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3"></div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-700 transition-colors line-clamp-3">
                      {article.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More and Pagination Controls */}
            {news.length > 0 && (
              <div className="flex flex-col items-center mt-12 space-y-4">
                {currentPage < totalPages && (
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className={`bg-${primary}-600 text-white px-8 py-4 rounded-lg hover:bg-${primary}-700 transition-all disabled:opacity-50 flex items-center space-x-3 shadow-lg hover:shadow-xl`}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span className="font-medium">लोड हुँदैछ...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        <span className="font-medium">
                          थप समाचार हेर्नुहोस्
                        </span>
                      </>
                    )}
                  </button>
                )}

                {currentPage === totalPages && totalPages > 1 && (
                  <div className="text-center text-gray-600 py-6 border-t border-gray-200 w-full">
                    <p className="text-lg">
                      तपाईंले सबै समाचार हेर्नुभयो ({news.length} समाचार)
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      फेरी भेटौंला नयाँ समाचारहरूको साथ
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Popular News - Now using स्वास्थ्य and लोकप्रिय categories */}
            <div className="overflow-hidden">
              <div className="py-2 px-2">
                <h4 className="font-bold text-lg text-center">लोकप्रिय समाचार</h4>
              </div>
              <div className="p-6 space-y-6">
                {popularNews.map((article, index) => (
                  <Link 
                    href={`/news/${article.id}`}
                    key={article.id} 
                    className="group cursor-pointer p-1 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex space-x-4">
                      <div className="relative flex-shrink-0">
                        <img
                          src={article.featuredImage || article.image}
                          alt={article.title}
                          className="w-30 h-20 object-cover rounded group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-blue-700 transition-colors line-clamp-2 mb-1">
                          {article.title}
                        </h5>
                        <p className="text-xs text-gray-500">
                          {formatDate(article.createdAt)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div
              className={`bg-gradient-to-br from-${primary}-50 to-${primary}-100 rounded-xl shadow-md border border-${primary}-200 overflow-hidden`}
            >
              <div className={`bg-${primary}-700 px-6 py-4`}>
                <h4 className="font-bold text-lg text-white">दुरुत लिंकहरू</h4>
              </div>
              <div className="p-6 space-y-3">
                <button className="w-full text-left hover:text-blue-600 transition-all duration-300 flex items-center justify-between group py-3 px-4 hover:bg-white rounded-lg">
                  <span className="font-medium">{category} भिडियो</span>
                  <svg
                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
                <button className="w-full text-left text-gray-700 hover:text-blue-600 transition-all duration-300 flex items-center justify-between group py-3 px-4 hover:bg-white rounded-lg">
                  <span className="font-medium">{category} पाठ्यक्रम</span>
                  <svg
                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
                <button className="w-full text-left text-gray-700 hover:text-blue-600 transition-all duration-300 flex items-center justify-between group py-3 px-4 hover:bg-white rounded-lg">
                  <span className="font-medium">{category} विशेषज्ञ</span>
                  <svg
                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
                <button className="w-full text-left text-gray-700 hover:text-blue-600 transition-all duration-300 flex items-center justify-between group py-3 px-4 hover:bg-white rounded-lg">
                  <span className="font-medium">{category} इभेन्ट</span>
                  <svg
                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 text-white">
              <h4 className="font-bold text-lg mb-3">न्यूजलेटर सदस्यता</h4>
              <p className="text-gray-300 text-sm mb-4">
                {category} को ताजा समाचार सिधै आफ्नो इमेलमा प्राप्त गर्नुहोस्
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="तपाईंको इमेल"
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  className={`w-full bg-${primary}-600 hover:bg-${primary}-700 text-white py-3 rounded-lg font-medium transition-colors`}
                >
                  सब्सक्राइब गर्नुहोस्
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryNewsPage;