"use client";
import { useCategoryNews } from "@/app/hooks/useCategoryNews";

interface Props {
  category: string; 
  title: string;    
  gradient?: string; 
}

const CategoryNewsPage = ({ category, title, gradient }: Props) => {
  const { news, loading, error, loadMore, totalPages, currentPage } =
    useCategoryNews(category);

  console.log(`News for category "${category}":`, news);

  const bg = gradient || "from-green-50 to-blue-50";


  const getCategorySidebarContent = () => {
    const commonTips = {
      technology: [
        "नयाँ प्रविधिको ज्ञान बढाउन दैनिक अभ्यास गर्नुहोस्",
        "साइबर सुरक्षाको लागि मजबूत पासवर्ड प्रयोग गर्नुहोस्",
        "नयाँ सफ्टवेयर र एप्सको बारेमा जान्नुहोस्",
        "डिजिटल साक्षरता बढाउनुहोस्"
      ],
      health: [
        "दिनमा कम्तीमा ८ गिलास पानी पिउनुहोस्",
        "नियमित ३० मिनेट व्यायाम गर्नुहोस्",
        "ताजा फलफूल र सब्जी खानुहोस्",
        "कम्तीमा ७-८ घण्टा निद लिनुहोस्"
      ],
      education: [
        "दैनिक कम्तीमा २ घण्टा अध्ययन गर्नुहोस्",
        "नोट बनाउने बानी लगाउनुहोस्",
        "समूहमा अध्ययन गर्दा बुझाइ राम्रो हुन्छ",
        "नियमित पढाइको समयतालिका बनाउनुहोस्"
      ],
      default: [
        "नियमित रूपमा जानकारी अपडेट गर्नुहोस्",
        "विश्वसनीय स्रोतबाट मात्र जानकारी लिनुहोस्",
        "आफ्नो ज्ञान अरूसँग साझा गर्नुहोस्",
        "नयाँ जानकारीको लागि सधैं खोजी गर्नुहोस्"
      ]
    };

    const tips = commonTips[category as keyof typeof commonTips] || commonTips.default;

    return { tips };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'अहिलै';
    } else if (diffInHours < 24) {
      return `${diffInHours} घण्टा अघि`;
    } else {
      return `${Math.floor(diffInHours / 24)} दिन अघि`;
    }
  };

  const getCategoryColor = () => {
    const colors = {
      technology: { primary: 'blue', badge: 'blue' },
      health: { primary: 'green', badge: 'green' },
      education: { primary: 'purple', badge: 'purple' },
      default: { primary: 'green', badge: 'green' }
    };
    
    return colors[category as keyof typeof colors] || colors.default;
  };

  const { tips } = getCategorySidebarContent();
  const { primary, badge } = getCategoryColor();

  if (loading && news.length === 0) {
    return (
      <section className={`py-7 bg-gradient-to-br ${bg}`}>
        <div className="container mx-auto px-8">
          <div className="text-center py-4">
            <div className={`animate-spin rounded-full h-12 w-12 border-b-2 border-${primary}-600 mx-auto`}></div>
            <p className="mt-4 text-gray-600">समाचार लोड हुँदैछ...</p>
          </div>
        </div>
      </section>
    );
  }

  

  const featuredNews = news[0];
  const otherNews = news.slice(1);

  return (
    <section className={`py-12 bg-gradient-to-br ${bg}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className={`p-3 bg-${primary}-600 rounded-lg`}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9m0 0v3m0-3V6a2 2 0 012-2h2a2 2 0 012 2v3" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
              <p className={`text-${primary}-600 font-medium`}>{category} सम्बन्धी ताजा समाचार र जानकारी</p>
            </div>
          </div>
        </div>

        {/* Page Info */}
        {totalPages > 1 && (
          <div className="mb-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              पेज {currentPage} of {totalPages}
            </div>
            <div className="text-sm text-gray-600">
              कुल {news.length} समाचार
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content - 3 columns */}
          <div className="lg:col-span-3">
            {/* Featured News */}
            {featuredNews && (
              <div className="mb-8">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="relative">
                    <img 
                      src={featuredNews.image} 
                      alt={featuredNews.title}
                      className="w-full h-80 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`bg-${badge}-500 text-white px-3 py-1 rounded-full text-sm font-bold`}>
                        फिचर्ड
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                      <div className="flex items-center space-x-4 text-white text-sm mb-2">
                        <span className={`bg-${primary}-600 px-2 py-1 rounded`}>{category}</span>
                        <span>{formatDate(featuredNews.createdAt)}</span>
                      </div>
                      <h3 className="text-white text-2xl font-bold mb-2">{featuredNews.title}</h3>
                      <p className="text-gray-200 line-clamp-2">
                        {featuredNews.excerpt || featuredNews.content?.substring(0, 150) || "विवरण उपलब्ध छैन..."}
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <span className={`text-${primary}-300`}>{featuredNews.author?.username || "लेखक"}</span>
                        <button className={`bg-white text-${primary}-600 px-4 py-2 rounded-lg hover:bg-${primary}-50 transition-colors`}>
                          पढ्न जारी राख्नुहोस्
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherNews.map((article) => (
                <div 
                  key={article._id} 
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                >
                  <div className="relative">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`bg-${badge}-600 text-white px-2 py-1 rounded text-xs font-medium`}>
                        {category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">{article.title}</h4>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {article.excerpt || article.content?.substring(0, 100) || "विवरण उपलब्ध छैन..."}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{article.author?.username || "लेखक"}</span>
                      <span>{formatDate(article.createdAt)}</span>
                    </div>
                    <button className={`w-full mt-3 bg-${primary}-50 text-${primary}-600 py-2 rounded-lg hover:bg-${primary}-100 transition-colors text-sm font-medium`}>
                      पढ्नुहोस्
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More and Pagination Controls */}
            {news.length > 0 && (
              <div className="flex flex-col items-center mt-8 space-y-4">
                {/* Load More Button */}
                {currentPage < totalPages && (
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className={`bg-${primary}-600 text-white px-6 py-3 rounded-lg hover:bg-${primary}-700 transition-colors disabled:opacity-50 flex items-center space-x-2`}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>लोड हुँदैछ...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>थप समाचार हेर्नुहोस्</span>
                      </>
                    )}
                  </button>
                )}

                {/* End of Results Message */}
                {currentPage === totalPages && totalPages > 1 && (
                  <div className="text-center text-gray-600 py-4">
                    <p>तपाईंले सबै समाचार हेर्नुभयो ({news.length} समाचार)</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - 1 column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Category Tips */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h4 className="font-bold text-gray-900 mb-4 text-lg">{category} सल्लाह</h4>
              <div className="space-y-3">
                {tips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-6 h-6 bg-${primary}-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1`}>
                      <svg className={`w-3 h-3 text-${primary}-600`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-700 text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular News */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h4 className="font-bold text-gray-900 mb-4 text-lg">लोकप्रिय समाचार</h4>
              <div className="space-y-4">
                {news.slice(0, 3).map((article) => (
                  <div key={article._id} className="flex space-x-3">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h5 className="font-medium text-sm text-gray-900 line-clamp-2">{article.title}</h5>
                      <p className="text-xs text-gray-500">{formatDate(article.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className={`bg-${primary}-50 rounded-xl shadow-md p-6 border border-${primary}-200`}>
              <h4 className="font-bold text-gray-900 mb-4 text-lg">द्रुत लिंकहरू</h4>
              <div className="space-y-3">
                <button className="w-full text-left text-sm text-gray-700 hover:text-blue-600 transition-colors py-1">
                  {category} सम्बन्धी भिडियो
                </button>
                <button className="w-full text-left text-sm text-gray-700 hover:text-blue-600 transition-colors py-1">
                  {category} पाठ्यक्रम
                </button>
                <button className="w-full text-left text-sm text-gray-700 hover:text-blue-600 transition-colors py-1">
                  {category} विशेषज्ञहरू
                </button>
                <button className="w-full text-left text-sm text-gray-700 hover:text-blue-600 transition-colors py-1">
                  {category} इभेन्टहरू
                </button>
              </div>
            </div>

            {/* Refresh Button */}
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryNewsPage;