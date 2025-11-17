import Link from "next/link";
import { localNewsData, localCategories } from "@/app/datas/localNewsData";

const allLocalNews = Object.values(localNewsData).flat();

export default function LocalLevelPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                स्थानीय तह
              </h1>
              <p className="text-xl text-green-100 max-w-2xl">
                स्थानीय सरकार, विकास कार्य, समुदाय समाचार र स्थानीय स्तरका
                जानकारीहरू
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/20 p-6 rounded-2xl text-center">
                <div className="text-2xl font-bold">स्थानीय</div>
                <div className="text-sm">समाचार</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Navigation */}
        <div className="flex overflow-x-auto space-x-4 mb-8 pb-4">
          {localCategories.map((category) => (
            <Link
              key={category.key}
              href={
                category.key === "all"
                  ? "/local-level"
                  : `/local-level/${category.key}`
              }
              className="bg-white px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-shadow whitespace-nowrap font-medium"
            >
              {category.label}
            </Link>
          ))}
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">
              ताजा स्थानीय समाचार
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>नयाँ अपडेट</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {allLocalNews.slice(0, 3).map((news) => (
              <div
                key={`${news.location}-${news.id}`}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {news.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {news.location}
                    </span>
                  </div>
                  <h4 className="font-bold text-xl mb-3 text-gray-900 line-clamp-2">
                    {news.title}
                  </h4>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {news.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{news.time}</span>
                    <span>👁️ {news.reads}</span>
                  </div>
                  <Link
                    href={`/local-level/${news.location}/${news.id}`}
                    className="inline-block mt-4 text-green-600 hover:text-green-700 font-medium"
                  >
                    पूरै पढ्नुहोस् →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Local News */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Latest Local News */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              अन्य स्थानीय समाचार
            </h3>
            <div className="space-y-6">
              {allLocalNews.slice(3).map((news) => (
                <div
                  key={`${news.location}-${news.id}`}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3">
                      <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          {news.category}
                        </span>
                        <span className="text-sm text-gray-500">
                          {news.location}
                        </span>
                      </div>
                      <h4 className="font-bold text-xl mb-3 text-gray-900">
                        {news.title}
                      </h4>
                      <p className="text-gray-600 mb-4">{news.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{news.time}</span>
                        <span>👁️ {news.reads}</span>
                      </div>
                      <Link
                        href={`/local-level/${news.location.toLowerCase()}/${
                          news.id
                        }`}
                        className="inline-block mt-4 text-green-600 hover:text-green-700 font-medium"
                      >
                        पूरै पढ्नुहोस् →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Local Government Updates */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 text-green-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                स्थानीय सरकार अपडेट
              </h4>
              <div className="space-y-4">
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
                    className="border-l-4 border-green-500 pl-4 py-2"
                  >
                    <div className="font-semibold text-gray-900">
                      {item.title}
                    </div>
                    <div className="text-sm text-gray-600">{item.location}</div>
                    <div className="text-sm text-gray-500">{item.time}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-4">
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
                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="font-medium text-gray-900">
                        {item.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Local Government */}
            <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-6 text-white">
              <h4 className="text-xl font-bold mb-4">सम्पर्क गर्नुहोस्</h4>
              <p className="text-green-100 mb-4">
                स्थानीय समस्याहरू र सुझावका लागि
              </p>
              <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors w-full">
                सम्पर्क फर्म
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">स्थानीय अपडेट पाउनुहोस्</h3>
          <p className="text-green-100 mb-6">
            तपाईंको इमेलमा ताजा स्थानीय समाचार र सरकारी अपडेटहरू प्राप्त
            गर्नुहोस्
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="तपाईंको इमेल ठेगाना"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
            <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
              सदस्यता लिनुहोस्
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
