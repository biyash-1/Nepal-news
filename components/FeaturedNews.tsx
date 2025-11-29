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

const getImageUrl = (article: Article) => {
  return article.image || "https://images.unsplash.com/photo-1546422904-90eab23c3d7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
};

const FeaturedNews = ({ articles }: FeaturedNewsProps) => {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">विशेष समाचार</h2>
          <p className="text-gray-600">आजका महत्वपूर्ण समाचारहरू</p>
        </div>
    <Link
  href={`/category/${encodeURIComponent("विशेष")}`}
  className="text-red-600 font-medium flex items-center hover:text-red-700 transition-colors"
>
  सबै हेर्नुहोस्
</Link>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Featured Article */}
        <div className="lg:col-span-2">
          <Link href={`/news/${articles[0]._id}`}>
            <div className="relative h-[530px] rounded-2xl overflow-hidden group cursor-pointer shadow-lg">
              <img 
                src={getImageUrl(articles[0])} 
                alt={articles[0].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                {articles[0].categories.length > 0 && (
                  <span className="inline-block bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold mb-3">
                    {articles[0].categories[0]}
                  </span>
                )}
                <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg hover:text-red-300 transition-colors mb-3">
                  {articles[0].title}
                </h2>
                <p className="text-gray-200 text-lg line-clamp-2">
                  {articles[0].content.substring(0, 150)}...
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Side Featured Articles */}
        <div className="space-y-6">
          {articles.slice(1, 4).map((article) => (
            <Link 
              href={`/news/${article._id}`}
              key={article._id}
              className="block group"
            >
              <div className="relative h-40 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                <img 
                  src={getImageUrl(article)} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-bold text-lg text-white drop-shadow-lg hover:text-red-300 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Additional Featured News Grid */}
      {articles.length > 4 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.slice(4).map((article) => (
            <Link 
              href={`/news/${article._id}`}
              key={article._id}
              className="group"
            >
              <div className="relative h-64 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                <img 
                  src={getImageUrl(article)} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  {article.categories.length > 0 && (
                    <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-semibold mb-2">
                      {article.categories[0]}
                    </span>
                  )}
                  <h4 className="font-bold text-white group-hover:text-red-300 transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedNews;