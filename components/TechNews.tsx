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
  return article.image || "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80";
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
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              प्रविधि समाचार
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            प्रविधिको दुनियाबाट ताजा अपडेट, नयाँ आविष्कार र डिजिटल क्रान्तिका समाचारहरू
          </p>
        </div>

        {articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {articles.map((tech) => (
                <Link 
                  href={`/news/${tech._id}`}
                  key={tech._id} 
                  className="group cursor-pointer"
                >
                  <div className="relative h-48 rounded-lg overflow-hidden">
                    <img
                      src={getImageUrl(tech)}
                      alt={tech.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <h3 className="mt-3 font-semibold text-gray-900 text-lg transition-colors duration-300 group-hover:text-red-600 line-clamp-2">
                    {tech.title}
                  </h3>
                  
                  <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                    <span>{getTimeAgo(tech.createdAt)}</span>
                    <span>👁️ {tech.views || 0}+</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Featured Tech Story */}
            {articles[0] && (
              <Link href={`/news/${articles[0]._id}`}>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="relative h-80 lg:h-full">
                      <img 
                        src={getImageUrl(articles[0])}
                        alt={articles[0].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
                      <div className="absolute bottom-6 left-6 text-white">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold mb-2 inline-block">
                          विशेष समाचार
                        </span>
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-300 transition-colors">
                          {articles[0].title}
                        </h3>
                        <p className="text-gray-200 line-clamp-2">
                          {articles[0].content.substring(0, 100)}...
                        </p>
                      </div>
                    </div>
                    <div className="p-8">
                      <h4 className="text-xl font-bold text-gray-900 mb-4">प्रविधि क्षेत्रमा नेपाल</h4>
                      <div className="space-y-4">
                        {[
                          "डिजिटल नेपालको नयाँ पहल",
                          "युवा उद्यमीहरूले लगानी आकर्षण गर्दै",
                          "सरकारले प्रविधि क्षेत्रमा विशेष बजेट",
                          "अन्तर्राष्ट्रिय कम्पनीहरूको नेपालमा लगानी"
                        ].map((item, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                      <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                        पूरै रिपोर्ट पढ्नुहोस्
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            )}
          </>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center">
            <p className="text-gray-500 text-lg">प्रविधि समाचार उपलब्ध छैन</p>
          </div>
        )}

        {/* Tech Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { number: "५००+", label: "टेक स्टार्टअप", icon: "🚀", color: "text-purple-600" },
            { number: "१५K+", label: "प्रविधि पेशेवर", icon: "👨‍💻", color: "text-blue-600" },
            { number: "८५%", label: "इन्टरनेट प्रयोग", icon: "🌐", color: "text-green-600" },
            { number: "२०+", label: "डिजिटल सेवा", icon: "📱", color: "text-orange-600" }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className={`text-2xl mb-2 ${stat.color}`}>{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
              <div className="text-gray-600 text-sm mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}