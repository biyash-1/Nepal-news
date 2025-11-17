

import SportsNews from '@/components/SportsNews'
import Link from 'next/link'
import { sportsNewsData, upcomingMatchesData } from '@/app/datas/sportsNewsData'

const categories = [
  { key: 'all', label: 'सबै' },
  { key: 'cricket', label: 'क्रिकेट' },
  { key: 'football', label: 'फुटबल' },
  { key: 'basketball', label: 'बास्केटबल' },
  { key: 'volleyball', label: 'भलिबल' }
]

const allNews = Object.values(sportsNewsData).flat()

export default function SportsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sports Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">खेलकुद</h1>
              <p className="text-xl text-blue-100 max-w-2xl">
                नेपाली खेलकुदको सम्पूर्ण जानकारी, ताजा समाचार, नतिजा र अपडेटहरू
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/20 p-6 rounded-2xl text-center">
                <div className="text-2xl font-bold">२०२४</div>
                <div className="text-sm">खेलकुद वर्ष</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Navigation */}
        <div className="flex overflow-x-auto space-x-4 mb-8 pb-4">
          {categories.map((category) => (
            <Link
              key={category.key}
              href={`/sports/${category.key}`}
              className="bg-white px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-shadow whitespace-nowrap font-medium"
            >
              {category.label}
            </Link>
          ))}
        </div>

        {/* Main Sports News Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">ताजा खेल समाचार</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>लाइभ अपडेट</span>
            </div>
          </div>
          <SportsNews />
        </div>

        {/* Additional Sports Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Latest Sports News */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">अन्य खेल समाचार</h3>
            <div className="space-y-6">
              {allNews.slice(0, 3).map((news) => (
                <div key={`${news.category}-${news.id}`} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3">
                      <img 
                        src={news.image} 
                        alt={news.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                        {news.category}
                      </span>
                      <h4 className="font-bold text-xl mb-3 text-gray-900">{news.title}</h4>
                      <p className="text-gray-600 mb-4">{news.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{news.time}</span>
                        <span>👁️ {news.reads}</span>
                      </div>
                      <Link 
                        href={`/sports/${news.category.toLowerCase()}/${news.id}`}
                        className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        पूरै पढ्नुहोस् →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar - Upcoming Matches & Stats */}
          <div className="space-y-6">
            {/* Upcoming Matches */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                आगामी खेलहरू
              </h4>
              <div className="space-y-4">
                {Object.values(upcomingMatchesData)
                  .flat()
                  .slice(0, 3)
                  .map((match, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                    <div className="font-semibold text-gray-900">{match.match}</div>
                    <div className="text-sm text-gray-600">{match.sport}</div>
                    <div className="text-sm text-gray-500">{match.time}</div>
                    <div className="text-xs text-gray-400">{match.venue}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sports Rankings */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-4">नेपालको अन्तर्राष्ट्रिय स्थान</h4>
              <div className="space-y-3">
                {[
                  { sport: "क्रिकेट (T20)", rank: "१४", trend: "up" },
                  { sport: "फुटबल", rank: "१७५", trend: "stable" },
                  { sport: "भलिबल", rank: "१०१", trend: "up" },
                  { sport: "कबड्डी", rank: "८", trend: "up" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-700">{item.sport}</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-900">{item.rank}</span>
                      <span className={`text-xs ${
                        item.trend === 'up' ? 'text-green-500' : 
                        item.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                      }`}>
                        {item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Players */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-4">लोकप्रिय खेलाडीहरू</h4>
              <div className="space-y-3">
                {[
                  { name: "सोमपाल कार्की", sport: "क्रिकेट", image: "🏏" },
                  { name: "किरण चेम्जोङ", sport: "फुटबल", image: "⚽" },
                  { name: "अन्जलि बास्नेत", sport: "भलिबल", image: "🏐" },
                  { name: "दीपेश कार्की", sport: "कबड्डी", image: "🤼" }
                ].map((player, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                    <span className="text-2xl">{player.image}</span>
                    <div>
                      <div className="font-medium text-gray-900">{player.name}</div>
                      <div className="text-sm text-gray-500">{player.sport}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">खेलकुद अपडेट पाउनुहोस्</h3>
          <p className="text-blue-100 mb-6">तपाईंको इमेलमा ताजा खेल समाचार र अपडेटहरू प्राप्त गर्नुहोस्</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="तपाईंको इमेल ठेगाना"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
              सदस्यता लिनुहोस्
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}