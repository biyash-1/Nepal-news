import Link from 'next/link'
import { notFound } from 'next/navigation'
import { arthatantraData } from '@/app/datas/arthatantraData'

const categories: Record<string, string> = {
  banking: 'बैङ्किङ्ग',
  market: 'बजार', 
  jobs: 'रोजगारी',
  trade: 'व्यापार',
  policy: 'अर्थतन्त्र नीति'
}

interface ArticlePageProps {
  params: Promise<{
    category: string
    id: string
  }>
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { category, id } = await params
  
  if (!category || !categories[category]) {
    notFound()
  }

  const newsId = parseInt(id)
  if (isNaN(newsId)) {
    notFound()
  }

  const news = arthatantraData[category]
  const article = news?.find(item => item.id === newsId)

  if (!article) {
    notFound()
  }

  const relatedNews = news?.filter(item => item.id !== newsId).slice(0, 3) || []

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="border-b">
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
            <Link href={`/economy/${category}`} className="hover:text-green-600 transition-colors">
              {categories[category]}
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
              {article.author && (
                <>
                  <span>•</span>
                  <span>लेखक: {article.author}</span>
                </>
              )}
              <span>•</span>
              <span>👁️ {article.reads}</span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-8">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-auto object-cover rounded-lg shadow-sm"
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <div className="text-gray-800 leading-relaxed text-lg space-y-6">
              <p className="text-xl font-medium text-gray-900">
                {article.description}
              </p>
              
              <div className="border-t border-b py-4 my-6">
                <div className="text-sm text-gray-600">
                  <strong>{categories[category]}</strong> — {article.content}
                </div>
              </div>

              {/* Main content paragraphs */}
              <p className="leading-8">
                {article.content}
              </p>
              
              <p className="leading-8">
                यस आर्थिक परिवर्तनले देशको आर्थिक वृद्धिमा महत्वपूर्ण योगदान दिने अपेक्षा गरिएको छ। 
                विशेषज्ञहरूको अनुसार यसले दीर्घकालीन आर्थिक स्थिरतामा सकारात्मक प्रभाव पार्न सक्नेछ।
              </p>

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

          {/* Related News */}
          {relatedNews.length > 0 && (
            <div className="border-t pt-8 mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{categories[category]} का अन्य समाचार</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedNews.map((news) => (
                  <Link 
                    key={news.id}
                    href={`/economy/${category}/${news.id}`}
                    className="group"
                  >
                    <div className="bg-white rounded-lg overflow-hidden">
                      <img 
                        src={news.image} 
                        alt={news.title}
                        className="w-full h-40 object-cover group-hover:opacity-90 transition-opacity"
                      />
                      <div className="py-4">
                        <h4 className="font-bold text-lg text-gray-900 group-hover:text-green-600 transition-colors leading-tight mb-2">
                          {news.title}
                        </h4>
                        <div className="text-sm text-gray-500">
                          {news.time}
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
              href={`/economy/${category}`}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              ← {categories[category]} मा फर्कनुहोस्
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
  )
}

export async function generateStaticParams() {
  const params = []
  
  for (const [category, news] of Object.entries(arthatantraData)) {
    for (const item of news) {
      params.push({
        category: category,
        id: item.id.toString(),
      })
    }
  }
  
  return params
}