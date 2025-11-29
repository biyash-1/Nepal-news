"use client";

import Link from "next/link";

interface Article {
  _id: string;
  title: string;
  content: string;
  image?: string;
  categories: string[];
}

interface PortfolioSectionProps {
  articles: Article[];
}

const getImageUrl = (article: Article) => {
  return article.image || "https://images.unsplash.com/photo-1593115057322-e94b77572f20?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80";
};

export default function PortfolioSection({ articles }: PortfolioSectionProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            पोर्टफोलियो
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            नेपालको अग्रणी समाचार पोर्टलमा आफ्नो व्यवसायलाई प्रमोट गर्नुहोस्। 
            हामीसँग विभिन्न प्रकारका समाचार कार्डहरू उपलब्ध छन्।
          </p>
        </div>

        {articles.length > 0 ? (
          <div className="space-y-8">
            {articles.map((item) => (
              <Link 
                href={`/news/${item._id}`}
                key={item._id}
                className="group flex flex-col md:flex-row rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-white"
              >
                {/* Image */}
                <div className="md:w-1/3 h-64 md:h-auto relative flex-shrink-0">
                  <img 
                    src={getImageUrl(item)} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="md:w-2/3 p-6 flex flex-col justify-between">
                  <div>
                    {item.categories.length > 0 && (
                      <span className="inline-block bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                        {item.categories[0]}
                      </span>
                    )}
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-red-600 transition-colors mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-700 text-base leading-relaxed line-clamp-3">
                      {item.content}
                    </p>
                  </div>
                  
                  <div className="mt-4">
                    <span className="text-red-600 font-medium group-hover:underline">
                      थप पढ्नुहोस् →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center">
            <p className="text-gray-500 text-lg">पोर्टफोलियो समाचार उपलब्ध छैन</p>
          </div>
        )}
      </div>
    </section>
  );
}