import Link from 'next/link'
import { notFound } from 'next/navigation'
import { arthatantraData, arthatantraCategories } from '@/app/datas/arthatantraData'

const categories: Record<string, string> = {
  banking: 'बैङ्किङ्ग',
  market: 'बजार',
  jobs: 'रोजगारी',
  trade: 'व्यापार',
  policy: 'अर्थतन्त्र नीति'
}

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  
  if (!category || !categories[category]) {
    notFound()
  }

  const news = arthatantraData[category] || []
  const featuredNews = news[0]
  const secondaryNews = news.slice(1, 3)
  const remainingNews = news.slice(3)

  return (
    <div className="min-h-screen bg-white">
   
      <div className="border-b-4 border-green-600 bg-gradient-to-r ">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
              <Link href="/economy" className="hover:text-green-600 transition-colors font-medium">
                अर्थतन्त्र
              </Link>
              <span className="text-green-500">›</span>
              <span className="text-gray-900 font-semibold bg-green-100  py-1 rounded-full">
                {categories[category]}
              </span>
            </div>
            <h1 className="text-3xl md:text-2xl font-bold text-gray-900  leading-tight">
              {categories[category]}
            </h1>
            <div className="w-24 h-1 bg-green-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
              {categories[category]} क्षेत्रका नवीनतम समाचार, विश्लेषण र व्यापारिक अद्यावधिकहरू
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breaking News Banner */}
        {featuredNews && (
          <div className="mb-12 border-l-4 border-red-500 bg-red-50 pl-4 py-3">
            <div className="flex items-center space-x-4">
              <span className="bg-red-500 text-white px-3 py-1 text-sm font-bold rounded">ब्रेकिङ</span>
              <Link 
                href={`/economy/${category}/${featuredNews.id}`}
                className="text-lg font-semibold text-gray-900 hover:text-red-600 transition-colors line-clamp-1"
              >
                {featuredNews.title}
              </Link>
              <span className="text-sm text-gray-500 hidden md:block">{featuredNews.time}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Main News Content - Enhanced Layout */}
          <div className="xl:col-span-8">
            {/* Featured News Section */}
            {featuredNews && (
              <div className="mb-12">
                <Link href={`/economy/${category}/${featuredNews.id}`} className="group">
                  <div className="relative overflow-hidden rounded-2xl mb-6">
                    <img 
                      src={featuredNews.image} 
                      alt={featuredNews.title}
                      className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                      <div className="text-white">
                        <span className="bg-green-600 text-white px-3 py-1 text-sm font-medium rounded-full mb-3 inline-block">
                          मुख्य समाचार
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-3 group-hover:text-green-300 transition-colors">
                          {featuredNews.title}
                        </h2>
                        <div className="flex items-center space-x-4 text-green-200 text-sm">
                          <span>{featuredNews.time}</span>
                          <span>•</span>
                          <span>👁️ {featuredNews.reads}</span>
                          {featuredNews.author && (
                            <>
                              <span>•</span>
                              <span>By {featuredNews.author}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Secondary News Grid */}
            {secondaryNews.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {secondaryNews.map((item, index) => (
                  <Link
                    key={item.id}
                    href={`/economy/${category}/${item.id}`}
                    className="group border-l-4 border-green-500 pl-4"
                  >
                    <div className="space-y-4">
                      <div className="overflow-hidden rounded-lg">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors leading-tight mb-2">
                          {item.title}
                        </h3>
                        <div className="flex items-center space-x-3 text-sm text-gray-500">
                          <span>{item.time}</span>
                          <span>•</span>
                          <span>👁️ {item.reads}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

        
            {remainingNews.length > 0 && (
              <div className="border-t pt-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b">अन्य समाचार</h3>
                <div className="space-y-6">
                  {remainingNews.map((item) => (
                    <Link
                      key={item.id}
                      href={`/economy/${category}/${item.id}`}
                      className="group flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <div className="flex-shrink-0 w-24 h-24 overflow-hidden rounded-lg">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors leading-tight mb-1 line-clamp-2">
                          {item.title}
                        </h4>
                        <div className="flex items-center space-x-3 text-sm text-gray-500">
                          <span>{item.time}</span>
                          <span>•</span>
                          <span>👁️ {item.reads}</span>
                        </div>
                      </div>
                      <div className="text-green-500 group-hover:text-green-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

        
          <div className="xl:col-span-4 space-y-8">
          
            <div className="bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl p-6 text-white">
              <h4 className="text-xl font-bold mb-6 text-center">आर्थिक सूचकांक</h4>
              <div className="space-y-4">
                {[
                  { indicator: "मुद्रास्फीति", value: "७.५%", trend: "up" },
                  { indicator: "ब्याज दर", value: "१०.२%", trend: "up" },
                  { indicator: "शेयर सूचकांक", value: "२१००", trend: "up" },
                  { indicator: "विदेशी मुद्रा भण्डार", value: "१२ बिलियन", trend: "up" },
                  { indicator: "विदेशी लगानी", value: "८.५ बिलियन", trend: "down" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-green-400/30 last:border-b-0">
                    <span className="text-green-100">{item.indicator}</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold">{item.value}</span>
                      <span className={`text-xs ${item.trend === 'up' ? 'text-green-300' : 'text-red-300'}`}>
                        {item.trend === 'up' ? '↗' : '↘'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending in Category */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                {categories[category]} मा ट्रेन्डिङ
              </h4>
              <div className="space-y-4">
                {news.slice(0, 4).map((item, index) => (
                  <Link
                    key={item.id}
                    href={`/economy/${category}/${item.id}`}
                    className="flex items-start space-x-3 group"
                  >
                    <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-800 rounded-full text-sm font-bold flex items-center justify-center mt-1">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-semibold text-gray-900 group-hover:text-green-600 transition-colors leading-tight line-clamp-2">
                        {item.title}
                      </h5>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500">{item.time}</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">👁️ {item.reads}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

        
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-6">अर्थतन्त्र श्रेणीहरू</h4>
              <div className="grid grid-cols-2 gap-3">
                {arthatantraCategories
                  .filter(cat => cat.key !== 'all')
                  .map((cat) => (
                    <Link
                      key={cat.key}
                      href={`/economy/${cat.key}`}
                      className={`p-4 rounded-xl text-center transition-all ${
                        category === cat.key
                          ? 'bg-green-600 text-white shadow-lg transform scale-105'
                          : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 hover:shadow-md border border-gray-200'
                      }`}
                    >
                      <div className="font-semibold text-sm leading-tight">{cat.label}</div>
                    </Link>
                  ))
                }
              </div>
            </div>

       
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white text-center">
              <h4 className="text-xl font-bold mb-3">आर्थिक अपडेट पाउनुहोस्</h4>
              <p className="text-blue-100 text-sm mb-4">
                {categories[category]} सम्बन्धी ताजा समाचार इमेलमा प्राप्त गर्नुहोस्
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="तपाईंको इमेल"
                  className="w-full px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
                />
                <button className="w-full bg-white text-blue-600 font-bold py-3 rounded-lg hover:bg-gray-100 transition-colors text-sm">
                  सदस्यता लिनुहोस्
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  return Object.keys(categories).map((category) => ({
    category: category,
  }))
}