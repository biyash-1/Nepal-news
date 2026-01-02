"use client";

import Link from "next/link";

interface Article {
  _id: string;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
  views: number;
}

interface TechNewsProps {
  articles: Article[];
}

const getImageUrl = (article: Article) => {
  return (
    article.image ||
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
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

export default function TechNews({ articles }: TechNewsProps) {
  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-semibold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              प्रविधि समाचार
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            प्रविधिको दुनियाबाट ताजा अपडेट, नयाँ आविष्कार र डिजिटल क्रान्तिका
            समाचारहरू
          </p>
        </div>

        {articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {articles.map((tech,index) => (
                <Link
                  href={`/news/${tech._id}`}
                  key={`${tech._id}-${index}`}
                  className="group cursor-pointer"
                >
                  <div className="relative h-48  overflow-hidden">
                    <img
                      src={getImageUrl(tech)}
                      alt={tech.title}
                      className="w-full h-full object-cover rounded"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <h3 className="mt-3 font-semibold text-gray-900 text-lg transition-colors duration-300 group-hover:text-red-600 line-clamp-2">
                    {tech.title}
                  </h3>

                 
                </Link>
              ))}
            </div>

            {/* Featured Tech Story */}
      <Link
          href={`/news/${articles[0]._id}`}
          className="grid md:grid-cols-2 bg-slate-800 rounded overflow-hidden mb-10 group"
        >
          {/* Image */}
          <div className="h-64 md:h-auto overflow-hidden">
            <img
              src={getImageUrl(articles[0])}
              alt={articles[0].title}
              className="w-full h-full rounded"
            />
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 text-white flex flex-col justify-center">
            <h3 className="text-2xl md:text-3xl font-semibold mb-4 group-hover:text-amber-300 transition">
              {articles[0].title}
            </h3>
            <p className="text-white/80 line-clamp-4">{articles[0].content}</p>
          </div>
        </Link>

          </>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center">
            <p className="text-gray-500 text-lg">प्रविधि समाचार उपलब्ध छैन</p>
          </div>
        )}
      </div>
    </section>
  );
}
