"use client";

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';
import { Article } from '@/app/hooks/useSportsNews';
import Link from 'next/link';
import Image from 'next/image';


const categoryMap: Record<string, { nepali: string; display: string }> = {
  'football': { nepali: 'फुटबल', display: 'फुटबल' },
  'cricket': { nepali: 'क्रिकेट', display: 'क्रिकेट' },
  'basketball': { nepali: 'बास्केटबल', display: 'बास्केटबल' },
  'volleyball': { nepali: 'भलिबल', display: 'भलिबल' },
};

export default function SportsCategoryPage() {
  const params = useParams();
  const sport = params.sport as string;
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categoryInfo = categoryMap[sport];

  useEffect(() => {
    const fetchCategoryNews = async () => {
      if (!categoryInfo) {
        setError('अवैध खेलकुद श्रेणी');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
     
        const response = await axiosInstance.get('/articles/category/खेलकुद', {
          params: {
            limit: 100,
            page: page
          }
        });

        if (!response.data.success || !response.data.articles) {
          throw new Error('Invalid response format');
        }

        // Filter articles by specific sport subcategory
        const filteredArticles = response.data.articles.filter((article: Article) =>
          article.categories.some(cat => cat.includes(categoryInfo.nepali))
        );

        // Sort by date (newest first)
        filteredArticles.sort((a: Article, b: Article) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setArticles(filteredArticles);
        console.log("articles", filteredArticles);
        setTotalPages(Math.ceil(filteredArticles.length / 12));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching category news:', err);
        setError('समाचार लोड गर्न समस्या भयो');
        setLoading(false);
      }
    };

    fetchCategoryNews();
  }, [sport, categoryInfo, page]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">समाचार लोड हुँदैछ...</p>
        </div>
      </div>
    );
  }

  if (error || !categoryInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error || 'अवैध श्रेणी'}</p>
          <Link
            href="/sports"
            className="mt-4 inline-block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            खेलकुद पृष्ठमा फर्कनुहोस्
          </Link>
        </div>
      </div>
    );
  }

  // Paginate articles
  const startIndex = (page - 1) * 12;
  const paginatedArticles = articles.slice(startIndex, startIndex + 12);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
    
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
        <Link href="/" className="hover:text-red-600">गृहपृष्ठ</Link>
        <span>/</span>
        <Link href="/sports" className="hover:text-red-600">खेलकुद</Link>
        <span>/</span>
        <span className="text-red-600">{categoryInfo.display}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-2">
          {categoryInfo.display} 
        </h1>
    
      </div>

      {/* Articles Grid */}
      {paginatedArticles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">यस श्रेणीमा कुनै समाचार छैन</p>
          <Link
            href="/sports"
            className="mt-4 inline-block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            खेलकुद पृष्ठमा फर्कनुहोस्
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedArticles.map((article) => (
              <Link
                key={article._id}
                href={`/news/${article._id}`}
                className="group  overflow-hidden hover:transition-shadow"
              >
                {article.image && (
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                    {article.title}
                  </h2>
                
                  
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                अघिल्लो
              </button>
              <span className="px-4 py-2 bg-white rounded-lg border">
                पृष्ठ {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                अर्को
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}