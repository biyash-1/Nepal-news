export default function SportsNews() {
  const sportsNews = [
    {
      id: 1,
      title: "नेपालले जित्यो T20 सिरिज",
      team1: "नेपाल",
      team2: "स्कटल्याण्ड",
      score1: "165/4",
      score2: "158/7",
      result: "नेपाल ७ रनले विजयी",
      highlight: "सोमपाल कार्कीको अर्धशतक",
      image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      trending: true
    },
    {
      id: 2,
      title: "राष्ट्रिय फुटबल लिग सुरु",
      teams: "म्याच सुरु हुँदै",
      time: "शनिबार, २:०० PM",
      venue: "दशरथ रंगशाला",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 3,
      title: "बास्केटबल प्रिमियर लिग",
      stage: "सेमिफाइनल",
      teams: "टिम A vs टिम B",
      time: "आज, ४:०० PM",
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    }
  ]

  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">खेलकुद</h2>
              <p className="text-blue-600 font-medium">ताजा खेल समाचार र अपडेट</p>
            </div>
          </div>
          <button className="hidden md:flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <span>सबै खेल समाचार</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Sports News */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative">
                <img 
                  src={sportsNews[0].image} 
                  alt={sportsNews[0].title}
                  className="w-full h-64 object-cover"
                />
                {sportsNews[0].trending && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      लाइभ अपडेट
                    </span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                  <h3 className="text-white text-xl font-bold mb-2">{sportsNews[0].title}</h3>
                  <div className="flex items-center justify-between text-white">
                    <div className="text-center">
                      <div className="font-bold">{sportsNews[0].team1}</div>
                      <div className="text-lg font-bold text-yellow-300">{sportsNews[0].score1}</div>
                    </div>
                    <div className="text-gray-300">VS</div>
                    <div className="text-center">
                      <div className="font-bold">{sportsNews[0].team2}</div>
                      <div className="text-lg font-bold">{sportsNews[0].score2}</div>
                    </div>
                  </div>
                  <div className="text-green-300 font-bold text-center mt-2">{sportsNews[0].result}</div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">✨ {sportsNews[0].highlight}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>🏏 क्रिकेट</span>
                  <span>⏱️ ३० मिनेट अघि</span>
                </div>
              </div>
            </div>
          </div>

          {/* Side Sports News */}
          <div className="space-y-6">
            {sportsNews.slice(1).map((sport) => (
              <div key={sport.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex">
                  <div className="w-1/3">
                    <img 
                      src={sport.image} 
                      alt={sport.title}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                  <div className="w-2/3 p-4">
                    <h4 className="font-bold text-gray-900 mb-2">{sport.title}</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        {sport.teams}
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        {sport.time}
                      </div>
                      {sport.venue && (
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                          {sport.venue}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

  
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
              <h5 className="font-bold text-lg mb-4">आजको खेलकुद</h5>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">३</div>
                  <div className="text-xs">खेलहरू</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">२</div>
                  <div className="text-xs">लाइभ</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">५+</div>
                  <div className="text-xs">अपडेट</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}