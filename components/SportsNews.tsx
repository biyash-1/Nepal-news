"use client";

import Link from "next/link";

interface Article {
  _id: string;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
}

interface SportsNewsProps {
  articles: Article[];
}

const getImageUrl = (article: Article) => {
  return (
    article.image ||
    "https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  );
};

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
    const diffMins = Math.floor(diffMs / (1000 * 60));
    return `${diffMins} मिनेट अघि`;
  }
};

export default function SportsNews({ articles }: SportsNewsProps) {
  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-600 rounded-lg">
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">खेलकुद</h2>
              <p className="text-blue-600 font-medium">
                ताजा खेल समाचार र अपडेट
              </p>
            </div>
          </div>
          <Link
            href="/category/खेलकुद"
            className="hidden md:flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <span>सबै खेल समाचार</span>
            <svg
              className="w-4 h-4"
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
          </Link>
        </div>

        {articles && articles.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Sports News */}
            <div className="lg:col-span-2">
              <Link href={`/news/${articles[0]._id}`}>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer h-full">
                  <div className="relative">
                    <img
                      src={getImageUrl(articles[0])}
                      alt={articles[0].title}
                      className="w-full h-83 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                      <h3 className="text-white text-2xl font-bold mb-2 group-hover:text-red-300 transition-colors">
                        {articles[0].title}
                      </h3>
                    </div>
                  </div>
                 
                </div>
              </Link>
            </div>

        {/* Side Sports News */}
<div className="space-y-4">
  {articles.slice(1, 5).map((article) => (
    <Link
      href={`/news/${article._id}`}
      key={article._id}
      className="flex items-center gap-4 group"
    >
      {/* Image */}
      <div className="w-1/3">
        <img
          src={getImageUrl(article)}
          alt={article.title}
          className="w-full h-20 object-cover"
        />
      </div>

      {/* Title */}
      <div className="w-2/3 flex items-center">
        <h4 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
          {article.title}
        </h4>
      </div>
    </Link>
  ))}p
</div>

          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center">
            <p className="text-gray-500 text-lg">खेलकुद समाचार उपलब्ध छैन</p>
          </div>
        )}
      </div>
    </section>
  );
}
