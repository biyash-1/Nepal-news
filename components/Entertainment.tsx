"use client";
import Link from "next/link";

interface Article {
  _id: string;
  title: string;
  content: string;
  image?: string;
  featuredImage?: string;
  categories: string[];
  createdAt: string;
}

interface EntertainmentNewsProps {
  articles: Article[];
}

const getImageUrl = (article: Article) => {
  return article.featuredImage || article.image || "https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80";
};

export default function EntertainmentNews({ articles }: EntertainmentNewsProps) {
  if (!articles || articles.length === 0) {
    return null;
  }

  const mainArticle = articles[0];
  const sideArticles = articles.slice(1, 3);

  return (
    <section className="mb-10 py-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold border-l-4 border-red-600 pl-3">मनोरञ्जन</h2>
          <Link href="/entertainment" className="text-red-600 font-medium flex items-center hover:text-red-700 transition-colors">
            सबै हेर्नुहोस्
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="h-0.5 bg-red-600 mt-2"></div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Link href={`/news/${mainArticle._id}`}>
            <div className="relative h-[500px] overflow-hidden rounded group cursor-pointer">
              <img 
                src={getImageUrl(mainArticle)} 
                alt={mainArticle.title}
                className="w-full h-full object-cover "
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg hover:text-red-300 transition-colors">
                  {mainArticle.title}
                </h2>
              </div>
            </div>
          </Link>
        </div>

        <div className="space-y-6">
          {sideArticles.map((news: Article) => (
            <div key={news._id} className="relative h-59 overflow-hidden rounded group cursor-pointer">
              <Link href={`/news/${news._id}`}>
                <img 
                  src={getImageUrl(news)} 
                  alt={news.title}
                  className="w-full h-full object-cover "
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-semibold text-xl text-white drop-shadow-lg hover:text-red-300 transition-colors">
                    {news.title}
                  </h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}