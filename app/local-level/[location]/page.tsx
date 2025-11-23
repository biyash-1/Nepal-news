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
    <div className="min-h-screen bg-white">
      {/* Clean Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-4 text-sm text-gray-600">
              <Link href="/local-level" className="hover:text-green-600 transition-colors">
                स्थानीय तह
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">{locations[location]}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {locations[location]}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {locations[location]} सम्बन्धी ताजा स्थानीय समाचार, विकास कार्य र अपडेटहरू
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main News Content */}
          <div className="lg:col-span-3">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b">
              {locations[location]} का समाचार
            </h2>
            
            {news.length > 0 ? (
              <div className="space-y-8">
                {news.map((item) => (
                  <Link
                    key={item.id}
                    href={`/local-level/${location}/${item.id}`}
                    className="group block"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-64 flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-2xl text-gray-900 group-hover:text-green-600 transition-colors leading-tight mb-3">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 mb-4 leading-relaxed text-lg">
                          {item.description}
                        </p>
                        <div className="flex items-center space-x-4 text-gray-500">
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
            ) : (
              <div className="bg-gray-50 rounded-lg p-12 text-center">
                <p className="text-gray-500 text-xl mb-4">यो स्थानमा कुनै समाचार उपलब्ध छैन।</p>
                <Link 
                  href="/local-level" 
                  className="inline-block text-green-600 hover:text-green-700 font-medium text-lg"
                >
                  मुख्य पृष्ठमा फर्कनुहोस्
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Location Info */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-4">{locations[location]} बारे</h4>
              <div className="space-y-3 text-gray-700">
                <p className="leading-relaxed">
                  यो स्थानीय तहको मुख्य समाचार पृष्ठ हो। यहाँ तपाईंले {locations[location]} सम्बन्धी 
                  ताजा समाचार, विकास कार्य, र स्थानीय सरकारी अपडेटहरू पाउन सक्नुहुन्छ।
                </p>
              </div>
            </div>

            {/* Other Locations */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-4">अन्य स्थानहरू</h4>
              <div className="space-y-3">
                {localCategories
                  .filter(cat => cat.key !== 'all' && cat.key !== location)
                  .map((loc) => (
                    <Link
                      key={loc.key}
                      href={`/local-level/${loc.key}`}
                      className="block px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-white rounded-lg transition-colors font-medium"
                    >
                      {loc.label}
                    </Link>
                  ))
                }
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4">समाचार विवरण</h4>
              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between py-2 border-b">
                  <span>कुल समाचार:</span>
                  <span className="font-semibold">{news.length}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>अपडेट:</span>
                  <span className="font-semibold">ताजा</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>स्थिति:</span>
                  <span className="font-semibold text-green-600">सक्रिय</span>
                </div>
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