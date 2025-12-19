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

interface LocalLevelNewsProps {
  articles: Article[];
}

const getImageUrl = (article: Article) =>
  article.image ||
  "https://images.unsplash.com/photo-1546422904-90eab23c3d7e?auto=format&fit=crop&w=800&q=80";

const LocalLevelNews = ({ articles }: LocalLevelNewsProps) => {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="py-12">
      <div className="mb-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">स्थानीय तह समाचार</h2>
          </div>
          <Link
            href={`/local-level`}
            className="text-red-600 font-medium hover:text-red-700 flex items-center gap-1"
          >
            सबै हेर्नुहोस् <span>&gt;</span>
          </Link>
        </div>
        <div className="h-0.5 bg-red-600 mt-2"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* COLUMN 1 – Main Featured (Increased width & height) */}
        <Link href={`/news/${articles[0]._id}`} className="group lg:col-span-5">
          <div className="relative h-[520px] rounded-xl overflow-hidden ">
            <img
              src={getImageUrl(articles[0])}
              alt={articles[0].title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            <div className="absolute bottom-0 p-6">
              <h2 className="text-2xl font-bold text-white group-hover:text-red-300 transition-colors line-clamp-3">
                {articles[0].title}
              </h2>
            </div>
          </div>
        </Link>

        {/* COLUMN 2 – Two square cards */}
        <div className="space-y-4 lg:col-span-3">
          {articles.slice(1, 3).map((article) => (
            <Link
              key={article._id}
              href={`/news/${article._id}`}
              className="group block"
            >
              <div className="rounded overflow-hidden hover:transition">
                {/* Square image */}
                <div className="h-48 w-full">
                  <img
                    src={getImageUrl(article)}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 group-hover:text-red-600 line-clamp-2">
                    {article.title}
                  </h4>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* COLUMN 3 – Small square images */}
        <div className="space-y-4 lg:col-span-4">
          {articles.slice(1, 7).map((article) => (
            <Link
              key={article._id}
              href={`/news/${article._id}`}
              className="flex gap-4  hover:transition overflow-hidden group"
            >
              {/* Small square image */}
              <div className="w-18 h-16 shrink-0">
                <img
                  src={getImageUrl(article)}
                  alt={article.title}
                  className="w-full rounded h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 p-2 flex items-center">
                <h3 className="font-semibold text-gray-900 group-hover:text-red-600 line-clamp-3">
                  {article.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocalLevelNews;