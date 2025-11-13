

import { pradeshData, pradeshNewsData, trendingProvinceNews } from '@/lib/PradeshData';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    pradeshId: string;
  };
}

// Fallback news data for when there aren't enough news items
const fallbackNews = {
  id: "fallback",
  title: "यस प्रदेशका थप समाचारहरू चाँडै नै उपलब्ध हुनेछन्",
  excerpt: "हामी यस प्रदेशका नयाँ समाचारहरू संकलन गर्दैछौं।",
  content: "यस प्रदेशका नयाँ समाचारहरू चाँडै नै उपलब्ध हुनेछन्।",
  image: "https://images.unsplash.com/photo-1584824486539-53bb4646bdbc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
  category: "सामान्य",
  date: "२०८२ मंसिर २७",
  author: "समाचार टिम",
  tags: ["प्रदेश", "समाचार"],
  views: 0,
  isBreaking: false
};

export default async function PradeshNewsPage({ params }: PageProps) {
  const { pradeshId } = await params;
  const pradesh = pradeshData[pradeshId];
  const news = pradeshNewsData[pradeshId] || [];

  if (!pradesh) {
    notFound();
  }

  // Ensure we have at least one main news
  const mainNews = news[0] || fallbackNews;
  
  // Ensure we have at least 2 featured news (fill with fallback if needed)
  const featuredNews = [
    ...news.slice(1, 3),
    ...Array(Math.max(0, 2 - news.slice(1, 3).length)).fill(fallbackNews)
  ].slice(0, 2);

  // Regular news (skip first 3, but don't show if we don't have enough)
  const regularNews = news.length > 3 ? news.slice(3) : [];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center">{mainNews.title} समाचार</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Main News Section with Large Image */}
        <div className="mb-8">
          <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-lg mb-4">
            <img 
              src={mainNews.image} 
              alt={mainNews.title}
              className="w-full h-full object-cover"
              
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            
              <p className="text-gray-200 text-sm md:text-base">{mainNews.excerpt}</p>
            </div>
          </div>
        </div>

        {/* Featured News Grid - Responsive layout */}
        {featuredNews.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* Main Featured News - Show only if we have at least one featured news */}
            {featuredNews[0] && (
              <div className="lg:col-span-2">
                <div className="border border-gray-200 rounded-lg overflow-hidden h-full">
                  <img 
                    src={featuredNews[0].image} 
                    alt={featuredNews[0].title}
                    className="w-full h-64 object-cover"
                   
                  />
                  <div className="p-4">
                    <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium mb-2">
                      {featuredNews[0].category}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{featuredNews[0].title}</h3>
                    <p className="text-gray-600 text-sm">{featuredNews[0].excerpt}</p>
                    <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                      <span>{featuredNews[0].date}</span>
                      <span>{featuredNews[0].views} पटक</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Side Featured News - Show only if we have second featured news */}
            {featuredNews[1] && (
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src={featuredNews[1].image} 
                    alt={featuredNews[1].title}
                    className="w-full h-32 object-cover"
                  
                  />
                  <div className="p-3">
                    <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium mb-2">
                      {featuredNews[1].category}
                    </span>
                    <h4 className="font-bold text-gray-900 text-sm leading-tight">{featuredNews[1].title}</h4>
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                      <span>{featuredNews[1].date}</span>
                    </div>
                  </div>
                </div>

                {/* Optional third small news if available */}
                {news[3] && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={news[3].image} 
                      alt={news[3].title}
                      className="w-full h-32 object-cover"
                     
                    />
                    <div className="p-3">
                      <h4 className="font-bold text-gray-900 text-sm leading-tight">{news[3].title}</h4>
                      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                        <span>{news[3].date}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Pradesh Headlines Section - Only show if we have enough news */}
        {news.length >= 3 && (
          <div className="bg-yellow-50 border rounded-lg p-6 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 ">प्रदेशका हेडलाइन</h3>
            
            {/* Top Row - Show available news (up to 3) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {news.slice(0, 3).map((item) => (
                <div key={item.id} className="  rounded-lg  p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded "
                    
                    />
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm leading-tight">{item.title}</h4>
                      <span className="text-xs text-gray-500 mt-1 block">{item.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Row - Show additional news if available */}
            {news.length >= 6 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {news.slice(3, 6).map((item) => (
                  <div key={item.id} className=" rounded-lg   p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-3">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded flex-shrink-0"
                       
                      />
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm leading-tight">{item.title}</h4>
                        <span className="text-xs text-gray-500 mt-1 block">{item.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Regular News Grid - Only show if we have regular news */}
        {regularNews.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">अन्य समाचार</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularNews.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-48 object-cover"
                   
                  />
                  <div className="p-4">
                    <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium mb-2">
                      {item.category}
                    </span>
                    <h4 className="font-bold text-gray-900 mb-2 leading-tight">{item.title}</h4>
                    <p className="text-gray-600 text-sm mb-3">{item.excerpt}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{item.date}</span>
                      <span>{item.views} पटक</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No News Message - Show when there are very few news */}
        {news.length <= 1 && (
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

export async function generateMetadata({ params }: PageProps) {
  const { pradeshId } = params;
  const pradesh = pradeshData[pradeshId];
  const news = pradeshNewsData[pradeshId];
  
  return {
    title: `${pradesh?.name || 'प्रदेश'} - ताजा समाचार | नेपाल समाचार`,
    description: news?.[0]?.excerpt || pradesh?.geography
  };
}