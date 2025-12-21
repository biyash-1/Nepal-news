"use client";
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useNewsDetail } from '@/app/hooks/useNewsDetail';
import { useComments } from '@/app/hooks/useComments';
import { useAuthStore } from '@/app/store/useAuthStore';
import { useViewTracker } from '@/app/hooks/useViewTracker';
import AuthModal from '@/components/AuthModel';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaFacebookF, FaTwitter, FaWhatsapp, FaLinkedinIn } from 'react-icons/fa';

export default function NewsDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { article, relatedNews, trendingNews,recentNews, loading, error } = useNewsDetail(id);
  const { user, isAuthenticated } = useAuthStore();
  
  // View tracking hook - now uses dynamic trending system
  const { viewCounted, isTrending, currentViews, trendingScore, debugInfo } = useViewTracker(id, article);
  
  const socialPlatforms = [
    { name: 'facebook', color: '#1877F2', icon: FaFacebookF },
    { name: 'twitter', color: '#1DA1F2', icon: FaTwitter },
    { name: 'whatsapp', color: '#25D366', icon: FaWhatsapp },
    { name: 'linkedin', color: '#0077B5', icon: FaLinkedinIn },
  ];

  const {
    comments,
    loading: commentsLoading,
    total: totalComments,
    hasMore,
    postComment,
    updateComment,
    deleteComment,
    likeComment,
    dislikeComment,
    loadMore
  } = useComments(id);

  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

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
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) return 'अहिले';
    if (diffInMinutes < 60) return `${diffInMinutes} मिनेट अघि`;
    if (diffInHours < 24) return `${diffInHours} घण्टा अघि`;
    if (diffInDays < 30) return `${diffInDays} दिन अघि`;
    return formatDate(dateString);
  };

  const handleCommentSubmit = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      toast.error('कृपया पहिले लगइन गर्नुहोस्');
      return;
    }

    if (!commentText.trim()) {
      toast.error('कृपया टिप्पणी लेख्नुहोस्');
      return;
    }

    try {
      await postComment(commentText);
      setCommentText('');
    } catch (error) {
      console.error('Failed to post comment:', error);
    }
  };

  const handleEditComment = (commentId: string, currentText: string) => {
    setEditingCommentId(commentId);
    setEditingText(currentText);
  };

  const handleSaveEdit = async (commentId: string) => {
    try {
      await updateComment(commentId, editingText);
      setEditingCommentId(null);
      setEditingText('');
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingText('');
  };

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm('के तपाईं यो टिप्पणी मेटाउन निश्चित हुनुहुन्छ?')) {
      try {
        await deleteComment(commentId);
      } catch (error) {
        console.error('Failed to delete comment:', error);
      }
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
            गृहपृष्ठ मा फर्कनुहोस् →
          </Link>
        </div>
      </div>
    );
  }

  const charCount = commentText.length;
  const maxChars = 1000;

  // Use current views from hook (updates in real-time)
  const displayViews = viewCounted ? currentViews : (article.views || 0);

  return (
    <div className="w-[75%] mx-auto bg-gray-50">
      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Article Content */}
            <article className="bg-white shadow-lg rounded overflow-hidden mb-8">
              <div className="px-8 pt-8">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="inline-block bg-red-600 text-white px-4 py-1 rounded-full text-sm font-medium capitalize">
                    {article.categories[0]}
                  </span>
                </div>
              </div>

              <div className="px-8 pt-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
                  {article.title}
                </h1>
              </div>

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
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{displayViews} दृश्य</span>
                </div>
                
               
              </div>

              <div className="px-8 py-6 bg-gray-50 border-b">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">सेयर गर्नुहोस्:</span>
                  <div className="flex space-x-3">
                    {socialPlatforms.map(({ name, color, icon: Icon }) => (
                      <button
                        key={name}
                        onClick={() => shareOnSocial(name)}
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                        style={{ backgroundColor: color }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                      >
                        <Icon className="text-white" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-[500px] object-cover"
                />
              </div>

              <div className="px-8 py-8">
                <div className="prose prose-lg max-w-none">
                  <div 
                    className="text-gray-800 text-lg leading-relaxed space-y-4"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                </div>

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
                टिप्पणीहरू ({totalComments})
              </h3>

              {/* Comment Form */}
              <div className="mb-8 bg-gray-50 p-6 rounded-lg">
                {!isAuthenticated && (
                  <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 text-sm text-center">
                      टिप्पणी गर्न कृपया{' '}
                      <button 
                        onClick={() => setShowAuthModal(true)}
                        className="font-bold underline hover:text-blue-900"
                      >
                        लगइन गर्नुहोस्
                      </button>
                    </p>
                  </div>
                )}
                
                {isAuthenticated && user && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">को रूपमा टिप्पणी गर्दै</p>
                    </div>
                  </div>
                )}

                <textarea
                  placeholder={isAuthenticated ? "तपाईंको टिप्पणी लेख्नुहोस् *" : "लगइन गरी टिप्पणी गर्नुहोस्..."}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onClick={() => {
                    if (!isAuthenticated) {
                      setShowAuthModal(true);
                      toast.error('कृपया पहिले लगइन गर्नुहोस्');
                    }
                  }}
                  disabled={!isAuthenticated}
                  rows={4}
                  maxLength={maxChars}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${charCount > maxChars * 0.9 ? 'text-red-600' : 'text-gray-500'}`}>
                    {charCount}/{maxChars} अक्षर
                  </span>
                  <button
                    onClick={handleCommentSubmit}
                    disabled={!isAuthenticated || !commentText.trim()}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    टिप्पणी पठाउनुहोस्
                  </button>
                </div>
              </div>

              {/* Comments Loading */}
              {commentsLoading && comments.length === 0 && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-red-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">टिप्पणीहरू लोड हुँदैछ...</p>
                </div>
              )}

              {/* No Comments */}
              {!commentsLoading && comments.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-gray-500 text-lg">अहिलेसम्म कुनै टिप्पणी छैन</p>
                  <p className="text-gray-400 text-sm mt-2">पहिलो टिप्पणी गर्नुहोस्!</p>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment._id} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        {comment.user.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-bold text-gray-900">{comment.user.username}</h4>
                            <p className="text-sm text-gray-500">
                              {formatRelativeTime(comment.createdAt)}
                              {comment.isEdited && <span className="ml-2">(सम्पादित)</span>}
                            </p>
                          </div>
                          
                          {isAuthenticated && user?.id === comment.user._id && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditComment(comment._id, comment.content)}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                              >
                                सम्पादन गर्नुहोस्
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment._id)}
                                className="text-red-600 hover:text-red-700 text-sm font-medium"
                              >
                                मेटाउनुहोस्
                              </button>
                            </div>
                          )}
                        </div>

                        {editingCommentId === comment._id ? (
                          <div className="mt-2">
                            <textarea
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              rows={3}
                              maxLength={maxChars}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-2"
                            />
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleSaveEdit(comment._id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                              >
                                सेभ गर्नुहोस्
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium"
                              >
                                रद्द गर्नुहोस्
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-gray-700 mb-3">{comment.content}</p>
                            
                            {/* Like/Dislike buttons */}
                            {isAuthenticated && (
                              <div className="flex items-center space-x-4">
                                <button
                                  onClick={() => likeComment(comment._id)}
                                  className={`flex items-center space-x-1 ${
                                    comment.likes.includes(user?.id || '') 
                                      ? 'text-red-600' 
                                      : 'text-gray-500 hover:text-red-600'
                                  } transition-colors`}
                                >
                                  <svg className="w-5 h-5" fill={comment.likes.includes(user?.id || '') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                  </svg>
                                  <span className="text-sm font-medium">{comment.likeCount}</span>
                                </button>
                                
                                <button
                                  onClick={() => dislikeComment(comment._id)}
                                  className={`flex items-center space-x-1 ${
                                    comment.dislikes.includes(user?.id || '') 
                                      ? 'text-blue-600' 
                                      : 'text-gray-500 hover:text-blue-600'
                                  } transition-colors`}
                                >
                                  <svg className="w-5 h-5" fill={comment.dislikes.includes(user?.id || '') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                                  </svg>
                                  <span className="text-sm font-medium">{comment.dislikeCount}</span>
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center mt-6">
                  <button
                    onClick={loadMore}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    थप टिप्पणी लोड गर्नुहोस्
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Recent News Sidebar */}
            <div className="overflow-hidden">
              <div className="py-4 px-4">

                <h4 className="font-bold pl-2 border-l-4 border-red-600 text-lg text-black">ताजा समाचार</h4>
                <div className="h-0.5 bg-red-600 mt-2"></div>
              </div>
              
              <div className="pt-3 pl-3 space-y-6">
                {recentNews.length > 0 ? (
                  recentNews.map((news) => (
                    <Link key={news._id} href={`/news/${news._id}`} className='block mb-2'>
                      <div className="group cursor-pointer border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="flex space-x-4">
                          <img
                            src={news.image}
                            alt={news.title}
                            className="w-24 h-20 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-900 text-base leading-tight group-hover:text-red-600 transition-colors line-clamp-3">
                              {news.title}
                            </h5>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">ट्रेन्डिङ समाचार फेला परेन</p>
                )}
              </div>
            </div>
            
            {/* Trending News Sidebar */}
            <div className="overflow-hidden">
              <div className="py-4 px-4">

                <h4 className="font-bold pl-2 border-l-4 border-red-600 text-lg text-black">ट्रेन्डिङ समाचार</h4>
                <div className="h-0.5 bg-red-600 mt-2"></div>
              </div>
              
              <div className="pt-3 pl-3 space-y-6">
                {trendingNews.length > 0 ? (
                  trendingNews.map((news) => (
                    <Link key={news._id} href={`/news/${news._id}`} className='block mb-2'>
                      <div className="group cursor-pointer border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="flex space-x-4">
                          <img
                            src={news.image}
                            alt={news.title}
                            className="w-24 h-20 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-900 text-base leading-tight group-hover:text-red-600 transition-colors line-clamp-3">
                              {news.title}
                            </h5>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">ट्रेन्डिङ समाचार फेला परेन</p>
                )}
              </div>
            </div>
            {/* Related News Sidebar */}
            <div className="overflow-hidden">
              <div className="px-4 py-4">

                <h4 className="font-bold pl-2 border-l-4 border-red-600 text-lg text-black">सम्बन्धित समाचार</h4>
                <div className="h-0.5 bg-red-600 mt-2"></div>
              </div>
              <div className="pt-3 pl-3 space-y-6">
                {relatedNews.length > 0 ? (
                  relatedNews.map((news) => (
                    <Link key={news._id} href={`/news/${news._id}`} className='block mb-2'>
                      <div className="group cursor-pointer border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="flex space-x-4">
                          <img
                            src={news.image}
                            alt={news.title}
                            className="w-24 h-20 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-900 text-base leading-tight group-hover:text-red-600 transition-colors line-clamp-3">
                              {news.title}
                            </h5>
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

          </div>
        </div>
      </div>
    </div>
  );
}