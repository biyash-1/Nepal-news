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

interface GlobalNewsProps {
  articles: Article[];
}

// Function to get image URL with fallback to a generic world news image
const getImageUrl = (article: Article) => {
  return (
    article.image ||
    "https://images.unsplash.com/photo-1506097425191-7ad6ce3b8e6b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
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

const GlobalNews = ({ articles }: GlobalNewsProps) => {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-br from-sky-50 to-gray-50 border-t border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Icon and "View All" Link */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">विश्व समाचार</h2>
            </div>
          </div>
          <Link
            href="/category/विश्व"
            className="hidden md:flex items-center space-x-2 bg-white px-5 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
          >
            <span className="font-medium">सबै विश्व समाचार</span>
            <svg
              className="w-5 h-5 text-blue-600"
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

        {/* Main Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - 6 News Items (3 top, 3 bottom) */}
      <div className="lg:col-span-8">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {articles.slice(0, 6).map((article) => (
      <Link
        href={`/news/${article._id}`}
        key={article._id}
        className="group cursor-pointer"
      >
        {/* 4:3 aspect ratio - common for news thumbnails */}
        <div className="relative aspect-4/3 overflow-hidden mb-3">
          <img
            src={getImageUrl(article)}
            alt={article.title}
            className="w-full h-full rounded object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-3">
          {article.title}
        </h3>
      </Link>
    ))}
  </div>
</div>

      {/* Right Column - Secondary Featured Articles */}
<div className="lg:col-span-4 space-y-2">
  {articles.slice(1, 9).map((article) => (
    <Link
      href={`/news/${article._id}`}
      key={article._id}
      className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200 group cursor-pointer"
    >
      {/* Small square image */}
      <div className="relative flex-shrink-0 w-16 h-16">
        <img
          src={getImageUrl(article)}
          alt={article.title}
          className="w-full h-full object-cover rounded-md group-hover:opacity-90 transition-opacity duration-200"
        />
      </div>
      
      {/* Title only */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-3">
          {article.title}
        </h4>
      </div>
    </Link>
  ))}
</div>
        </div>
      </div>
    </section>
  );
};

export default GlobalNews;