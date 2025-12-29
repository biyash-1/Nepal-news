"use client";
import Link from "next/link";
import React from "react";
import { useSportsNews } from "@/app/hooks/useSportsNews";

// Fallback image for missing images
const getImageUrl = (article: any) => {
  return (
    article?.image ||
    "https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  );
};

// Sports icons mapping
const sportIcons: Record<string, string> = {
  football: "⚽",
  cricket: "🏏",
  basketball: "🏀",
  volleyball: "🏐",
  tennis: "🎾",
  other: "🏆",
};

export default function SportsPage() {
  const {
    trendingNews,
    footballNews,
    cricketNews,
    basketballNews,
    volleyballNews,
    otherSportsNews,
    featuredNews,
    loading,
    error,
  } = useSportsNews();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 py-16 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white">
              खेलकुद
            </h1>
            <p className="text-lg text-blue-100">खेलको संसार</p>
          </div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">खेलकुद समाचार लोड हुँदैछ...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 py-16 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white">
              खेलकुद
            </h1>
          </div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <p className="text-red-600 text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              पुनः प्रयास गर्नुहोस्
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log("Sports data loaded:", {
    football: footballNews.length,
    cricket: cricketNews.length,
    basketball: basketballNews.length,
    volleyball: volleyballNews.length,
    other: otherSportsNews.length,
    trending: trendingNews.length,
    featured: featuredNews.length,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-green-600 to-blue-600 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 text-white/10 text-9xl">
            ⚽
          </div>
          <div className="absolute top-20 right-20 text-white/10 text-9xl">
            🏏
          </div>
          <div className="absolute bottom-10 left-1/3 text-white/10 text-9xl">
            🏀
          </div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white">
            खेलकुद
          </h1>
          <p className="text-lg text-blue-100">
            खेलको संसार - ताजा समाचार र अपडेट
          </p>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {footballNews.length > 0 && (
          <section className="mb-12">
            {/* Header with red line */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                {/* Left Title */}
                <div className="flex items-center space-x-3">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">फुटबल</h2>
                  </div>
                </div>

                {/* Right Link */}
                <Link
                  href="/sports/football"
                  className="flex items-center text-purple-600 hover:text-purple-700 font-semibold"
                >
                  सबै फुटबल समाचार
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>

              {/* Red horizontal line */}
              <div className="flex items-center mt-1">
                <div className="flex-grow border-t-2 border-red-600"></div>
              </div>
            </div>

            {/* Rest of the football section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Main Football News */}
              <div>
                <Link href={`/news/${footballNews[0]._id}`}>
                  <div className="relative rounded overflow-hidden group cursor-pointer mb-6">
                    <div className="h-[520px]">
                      <img
                        src={getImageUrl(footballNews[0])}
                        alt={footballNews[0].title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors">
                        {footballNews[0].title}
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Right Column: Split into Middle and End Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
                {/* Middle Section: Two news items with image above title in column */}
                <div className="">
                  {footballNews.slice(1, 3).map((news) => (
                    <Link
                      href={`/news/${news._id}`}
                      key={news._id}
                      className="group cursor-pointer hover:bg-gray-50 transition-colors p-3 rounded-lg block"
                    >
                      <div className="mb-3">
                        <div className="w-full h-48 overflow-hidden ">
                          <img
                            src={getImageUrl(news)}
                            alt={news.title}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 line-clamp-3">
                          {news.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* End Section: Two news items with small image and title to the right */}
                <div className="space-y-4">
                  {footballNews.slice(3, 7).map((news) => (
                    <Link
                      href={`/news/${news._id}`}
                      key={news._id}
                      className="flex items-center gap-4 group p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {/* Image */}
                      <div className="w-30 ">
                        <img
                          src={getImageUrl(news)}
                          alt={news.title}
                          className="w-full h-21 object-cover rounded"
                        />
                      </div>

                      {/* Title */}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                          {news.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
        {/* Cricket Section */}
        {/* Cricket Section */}
        {cricketNews.length > 0 && (
          <section className="mb-12">
            {/* Header with red line */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                {/* Left Title */}
                <div className="flex items-center space-x-3">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      क्रिकेट
                    </h2>
                  </div>
                </div>

                {/* Right Link */}
                <Link
                  href="/sports/cricket"
                  className="flex items-center text-yellow-600 hover:text-yellow-700 font-semibold"
                >
                  सबै क्रिकेट समाचार
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>

              {/* Red horizontal line */}
              <div className="flex items-center mt-1">
                <div className="flex-grow border-t-2 border-red-600"></div>
              </div>
            </div>

            {/* Cricket News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cricketNews.slice(0, 3).map((news) => (
                <Link
                  href={`/news/${news._id}`}
                  key={news._id}
                  className="group cursor-pointer"
                >
                  <div className="relative overflow-hidden  mb-3">
                    <div className="h-64">
                      <img
                        src={getImageUrl(news)}
                        alt={news.title}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors line-clamp-2">
                    {news.title}
                  </h4>
                </Link>
              ))}
            </div>

            {/* Additional Cricket News */}
            {cricketNews.length > 3 && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                {cricketNews.slice(3, 9).map((news) => (
                  <Link
                    href={`/news/${news._id}`}
                    key={news._id}
                    className="flex items-center space-x-3 group cursor-pointer p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="w-16 h-16 flex-shrink-0">
                      <img
                        src={getImageUrl(news)}
                        alt={news.title}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-lg font-semibold text-gray-900 group-hover:text-yellow-600 line-clamp-2">
                        {news.title}
                      </h5>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Basketball and Volleyball in 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 py-12">
          {/* Basketball Section */}
          {basketballNews.length > 0 && (
            <section>
              {/* Header */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🏀</span>
                    <h3 className="text-2xl font-bold text-gray-900">
                      बास्केटबल
                    </h3>
                  </div>
                  <Link
                    href="/sports/basketball"
                    className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    सबै हेर्नुहोस्
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
                {/* Red horizontal line */}
                <div className="flex items-center mt-1">
                  <div className="flex-grow border-t-2 border-red-600"></div>
                </div>
              </div>

              {/* Content: 2 columns */}
              <div className="grid grid-cols-2 gap-4">
                {/* Left: Featured News */}
                {basketballNews[0] && (
                  <Link
                    href={`/news/${basketballNews[0]._id}`}
                    className="group cursor-pointer"
                  >
                    <div className="relative rounded overflow-hidden h-full min-h-[300px]">
                      <img
                        src={getImageUrl(basketballNews[0])}
                        alt={basketballNews[0].title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h4 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors line-clamp-3">
                          {basketballNews[0].title}
                        </h4>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Right: List of 4 news */}
                <div className="space-y-3">
                  {basketballNews.slice(1, 5).map((news) => (
                    <Link
                      href={`/news/${news._id}`}
                      key={news._id}
                      className="flex items-center gap-3 group cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="w-16 h-16 flex-shrink-0">
                        <img
                          src={getImageUrl(news)}
                          alt={news.title}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2">
                          {news.title}
                        </h5>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Volleyball Section */}
          {volleyballNews.length > 0 && (
            <section>
              {/* Header */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🏐</span>
                    <h3 className="text-2xl font-bold text-gray-900">भलिबल</h3>
                  </div>
                  <Link
                    href="/sports/volleyball"
                    className="flex items-center text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    सबै हेर्नुहोस्
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
                {/* Red horizontal line */}
                <div className="flex items-center mt-1">
                  <div className="flex-grow border-t-2 border-red-600"></div>
                </div>
              </div>

              {/* Content: 2 columns */}
              <div className="grid grid-cols-2 gap-4">
                {/* Left: Featured News */}
                {volleyballNews[0] && (
                  <Link
                    href={`/news/${volleyballNews[0]._id}`}
                    className="group cursor-pointer"
                  >
                    <div className="relative rounded overflow-hidden h-full min-h-[300px]">
                      <img
                        src={getImageUrl(volleyballNews[0])}
                        alt={volleyballNews[0].title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h4 className="text-lg font-semibold text-white group-hover:text-red-300 transition-colors line-clamp-3">
                          {volleyballNews[0].title}
                        </h4>
                      </div>
                    </div>
                  </Link>
                )}

             
                <div className="space-y-3">
                  {volleyballNews.slice(1, 5).map((news) => (
                    <Link
                      href={`/news/${news._id}`}
                      key={news._id}
                      className="flex items-center gap-3 group cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="w-16 h-16 flex-shrink-0">
                        <img
                          src={getImageUrl(news)}
                          alt={news.title}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-semibold text-gray-900 group-hover:text-red-600 line-clamp-2">
                          {news.title}
                        </h5>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
     
        {otherSportsNews.length > 0 && (
          <section className="mb-12">
            {/* Header with red line */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                {/* Left Title */}
                <div className="flex items-center space-x-3">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      अन्य खेलहरू
                    </h2>
                  </div>
                </div>

             
              </div>

              {/* Red horizontal line */}
              <div className="flex items-center mt-1">
                <div className="flex-grow border-t-2 border-red-600"></div>
              </div>
            </div>

            {/* News Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {otherSportsNews.slice(0, 8 ).map((news) => (
                <Link
                  href={`/news/${news._id}`}
                  key={news._id}
                  className="group cursor-pointer"
                >
                  {/* Square image container */}
                  <div className="overflow-hidden mb-3">
                    <img
                      src={getImageUrl(news)}
                      alt={news.title}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <h5 className="text-lg font-semibold text-gray-900 group-hover:text-red-600 line-clamp-2">
                    {news.title}
                  </h5>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
