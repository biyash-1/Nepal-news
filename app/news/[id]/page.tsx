"use client";
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useNewsDetail } from '@/app/hooks/useNewsDetail';
import { useState } from 'react';

export default function NewsDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { article, relatedNews, loading, error } = useNewsDetail(id);
  const [comment, setComment] = useState({ name: '', email: '', message: '' });
  const [comments, setComments] = useState([
    { name: 'राम श्रेष्ठ', message: 'राम्रो समाचार!', time: '२ घण्टा अघि' },
    { name: 'सीता कार्की', message: 'धन्यवाद जानकारीको लागि', time: '५ घण्टा अघि' },
  ]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('ne-NP', options);
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'अहिलै';
    if (diffInHours < 24) return `${diffInHours} घण्टा अघि`;
    return `${Math.floor(diffInHours / 24)} दिन अघि`;
  };

  const handleCommentSubmit = () => {
    if (comment.name && comment.message) {
      setComments([
        { name: comment.name, message: comment.message, time: 'अहिलै' },
        ...comments
      ]);
      setComment({ name: '', email: '', message: '' });
    }
  };

  const shareOnSocial = (platform: string) => {
    const url = window.location.href;
    const text = article?.title || '';
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      whatsapp: `https://wa.me/?text=${text} ${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    };
    
    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">लोड हुँदैछ...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">समाचार फेला परेन</h2>
          <Link href="/" className="text-red-600 hover:text-red-700 font-medium">
            गृहपृष्ठमा फर्कनुहोस् →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-red-600">गृहपृष्ठ</Link>
            <span>/</span>
            <Link href={`/category/${article.categories[0]}`} className="hover:text-red-600 capitalize">
              {article.categories[0]}
            </Link>
            <span>/</span>
            <span className="text-gray-900 truncate">{article.title.substring(0, 50)}...</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Article Header */}
            <article className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
              {/* Category Badge */}
              <div className="px-8 pt-8">
                <span className="inline-block bg-red-600 text-white px-4 py-1 rounded-full text-sm font-medium capitalize">
                  {article.categories[0]}
                </span>
              </div>

              {/* Title */}
              <div className="px-8 pt-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
                  {article.title}
                </h1>
              </div>

              {/* Meta Information */}
              <div className="px-8 pb-6 flex flex-wrap items-center gap-6 text-sm text-gray-600 border-b">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-medium">{article.author.username}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{formatDate(article.createdAt)}</span>
                </div>
              </div>

              {/* Social Share */}
              <div className="px-8 py-6 bg-gray-50 border-b">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">सेयर गर्नुहोस्:</span>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => shareOnSocial('facebook')}
                      className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => shareOnSocial('twitter')}
                      className="w-10 h-10 bg-sky-500 hover:bg-sky-600 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => shareOnSocial('whatsapp')}
                      className="w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => shareOnSocial('linkedin')}
                      className="w-10 h-10 bg-blue-700 hover:bg-blue-800 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Hero Image */}
              <div className="relative">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-[500px] object-cover"
                />
              </div>

              {/* Article Content */}
              <div className="px-8 py-8">
                <div className="prose prose-lg max-w-none">
                  <div 
                    className="text-gray-800 leading-relaxed space-y-4"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                </div>

                {/* Categories/Tags */}
                {article.categories && article.categories.length > 0 && (
                  <div className="mt-8 pt-6 border-t">
                    <div className="flex flex-wrap gap-2">
                      <span className="text-gray-600 font-medium">श्रेणीहरू:</span>
                      {article.categories.map((category, index) => (
                        <Link
                          key={index}
                          href={`/category/${category}`}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm cursor-pointer transition-colors"
                        >
                          #{category}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </article>

            {/* Comments Section */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                टिप्पणीहरू ({comments.length})
              </h3>

              {/* Comment Form */}
              <div className="mb-8 bg-gray-50 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="तपाईंको नाम *"
                    value={comment.name}
                    onChange={(e) => setComment({ ...comment, name: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <input
                    type="email"
                    placeholder="इमेल ठेगाना"
                    value={comment.email}
                    onChange={(e) => setComment({ ...comment, email: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <textarea
                  placeholder="तपाईंको टिप्पणी लेख्नुहोस् *"
                  value={comment.message}
                  onChange={(e) => setComment({ ...comment, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
                />
                <button
                  onClick={handleCommentSubmit}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  टिप्पणी पठाउनुहोस्
                </button>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((c, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        {c.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-gray-900">{c.name}</h4>
                          <span className="text-sm text-gray-500">{c.time}</span>
                        </div>
                        <p className="text-gray-700">{c.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Related News */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-pink-600 px-6 py-4">
                <h4 className="font-bold text-lg text-white">थप समाचारहरू</h4>
              </div>
              <div className="p-6 space-y-6">
                {relatedNews.length > 0 ? (
                  relatedNews.map((news) => (
                    <Link key={news.id} href={`/news/${news.id}`}>
                      <div className="group cursor-pointer border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                        <div className="flex space-x-4">
                          <img
                            src={news.image}
                            alt={news.title}
                            className="w-24 h-20 object-cover rounded-lg group-hover:scale-105 transition-transform"
                          />
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-red-600 transition-colors line-clamp-3">
                              {news.title}
                            </h5>
                            <p className="text-xs text-gray-500 mt-2">
                              {formatRelativeTime(news.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">सम्बन्धित समाचार फेला परेन</p>
                )}
              </div>
            </div>

            {/* Trending Now */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl shadow-lg p-6">
              <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                🔥 ट्रेन्डिङ
              </h4>
              <div className="space-y-3">
                {relatedNews.slice(0, 5).map((news, index) => (
                  <Link key={news.id} href={`/news/${news.id}`}>
                    <div className="flex items-center space-x-3 p-3 bg-white rounded-lg hover:shadow-md cursor-pointer transition-all">
                      <span className="font-bold text-red-600 text-xl w-8">{index + 1}</span>
                      <p className="text-sm font-medium text-gray-800 flex-1 line-clamp-2">
                        {news.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 text-white">
              <h4 className="font-bold text-lg mb-3">न्यूजलेटर सदस्यता</h4>
              <p className="text-gray-300 text-sm mb-4">
                ताजा समाचार सिधै आफ्नो इमेलमा प्राप्त गर्नुहोस्
              </p>
              <input
                type="email"
                placeholder="तपाईंको इमेल"
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 mb-3"
              />
              <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors">
                सब्सक्राइब गर्नुहोस्
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}