"use client";

import { pradeshData } from '@/lib/PradeshData';
import { notFound, useParams } from 'next/navigation';
import { usePradeshNews } from '@/app/hooks/usePradeshNews';

// Fallback news data
const fallbackNews = {
  id: "fallback",
  title: "यस प्रदेशका थप समाचारहरू चाँडै नै उपलब्ध हुनेछन्",
  content: "हामी यस प्रदेशका नयाँ समाचारहरू संकलन गर्दैछौं। यस प्रदेशका ताजा समाचारहरू चाँडै नै उपलब्ध हुनेछन्।",
  image: "https://images.unsplash.com/photo-1584824486539-53bb4646bdbc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
  categories: ["प्रदेश", "सामान्य"],
  author: {
    id: "system",
    username: "समाचार टिम"
  },
  createdAt: new Date().toISOString()
};

const getImageUrl = (article: any) => {
  return article?.image || "https://images.unsplash.com/photo-1584824486539-53bb4646bdbc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80";
};

const getExcerpt = (content: string, maxLength: number = 150) => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + "...";
};

export default function PradeshNewsPage() {
  const params = useParams();
  const pradeshId = params?.pradeshId as string;
  
  const pradesh = pradeshData[pradeshId];
  
  if (!pradesh) {
    notFound();
  }

  const { mainNews, featuredNews, headlineNews, regularNews, loading, error } = usePradeshNews(pradesh.name);

  // Prepare data with fallbacks
  const displayMainNews = mainNews || fallbackNews;
  const displayFeaturedNews = [
    ...(featuredNews || []),
    ...Array(Math.max(0, 2 - (featuredNews?.length || 0))).fill(fallbackNews)
  ].slice(0, 2);
  const displayHeadlineNews = headlineNews || [];
  const displayRegularNews = regularNews || [];
  
  const allNews = [mainNews, ...featuredNews, ...headlineNews, ...regularNews].filter(Boolean);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 text-center">{pradesh.name} समाचार</h1>
          </div>
        </div>
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600">समाचार लोड हुँदैछ...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 text-center">{pradesh.name} समाचार</h1>
          </div>
        </div>
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center">{pradesh.name} समाचार</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Main News Section with Large Image */}
        <div className="mb-8">
          <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-lg mb-4">
            <img 
              src={getImageUrl(displayMainNews)} 
              alt={displayMainNews.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <p className="text-gray-200 text-sm md:text-base">{getExcerpt(displayMainNews.content)}</p>
            </div>
          </div>
        </div>

        {/* Featured News Grid */}
        {displayFeaturedNews.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* Main Featured News */}
            {displayFeaturedNews[0] && (
              <div className="lg:col-span-2">
                <div className="border border-gray-200 rounded-lg overflow-hidden h-full">
                  <img 
                    src={getImageUrl(displayFeaturedNews[0])} 
                    alt={displayFeaturedNews[0].title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium mb-2">
                      {displayFeaturedNews[0].categories[0]}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{displayFeaturedNews[0].title}</h3>
                    <p className="text-gray-600 text-sm">{getExcerpt(displayFeaturedNews[0].content)}</p>
                    <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                      <span>{new Date(displayFeaturedNews[0].createdAt).toLocaleDateString('ne-NP')}</span>
                      <span>{displayFeaturedNews[0].author.username}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Side Featured News */}
            {displayFeaturedNews[1] && (
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src={getImageUrl(displayFeaturedNews[1])} 
                    alt={displayFeaturedNews[1].title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-3">
                    <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium mb-2">
                      {displayFeaturedNews[1].categories[0]}
                    </span>
                    <h4 className="font-bold text-gray-900 text-sm leading-tight">{displayFeaturedNews[1].title}</h4>
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                      <span>{new Date(displayFeaturedNews[1].createdAt).toLocaleDateString('ne-NP')}</span>
                    </div>
                  </div>
                </div>

                {/* Optional third small news */}
                {displayHeadlineNews[0] && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={getImageUrl(displayHeadlineNews[0])} 
                      alt={displayHeadlineNews[0].title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-3">
                      <h4 className="font-bold text-gray-900 text-sm leading-tight">{displayHeadlineNews[0].title}</h4>
                      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                        <span>{new Date(displayHeadlineNews[0].createdAt).toLocaleDateString('ne-NP')}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Pradesh Headlines Section */}
        {allNews.length >= 3 && (
          <div className="bg-yellow-50 border rounded-lg p-6 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">प्रदेशका हेडलाइन</h3>
            
            {/* Top Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {[mainNews, ...featuredNews].filter(Boolean).slice(0, 3).map((item: any) => (
                <div key={item.id} className="rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={getImageUrl(item)} 
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm leading-tight">{item.title}</h4>
                      <span className="text-xs text-gray-500 mt-1 block">
                        {new Date(item.createdAt).toLocaleDateString('ne-NP')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Row */}
            {displayHeadlineNews.length >= 3 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {displayHeadlineNews.slice(0, 3).map((item: any) => (
                  <div key={item.id} className="rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-3">
                      <img 
                        src={getImageUrl(item)} 
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded flex-shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm leading-tight">{item.title}</h4>
                        <span className="text-xs text-gray-500 mt-1 block">
                          {new Date(item.createdAt).toLocaleDateString('ne-NP')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Regular News Grid */}
        {displayRegularNews.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">अन्य समाचार</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayRegularNews.map((item: any) => (
                <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <img 
                    src={getImageUrl(item)} 
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium mb-2">
                      {item.categories[0]}
                    </span>
                    <h4 className="font-bold text-gray-900 mb-2 leading-tight">{item.title}</h4>
                    <p className="text-gray-600 text-sm mb-3">{getExcerpt(item.content, 100)}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{new Date(item.createdAt).toLocaleDateString('ne-NP')}</span>
                      <span>{item.author.username}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No News Message */}
        {allNews.length <= 1 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center mb-8">
            <h3 className="text-xl font-bold text-blue-900 mb-2">यस प्रदेशका नयाँ समाचारहरू चाँडै नै उपलब्ध हुनेछन्</h3>
            <p className="text-blue-700">हामी यस प्रदेशका ताजा समाचारहरू संकलन गर्दैछौं। कृपया केही समय पछि पुनः जाँच्नुहोस्।</p>
          </div>
        )}

        {/* Province Info Section */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">{pradesh.name} को बारेमा</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">प्रमुख सहरहरू</h4>
              <div className="flex flex-wrap gap-2">
                {pradesh.majorCities.map((city, index) => (
                  <span key={index} className="bg-white border border-gray-300 px-3 py-1 rounded-lg text-sm">
                    {city}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">पर्यटन स्थलहरू</h4>
              <div className="space-y-2">
                {pradesh.tourism.slice(0, 4).map((place, index) => (
                  <div key={index} className="flex items-center space-x-2 text-gray-700">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                    <span className="text-sm">{place}</span>
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