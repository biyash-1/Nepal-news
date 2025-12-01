"use client";
import { useCategoryNews } from "@/app/hooks/useCategoryNews";
import Link from "next/link";
import { useState } from "react";

interface Props {
  category: string;
  title: string;
  gradient?: string;
}

const CategoryNewsPage = ({ category, title, gradient }: Props) => {
  const { news, popularNews, loading, error, loadMore, totalPages, currentPage } =
    useCategoryNews(category);
  const [email, setEmail] = useState("");
  const [activeTab, setActiveTab] = useState("latest");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "अहिलै";
    if (diffInHours < 24) return `${diffInHours} घण्टा अघि`;
    return `${Math.floor(diffInHours / 24)} दिन अघि`;
  };

  const getImageSrc = (img?: string) => {
    return img && img.trim() !== ""
      ? img
      : `https://images.unsplash.com/photo-${category === 'technology' ? '1550745165' : category === 'health' ? '1576091160399' : '1495020689067'}-?auto=format&fit=crop&w=800&q=80`;
  };

  const getCategoryColor = () => {
    const colors = {
      technology: {
        primary: "bg-blue-600",
        light: "bg-blue-50",
        text: "text-blue-600",
        border: "border-blue-200",
        hover: "hover:bg-blue-50",
        gradient: "from-blue-500 to-blue-600",
      },
      health: {
        primary: "bg-green-600",
        light: "bg-green-50",
        text: "text-green-600",
        border: "border-green-200",
        hover: "hover:bg-green-50",
        gradient: "from-green-500 to-green-600",
      },
      education: {
        primary: "bg-purple-600",
        light: "bg-purple-50",
        text: "text-purple-600",
        border: "border-purple-200",
        hover: "hover:bg-purple-50",
        gradient: "from-purple-500 to-purple-600",
      },
      default: {
        primary: "bg-indigo-600",
        light: "bg-indigo-50",
        text: "text-indigo-600",
        border: "border-indigo-200",
        hover: "hover:bg-indigo-50",
        gradient: "from-indigo-500 to-indigo-600",
      },
    };
    return colors[category as keyof typeof colors] || colors.default;
  };

  const { primary, light, text, border, hover, gradient: catGradient } = getCategoryColor();

  const getCategoryIcon = () => {
    const icons = {
      technology: "💻",
      health: "🏥",
      education: "📚",
      default: "📰"
    };
    return icons[category as keyof typeof icons] || icons.default;
  };

  // Featured news is first item
  const featuredNews = news[0];
  const latestNews = news.slice(1, 7); // First 6 news after featured
  const moreNews = news.slice(7); // Remaining news for "थप समाचार"

  if (loading && news.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-16 h-16 rounded-full border-4 border-gray-200"></div>
            <div className={`absolute top-0 left-0 w-16 h-16 rounded-full border-4 ${primary} border-t-transparent animate-spin`}></div>
          </div>
          <p className="mt-6 text-lg text-gray-600 font-medium">समाचार लोड हुँदैछ...</p>
          <p className="text-gray-400 text-sm mt-2">कृपया प्रतिक्षा गर्नुहोस्</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-500 text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">समाचार लोड गर्न असफल</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className={`${primary} text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity`}
          >
            पुन: प्रयास गर्नुहोस्
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Category Header */}
      <div className={`sticky top-0 z-10 bg-gradient-to-r ${catGradient} shadow-lg`}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">{title}</h1>
                <p className="text-white/80 mt-1">ताजा समाचार र अपडेटहरू</p>
              </div>
            </div>
           
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column - Main Content (75%) */}
          <div className="lg:w-3/4">
            
            {/* Featured News Section */}
            {featuredNews && (
              <div className="mb-12">
                <Link href={`/news/${featuredNews._id}`} className="group block">
                  <div className="relative overflow-hidden rounded-2xl shadow-xl">
                    <div className="aspect-[21/9] relative overflow-hidden">
                      <img
                        src={getImageSrc(featuredNews.featuredImage || featuredNews.image)}
                        alt={featuredNews.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="max-w-3xl">
                          <div className="flex items-center gap-4 mb-4">
                           
                          </div>
                          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 group-hover:text-gray-200 transition-colors">
                            {featuredNews.title}
                          </h2>
                        
                          <div className="flex items-center gap-4 mt-6">
                           
                         
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Latest News Grid */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900">ताजा समाचार</h3>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm text-gray-500">लाइभ अपडेट</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestNews.map((article, index) => (
                  <Link
                    href={`/news/${article._id}`}
                    key={article._id}
                    className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={getImageSrc(article.featuredImage || article.image)}
                        alt={article.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                       
                      </div>
                    
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                       
                        <span className="text-xs text-gray-500">
                          {formatDate(article.createdAt)}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors line-clamp-2 mb-4">
                        {article.title}
                      </h4>
                      <div className="flex items-center justify-between">
                       
                      
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* More News Section with Right Side Content */}
            {moreNews.length > 0 && (
              <div className="mb-12">
                <div className="border-t border-gray-200 pt-8">
                  <h4 className="text-2xl font-bold text-gray-900 mb-6">थप समाचार</h4>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - More News (2/3 width) */}
                    <div className="lg:col-span-2">
                      <div className="space-y-6">
                        {moreNews.slice(0, 4).map((article, index) => (
                          <Link
                            href={`/news/${article._id}`}
                            key={article._id}
                            className="group flex items-start gap-6 p-4 hover:bg-white rounded-xl transition-all duration-300 border border-gray-100 hover:shadow-md"
                          >
                            <div className="flex-shrink-0 w-32 h-32 overflow-hidden rounded-lg">
                              <img
                                src={getImageSrc(article.featuredImage || article.image)}
                                alt={article.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <span className={`text-xs font-semibold ${text} px-2 py-1 rounded ${light}`}>
                                  {category}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {formatDate(article.createdAt)}
                                </span>
                              </div>
                              <h5 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-lg mb-2">
                                {article.title}
                              </h5>
                              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                {article.description || "समाचार पढ्न जारी राख्नुहोस्..."}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                  {Math.floor(Math.random() * 8) + 2} मिनेट पढ्न
                                </span>
                                <span className="text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                                  विस्तारित →
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Right Column - Additional Content (1/3 width) */}
                    <div className="space-y-6">
                      {/* Trending Topics */}
                      <div className={`${light} border ${border} rounded-xl p-5`}>
                        <div className="flex items-center gap-2 mb-4">
                          <svg className={`w-5 h-5 ${text}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                          </svg>
                          <h5 className="font-bold text-gray-900">हालै ट्रेन्डिङ</h5>
                        </div>
                        <div className="space-y-3">
                          {['ताजा समाचार', 'नेपाली बजार', 'स्वास्थ्य टिप्स', 'शैक्षिक अपडेट', 'प्रविधि नयाँ'].map((topic, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 hover:bg-white rounded-lg cursor-pointer group">
                              <div className="flex items-center gap-3">
                                <span className="text-gray-400 text-sm font-bold">#{idx + 1}</span>
                                <span className="text-sm text-gray-700 group-hover:text-blue-600">{topic}</span>
                              </div>
                              <span className="text-xs text-gray-500">{Math.floor(Math.random() * 1000) + 100}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Top Contributors */}
                      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                          <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                          </svg>
                          <h5 className="font-bold text-gray-900">शीर्ष योगदानकर्ताहरू</h5>
                        </div>
                        <div className="space-y-4">
                          {['राम श्रेष्ठ', 'सीता कोइराला', 'हरि गुरुङ', 'गीता थापा'].map((author, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                              <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                  {author.charAt(0)}
                                </div>
                                {idx < 2 && (
                                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-xs text-white">
                                    {idx + 1}
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm text-gray-900">{author}</p>
                                <p className="text-xs text-gray-500">{Math.floor(Math.random() * 50) + 10} लेखहरू</p>
                              </div>
                              <span className={`text-xs font-bold ${text}`}>
                                {Math.floor(Math.random() * 1000) + 100} पाठक
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Weekly Stats */}
                      <div className="bg-gradient-to-br from-gray-900 to-black text-white rounded-xl p-5">
                        <h5 className="font-bold mb-4 text-lg">यस हप्ताको तथ्याङ्क</h5>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-white/10 rounded-lg">
                            <p className="text-2xl font-bold">{news.length}</p>
                            <p className="text-xs text-gray-300 mt-1">समाचार</p>
                          </div>
                          <div className="text-center p-3 bg-white/10 rounded-lg">
                            <p className="text-2xl font-bold">{popularNews.length}</p>
                            <p className="text-xs text-gray-300 mt-1">लोकप्रिय</p>
                          </div>
                          <div className="text-center p-3 bg-white/10 rounded-lg">
                            <p className="text-2xl font-bold">{Math.floor(Math.random() * 10000) + 1000}</p>
                            <p className="text-xs text-gray-300 mt-1">पाठकहरू</p>
                          </div>
                          <div className="text-center p-3 bg-white/10 rounded-lg">
                            <p className="text-2xl font-bold">४.८★</p>
                            <p className="text-xs text-gray-300 mt-1">मूल्याङ्कन</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Load More Button */}
            {currentPage < totalPages && (
              <div className="text-center py-8 border-t border-gray-200">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className={`inline-flex items-center gap-3 ${primary} hover:opacity-90 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      लोड हुँदैछ...
                    </>
                  ) : (
                    <>
                      थप {Math.min(6, totalPages - currentPage)} समाचार हेर्नुहोस्
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </>
                  )}
                </button>
                <p className="text-gray-500 text-sm mt-4">
                  पृष्ठ {currentPage} of {totalPages} • {news.length} समाचार देखियो
                </p>
              </div>
            )}

            {currentPage === totalPages && totalPages > 1 && (
              <div className="text-center py-12">
                <div className={`inline-flex items-center justify-center w-16 h-16 ${light} rounded-full mb-4`}>
                  <span className="text-2xl">🎉</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">धन्यवाद!</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  तपाईंले {news.length} समाचारहरू हेर्नुभयो। नयाँ समाचारहरूको लागि फेरि भेटौंला।
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar (25%) */}
          <div className="lg:w-1/4 space-y-8">
            
            {/* Popular News */}
            <div className="sticky top-24">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className={`${primary} px-5 py-4`}>
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                    लोकप्रिय समाचार
                  </h4>
                </div>
                <div className="divide-y divide-gray-100">
                  {popularNews.map((article, index) => (
                    <Link
                      href={`/news/${article._id}`}
                      key={article._id}
                      className="group block p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 text-sm font-bold text-gray-700">
                            {index + 1}
                          </div>
                          <div className={`absolute inset-0 ${primary} rounded-lg opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                            {article.title}
                          </h5>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">
                              {formatDate(article.createdAt)}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-blue-600 font-medium">
                              {Math.floor(Math.random() * 1000) + 100} पटक हेरियो
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-5 text-white mt-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">समाचार सदस्यता</h4>
                    <p className="text-sm text-gray-300">ताजा समाचार इमेलमा</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-5">
                  {title} को ताजा समाचार सिधै तपाईंको इनबक्समा प्राप्त गर्नुहोस्
                </p>
                <div className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="तपाईंको इमेल ठेगाना"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  />
                  <button
                    className={`w-full ${primary} hover:opacity-90 text-white py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    सब्सक्राइब गर्नुहोस्
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-4 text-center">
                  कुनै स्प्याम छैन • कुनै पनि समयमा रद्द गर्न सकिन्छ
                </p>
              </div>

              {/* Quick Links */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 mt-8">
                <h5 className="font-bold text-gray-900 mb-4">द्रुत लिंकहरू</h5>
                <div className="space-y-3">
                  {[
                    { label: 'सबै समाचार', icon: '📰' },
                    { label: 'विशेषज्ञहरू', icon: '👨‍💼' },
                    { label: 'वेबिनारहरू', icon: '🎥' },
                    { label: 'मार्गदर्शन', icon: '📖' },
                    { label: 'सम्पर्क', icon: '📞' }
                  ].map((link) => (
                    <button
                      key={link.label}
                      className="w-full text-left text-gray-700 hover:text-blue-600 transition-all duration-300 flex items-center justify-between group py-2.5 px-3 hover:bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{link.icon}</span>
                        <span className="font-medium">{link.label}</span>
                      </div>
                      <svg className="w-4 h-4 text-gray-400 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className={`mt-12 bg-gradient-to-r ${catGradient} text-white py-12`}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-6">
              {title} को बारेमा थप जान्न चाहनुहुन्छ?
            </h3>
            <p className="text-xl text-white/80 mb-8">
              हाम्रो नियमित अपडेट, विशेष सामग्री र विशेषज्ञ विश्लेषणहरू प्राप्त गर्न आज नै सदस्यता लिनुहोस्।
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold transition-colors inline-flex items-center justify-center gap-2">
                <span>सुरू गर्नुहोस्</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <button className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-full font-semibold transition-colors">
                थप जानकारी
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryNewsPage;