"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useArticle, useLocalData } from "@/app/hooks/useLocalData";

export default function ArticlePage() {
  const params = useParams();
  const articleId = params?.id as string;

  // Fetch single article
  const { article, loading: articleLoading, error: articleError } = useArticle(articleId);
  
  // Fetch related articles
  const { articles, loading: relatedLoading } = useLocalData();

  const loading = articleLoading || relatedLoading;
  const error = articleError;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">समाचार लोड हुँदैछ...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "समाचार भेटिएन"}</p>
          <Link
            href="/local-level"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 inline-block"
          >
            स्थानीय तहमा फर्कनुहोस्
          </Link>
        </div>
      </div>
    );
  }

  // Get related articles (same category, excluding current)
  const relatedNews = articles
    .filter((item) => item._id !== articleId)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <Link href="/local-level" className="hover:text-green-600 transition-colors">
              स्थानीय तह
            </Link>
            <span>/</span>
            <span className="text-gray-400">समाचार</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                {article.categories.map((cat, idx) => (
                  <span 
                    key={idx}
                    className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {cat}
                  </span>
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {article.location} {article.ward && `• ${article.ward}`}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>
            <div className="flex items-center space-x-4 text-gray-600">
              <span>📅 {article.time}</span>
              {article.views !== undefined && (
                <>
                  <span>•</span>
                  <span>👁️ {article.views} पटक हेरिएको</span>
                </>
              )}
              <span>•</span>
              <span>✍️ {article.author.username}</span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-8">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-64 md:h-96 object-cover rounded-xl shadow-md"
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <div className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
              {article.content}
            </div>

            <div className="mt-8 p-6 bg-green-50 rounded-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">महत्वपूर्ण तथ्यहरू</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• यो परियोजना स्थानीय विकासको लागि महत्वपूर्ण छ</li>
                <li>• स्थानीय नागरिकहरूको सहभागिता आवश्यक छ</li>
                <li>• भविष्यका लागि राम्रो नतिजाको अपेक्षा छ</li>
              </ul>
            </div>
          </div>

          {/* Share Section */}
          <div className="border-t border-b py-6 mb-8">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">यो समाचार साझा गर्नुहोस्:</span>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Facebook
                </button>
                <button className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
                  Twitter
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  WhatsApp
                </button>
              </div>
            </div>
          </div>

          {/* Related News */}
          {relatedNews.length > 0 && (
            <div className="border-t pt-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">सम्बन्धित समाचारहरू</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedNews.map((news) => (
                  <Link
                    key={news._id}
                    href={`/local-level/article/${news._id}`}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group"
                  >
                    <img 
                      src={news.image} 
                      alt={news.title} 
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <div className="p-4">
                      <h4 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2">
                        {news.title}
                      </h4>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{news.time}</span>
                        {news.views !== undefined && <span>👁️ {news.views}</span>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="mt-8">
            <Link
              href="/local-level"
              className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <span>←</span>
              <span>स्थानीय तहमा फर्कनुहोस्</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}