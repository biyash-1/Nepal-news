import Link from 'next/link'
import { notFound } from 'next/navigation'
import { sportsNewsData, upcomingMatchesData } from '@/app/datas/sportsNewsData'

const categories: Record<string, string> = {
  cricket: 'क्रिकेट',
  football: 'फुटबल', 
  basketball: 'बास्केटबल',
  volleyball: 'भलिबल'
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

  const news = sportsNewsData[category] || []
  const matches = upcomingMatchesData[category] || []

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <Link href="/sports" className="text-blue-100 hover:text-white transition-colors">
                  ← खेलकुद
                </Link>
                <span className="text-blue-200">/</span>
                <h1 className="text-4xl md:text-5xl font-bold">{categories[category]}</h1>
              </div>
              <p className="text-xl text-blue-100 max-w-2xl">
                {categories[category]} सम्बन्धी ताजा समाचार, नतिजा र अपडेटहरू
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main News Content */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{categories[category]} समाचार</h2>
            {news.length > 0 ? (
              <div className="space-y-6">
                {news.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>
                      <div className="md:w-2/3 p-6">
                        <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                          {item.category}
                        </span>
                        <h4 className="font-bold text-xl mb-3 text-gray-900">{item.title}</h4>
                        <p className="text-gray-600 mb-4">{item.description}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{item.time}</span>
                          <span>👁️ {item.reads}</span>
                        </div>
                        <Link 
                          href={`/sports/${category}/${item.id}`}
                          className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
                        >
                          पूरै पढ्नुहोस् →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <p className="text-gray-500 text-lg">यो श्रेणीमा कुनै समाचार उपलब्ध छैन।</p>
                <Link href="/sports" className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium">
                  मुख्य पृष्ठमा फर्कनुहोस्
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Matches */}
            {matches.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  आगामी खेलहरू
                </h4>
                <div className="space-y-4">
                  {matches.map((match, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                      <div className="font-semibold text-gray-900">{match.match}</div>
                      <div className="text-sm text-gray-600">{match.sport}</div>
                      <div className="text-sm text-gray-500">{match.time}</div>
                      <div className="text-xs text-gray-400">{match.venue}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Navigation */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-4">खेलका प्रकारहरू</h4>
              <div className="space-y-2">
                {Object.entries(categories).map(([key, label]) => (
                  <Link
                    key={key}
                    href={`/sports/${key}`}
                    className={`block px-4 py-3 rounded-lg transition-colors ${
                      category === key 
                        ? 'bg-blue-100 text-blue-700 font-medium' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {label}
                  </Link>
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
  return Object.keys(categories).map((category) => ({
    category: category,
  }))
}