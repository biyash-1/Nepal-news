export default function TechNews() {
  const techNews = [
    {
      id: 1,
      title: "AI ले गर्ने नयाँ क्रान्ति",
      category: "कृत्रिम बुद्धिमत्ता",
      trend: "up",
      description: "नेपालमा AI प्रविधिको प्रयोग बढ्दो, स्टार्टअपहरूमा नयाँ सम्भावना",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      icon: "🤖",
      color: "from-purple-500 to-pink-500",
      time: "३ घण्टा अघि",
      reads: "१,२००+"
    },
    {
      id: 2,
      title: "5G सेवा विस्तार",
      category: "टेलिकम",
      trend: "up", 
      description: "काठमाडौंबाट 5G सेवाको सुरुवात, इन्टरनेट गतिमा क्रान्ति",
      image: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      icon: "📶",
      color: "from-blue-500 to-cyan-500",
      time: "५ घण्टा अघि",
      reads: "९००+"
    },
    {
      id: 3,
      title: "साइबर सुरक्षा चुनौती",
      category: "सुरक्षा",
      trend: "down",
      description: "नयाँ साइबर आक्रमणबाट सुरक्षा, विशेषज्ञहरूको सल्लाह",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      icon: "🛡️",
      color: "from-red-500 to-orange-500",
      time: "८ घण्टा अघि",
      reads: "१,५००+"
    },
    {
      id: 4,
      title: "नेपालमा ड्रोन प्रविधि",
      category: "नवीन प्रविधि",
      trend: "up",
      description: "कृषि र स्वास्थ्य क्षेत्रमा ड्रोनको प्रयोग बढ्दो",
      image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      icon: "🚁",
      color: "from-green-500 to-emerald-500",
      time: "१ दिन अघि",
      reads: "२,३००+"
    }
  ]

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              प्रविधि समाचार
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            प्रविधिको दुनियाबाट ताजा अपडेट, नयाँ आविष्कार र डिजिटल क्रान्तिका समाचारहरू
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {techNews.map((tech) => (
            <div key={tech.id} className="group">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform group-hover:scale-105 transition-all duration-300 h-full flex flex-col">
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={tech.image} 
                    alt={tech.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className={`absolute top-4 left-4 bg-gradient-to-r ${tech.color} text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-2`}>
                    <span>{tech.icon}</span>
                    <span>{tech.category}</span>
                  </div>
                  <div className={`absolute top-4 right-4 text-xs px-2 py-1 rounded-full ${
                    tech.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {tech.trend === 'up' ? '↑ बढ्दो' : '↓ चुनौती'}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg text-gray-900 mb-3 leading-tight">
                    {tech.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-1">
                    {tech.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
                    <div className="flex items-center space-x-4">
                      <span>{tech.time}</span>
                      <span>👁️ {tech.reads}</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1">
                      <span>पढ्नुहोस्</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Tech Story */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative h-80 lg:h-full">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="नेपाली युवा प्रविधिमा"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold mb-2 inline-block">
                  विशेष समाचार
                </span>
                <h3 className="text-2xl font-bold mb-2">नेपाली युवाहरूको प्रविधि क्रान्ति</h3>
                <p className="text-gray-200">स्टार्टअप र डिजिटल उद्यमितामा नेपाली युवाहरूको उल्लेख्य सफलता</p>
              </div>
            </div>
            <div className="p-8">
              <h4 className="text-xl font-bold text-gray-900 mb-4">प्रविधि क्षेत्रमा नेपाल</h4>
              <div className="space-y-4">
                {[
                  "२०२४ मा ५०+ नयाँ टेक स्टार्टअप दर्ता",
                  "युवा उद्यमीहरूले लगानी आकर्षण गर्दै",
                  "सरकारले डिजिटल नेपालका लागि विशेष बजेट",
                  "अन्तर्राष्ट्रिय कम्पनीहरूको नेपालमा लगानी"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                पूरै रिपोर्ट पढ्नुहोस्
              </button>
            </div>
          </div>
        </div>

        {/* Tech Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { number: "५००+", label: "टेक स्टार्टअप", icon: "🚀", color: "text-purple-600" },
            { number: "१५K+", label: "प्रविधि पेशेवर", icon: "👨‍💻", color: "text-blue-600" },
            { number: "८५%", label: "इन्टरनेट प्रयोग", icon: "🌐", color: "text-green-600" },
            { number: "२०+", label: "डिजिटल सेवा", icon: "📱", color: "text-orange-600" }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className={`text-2xl mb-2 ${stat.color}`}>{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
              <div className="text-gray-600 text-sm mt-2">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Tech Updates */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">ताजा प्रविधि अपडेटहरू</h3>
            <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-sm">लाइभ अपडेट</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/10 p-4 rounded-lg">
              <div className="font-semibold">नेपाल टेलिकम</div>
              <div className="text-white/80">फाइबर इन्टरनेट सेवा विस्तार</div>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <div className="font-semibold">डिजिटल भुक्तानी</div>
              <div className="text-white/80">eSewa, Khalti मा नयाँ अफर</div>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <div className="font-semibold">AI सम्मेलन</div>
              <div className="text-white/80">काठमाडौंमा अन्तर्राष्ट्रिय AI सम्मेलन</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}