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
  const { headlineNews, gossipNews, bollywoodHollywoodNews, musicNews, featuredNews, loading, error } = useEntertainmentNews();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-3">मनोरञ्जन</h1>
            <p className="text-red-100 text-lg">ताजा मनोरञ्जन समाचार र अपडेट</p>
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
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-3">मनोरञ्जन</h1>
            <p className="text-red-100 text-lg">ताजा मनोरञ्जन समाचार र अपडेट</p>
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
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-3">मनोरञ्जन</h1>
          <p className="text-red-100 text-lg">ताजा मनोरञ्जन समाचार र अपडेट</p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top 3 Headlines */}
        {headlineNews.main && (
          <div className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Link href={`/news/${headlineNews.main._id}`}>
                  <div className="relative h-[500px] overflow-hidden rounded-2xl group cursor-pointer">
                    <img 
                      src={getImageUrl(headlineNews.main)} 
                      alt={headlineNews.main.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg hover:text-red-300 transition-colors">
                        {headlineNews.main.title}
                      </h2>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="space-y-6">
                {headlineNews.side.map((news: any) => (
                  <div key={news._id} className="relative h-59 overflow-hidden rounded-2xl group cursor-pointer">
                    <Link href={`/news/${news._id}`}>
                      <img 
                        src={getImageUrl(news)} 
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="font-bold text-xl text-white drop-shadow-lg hover:text-red-300 transition-colors">
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

        {/* Section Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-16"></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-16">
            {/* Gossip Section */}
            {gossipNews.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl font-bold text-gray-900">💬 गपशप</h3>
                  <Link href="/category/gossip" className="text-red-600 hover:text-red-700 font-medium">
                    सबै हेर्नुहोस् →
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {gossipNews.map((news: any, i: number) => (
                    <Link href={`/news/${news._id}`}
                      key={news._id}
                      className={`group cursor-pointer rounded-lg overflow-hidden ${
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
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      
                      <h4
                        className={`mt-3 font-bold ${
                          i % 5 === 0 ? "text-lg md:text-2xl" : "text-sm md:text-base"
                        } text-gray-900 group-hover:text-red-600 transition-colors`}
                      >
                        {news.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Section Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

            {/* Bollywood/Hollywood Section */}
            {bollywoodHollywoodNews.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl font-bold text-gray-900">🎬 बलिउड / हलिउड</h3>
                  <Link href="/category/bollywood" className="text-red-600 hover:text-red-700 font-medium">
                    सबै हेर्नुहोस् →
                  </Link>
                </div>

                <Link className="group cursor-pointer mb-6" href={`/news/${bollywoodHollywoodNews[0]._id}`}>
                  <div className="relative h-96 overflow-hidden rounded-lg">
                    <img
                      src={getImageUrl(bollywoodHollywoodNews[0])}
                      alt={bollywoodHollywoodNews[0].title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  <div className="mt-4 bg-white">
                    <h4 className="font-bold text-xl text-gray-900 group-hover:text-red-600 transition-colors">
                      {bollywoodHollywoodNews[0].title}
                    </h4>
                  </div>
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {bollywoodHollywoodNews.slice(1).map((news: any) => (
                    <Link href={`/news/${news._id}`} key={news._id} className="group cursor-pointer">
                      <div className="relative h-64 overflow-hidden rounded-lg">
                        <img
                          src={getImageUrl(news)}
                          alt={news.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      
                      <div className="mt-4 bg-white">
                        <h5 className="font-bold text-lg text-gray-900 group-hover:text-red-600 transition-colors">
                          {news.title}
                        </h5>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Section Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

            {/* Music Section */}
            {musicNews.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl font-bold text-gray-900">🎵 संगीत</h3>
                  <Link href="/category/music" className="text-red-600 hover:text-red-700 font-medium">
                    सबै हेर्नुहोस् →
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {musicNews.map((news: any) => (
                    <Link href={`/news/${news._id}`} key={news._id} className="group cursor-pointer rounded-lg overflow-hidden">
                      <div className="relative h-72 overflow-hidden">
                        <img 
                          src={getImageUrl(news)} 
                          alt={news.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <h4 className="mt-3 font-bold text-lg text-gray-900 group-hover:text-red-600 transition-colors">
                        {news.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Section Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Trending */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 shadow-sm">
              <h4 className="text-2xl font-bold text-gray-900 mb-6">🔥 ट्रेन्डिङ</h4>
              <div className="space-y-4">
                {[headlineNews.main, ...headlineNews.side].filter(Boolean).slice(0, 5).map((trend: any, index: number) => (
                  <Link href={`/news/${trend._id}`} key={trend._id} className="flex items-center space-x-4 p-3 bg-white rounded-xl hover:shadow-md cursor-pointer transition-all">
                    <span className="font-bold text-red-600 text-xl w-8">{index + 1}</span>
                    <img src={getImageUrl(trend)} alt={trend.title} className="w-16 h-16 object-cover rounded-lg" />
                    <span className="text-gray-800 text-sm font-medium flex-1">{trend.title}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Celebrity Spotlight */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h4 className="text-2xl font-bold text-gray-900 mb-6">⭐ लोकप्रिय कलाकार</h4>
              <div className="space-y-4">
                {celebrities.map((celeb, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-all">
                    <img src={celeb.image} alt={celeb.name} className="w-14 h-14 object-cover rounded-full" />
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">{celeb.name}</div>
                      <div className="text-sm text-gray-500">{celeb.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Box Office */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h4 className="text-2xl font-bold text-gray-900 mb-6">🎟️ बक्स अफिस</h4>
              <div className="space-y-4">
                {[
                  { title: "कबड्डी ४", earnings: "५ करोड", position: 1, image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" },
                  { title: "पशुपति प्रसाद २", earnings: "३.५ करोड", position: 2, image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" },
                  { title: "छक्का पञ्जा ४", earnings: "२.८ करोड", position: 3, image: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" },
                  { title: "जात्रै जात्रा", earnings: "१.५ करोड", position: 4, image: "https://images.unsplash.com/photo-1574267432644-f610dd5ac6f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" }
                ].map((movie, index) => (
                  <div key={index} className="flex items-center space-x-4 py-3 border-b border-gray-100 last:border-0">
                    <span className="font-bold text-red-600 text-xl w-8">#{movie.position}</span>
                    <img src={movie.image} alt={movie.title} className="w-12 h-12 object-cover rounded-lg" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{movie.title}</div>
                      <div className="text-sm text-gray-500">{movie.earnings}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Releases */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h4 className="text-2xl font-bold text-gray-900 mb-6">📅 आगामी रिलिज</h4>
              <div className="space-y-4">
                {[
                  { title: "प्रेम गीत ३", date: "पुष १५", genre: "रोमान्स", image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" },
                  { title: "दामिनी", date: "पुष २०", genre: "एक्शन", image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" },
                  { title: "सुनको बिहे", date: "माघ ५", genre: "कमेडी", image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" }
                ].map((movie, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 border-l-4 border-red-500 bg-red-50 rounded-r-xl">
                    <img src={movie.image} alt={movie.title} className="w-14 h-14 object-cover rounded-lg" />
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">{movie.title}</div>
                      <div className="text-sm text-gray-600">{movie.genre}</div>
                      <div className="text-xs text-gray-500 mt-1">{movie.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Poll */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h4 className="text-2xl font-bold text-gray-900 mb-4">📊 तपाईंको मत</h4>
              <p className="text-sm text-gray-600 mb-5">यो वर्षको उत्कृष्ट नेपाली फिल्म कुन हो?</p>
              <div className="space-y-3">
                {[
                  { movie: "कबड्डी ४", votes: 45 },
                  { movie: "पशुपति प्रसाद २", votes: 30 },
                  { movie: "छक्का पञ्जा ४", votes: 15 },
                  { movie: "अन्य", votes: 10 }
                ].map((option, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700 font-medium">{option.movie}</span>
                      <span className="font-bold text-red-600">{option.votes}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-red-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${option.votes}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all">
                मतदान गर्नुहोस्
              </button>
            </div>
          </div>
        </div>

        {/* Featured Section */}
        {featuredNews.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-bold text-gray-900">⭐ विशेष</h3>
              <Link href="/category/special" className="text-red-600 hover:text-red-700 font-medium">
                सबै हेर्नुहोस् →
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {featuredNews.map((news: any) => (
                <Link href={`/news/${news._id}`} key={news._id} className="group cursor-pointer">
                  <div className="relative h-90 overflow-hidden rounded-lg">
                    <img 
                      src={getImageUrl(news)} 
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h4 className="mt-3 font-bold text-2xl text-gray-900 group-hover:text-red-600 transition-colors">
                    {news.title}
                  </h4>
                </Link>
              ))}
            </div>
          </section>
        )}


        {/* Section Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-16"></div>

        {/* Photo Gallery Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-gray-900">📸 फोटो ग्यालेरी</h3>
            <a href="#" className="text-red-600 hover:text-red-700 font-medium">सबै हेर्नुहोस् →</a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...gossipNews, ...musicNews].slice(0, 6).map((news: any, index: number) => (
              <Link href={`/news/${news._id}`} key={news._id} className="aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all group cursor-pointer">
                <img 
                  src={getImageUrl(news)} 
                  alt={news.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-red-500 via-pink-500 to-red-600 rounded-3xl p-10 md:p-16 text-white text-center shadow-2xl">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-4xl font-bold mb-4">मनोरञ्जन समाचार पाउनुहोस्</h3>
            <p className="text-red-100 mb-8 text-lg">
              ताजा बलिउड, हलिउड र नेपाली मनोरञ्जनका समाचार सिधै तपाईंको इमेलमा
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="तपाईंको इमेल ठेगाना"
                className="flex-1 px-6 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/50 shadow-lg"
              />
              <button className="bg-white text-red-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all whitespace-nowrap shadow-lg hover:shadow-xl">
                सदस्यता लिनुहोस्
              </button>
            </div>
            <p className="text-sm text-red-100 mt-6 flex items-center justify-center gap-2">
              हप्तामा एक पटक मात्र। कुनै स्प्याम छैन। 🎬
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}