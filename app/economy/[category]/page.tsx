
"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEconomyArticle } from "@/app/hooks/useEconomy";
import { useEconomy } from "@/app/hooks/useEconomy";

const categories: Record<string, string> = {
  banking: 'बैङ्किङ्ग',
  market: 'बजार',
  jobs: 'रोजगारी',
  trade: 'व्यापार',
  policy: 'अर्थतन्त्र नीति'
};

export default function CategoryArticlePage() {
  const params = useParams();
  const categoryKey = params?.category as string;
  const articleId = params?.id as string;

  const { article, loading, error } = useEconomyArticle(articleId);
  const { articles } = useEconomy(categoryKey);

  const categoryLabel = categories[categoryKey] || categoryKey;
  
  // Get related articles from the same category, excluding current article
  const relatedArticles = articles
    .filter(item => item._id !== articleId)
    .slice(0, 3);

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
            href="/economy"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 inline-block"
          >
            अर्थतन्त्रमा फर्कनुहोस्
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <Link href="/" className="hover:text-green-600 transition-colors">
              गृहपृष्ठ
            </Link>
            <span>/</span>
            <Link href="/economy" className="hover:text-green-600 transition-colors">
              अर्थतन्त्र
            </Link>
            <span>/</span>
            <Link href={`/economy/${categoryKey}`} className="hover:text-green-600 transition-colors">
              {categoryLabel}
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
              {article.title}
            </h1>
            <div className="flex items-center justify-center space-x-6 text-gray-600 text-sm">
              <span>प्रकाशित मिति: {article.time}</span>
              {article.author?.username && (
                <>
                  <span>•</span>
                  <span>लेखक: {article.author.username}</span>
                </>
              )}
              <span>•</span>
              <span>👁️ {article.views}</span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-8">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-auto max-h-96 object-cover rounded-lg shadow-sm"
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <div className="text-gray-800 leading-relaxed text-lg space-y-6">
              <div className="text-xl font-medium text-gray-900 leading-8">
                {article.content}
              </div>

              <div className="mt-8 p-6 bg-green-50 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">महत्वपूर्ण तथ्यहरू</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• यसले आम नागरिकहरूको जीवनस्तरमा सीधा प्रभाव पार्नेछ</li>
                  <li>• व्यवसायीहरूले नयाँ अवसरहरू प्राप्त गर्न सक्नेछन्</li>
                  <li>• देशको आर्थिक विकासमा सकारात्मक योगदान</li>
                </ul>
              </div>
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
          {relatedArticles.length > 0 && (
            <div className="border-t pt-8 mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{categoryLabel} का सम्बन्धित समाचार</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((news) => (
                  <Link 
                    key={news._id}
                    href={`/economy/${categoryKey}/${news._id}`}
                    className="group"
                  >
                    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                      <img 
                        src={news.image} 
                        alt={news.title}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="p-4">
                        <h4 className="font-bold text-lg text-gray-900 group-hover:text-green-600 transition-colors leading-tight mb-2 line-clamp-2">
                          {news.title}
                        </h4>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{news.time}</span>
                          <span>👁️ {news.views}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between border-t pt-8 mt-8">
            <Link 
              href={`/economy/${categoryKey}`}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              ← {categoryLabel} मा फर्कनुहोस्
            </Link>
            
            <Link 
              href="/economy"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              अर्थतन्त्र →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}