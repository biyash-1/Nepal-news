export default function PortfolioSection() {
  const adPackages = [
    {
      id: 1,
      title: "प्रिमियम ब्यानर विज्ञापन",
      description: "साइटको मुख्य पृष्ठमा शीर्षस्थानमा प्रदर्शन हुने विज्ञापन",
      price: "रु. १५,०००/महिना",
      features: ["सबै पृष्ठहरूमा देखिने", "उच्च क्लिक दर", "प्रिमियम स्थान"],
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      type: "premium",
      popular: true
    },
    {
      id: 2,
      title: "साइडबार विज्ञापन",
      description: "साइडबारमा प्रदर्शन हुने मध्यम आकारको विज्ञापन",
      price: "रु. ८,०००/महिना",
      features: ["निर्दिष्ट श्रेणीमा",  "मोबाइल अनुकूल", "मासिक रिपोर्ट"],
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      type: "standard"
    },
    {
      id: 3,
      title: "इन-आर्टिकल विज्ञापन",
      description: "समाचार भित्र प्राकृतिक रूपमा समावेश गरिएको विज्ञापन",
      price: "रु. १२,०००/महिना",
      features: ["उच्च जनसङ्ख्या", "समाचारसँग सम्बन्धित", "स्पन्सरशिप"],
      image: "https://images.unsplash.com/photo-1565689228864-0f8f4c2e45c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      type: "premium"
    },
    {
      id: 4,
      title: "पप-अप विज्ञापन",
      description: "प्रयोगकर्ताले साइट प्रवेश गर्दा देखिने विज्ञापन",
      price: "रु. ६,०००/महिना",
      features: ["उच्च दृश्यता", "सीपीए मोडेल", "कस्टमाइजेबल"],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      type: "standard"
    }
  ];

  const adStats = [
    { number: "५०,०००+", label: "दैनिक पाठक" },
    { number: "१० लाख+", label: "मासिक पृष्ठ दृश्य" },
    { number: "७०%", label: "नेपाली प्रयोगकर्ता" },
    { number: "३० सेकेन्ड", label: "औसत समय बिताएको" }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
           पोर्टफोलियो
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            नेपालको अग्रणी समाचार पोर्टलमा आफ्नो व्यवसायलाई प्रमोट गर्नुहोस्। 
            हामीसँग विभिन्न प्रकारका विज्ञापन प्याकेजहरू उपलब्ध छन्।
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {adStats.map((stat, index) => (
            <div key={index} className="text-center bg-white rounded-lg p-6 shadow-sm">
              <div className="text-2xl font-bold text-blue-600 mb-2">{stat.number}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Ad Packages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {adPackages.map((pkg) => (
            <div 
              key={pkg.id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
                pkg.popular ? 'ring-2 ring-yellow-400' : ''
              }`}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="bg-yellow-500 text-white text-center py-2 text-sm font-bold">
                  ⭐ सबैभन्दा लोकप्रिय
                </div>
              )}
              
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={pkg.image} 
                  alt={pkg.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    pkg.type === 'premium' 
                      ? 'bg-yellow-500 text-white' 
                      : 'bg-blue-500 text-white'
                  }`}>
                    {pkg.type === 'premium' ? 'प्रिमियम' : 'स्ट्यान्डर्ड'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-2">{pkg.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>
                
                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Price & CTA */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-green-600">{pkg.price}</span>
                  </div>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors">
                    अहिले बुक गर्नुहोस्
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">विज्ञापनको लागि सम्पर्क गर्नुहोस्</h3>
          <p className="text-blue-100 mb-6">
            हामी तपाईंको व्यवसायको आवश्यकता अनुसार कस्टम विज्ञापन प्याकेज तयार गर्न मद्दत गर्छौं।
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>९८०XXXXXXXX, ९८१XXXXXXXX</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>ads@nepalsamachar.com</span>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h4 className="font-bold text-gray-900 mb-2">गुणस्तरीय ट्राफिक</h4>
            <p className="text-gray-600 text-sm">नेपाली प्रयोगकर्ताहरूको ठूलो संख्यामा पहुँच</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="font-bold text-gray-900 mb-2">तुरुन्तै असर</h4>
            <p className="text-gray-600 text-sm">विज्ञापन दिइएको दिनदेखि नै परिणाम देख्नुहोस्</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h4 className="font-bold text-gray-900 mb-2">सुरक्षित भुक्तानी</h4>
            <p className="text-gray-600 text-sm">विभिन्न सुरक्षित भुक्तानी विधिहरू उपलब्ध</p>
          </div>
        </div>
      </div>
    </section>
  );
}