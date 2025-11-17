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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Location Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <Link href="/locallevel" className="text-green-100 hover:text-white transition-colors">
                  ← स्थानीय तह
                </Link>
                <span className="text-green-200">/</span>
                <h1 className="text-4xl md:text-5xl font-bold">{locations[location]}</h1>
              </div>
              <p className="text-xl text-green-100 max-w-2xl">
                {locations[location]} सम्बन्धी ताजा स्थानीय समाचार, विकास कार्य र अपडेटहरू
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main News Content */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{locations[location]} समाचार</h2>
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
                        <div className="flex items-center justify-between mb-3">
                          <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            {item.category}
                          </span>
                          {item.ward && (
                            <span className="text-sm text-gray-500">{item.ward}</span>
                          )}
                        </div>
                        <h4 className="font-bold text-xl mb-3 text-gray-900">{item.title}</h4>
                        <p className="text-gray-600 mb-4">{item.description}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{item.time}</span>
                          <span>👁️ {item.reads}</span>
                        </div>
                        <Link 
                          href={`/local-level/${location}/${item.id}`}
                          className="inline-block mt-4 text-green-600 hover:text-green-700 font-medium"
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
                <p className="text-gray-500 text-lg">यो स्थानमा कुनै समाचार उपलब्ध छैन।</p>
                <Link href="/locallevel" className="inline-block mt-4 text-green-600 hover:text-green-700 font-medium">
                  मुख्य पृष्ठमा फर्कनुहोस्
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Location Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-4">{locations[location]} बारे</h4>
              <div className="space-y-3 text-gray-700">
                <p>यो स्थानीय तहको मुख्य समाचार पृष्ठ हो। यहाँ तपाईंले {locations[location]} सम्बन्धी ताजा समाचार, विकास कार्य, र स्थानीय सरकारी अपडेटहरू पाउन सक्नुहुन्छ।</p>
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-4">अन्य स्थानहरू</h4>
              <div className="space-y-2">
                {localCategories.filter(cat => cat.key !== 'all').map((loc) => (
                  <Link
                    key={loc.key}
                    href={`/local-level/${loc.key}`}
                    className={`block px-4 py-3 rounded-lg transition-colors ${
                      location === loc.key 
                        ? 'bg-green-100 text-green-700 font-medium' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {loc.label}
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
  return Object.keys(locations).map((location) => ({
    location: location,
  }))
}