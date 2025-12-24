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

interface EducationNewsProps {
  articles: Article[];
}

const getImageUrl = (article: Article) => {
  return (
    article.image ||
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs6cxoawnslMNC2DaEj4ukeP67sxHw5FOzlg&s"
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
    return "अहिले";
  }
};

const EducationNews = ({ articles }: EducationNewsProps) => {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-3xl font-bold text-gray-900">शिक्षा समाचार</h2>
            </div>
            <Link href="/education" className="text-red-600 font-medium flex items-center hover:text-red-700 transition-colors">
              सबै हेर्नुहोस्
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="h-0.5 bg-red-600 mt-0.5"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Left Column - Featured Article */}
          <div className="lg:col-span-1">
            {articles.slice(0, 1).map((article) => (
              <Link
                href={`/news/${article._id}`}
                key={article._id}
                className="rounded shadow-lg overflow-hidden group cursor-pointer border block"
              >
                <div className="relative">
                  <img
                    src={getImageUrl(article)}
                    alt={article.title}
                    className="w-full h-[200px] object-cover rounded"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    {article.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Columns - Two columns of small news items */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Column - 3 items */}
            <div className="space-y-4">
              {articles.slice(1, 4).map((article) => (
                <Link
                  href={`/news/${article._id}`}
                  key={article._id}
                  className="rounded overflow-hidden group cursor-pointer block"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-20 flex-shrink-0">
                      <img
                        src={getImageUrl(article)}
                        alt={article.title}
                        className="w-full h-full rounded object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-3">
                        {article.title}
                      </h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Second Column - 3 items */}
            <div className="space-y-4">
              {articles.slice(4, 7).map((article) => (
                <Link
                  href={`/news/${article._id}`}
                  key={article._id}
                  className="rounded overflow-hidden group cursor-pointer block"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-20 flex-shrink-0">
                      <img
                        src={getImageUrl(article)}
                        alt={article.title}
                        className="w-full h-full rounded object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-3">
                        {article.title}
                      </h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationNews;