import Link from 'next/link'
import { notFound } from 'next/navigation'
import { localNewsData } from '@/app/datas/localNewsData'

const locations: Record<string, string> = {
  kathmandu: 'काठमाडौं',
  lalitpur: 'ललितपुर', 
  bhaktapur: 'भक्तपुर',
  pokhara: 'पोखरा',
  biratnagar: 'बिराटनगर'
}

interface ArticlePageProps {
  params: Promise<{
    location: string
    id: string
  }>
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { location, id } = await params
  
  if (!location || !locations[location]) {
    notFound()
  }

  const newsId = parseInt(id)
  if (isNaN(newsId)) {
    notFound()
  }

  const news = localNewsData[location]
  const article = news?.find(item => item.id === newsId)

  if (!article) {
    notFound()
  }

  const relatedNews = news?.filter(item => item.id !== newsId).slice(0, 2) || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Article Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <Link href="/local-level" className="hover:text-green-600 transition-colors">
              स्थानीय तह
            </Link>
            <span>/</span>
            <Link href={`/local-level/${location}`} className="hover:text-green-600 transition-colors">
              {locations[location]}
            </Link>
            <span>/</span>
            <span className="text-gray-400">समाचार</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
     
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {article.category}
              </span>
              <span className="text-sm text-gray-500">{article.location} {article.ward && `• ${article.ward}`}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
            <div className="flex items-center space-x-4 text-gray-600">
              <span>{article.time}</span>
              <span>•</span>
              <span>👁️ {article.reads}</span>
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
            <p className="text-gray-700 leading-relaxed text-lg">
              {article.content}
            </p>
            
            {/* Additional content */}
            <div className="mt-8 p-6 bg-green-50 rounded-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">महत्वपूर्ण तथ्यहरू</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• यो परियोजना स्थानीय विकासको लागि महत्वपूर्ण छ</li>
                <li>• स्थानीय नागरिकहरूको सहभागिता आवश्यक छ</li>
                <li>• भविष्यका लागि राम्रो नतिजाको अपेक्षा छ</li>
              </ul>
            </div>
          </div>

          {/* Related News */}
          {relatedNews.length > 0 && (
            <div className="border-t pt-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{locations[location]} का अन्य समाचार</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedNews.map((news) => (
                  <Link 
                    key={news.id}
                    href={`/local-level/${location}/${news.id}`}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                  >
                    <img 
                      src={news.image} 
                      alt={news.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="font-bold text-lg mb-2 text-gray-900">{news.title}</h4>
                      <p className="text-gray-600 text-sm mb-3">{news.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{news.time}</span>
                        <span>👁️ {news.reads}</span>
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
              href={`/local-level/${location}`}
              className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <span>←</span>
              <span>{locations[location]} मा फर्कनुहोस्</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  const params = []
  
  for (const [location, news] of Object.entries(localNewsData)) {
    for (const item of news) {
      params.push({
        location: location,
        id: item.id.toString(),
      })
    }
  }
  
  return params
}