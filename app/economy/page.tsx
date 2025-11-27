
"use client";

import Link from "next/link";
import { arthatantraCategories } from "@/app/datas/arthatantraData";
import { useEconomy } from "@/app/hooks/useEconomy";

export default function EconomyPage() {
  const { articles, featuredArticles, loading, error, refreshData } = useEconomy("all");

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
            onClick={refreshData}
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
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              अर्थतन्त्र
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              बैंकिङ, बजार, रोजगारी, व्यापार र आर्थिक नीतिसम्बन्धी ताजा समाचारहरू
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Navigation */}
        <div className="flex overflow-x-auto space-x-2 mb-12 pb-4 border-b">
          {arthatantraCategories.map((category) => (
            <Link
              key={category.key}
              href={
                category.key === "all"
                  ? "/economy"
                  : `/economy/${category.key}`
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
            ताजा आर्थिक समाचार
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
                  href={`/economy/article/${news._id}`}
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
                        <span>👁️ {news.views}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main News Content */}
          <div className="lg:col-span-3">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-b">
              अन्य आर्थिक समाचार
            </h3>

            {articles.slice(6).length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">कुनै थप समाचार उपलब्ध छैन</p>
              </div>
            ) : (
              <div className="space-y-8">
                {articles.slice(6).map((news) => (
                  <Link
                    key={news._id}
                    href={`/economy/article/${news._id}`}
                    className="group block"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-48 flex-shrink-0">
                        <img
                          src={news.image}
                          alt={news.title}
                          className="w-full h-36 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-xl text-gray-900 group-hover:text-green-600 transition-colors leading-tight mb-3">
                          {news.title}
                        </h4>
                        <p className="text-gray-600 mb-3 leading-relaxed line-clamp-2">
                          {news.excerpt}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{news.time}</span>
                          <span>•</span>
                          <span>👁️ {news.views}</span>
                          {news.author?.username && (
                            <>
                              <span>•</span>
                              <span>✍️ {news.author.username}</span>
                            </>
                          )}
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
            {/* Economic Indicators */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b">
                आर्थिक सूचकांक
              </h4>
              <div className="space-y-5">
                {[
                  { indicator: "मुद्रास्फीति", value: "७.५%", change: "+०.२%" },
                  { indicator: "ब्याज दर", value: "१०.२%", change: "+०.५%" },
                  { indicator: "शेयर सूचकांक", value: "२१००", change: "+१.२%" },
                  { indicator: "विदेशी मुद्रा भण्डार", value: "१२ बिलियन", change: "+५%" },
                ].map((item, index) => (
                  <div key={index} className="pb-4 border-b last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-900">{item.indicator}</span>
                      <span className="font-semibold">{item.value}</span>
                    </div>
                    <div className={`text-sm ${item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {item.change}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-6">
                आर्थिक सेवाहरू
              </h4>
              <div className="space-y-3">
                {[
                  { name: "बैंक दर", icon: "🏦" },
                  { name: "शेयर बजार", icon: "📈" },
                  { name: "मुद्रा विनिमय", icon: "💱" },
                  { name: "कर सेवा", icon: "📊" },
                  { name: "ऋण जानकारी", icon: "💰" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 hover:bg-white rounded-lg transition-colors cursor-pointer"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <div className="font-medium text-gray-900">
                      {item.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}