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

interface FeaturedNewsProps {
  articles: Article[];
}

const getImageUrl = (article: Article) =>
  article.image ||
  "https://images.unsplash.com/photo-1546422904-90eab23c3d7e?auto=format&fit=crop&w=800&q=80";

const FeaturedNews = ({ articles }: FeaturedNewsProps) => {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="py-12">
  
  <div className="mb-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">विशेष समाचार</h2>
            <p className="text-gray-600">आजका महत्वपूर्ण समाचारहरू</p>
          </div>
          <Link
            href={`/category/${encodeURIComponent("विशेष")}`}
            className="text-red-600 font-medium hover:text-red-700 flex items-center gap-1"
          >
            सबै हेर्नुहोस् <span>&gt;</span>
          </Link>
        </div>
        <div className="h-0.5 bg-red-600 mt-2"></div>
      </div>

   
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* COLUMN 1 – Main Featured (Increased width: 5 columns) */}
        <Link href={`/news/${articles[0]._id}`} className="group lg:col-span-5">
          <div className="relative h-[420px] rounded-2xl overflow-hidden shadow-lg">
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

        {/* COLUMN 2 – Image Left, Title Right (Reduced width: 3 columns) */}
        <div className="space-y-4 lg:col-span-3">
          {articles.slice(1, 7).map((article) => (
            <Link
              key={article._id}
              href={`/news/${article._id}`}
              className="group block"
            >
              <div className="rounded-xl overflow-hidden  hover:shadow-lg transition">
                <div className="h-22">
                  <img
                    src={getImageUrl(article)}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-1">
                  <h4 className="font-bold text-gray-900 group-hover:text-red-600 line-clamp-2">
                    {article.title}
                  </h4>
                </div>
              </div>
            </Link>
          ))}
        </div>
      

        {/* COLUMN 3 – Image Top, Title Bottom (4 columns) */}
        <div className="space-y-6 lg:col-span-4">
          {articles.slice(1, 4).map((article) => (
            <Link
              key={article._id}
              href={`/news/${article._id}`}
              className="flex gap-4 rounded-xl hover: transition overflow-hidden group"
            >
              <div className="w-32 h-32 flex-shrink-0">
                <img
                  src={getImageUrl(article)}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-3 flex items-center">
                <h3 className="font-bold text-gray-900 group-hover:text-red-600 line-clamp-3">
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

export default FeaturedNews;