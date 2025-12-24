"use client";

import Link from "next/link";
import { formatTimeAgo } from "@/lib/formatTime";

interface Article {
  _id: string;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
}

interface PortfolioSectionProps {
  articles: Article[];
}

const getImageUrl = (article: Article) =>
  article.image ||
  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80";

const PortfolioSection = ({ articles }: PortfolioSectionProps) => {
  if (!articles.length) return null;

  const featured = articles[1];
  const gridArticles = articles.slice(0, 4);
  const vichar = articles.slice(1, 4);

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* SECTION TITLE */}
        <div className="mb-8 border-b pb-3">
          <h2 className="text-3xl font-semibold text-gray-900">पोर्टफोलियो</h2>
        </div>

        {/* BIG FEATURE CARD */}
        <Link
          href={`/news/${featured._id}`}
          className="grid md:grid-cols-2 bg-slate-800 rounded overflow-hidden shadow-lg mb-10 group"
        >
          {/* Image */}
          <div className="h-64 md:h-auto overflow-hidden">
            <img
              src={getImageUrl(featured)}
              alt={featured.title}
              className="w-full h-full rounded"
            />
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 text-white flex flex-col justify-center">
            <h3 className="text-2xl md:text-3xl font-semibold mb-4 group-hover:text-amber-300 transition">
              {featured.title}
            </h3>
            <p className="text-white/80 line-clamp-4">{featured.content}</p>
          </div>
        </Link>

        {/* LOWER GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 3 IMAGE CARDS */}
          <div className="lg:col-span-8 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {gridArticles.map((article) => (
              <Link
                key={article._id}
                href={`/news/${article._id}`}
                className=" rounded overflow-hidden  hover:transition group"
              >
                <div className="h-44 overflow-hidden">
                  <img
                    src={getImageUrl(article)}
                    alt={article.title}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold  group-hover:text-amber-600 transition line-clamp-3">
                    {article.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>

          {/* VICHAR SECTION */}
          {/* VICHAR SECTION */}
          <div className="lg:col-span-4">
            <h3 className="text-lg font-semibold text-red-600 mb-4">विचार</h3>

            <div className="space-y-4">
              {vichar.map((article) => (
                <Link
                  key={article._id}
                  href={`/news/${article._id}`}
                  className="flex gap-3 items-start hover:bg-gray-50 p-2 rounded-md transition"
                >
            
                  <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-full">
                    <img
                      src={getImageUrl(article)}
                      alt={article.title}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>

                  {/* Text */}
                  <div className="flex flex-col">
                    <h4 className="text-lg font-semibold line-clamp-3 hover:text-red-600 transition">
                      {article.title}
                    </h4>
                    <span className="text-xs text-gray-500 mt-1">
                      {formatTimeAgo(article.createdAt)}
                    </span>
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

export default PortfolioSection;
