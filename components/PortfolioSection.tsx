"use client";

import Link from "next/link";

interface Article {
  _id: string;
  title: string;
  content: string;
  image?: string;
  categories: string[];
  createdAt: string;
}

interface PortfolioSectionProps {
  articles: Article[];
}

// Function to get image URL with fallback to portfolio-related image
const getImageUrl = (article: Article) => {
  return (
    article.image ||
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  );
};

// Function to calculate relative time
const getTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    return `${diffDays} दिन अघि`;
  } else if (diffHours > 0) {
    return `${diffHours} घण्टा अघि`;
  } else {
    return "अहिले";
  }
};

const PortfolioSection = ({ articles }: PortfolioSectionProps) => {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-br from-amber-50 to-white border-t border-b border-amber-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Icon and Gradient Border */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">पोर्टफोलियो समाचार</h2>
              </div>
              <p className="text-gray-600 text-lg">
                निवेश, बजार र आर्थिक विश्लेषण
              </p>
            </div>
            <Link
              href="/category/portfolio"
              className="hidden md:flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              <span>सबै हेर्नुहोस्</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
          <div className="h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"></div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Main Featured Article */}
          <div className="lg:col-span-6">
            {articles[0] && (
              <Link
                href={`/news/${articles[0]._id}`}
                className="group block rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-white"
              >
                <div className="relative h-80 md:h-96 overflow-hidden">
                  <img
                    src={getImageUrl(articles[0])}
                    alt={articles[0].title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      मुख्य समाचार
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 p-6">
                    <div className="flex items-center text-white/90 mb-3">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm">{getTimeAgo(articles[0].createdAt)}</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-amber-300 transition-colors">
                      {articles[0].title}
                    </h2>
                    <p className="text-white/80 line-clamp-2">
                      {articles[0].content.substring(0, 150)}...
                    </p>
                  </div>
                </div>
              </Link>
            )}
          </div>

          {/* Middle Column - Two Featured Articles */}
          <div className="lg:col-span-3 space-y-6">
            {articles.slice(1, 3).map((article) => (
              <Link
                key={article._id}
                href={`/news/${article._id}`}
                className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getImageUrl(article)}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
                <div className="p-5">
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{getTimeAgo(article.createdAt)}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-3">
                    {article.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Column - List of Articles */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-100 border-b">
                <h3 className="font-bold text-gray-900">ताजा अपडेट</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {articles.slice(3, 8).map((article) => (
                  <Link
                    key={article._id}
                    href={`/news/${article._id}`}
                    className="flex items-start gap-3 p-4 hover:bg-amber-50/50 transition-colors duration-200 group"
                  >
                    <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-amber-500"></div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-3">
                        {article.title}
                      </h4>
                      <div className="flex items-center mt-1 text-gray-500 text-xs">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>{getTimeAgo(article.createdAt)}</span>
                      </div>
                    </div>
                    <svg
                      className="w-4 h-4 text-gray-400 group-hover:text-amber-600 transition-colors flex-shrink-0 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Stats/Info Box */}
            <div className="mt-6 p-5 bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl text-white">
              <div className="flex items-center mb-3">
                <svg
                  className="w-6 h-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <h4 className="font-bold">बजार अवलोकन</h4>
              </div>
              <p className="text-sm text-amber-100">
                नेपाली बजारको ताजा विश्लेषण र निवेशका अवसरहरू
              </p>
              <Link
                href="/market-analysis"
                className="mt-4 inline-flex items-center text-sm font-medium hover:text-amber-200 transition-colors"
              >
                विस्तृत विश्लेषण हेर्नुहोस्
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile "View All" Button */}
        <div className="mt-8 md:hidden">
          <Link
            href="/category/portfolio"
            className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 w-full shadow-md"
          >
            <span>सबै पोर्टफोलियो समाचार हेर्नुहोस्</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;