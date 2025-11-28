"use client";

import Link from "next/link";
import { localCategories } from "@/app/datas/localCategories";
import { useLocalData } from "@/app/hooks/useLocalData";

export default function LocalLevelPage() {
  const { articles, featuredArticles, loading, error } = useLocalData();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">समाचार लोड हुँदैछ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            पुनः प्रयास गर्नुहोस्
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              स्थानीय तह
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              स्थानीय सरकार, विकास कार्य, समुदाय समाचार र स्थानीय स्तरका
              जानकारीहरू
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Location Navigation */}
        <div className="flex overflow-x-auto space-x-2 mb-12 pb-4 border-b">
          {localCategories.map((category) => (
            <Link
              key={category.key}
              href={
                category.key === "all"
                  ? "/local-level"
                  : `/local-level/${category.key}`
              }
              className="bg-gray-100 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap font-medium text-gray-700 hover:text-gray-900"
            >
              {category.label}
            </Link>
          ))}
        </div>

        {/* Featured News Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b">
            ताजा स्थानीय समाचार
          </h2>

          {featuredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">कुनै समाचार उपलब्ध छैन</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArticles.map((news) => (
                <Link
                  key={news._id}
                  href={`/news/${news._id}`} 
                  className="group block"
                >
                  <div className="bg-white rounded-lg overflow-hidden">
                    <div className="h-56 overflow-hidden">
                   
                      <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="py-4">
                      <h3 className="font-bold text-xl text-gray-900 group-hover:text-green-600 transition-colors leading-tight mb-2 line-clamp-2">
                        {news.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{news.time}</span>
                        <span>{news.location}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
          {/* Main News Content */}
          <div className="lg:col-span-3">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-b">
              अन्य स्थानीय समाचार
            </h3>

            {articles.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">कुनै थप समाचार उपलब्ध छैन</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.slice(6).map((news) => (
                  <Link
                    key={news._id}
                    href={`/news/${news._id}`}  
                    className="group block"
                  >
                    <div className="flex flex-col gap-4 h-full">
                      <div className="w-full flex-shrink-0">
                        <img
                          src={news.image}
                          alt={news.title}
                          className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-xl text-gray-900 group-hover:text-green-600 transition-colors leading-tight mb-3 line-clamp-2">
                          {news.title}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{news.time}</span>
                          <span>•</span>
                          <span>{news.location}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b">
                स्थानीय सरकार अपडेट
              </h4>
              <div className="space-y-5">
                {[
                  {
                    title: "नयाँ बजट घोषणा",
                    location: "काठमाडौं",
                    time: "२ घन्टा अघि",
                  },
                  {
                    title: "नागरिक सेवा कार्यक्रम",
                    location: "ललितपुर",
                    time: "१ दिन अघि",
                  },
                  {
                    title: "सफाइ अभियान",
                    location: "भक्तपुर",
                    time: "२ दिन अघि",
                  },
                  {
                    title: "सडक मर्मत सम्भार",
                    location: "पोखरा",
                    time: "३ दिन अघि",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="pb-4 border-b last:border-b-0 last:pb-0"
                  >
                    <h5 className="font-semibold text-gray-900 mb-1 leading-tight">
                      {item.title}
                    </h5>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <span>{item.location}</span>
                      <span>•</span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-gray-100 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            स्थानीय अपडेट पाउनुहोस्
          </h3>
          <p className="text-gray-700 mb-6 max-w-md mx-auto">
            तपाईंको इमेलमा ताजा स्थानीय समाचार र सरकारी अपडेटहरू प्राप्त
            गर्नुहोस्
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="तपाईंको इमेल ठेगाना"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors">
              सदस्यता लिनुहोस्
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}