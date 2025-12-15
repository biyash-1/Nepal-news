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

interface LatestNewsProps {
  articles: Article[];
}

const getImageUrl = (article: Article) => {
  return article.image || "https://images.unsplash.com/photo-1546422904-90eab23c3d7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80";
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

export default function LatestNews({ articles }: LatestNewsProps) {
  return (
    <section className="mb-10 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold border-l-4 border-red-600 pl-3">ताजा समाचार</h2>
        <Link href="/category/latest" className="text-red-600 font-medium flex items-center hover:text-red-700 transition-colors">
          सबै हेर्नुहोस्
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.length > 0 ? (
          articles.map((article) => (
            <Link 
              href={`/news/${article._id}`}
              key={article._id}
              className="rounded-lg overflow-hidden news-card cursor-pointer group"
            >
              <img 
                src={getImageUrl(article)} 
                alt={article.title} 
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-4">
                {article.categories.length > 0 && (
                  <span className="text-xs text-red-600 font-semibold mb-2 inline-block">
                    {article.categories[0]}
                  </span>
                )}
                <h3 className="text-2xl font-bold mt-2 mb-2 text-gray-800 transition-colors duration-300 group-hover:text-red-600">
                  {article.title}
                </h3>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-3 text-center py-10 text-gray-500">
            कुनै समाचार उपलब्ध छैन
          </div>
        )}
      </div>
    </section>
  );
}