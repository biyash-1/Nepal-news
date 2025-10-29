export default function GlobalNews() {
  const globalNews = [
    {
      id: 1,
      title: "यूक्रेन संकट: नयाँ शान्ति वार्ता",
      country: "यूक्रेन",
      flag: "🇺🇦",
      summary: "यूक्रेन र रुसबीच नयाँ दौरको शान्ति वार्ता सुरु भएको छ",
      category: "अन्तर्राष्ट्रिय",
      urgency: "high",
      time: "२ घण्टा अघि"
    },
    {
      id: 2,
      title: "चीनको नयाँ आर्थिक नीति",
      country: "चीन",
      flag: "🇨🇳",
      summary: "चीनले आर्थिक वृद्धिलाई बढावा दिन नयाँ नीति घोषणा गरेको छ",
      category: "अर्थतन्त्र",
      urgency: "medium",
      time: "४ घण्टा अघि"
    },
    {
      id: 3,
      title: "NASA को नयाँ अन्तरिक्ष मिसन",
      country: "अमेरिका",
      flag: "🇺🇸",
      summary: "मंगल ग्रहमा नयाँ अन्वेषण मिसन सफलतापूर्वक पुगेको छ",
      category: "विज्ञान",
      urgency: "medium",
      time: "६ घण्टा अघि"
    },
    {
      id: 4,
      title: "यूरोपमा ऊर्जा संकट",
      country: "यूरोप",
      flag: "🇪🇺",
      summary: "यूरोपीय संघले ऊर्जा संकट समाधानका लागि आपतकालीन बैठक बोलाएको छ",
      category: "अर्थतन्त्र",
      urgency: "high",
      time: "८ घण्टा अघि"
    }
  ]

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  return (
    <section className="py-12  ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3  px-6 py-3 rounded-full">
            <svg className="w-6 h-6 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-3xl font-bold">विश्व समाचार</h2>
            <span className="text-blue-400 font-medium">Global News</span>
          </div>
          <p className=" mt-4">विश्वभरबाट ताजा अपडेटहरू</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {globalNews.map((news) => (
            <div 
              key={news.id} 
              className={`rounded-xl p-6 border-l-4 ${
                news.urgency === 'high' ? 'border-red-500' : 
                news.urgency === 'medium' ? 'border-yellow-500' : 'border-blue-500'
              } hover:bg-gray-200 transition-all duration-300 hover:scale-105`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{news.flag}</span>
                  <span className="font-semibold">{news.country}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getUrgencyColor(news.urgency)}`}>
                  {news.urgency === 'high' ? 'जरुरी' : 'महत्त्वपूर्ण'}
                </span>
              </div>
              
              <h3 className="font-bold text-lg mb-3 leading-tight">
                {news.title}
              </h3>
              
              <p className="text-sm mb-4 leading-relaxed">
                {news.summary}
              </p>
              
              <div className="flex items-center justify-between text-xs ">
                <span>{news.category}</span>
                <span>{news.time}</span>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <button className="w-full  hover:bg-gray-300  py-2 rounded-lg text-sm font-medium transition-colors bg-amber-100">
                  पूरै पढ्नुहोस्
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* World Map Visualization */}
        <div className="mt-12  rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">आजको विश्व मानचित्र</h3>
            <div className="flex space-x-2 text-sm">
              <span className="flex items-center">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                संकट क्षेत्र
              </span>
              <span className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                शान्ति वार्ता
              </span>
              <span className="flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                आर्थिक विकास
              </span>
            </div>
          </div>
          
          {/* Simple World Map Representation */}
          <div className="rounded-xl p-8 text-center">
            <div className="text-6xl mb-4">🌍</div>
            <p className="text-gray-400">
              विश्वका १५+ देशहरूबाट आज समाचार अपडेट भएको छ
            </p>
            <div className="flex justify-center space-x-6 mt-4 text-sm text-gray-500">
              <span>🇺🇦 यूक्रेन</span>
              <span>🇺🇸 अमेरिका</span>
              <span>🇨🇳 चीन</span>
              <span>🇪🇺 यूरोप</span>
              <span>+११ अन्य</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}