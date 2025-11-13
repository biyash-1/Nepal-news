"use client";

import Link from 'next/link';
import { allProvinces, pradeshNewsData, trendingProvinceNews } from '@/lib/PradeshData';

const PradeshHubPage = () => {
 
  const provinceHighlights = allProvinces.map(province => {
    const news = pradeshNewsData[province.id];
    const latestNews = news ? news[0] : null;
    return {
      province,
      latestNews
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">नेपालका प्रदेशहरू</h1>
          <p className="text-xl text-red-100 max-w-3xl mx-auto">
            सबै सात प्रदेशको ताजा समाचार, अपडेट र विश्लेषण एकै ठाउँमा
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Trending Across Nepal */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-bold text-gray-900">🔥 सम्पूर्ण नेपालमा ट्रेन्डिङ</h2>
            <div className="flex items-center space-x-2 text-red-600">
              <span>ताजा अपडेट</span>
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingProvinceNews.map((news, index) => (
              <div key={news.id} className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={news.image} 
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    #{index + 1}
                  </div>
                  <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {news.province}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-red-600 transition-colors mb-2 line-clamp-2">
                    {news.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{news.views} पटक हेरिएको</span>
                    <Link 
                      href={`/pradesh/${news.id.split('-')[0]}`} 
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      थप हेर्नुहोस् →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-16"></div>

        {/* All Provinces Grid */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">🏛️ सबै प्रदेशहरू</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {allProvinces.map((province) => {
              const news = pradeshNewsData[province.id];
              const latestNews = news ? news[0] : null;
              
              return (
                <Link 
                  key={province.id} 
                  href={`/pradesh/${province.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full border border-gray-100">
                    {/* Province Header */}
                    <div 
                      className="h-32 bg-cover bg-center relative"
                      style={{ backgroundImage: `url(${province.image})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white">{province.name}</h3>
                        <p className="text-gray-200 text-sm">{province.number}</p>
                      </div>
                    </div>

                    {/* Province Info */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-gray-600">
                          <div className="font-semibold">{province.capital}</div>
                          <div>राजधानी</div>
                        </div>
                        <div className="text-sm text-gray-600 text-right">
                          <div className="font-semibold">{province.districts}</div>
                          <div>जिल्ला</div>
                        </div>
                      </div>

                      {/* Latest News Preview */}
                      {latestNews && (
                        <div className="border-t border-gray-100 pt-4 mt-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-medium">
                              {latestNews.category}
                            </span>
                            {latestNews.isBreaking && (
                              <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                                ब्रेकिङ
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-gray-900 text-sm line-clamp-2 group-hover:text-red-600 transition-colors mb-2">
                            {latestNews.title}
                          </h4>
                          <p className="text-gray-600 text-xs line-clamp-2 mb-3">
                            {latestNews.excerpt}
                          </p>
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>{latestNews.date}</span>
                            <span>{latestNews.views} पटक</span>
                          </div>
                        </div>
                      )}

                      {/* View More Button */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <button className="w-full bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition-colors text-sm">
                          प्रदेशको समाचार हेर्नुहोस्
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Section Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-16"></div>

        {/* Province Comparison */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">📊 प्रदेश तुलना</h2>
          
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-0">
              {allProvinces.map((province) => (
                <div key={province.id} className="text-center p-6 border-r border-gray-100 last:border-r-0">
                  <div className="text-2xl font-bold text-red-600 mb-2">{province.districts}</div>
                  <div className="text-sm text-gray-600 mb-1">जिल्ला</div>
                  <div className="font-semibold text-gray-900 text-sm mb-1">{province.name}</div>
                  <div className="text-xs text-gray-500">{province.population}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Latest News by Category */}
        <section>
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">📰 श्रेणी अनुसार समाचार</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { category: "राजनीति", icon: "🏛️", color: "bg-blue-100 text-blue-700" },
              { category: "आर्थिक", icon: "💰", color: "bg-green-100 text-green-700" },
              { category: "पर्यटन", icon: "🏞️", color: "bg-purple-100 text-purple-700" },
              { category: "स्वास्थ्य", icon: "🏥", color: "bg-red-100 text-red-700" }
            ].map((cat) => {
              // Find latest news in this category
              const categoryNews = Object.values(pradeshNewsData)
                .flat()
                .filter(news => news.category === cat.category)
                .sort((a, b) => b.views - a.views)[0];

              return (
                <div key={cat.category} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-2xl">{cat.icon}</span>
                    <h3 className="font-bold text-gray-900 text-lg">{cat.category}</h3>
                  </div>
                  
                  {categoryNews ? (
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-2">
                        {categoryNews.title}
                      </h4>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{categoryNews.province}</span>
                        <span>{categoryNews.views} पटक</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">कुनै समाचार छैन</p>
                  )}
                  
                  <button className="w-full mt-4 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                    सबै हेर्नुहोस्
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Newsletter Subscription */}
        <div className="bg-gradient-to-r from-red-500 via-pink-500 to-red-600 rounded-3xl p-10 md:p-16 text-white text-center shadow-2xl mt-16">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-4xl font-bold mb-4">प्रदेश समाचार पाउनुहोस्</h3>
            <p className="text-red-100 mb-8 text-lg">
              सबै सात प्रदेशको ताजा समाचार सिधै तपाईंको इमेलमा
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="तपाईंको इमेल ठेगाना"
                className="flex-1 px-6 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/50 shadow-lg"
              />
              <button className="bg-white text-red-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all whitespace-nowrap shadow-lg hover:shadow-xl">
                सदस्यता लिनुहोस्
              </button>
            </div>
            <p className="text-sm text-red-100 mt-6 flex items-center justify-center gap-2">
              दैनिक अपडेट। कुनै स्प्याम छैन। 📰
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PradeshHubPage;