"use client";

import Link from "next/link";

interface Article {
  id: string;
  title: string;
  content: string;
  image?: string;
  categories: string[];
  createdAt: string;
}

interface PoliticsSectionProps {
  articles: Article[];
}

const getImageUrl = (article: Article) => {
  return article.image || "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80";
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

const PoliticsSection = ({ articles }: PoliticsSectionProps) => {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 to-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-2xl font-bold   border-l-4 border-red-600 pl-3 text-gray-900">राजनीति</h2>
            </div>
          </div>
          <Link href="/health" className="text-red-600 font-medium flex items-center hover:text-red-700 transition-colors">
            सबै हेर्नुहोस्
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="h-0.5 bg-red-600 mt-0.5 mb-8"></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Politics News */}
          <div className="lg:col-span-2">
            <Link href={`/news/${articles[0].id}`}>
              <div className="bg-white shadow-lg overflow-hidden group cursor-pointer">
                <div className="relative h-108">
                  <img 
                    src={getImageUrl(articles[0])} 
                    alt={articles[0].title}
                    className="w-full h-full object-cover rounded"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                      {articles[0].title}
                    </h3>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Side Politics News */}
          <div className="space-y-6">
  {articles.slice(1, 4).map((article,index) => (
    <Link 
      href={`/news/${article.id}`}
      key={`${article.id}-${index}`}
      className="bg-white rounded overflow-hidden group cursor-pointer block"
    >
      <div className="flex items-center">
        <div className="w-3/5 p-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
            {article.title}
          </h4>
        </div>
        <div className="w-2/5 flex justify-end">
          <img 
            src={getImageUrl(article)} 
            alt={article.title}
            className="w-5/5 h-32 object-cover rounded"
          />
        </div>
      </div>
    </Link>
  ))}
</div>

        </div>

        {/* Additional Politics News */}
        {articles.length > 4 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {articles.slice(4).map((article,index) => (
              <Link 
                href={`/news/${article.id}`}
                key={`${article.id}-${index}`}
                className="overflow-hidden group cursor-pointer"
              >
                <div className="relative h-48">
                  <img 
                    src={getImageUrl(article)} 
                    alt={article.title}
                    className="w-full h-full rounded object-cover "
                  />
                </div>
                <div className="p-5">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PoliticsSection;