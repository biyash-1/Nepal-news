"use client";
import Link from "next/link";
import React from 'react';
import { useEntertainmentNews } from "@/app/hooks/useEntertainmentNews";

// Fallback image for missing images
const getImageUrl = (article: any) => {
  return article?.featuredImage || article?.image || "https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80";
};

const celebrities = [
  { name: "दयाहाङ राई", role: "अभिनेता", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" },
  { name: "स्वस्तिमा खड्का", role: "अभिनेत्री", image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" },
  { name: "सुगम पोखरेल", role: "गायक", image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" },
  { name: "रेखा थापा", role: "निर्देशक", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" }
];

export default function EntertainmentPage() {
  const { headlineNews, gossipNews, bollywoodHollywoodNews, musicNews, featuredNews, trendingNews, loading, error } = useEntertainmentNews();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="bg-red-600 py-12 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-semibold mb-3 text-white">
            मनोरञ्जन
          </h1>
        </div>
      </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600">समाचार लोड हुँदैछ...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="bg-red-600 py-12 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-semibold mb-3 text-white">
            मनोरञ्जन
          </h1>
        </div>
      </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
    <div className="bg-red-600 py-12 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl md:text-4xl font-semibold mb-3 text-white">
          मनोरञ्जन
        </h1>
      </div>
    </div>






      {/* 80% Width Container for All Content */}
      <div className="w-[75%] mx-auto py-6 " >
        <div className="flex items-center justify-between">
              <h3 className="text-3xl border-l-4 border-red-600 font-bold text-gray-900 pl-3">मनोरञ्जन</h3>
              <Link href="/category/music" className="text-red-600 hover:text-red-700 font-medium">
                सबै हेर्नुहोस् →
              </Link>
            </div>
            <div className="h-0.5 bg-red-600 mt-2 mb-8"></div>
        {/* Top 3 Headlines */}
        {headlineNews.main && (
          <div className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Link href={`/news/${headlineNews.main._id}`}>
                  <div className="relative h-[500px] overflow-hidden rounded group cursor-pointer">
                    <img 
                      src={getImageUrl(headlineNews.main)} 
                      alt={headlineNews.main.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <h2 className="text-2xl md:text-4xl font-semibold text-white drop-shadow-lg hover:text-red-300 transition-colors">
                        {headlineNews.main.title}
                      </h2>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="space-y-6">
                {headlineNews.side.map((news: any) => (
                  <div key={news._id} className="relative h-59 overflow-hidden rounded group cursor-pointer">
                    <Link href={`/news/${news._id}`}>
                      <img 
                        src={getImageUrl(news)} 
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="font-semibold text-xl text-white drop-shadow-lg hover:text-red-300 transition-colors">
                          {news.title}
                        </h3>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Horizontal News */}
          <div className="w-full mb-8">
  <div className="flex gap-4 w-full">
    {trendingNews.slice(0, 3).map((trend: any, index: number) => (
      <Link
        href={`/news/${trend._id}`}
        key={trend._id}
        className="flex-1 group"
      >
        <div className="w-full">
          <div className="flex items-center space-x-4 w-full">
            <img
              src={getImageUrl(trend)}
              alt={trend.title}
              className="w-30 h-22 object-cover rounded flex-shrink-0 group-hover:scale-105 transition-transform duration-500"
            />
            <span className="text-gray-800 font-semibold text-base flex-1 line-clamp-3 group-hover:text-red-600 transition-colors">
              {trend.title}
            </span>
          </div>
        </div>
      </Link>
    ))}
  </div>
</div>



        {/* Section Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-8"></div>

        {/* Layout A: Gossip Section with Sidebar */}
        {gossipNews.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-8">
            <div className="lg:col-span-2">
              <section>
                <div className="flex items-center justify-between ">
                  <h3 className="text-3xl font-bold text-gray-900">💬 गपशप</h3>
                  <Link href="/category/gossip" className="text-red-600 hover:text-red-700 font-medium">
                    सबै हेर्नुहोस् →
                  </Link>
                </div>
                <div className="h-0.5 bg-red-600 mt-2 mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {gossipNews.map((news: any, i: number) => (
                    <Link href={`/news/${news._id}`}
                      key={news._id}
                      className={`group cursor-pointer  overflow-hidden ${
                        i % 5 === 0 ? "md:col-span-2 md:row-span-2" : ""
                      }`}
                    >
                      <div
                        className={`relative overflow-hidden ${
                          i % 5 === 0 ? "h-95" : "h-32"
                        }`}
                      >
                        <img
                          src={getImageUrl(news)}
                          alt={news.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded"
                        />
                      </div>
                      
                      <h4
                        className={`mt-3 font-semibold ${
                          i % 5 === 0 ? "text-lg md:text-2xl" : "text-sm md:text-base"
                        } text-gray-900 group-hover:text-red-600 transition-colors`}
                      >
                        {news.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar - Only appears next to Gossip */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded p-6">
                <h4 className="text-2xl font-bold text-gray-900 mb-6">🔥 ट्रेन्डिङ</h4>
                <div className="space-y-4">
                  {trendingNews.length > 0 ? (
                    trendingNews.map((trend: any, index: number) => (
                      <Link href={`/news/${trend._id}`} key={trend._id} className="flex items-center space-x-4 rounded cursor-pointer transition-all">
                        <img src={getImageUrl(trend)} alt={trend.title} className="w-26 h-18 object-cover rounded mb-1" />
                        <span className="text-gray-800 font-semibold text-base font-medium flex-1">{trend.title}</span>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      कुनै ट्रेन्डिङ समाचार छैन
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-8"></div>

        {/* Layout B: Full-width sections after Gossip */}

        {/* Bollywood/Hollywood Section - Hero + 2x2 Grid */}
        {bollywoodHollywoodNews.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-bold text-gray-900">🎬 बलिउड / हलिउड</h3>
              <Link href="/category/bollywood" className="text-red-600 hover:text-red-700 font-medium">
                सबै हेर्नुहोस् →
              </Link>
            </div>
            <div className="h-0.5 bg-red-600 mt-2 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Hero Article - Left Side */}
              <Link className="group cursor-pointer" href={`/news/${bollywoodHollywoodNews[0]._id}`}>
                <div className="relative h-full min-h-[500px] overflow-hidden rounded">
                  <img
                    src={getImageUrl(bollywoodHollywoodNews[0])}
                    alt={bollywoodHollywoodNews[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h4 className="font-semibold text-2xl text-white group-hover:text-red-300 transition-colors">
                      {bollywoodHollywoodNews[0].title}
                    </h4>
                  </div>
                </div>
              </Link>

              {/* 2x2 Grid - Right Side */}
              <div className="grid grid-cols-2 gap-4">
  {bollywoodHollywoodNews.slice(1, 5).map((news: any) => (
    <Link
      href={`/news/${news._id}`}
      key={news._id}
      className="group cursor-pointer"
    >
      <div className="relative h-45 overflow-hidden">
        <img
          src={getImageUrl(news)}
          alt={news.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded"
        />
      </div>
      <h5 className="mt-2 font-semibold text-lg text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
        {news.title}
      </h5>
    </Link>
  ))}
</div>

            </div>
          </section>
        )}

        {/* Section Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-8"></div>

        {/* Music Section - Balanced Grid */}
        {musicNews.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-bold text-gray-900">🎵 संगीत</h3>
              <Link href="/category/music" className="text-red-600 hover:text-red-700 font-medium">
                सबै हेर्नुहोस् →
              </Link>
            </div>
            <div className="h-0.5 bg-red-600 mt-2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {musicNews.map((news: any) => (
                <Link href={`/news/${news._id}`} key={news._id} className="group cursor-pointer overflow-hidden">
                  <div className="relative h-50 overflow-hidden">
                    <img 
                      src={getImageUrl(news)} 
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded"
                    />
                  </div>
                  <h4 className="mt-3 font-semibold text-lg text-gray-900 group-hover:text-red-600 transition-colors">
                    {news.title}
                  </h4>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Section Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-8"></div>

        {/* Featured Section - Hero + 2x2 Grid (Matching Bollywood/Hollywood Style) */}
        {featuredNews.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-bold text-gray-900">⭐ विशेष</h3>
              <Link href="/category/special" className="text-red-600 hover:text-red-700 font-medium">
                सबै हेर्नुहोस् →
              </Link>
            </div>
            <div className="h-0.5 bg-red-600 mt-2 mb-8"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Hero Featured - Left Side */}
              <Link href={`/news/${featuredNews[0]._id}`} className="group cursor-pointer">
                <div className="relative h-full min-h-[500px] overflow-hidden">
                  <img 
                    src={getImageUrl(featuredNews[0])} 
                    alt={featuredNews[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h4 className="font-semibold text-2xl text-white group-hover:text-red-300 transition-colors">
                      {featuredNews[0].title}
                    </h4>
                  </div>
                </div>
              </Link>

              {/* 2x2 Grid - Right Side */}
              <div className="grid grid-cols-2 gap-4">
                {featuredNews.slice(1, 5).map((news: any) => (
                  <Link
                    href={`/news/${news._id}`}
                    key={news._id}
                    className="group cursor-pointer"
                  >
                    <div className="relative h-45 overflow-hidden">
                      <img
                        src={getImageUrl(news)}
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded"
                      />
                    </div>
                    <h5 className="mt-2 font-semibold text-lg text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
                      {news.title}
                    </h5>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}


        {/* Section Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-8"></div>

        {/* Photo Gallery Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-bold text-gray-900">📸 फोटो ग्यालेरी</h3>
            <a href="#" className="text-red-600 hover:text-red-700 font-medium">सबै हेर्नुहोस् →</a>
          </div>
          <div className="h-0.5 bg-red-600 mt-2 mb-8"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...gossipNews, ...musicNews].slice(0, 6).map((news: any, index: number) => (
              <Link href={`/news/${news._id}`} key={news._id} className="aspect-square rounded overflow-hidden shadow-md hover:shadow-2xl transition-all group cursor-pointer">
                <img 
                  src={getImageUrl(news)} 
                  alt={news.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}