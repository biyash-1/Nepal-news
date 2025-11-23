import Link from "next/link";
import { localNewsData, localCategories } from "@/app/datas/localNewsData";

const allLocalNews = Object.values(localNewsData).flat();

const getLocationKey = (nepaliName: string) => {
  const locationMap: Record<string, string> = {
    'काठमाडौं': 'kathmandu',
    'ललितपुर': 'lalitpur',
    'भक्तपुर': 'bhaktapur',
    'पोखरा': 'pokhara',
    'बिराटनगर': 'biratnagar'
  };
  return locationMap[nepaliName] || nepaliName.toLowerCase();
};

export default function LocalLevelPage() {
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
              स्थानीय सरकार, विकास कार्य, समुदाय समाचार र स्थानीय स्तरका जानकारीहरू
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allLocalNews.slice(0, 6).map((news) => (
              <Link
                key={`${news.location}-${news.id}`}
                href={`/local-level/${getLocationKey(news.location)}/${news.id}`}
                className="group"
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
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
          {/* Main News Content */}
          <div className="lg:col-span-3">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-b">
              अन्य स्थानीय समाचार
            </h3>
            
            <div className="space-y-8">
              {allLocalNews.slice(6).map((news) => (
                <Link
                  key={`${news.location}-${news.id}`}
                  href={`/local-level/${news.location}/${news.id}`}
                  className="group block"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-48 flex-shrink-0">
                      <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-36 object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-xl text-gray-900 group-hover:text-green-600 transition-colors leading-tight mb-3">
                        {news.title}
                      </h4>
                      <p className="text-gray-600 mb-3 leading-relaxed">
                        {news.description}
                      </p>
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
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Local Government Updates */}
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
                  <div key={index} className="pb-4 border-b last:border-b-0 last:pb-0">
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

            {/* Quick Links */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-6">
                स्थानीय योजनाहरू
              </h4>
              <div className="space-y-3">
                {[
                  { name: "सामुदायिक स्वास्थ्य", icon: "🏥" },
                  { name: "शिक्षा विकास", icon: "📚" },
                  { name: "सडक निर्माण", icon: "🛣️" },
                  { name: "पानी आपूर्ति", icon: "💧" },
                  { name: "सफाइ व्यवस्था", icon: "🧹" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 hover:bg-white rounded-lg transition-colors"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <div className="font-medium text-gray-900">
                      {item.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4">
                सम्पर्क गर्नुहोस्
              </h4>
              <p className="text-gray-700 mb-4">
                स्थानीय समस्याहरू र सुझावका लागि
              </p>
              <button className="bg-green-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors w-full">
                सम्पर्क फर्म
              </button>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-gray-100 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            स्थानीय अपडेट पाउनुहोस्
          </h3>
          <p className="text-gray-700 mb-6 max-w-md mx-auto">
            तपाईंको इमेलमा ताजा स्थानीय समाचार र सरकारी अपडेटहरू प्राप्त गर्नुहोस्
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