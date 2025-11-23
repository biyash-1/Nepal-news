import Link from 'next/link'
import { notFound } from 'next/navigation'
import { sportsNewsData } from '@/app/datas/sportsNewsData'

const categories = {
  cricket: 'क्रिकेट',
  football: 'फुटबल',
  basketball: 'बास्केटबल', 
  volleyball: 'भलिबल'
}

interface ArticlePageProps {
  params: {
    category: string
    id: string
  }
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const category = params.category
  console.log("category is", category)
  const id = parseInt(params.id)
  console.log("id is",id)

   if (!category || !(category in categories) || isNaN(id)) {
    notFound()
  }

  const news = sportsNewsData[category]
  const article = news?.find(item => item.id === id)

  if (!article) {
    notFound()
  }

  const relatedNews = sportsNewsData[category]?.filter(item => item.id !== id).slice(0, 2) || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Article Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <Link href="/sports" className="hover:text-blue-600 transition-colors">
              खेलकुद
            </Link>
            <span>/</span>
            <Link href={`/sports/${category}`} className="hover:text-blue-600 transition-colors">
              {categories[category]}
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
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              {article.category}
            </span>
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
            
            {/* Additional content can be added here */}
            <div className="mt-8 p-6 bg-blue-50 rounded-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">महत्वपूर्ण तथ्यहरू</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• यो खेल नेपाली खेल जगतको लागि ऐतिहासिक घटना हो</li>
                <li>• खेलाडीहरूले उत्कृष्ट प्रदर्शन गरेका छन्</li>
                <li>• भविष्यका लागि राम्रो सम्भावना देखिएको छ</li>
              </ul>
            </div>
          </div>

          {/* Related News */}
          {relatedNews.length > 0 && (
            <div className="border-t pt-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">सम्बन्धित समाचार</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedNews.map((news) => (
                  <Link 
                    key={news.id}
                    href={`/sports/${category}/${news.id}`}
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
              href={`/sports/${category}`}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span>←</span>
              <span>{categories[category]} मा फर्कनुहोस्</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}