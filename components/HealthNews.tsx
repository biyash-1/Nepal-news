
"use client";

import { useHealthNews } from '@/app/hooks/useHealthNews';
import { useState } from 'react';

const HealthNews = () => {
  const { 
    healthNews, 
    featuredHealthNews, 
    loading, 
    error, 
    loadMore 
  } = useHealthNews();
  const [selectedNews, setSelectedNews] = useState<string | null>(null);

  const healthTips = [
    "दिनमा कम्तीमा ८ गिलास पानी पिउनुहोस्",
    "नियमित ३० मिनेट व्यायाम गर्नुहोस्",
    "ताजा फलफूल र सब्जी खानुहोस्",
    "कम्तीमा ७-८ घण्टा निद लिनुहोस्",
    "तनाव प्रबन्धनका लागि ध्यान गर्नुहोस्"
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'अहिलै';
    } else if (diffInHours < 24) {
      return `${diffInHours} घण्टा अघि`;
    } else {
      return `${Math.floor(diffInHours / 24)} दिन अघि`;
    }
  };

  
//   const fallbackHealthNews = [
//     {
//       _id: '1',
//       title: "कोभिड-१९ को नयाँ प्रकारको सतर्कता",
//       content: "विश्व स्वास्थ्य संगठनले कोभिड-१९ को नयाँ प्रकारको सम्बन्धमा सतर्कता जारी गरेको छ।",
//       excerpt: "विश्व स्वास्थ्य संगठनले कोभिड-१९ को नयाँ प्रकारको सम्बन्धमा सतर्कता जारी गरेको छ।",
//       image: "https://images.unsplash.com/photo-1584516150908-2a7b2dfb091b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
//       categories: ["health"],
//       author: { _id: '1', username: "डा. सुजन श्रेष्ठ" },
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//       featured: true
//     },
//     {
//       _id: '2',
//       title: "नेपालमा मानसिक स्वास्थ्य सेवाको अवस्था",
//       content: "युवामाझ बढ्दो मानसिक रोगको समस्यामा विशेषज्ञहरुको चासो",
//       excerpt: "युवामाझ बढ्दो मानसिक रोगको समस्यामा विशेषज्ञहरुको चासो",
//       image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
//       categories: ["health"],
//       author: { _id: '2', username: "डा. प्रिया शर्मा" },
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString()
//     }
//   ];

  // Use fallback data if no data from API
  const displayNews = healthNews;
  const displayFeatured = featuredHealthNews.length > 0 ? featuredHealthNews[0] : displayNews[0];

  if (loading && healthNews.length === 0) {
    return (
      <section className="py-12 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">समाचार लोड हुँदैछ...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error && healthNews.length === 0) {
    return (
      <section className="py-12 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-600 py-8">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              पुनः प्रयास गर्नुहोस्
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">स्वास्थ्य</h2>
              <p className="text-green-600 font-medium">स्वास्थ्य सम्बन्धी ताजा समाचार र जानकारी</p>
            </div>
          </div>
          <button className="hidden md:flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <span>सबै स्वास्थ्य समाचार</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content - 3 columns */}
          <div className="lg:col-span-3">
            {/* Featured Health News */}
            {displayFeatured && (
              <div className="mb-8">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="relative">
                    <img 
                      src={displayFeatured.image} 
                      alt={displayFeatured.title}
                      className="w-full h-80 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        फिचर्ड
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                      <div className="flex items-center space-x-4 text-white text-sm mb-2">
                        <span className="bg-green-600 px-2 py-1 rounded">स्वास्थ्य</span>
                        <span>{formatDate(displayFeatured.createdAt)}</span>
                      </div>
                      <h3 className="text-white text-2xl font-bold mb-2">{displayFeatured.title}</h3>
                      <p className="text-gray-200 line-clamp-2">
                        {displayFeatured.excerpt || displayFeatured.content.substring(0, 150)}...
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-green-300">{displayFeatured.author.username}</span>
                        <button className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors">
                          पढ्न जारी राख्नुहोस्
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Health News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayNews.slice(1).map((news) => (
                <div 
                  key={news._id} 
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  onClick={() => setSelectedNews(news._id)}
                >
                  <div className="relative">
                    <img 
                      src={news.image} 
                      alt={news.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                        स्वास्थ्य
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">{news.title}</h4>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {news.excerpt || news.content.substring(0, 100)}...
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{news.author.username}</span>
                      <span>{formatDate(news.createdAt)}</span>
                    </div>
                    <button className="w-full mt-3 bg-green-50 text-green-600 py-2 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium">
                      पढ्नुहोस्
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {healthNews.length > 0  && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'लोड हुँदैछ...' : 'थप समाचार हेर्नुहोस्'}
                </button>
              </div>
            )}
          </div>

          {/* Sidebar - 1 column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Health Tips */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h4 className="font-bold text-gray-900 mb-4 text-lg">स्वास्थ्य सल्लाह</h4>
              <div className="space-y-3">
                {healthTips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-700 text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-red-50 rounded-xl shadow-md p-6 border border-red-200">
              <h4 className="font-bold text-gray-900 mb-4 text-lg">आपतकालीन सम्पर्क</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-red-100">
                  <span className="text-gray-700">एम्बुलेन्स</span>
                  <span className="font-bold text-red-600">१०२</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-red-100">
                  <span className="text-gray-700">पुलिस</span>
                  <span className="font-bold text-red-600">१००</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-red-100">
                  <span className="text-gray-700">अग्निशमन</span>
                  <span className="font-bold text-red-600">१०१</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">स्वास्थ्य केन्द्र</span>
                  <span className="font-bold text-red-600">१११५</span>
                </div>
              </div>
            </div>

            {/* Popular Health News */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h4 className="font-bold text-gray-900 mb-4 text-lg">लोकप्रिय समाचार</h4>
              <div className="space-y-4">
                {displayNews.slice(0, 3).map((news) => (
                  <div key={news._id} className="flex space-x-3">
                    <img 
                      src={news.image} 
                      alt={news.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h5 className="font-medium text-sm text-gray-900 line-clamp-2">{news.title}</h5>
                      <p className="text-xs text-gray-500">{formatDate(news.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HealthNews;