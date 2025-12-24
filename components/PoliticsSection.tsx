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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">राजनीति</h2>
              <p className="text-red-600 font-medium">राजनीतिक समाचार र विश्लेषण</p>
            </div>
          </div>
          <Link 
            href="/category/राजनीति" 
            className="hidden md:flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <span>सबै राजनीति समाचार</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Politics News */}
          <div className="lg:col-span-2">
            <Link href={`/news/${articles[0]._id}`}>
              <div className="bg-white shadow-lg overflow-hidden group cursor-pointer">
                <div className="relative h-108">
                  <img 
                    src={getImageUrl(articles[0])} 
                    alt={articles[0].title}
                    className="w-full h-full object-cover rounded"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-4xl font-bold text-white mb-2 group-hover:text-red-300 transition-colors">
                      {articles[0].title}
                    </h3>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Side Politics News */}
          <div className="space-y-6">
  {articles.slice(1, 4).map((article) => (
    <Link 
      href={`/news/${article._id}`}
      key={article._id}
      className="bg-white rounded shadow-md overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer block"
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
            className="w-5/5 h-32 object-cover "
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
            {articles.slice(4).map((article) => (
              <Link 
                href={`/news/${article._id}`}
                key={article._id}
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