

import { pradeshData, pradeshNewsData, trendingProvinceNews } from '@/lib/PradeshData';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    pradeshId: string;
  };
}

export default async function PradeshNewsPage({ params }: PageProps) {
  const { pradeshId } = await params;
  const pradesh = pradeshData[pradeshId];
  const news = pradeshNewsData[pradeshId];

  if (!pradesh || !news) {
    notFound();
  }

  const mainNews = news[0];
  const featuredNews = news.slice(1, 3);
  const regularNews = news.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Province Hero Header */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-3">{pradesh.name}</h1>
              <p className="text-red-100 text-lg">{pradesh.number} - ताजा समाचार र अपडेट</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mt-4 md:mt-0">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{pradesh.population}</div>
                  <div className="text-red-100 text-sm">जनसंख्या</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{pradesh.districts}</div>
                  <div className="text-red-100 text-sm">जिल्ला</div>
                </div>
                <div>
                  <div className="text-xl font-bold">{pradesh.area}</div>
                  <div className="text-red-100 text-sm">क्षेत्रफल</div>
                </div>
                <div>
                  <div className="text-xl font-bold">{pradesh.capital}</div>
                  <div className="text-red-100 text-sm">राजधानी</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breaking News Banner */}
        {mainNews.isBreaking && (
          <div className="bg-red-600 text-white py-3 px-4 rounded-lg mb-8 flex items-center">
            <span className="bg-white text-red-600 px-3 py-1 rounded-full text-sm font-bold mr-4">ब्रेकिङ</span>
            <span className="font-medium">{mainNews.title}</span>
          </div>
        )}

        {/* Main Headline Section */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="relative h-[500px] overflow-hidden rounded-2xl group cursor-pointer">
                <img 
                  src={mainNews.image} 
                  alt={mainNews.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg hover:text-red-300 transition-colors mb-4">
                    {mainNews.title}
                  </h2>
         
                  <div className="flex items-center text-gray-300">
                    <span>{mainNews.date}</span>
                    <span className="mx-2">•</span>
                    <span>{mainNews.author}</span>
                    <span className="mx-2">•</span>
                    <span>{mainNews.views} पटक हेरिएको</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured News Sidebar */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">विशेष समाचार</h3>
              {featuredNews.map((item) => (
                <div key={item.id} className="group cursor-pointer">
                  <div className="relative h-48 overflow-hidden rounded-xl mb-3">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {item.isBreaking && (
                      <span className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                        ब्रेकिङ
                      </span>
                    )}
                  </div>
                  <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium mb-2">
                    {item.category}
                  </span>
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-red-600 transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">{item.excerpt}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{item.date}</span>
                    <span>{item.views} पटक</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-16"></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main News Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Regular News Grid */}
            <section>
  <h3 className="text-3xl font-bold text-gray-900 mb-8">📰 अन्य समाचार</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {regularNews.map((item) => (
      <div
        key={item.id}
        className="group cursor-pointer overflow-hidden bg-white hover:shadow-lg transition-all duration-300"
      >
        <div className="relative h-64 overflow-hidden mb-4">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          
        </div>
        <h4 className="font-bold text-xl text-gray-900 group-hover:text-red-600 transition-colors leading-tight">
          {item.title}
        </h4>
      </div>
    ))}
  </div>
</section>
            {/* Province Quick Info */}
            <section className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">🏛️ {pradesh.name} को बारेमा</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">प्रमुख सहरहरू</h4>
                  <div className="flex flex-wrap gap-2">
                    {pradesh.majorCities.map((city, index) => (
                      <span key={index} className="px-3 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium">
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">पर्यटन स्थलहरू</h4>
                  <div className="space-y-2">
                    {pradesh.tourism.slice(0, 3).map((place, index) => (
                      <div key={index} className="flex items-center space-x-2 text-gray-700">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>{place}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Trending News */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 shadow-sm">
              <h4 className="text-2xl font-bold text-gray-900 mb-6">🔥 ट्रेन्डिङ समाचार</h4>
              <div className="space-y-4">
                {trendingProvinceNews.map((trend, index) => (
                  <div key={trend.id} className="flex items-center space-x-4 p-3 bg-white rounded-xl hover:shadow-md cursor-pointer transition-all group">
                    <span className="font-bold text-red-600 text-xl w-8 flex-shrink-0">{index + 1}</span>
                    <img src={trend.image} alt={trend.title} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-gray-800 text-sm font-medium group-hover:text-red-600 transition-colors line-clamp-2">
                        {trend.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{trend.province}</div>
                      <div className="text-xs text-gray-400 mt-1">{trend.views} पटक हेरिएको</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Province Quick Facts */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h4 className="text-2xl font-bold text-gray-900 mb-6">📊 प्रदेश तथ्याङ्क</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">राजधानी</span>
                  <span className="font-semibold text-gray-900">{pradesh.capital}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">मुख्यमन्त्री</span>
                  <span className="font-semibold text-gray-900">{pradesh.chiefMinister}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">प्रदेश प्रमुख</span>
                  <span className="font-semibold text-gray-900">{pradesh.governor}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">जिल्लाहरू</span>
                  <span className="font-semibold text-gray-900">{pradesh.districts}</span>
                </div>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-6 text-white text-center">
              <h4 className="text-xl font-bold mb-3">{pradesh.name} को समाचार</h4>
              <p className="text-red-100 text-sm mb-4">ताजा समाचार सिधै तपाईंको इमेलमा</p>
              <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder="तपाईंको इमेल ठेगाना"
                  className="w-full px-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="w-full bg-white text-red-600 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all">
                  सदस्यता लिनुहोस्
                </button>
              </div>
            </div>

            {/* Weather Widget */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h4 className="text-2xl font-bold text-gray-900 mb-6">⛅ मौसम</h4>
              <div className="text-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white">
                <div className="text-4xl font-bold mb-2">२२°C</div>
                <div className="text-blue-100">{pradesh.capital}, {pradesh.name}</div>
                <div className="text-sm text-blue-200 mt-2">आज राती हल्का बर्षाको सम्भावना</div>
              </div>
            </div>
          </div>
        </div>

        {/* More News Section */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-16"></div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">📖 थप समाचारहरू</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.slice(0, 6).map((item, index) => (
              <div key={item.id} className="group cursor-pointer border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="bg-red-100 text-red-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.category}</span>
                </div>
                <h4 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors mb-2 line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.excerpt}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{item.date}</span>
                  <span>{item.views} पटक</span>
                </div>
              </div>
            ))}
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