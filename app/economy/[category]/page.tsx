"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEconomy } from "@/app/hooks/useEconomy";

const categoryLabels: Record<string, string> = {
  banking: "बैङ्किङ्ग",
  market: "बजार",
  jobs: "रोजगारी",
  trade: "व्यापार",
  policy: "अर्थतन्त्र नीति",
};

export default function EconomyArticlePage() {
  const params = useParams();
  const categoryKey = params?.category as string;

  // Fetch category articles
  const { articles: categoryArticles, loading, error, refreshData } = useEconomy(categoryKey);
  const categoryLabel = categoryLabels[categoryKey] || categoryKey;

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

  if (error || categoryArticles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "समाचार भेटिएन"}</p>
          <Link
            href="/economy"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 inline-block"
          >
            अर्थतन्त्र मा फर्कनुहोस्
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <Link href="/" className="hover:text-green-600 transition-colors">गृहपृष्ठ</Link>
            <span>/</span>
            <Link href="/economy" className="hover:text-green-600 transition-colors">अर्थतन्त्र</Link>
            <span>/</span>
            <span>{categoryLabel}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">{categoryLabel} का समाचार</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categoryArticles.map((article) => (
            <Link 
              key={article._id}
              href={`/news/${article._id}`}
              className="group"
            >
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-4">
                  <h4 className="font-bold text-lg text-gray-900 group-hover:text-green-600 transition-colors leading-tight mb-2 line-clamp-2">
                    {article.title}
                  </h4>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{article.time}</span>
                    <span>👁️ {article.views}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between border-t pt-8 mt-8">
          <Link 
            href="/economy"
            className="text-green-600 hover:text-green-700 font-medium"
          >
            ← अर्थतन्त्र मा फर्कनुहोस्
          </Link>
        </div>
      </div>
    </div>
  );
}
