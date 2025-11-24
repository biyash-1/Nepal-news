"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  publishedAt: string;
  author: string;
  slug: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (query) {
      searchNews(query);
    }
  }, [query]);

  const searchNews = async (searchQuery: string) => {
    setLoading(true);
    setError("");
    
    try {
    
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      
      if (!response.ok) {
        throw new Error("Search failed");
      }
      
      const data = await response.json();
      setResults(data.results || []);
    } catch (err) {
      setError("खोजीमा समस्या भयो। पुनः प्रयास गर्नुहोस्।");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

 
  const mockResults: SearchResult[] = [
    {
      id: "1",
      title: "नेपालले अन्तर्राष्ट्रिय क्रिकेट प्रतियोगिता जित्यो",
      excerpt: "नेपाली क्रिकेट टिमले ऐतिहासिक जित हासिल गर्दै अन्तर्राष्ट्रिय प्रतियोगिताको उपाधि जितेको छ।",
      image: "/images/cricket-win.jpg",
      category: "खेलकुद",
      publishedAt: "२०२४-०१-१५",
      author: "सports संवाददाता",
      slug: "nepal-cricket-win"
    },
    {
      id: "2",
      title: "नयाँ आर्थिक नीतिमा व्यापारीहरूको प्रतिक्रिया",
      excerpt: "सरकारको नयाँ आर्थिक नीतिले व्यापारी समुदायमा मिश्रित प्रतिक्रिया उत्पन्न गरेको छ।",
      image: "/images/economy-policy.jpg",
      category: "अर्थतन्त्र",
      publishedAt: "२०२४-०१-१४",
      author: "आर्थिक संवाददाता",
      slug: "new-economic-policy"
    }
  ];


  useEffect(() => {
    if (query && !loading) {
      setTimeout(() => {
        setResults(mockResults.filter(item => 
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.excerpt.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
        ));
      }, 1000);
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            खोज नतिजा: "{query}"
          </h1>
          <p className="text-gray-600">
            {loading ? "खोजिँदै..." : `${results.length} वटा समाचार फेला पर्यो`}
          </p>
        </div>

   
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        )}

      
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => searchNews(query)}
              className="mt-4 bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors"
            >
              पुनः प्रयास गर्नुहोस्
            </button>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && results.length === 0 && query && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              कुनै समाचार फेला परेन
            </h3>
            <p className="text-gray-500">
              कृपया अर्को शब्दले खोज्नुहोस् वा different कीवर्ड प्रयोग गर्नुहोस्।
            </p>
          </div>
        )}

        {/* Search Results */}
        {!loading && results.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map((result) => (
              <Link
                key={result.id}
                href={`/news/${result.slug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-48 bg-gray-200">
                  {/* Replace with actual Image component when you have real images */}
                  <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                    <span className="text-red-300 text-lg">📷</span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {result.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                    {result.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {result.excerpt}
                  </p>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{result.author}</span>
                    <span>{result.publishedAt}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

       
        {!query && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              समाचार खोज्नुहोस्
            </h3>
            <p className="text-gray-500">
              माथिको खोज बाकसमा आफूले खोज्न चाहेको समाचारको शब्द लेख्नुहोस्।
            </p>
          </div>
        )}
      </div>
    </div>
  );
}