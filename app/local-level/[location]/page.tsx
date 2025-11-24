import Link from 'next/link'
import { notFound } from 'next/navigation'
import { localNewsData, localCategories } from '@/app/datas/localNewsData'

const locations: Record<string, string> = {
  kathmandu: 'काठमाडौं',
  lalitpur: 'ललितपुर',
  bhaktapur: 'भक्तपुर',
  pokhara: 'पोखरा',
  biratnagar: 'बिराटनगर'
}

interface LocationPageProps {
  params: Promise<{
    location: string
  }>
}

export default async function LocationPage({ params }: LocationPageProps) {
  const { location } = await params
  
  if (!location || !locations[location]) {
    notFound()
  }

  const news = localNewsData[location] || []
  const featuredNews = news[0]
  const secondaryNews = news.slice(1, 3)
  const remainingNews = news.slice(3)

  return (
    <div className="min-h-screen bg-white">
      {/* Compact Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-3 text-sm text-gray-600">
              <Link href="/local-level" className="hover:text-green-600 transition-colors font-medium">
                स्थानीय तह
              </Link>
              <span className="text-green-500">›</span>
              <span className="text-gray-900 font-semibold bg-green-100 px-3 py-1 rounded-full">
                {locations[location]}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {locations[location]}
            </h1>
            <div className="w-20 h-1 bg-green-600 mx-auto mb-3"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {locations[location]} सम्बन्धी ताजा स्थानीय समाचार, विकास कार्य र अपडेटहरू
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breaking News Banner */}
        {featuredNews && (
          <div className="mb-8 border-l-4 border-red-500 bg-red-50 pl-4 py-2">
            <div className="flex items-center space-x-4">
              <span className="bg-red-500 text-white px-3 py-1 text-sm font-bold rounded">ब्रेकिङ</span>
              <Link 
                href={`/local-level/${location}/${featuredNews.id}`}
                className="text-base font-semibold text-gray-900 hover:text-red-600 transition-colors line-clamp-1"
              >
                {featuredNews.title}
              </Link>
              <span className="text-sm text-gray-500 hidden md:block">{featuredNews.time}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Main News Content */}
          <div className="xl:col-span-8">
            {/* Featured News Section */}
            {featuredNews && (
              <div className="mb-8">
                <Link href={`/local-level/${location}/${featuredNews.id}`} className="group">
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <img 
                      src={featuredNews.image} 
                      alt={featuredNews.title}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                      <div className="text-white">
                        <span className="bg-green-600 text-white px-3 py-1 text-sm font-medium rounded-full mb-2 inline-block">
                          मुख्य समाचार
                        </span>
                        <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-2 group-hover:text-green-300 transition-colors">
                          {featuredNews.title}
                        </h2>
                        <div className="flex items-center space-x-4 text-green-200 text-sm">
                          <span>{featuredNews.time}</span>
                          {featuredNews.ward && (
                            <>
                              <span>•</span>
                              <span>{featuredNews.ward}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

         
            {secondaryNews.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {secondaryNews.map((item, index) => (
                  <Link
                    key={item.id}
                    href={`/local-level/${location}/${item.id}`}
                    className="group border-l-4 border-green-500 pl-4"
                  >
                    <div className="space-y-3">
                      <div className="overflow-hidden rounded-lg">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors leading-tight mb-2">
                          {item.title}
                        </h3>
                        <div className="flex items-center space-x-3 text-sm text-gray-500">
                          <span>{item.time}</span>
                          {item.ward && (
                            <>
                              <span>•</span>
                              <span>{item.ward}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Remaining News - Newspaper Style List */}
            {remainingNews.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">{locations[location]} का अन्य समाचार</h3>
                <div className="space-y-4">
                  {remainingNews.map((item) => (
                    <Link
                      key={item.id}
                      href={`/local-level/${location}/${item.id}`}
                      className="group flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex-shrink-0 w-20 h-20 overflow-hidden rounded-lg">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-semibold text-gray-900 group-hover:text-green-600 transition-colors leading-tight mb-1 line-clamp-2">
                          {item.title}
                        </h4>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>{item.time}</span>
                          {item.ward && (
                            <>
                              <span>•</span>
                              <span>{item.ward}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-green-500 group-hover:text-green-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>


          <div className="xl:col-span-4 space-y-6">
         
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-5 border border-green-100">
              <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {locations[location]} बारे
              </h4>
              <div className="text-gray-700 text-sm leading-relaxed">
                <p>
                  यो स्थानीय तहको मुख्य समाचार पृष्ठ हो। यहाँ तपाईंले {locations[location]} सम्बन्धी 
                  ताजा समाचार, विकास कार्य, र स्थानीय सरकारी अपडेटहरू पाउन सक्नुहुन्छ।
                </p>
              </div>
            </div>

            {/* Trending in Location */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                {locations[location]} मा ट्रेन्डिङ
              </h4>
              <div className="space-y-3">
                {news.slice(0, 4).map((item, index) => (
                  <Link
                    key={item.id}
                    href={`/local-level/${location}/${item.id}`}
                    className="flex items-start space-x-3 group"
                  >
                    <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-800 rounded-full text-xs font-bold flex items-center justify-center mt-0.5">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-semibold text-gray-900 group-hover:text-green-600 transition-colors leading-tight line-clamp-2">
                        {item.title}
                      </h5>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500">{item.time}</span>
                        {item.ward && (
                          <>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500">{item.ward}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

        
            <div className="bg-gray-50 rounded-xl p-5">
              <h4 className="text-lg font-bold text-gray-900 mb-4">अन्य स्थानहरू</h4>
              <div className="grid grid-cols-2 gap-2">
                {localCategories
                  .filter(cat => cat.key !== 'all' && cat.key !== location)
                  .map((loc) => (
                    <Link
                      key={loc.key}
                      href={`/local-level/${loc.key}`}
                      className={`p-3 rounded-lg text-center transition-all ${
                        location === loc.key
                          ? 'bg-green-600 text-white shadow-lg transform scale-105'
                          : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 hover:shadow-md border border-gray-200'
                      }`}
                    >
                      <div className="font-semibold text-xs leading-tight">{loc.label}</div>
                    </Link>
                  ))
                }
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-5 text-white">
              <h4 className="text-lg font-bold mb-3 text-center">स्थानीय तथ्याङ्क</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-green-400/30">
                  <span className="text-green-100">कुल समाचार</span>
                  <span className="font-bold">{news.length}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-green-400/30">
                  <span className="text-green-100">अपडेट</span>
                  <span className="font-bold">ताजा</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-100">स्थिति</span>
                  <span className="font-bold bg-white/20 px-2 py-1 rounded-full text-xs">सक्रिय</span>
                </div>
              </div>
            </div>

            {/* Local Services */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="text-lg font-bold text-gray-900 mb-4">स्थानीय सेवाहरू</h4>
              <div className="space-y-2">
                {[
                  { name: "नगर कार्यपालिका", icon: "🏛️" },
                  { name: "प्रहरी कार्यालय", icon: "👮" },
                  { name: "स्वास्थ्य चौकी", icon: "🏥" },
                  { name: "विद्यालय", icon: "📚" },
                  { name: "आपतकालीन", icon: "🚨" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <span className="text-xl">{item.icon}</span>
                    <div className="font-medium text-gray-900 text-sm">
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
  )
}

export async function generateStaticParams() {
  return Object.keys(locations).map((location) => ({
    location: location,
  }))
}