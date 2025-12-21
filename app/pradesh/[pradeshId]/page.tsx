"use client";

import { pradeshData } from "@/lib/PradeshData";
import { notFound, useParams } from "next/navigation";
import { usePradeshNews } from "@/app/hooks/usePradeshNews";
import Link from "next/link";

const fallbackNews = {
  _id: "fallback",
  title: "यस प्रदेशका थप समाचारहरू चाँडै नै उपलब्ध हुनेछन्",
  content:
    "हामी यस प्रदेशका नयाँ समाचारहरू संकलन गर्दैछौं। यस प्रदेशका ताजा समाचारहरू चाँडै नै उपलब्ध हुनेछन्।",
  image:
    "https://images.unsplash.com/photo-1584824486539-53bb4646bdbc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
  categories: ["प्रदेश", "सामान्य"],
  author: {
    id: "system",
    username: "समाचार टिम",
  },
  createdAt: new Date().toISOString(),
};

const getImageUrl = (article: any) => {
  return (
    article?.image ||
    "https://images.unsplash.com/photo-1584824486539-53bb4646bdbc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
  );
};

const getExcerpt = (content: string, maxLength: number = 150) => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + "...";
};

export default function PradeshNewsPage() {
  const params = useParams();
  const pradeshId = params?.pradeshId as string;

  const pradesh = pradeshData[pradeshId];

  if (!pradesh) {
    notFound();
  }

  const { mainNews, featuredNews, headlineNews, regularNews, loading, error } =
    usePradeshNews(pradesh.name);

  // Prepare data with fallbacks
  const displayMainNews = mainNews || fallbackNews;
  const displayFeaturedNews = [
    ...(featuredNews || []),
    ...Array(Math.max(0, 2 - (featuredNews?.length || 0))).fill(fallbackNews),
  ].slice(0, 2);
  const displayHeadlineNews = headlineNews || [];
  const displayRegularNews = regularNews || [];

  const allNews = [
    mainNews,
    ...featuredNews,
    ...headlineNews,
    ...regularNews,
  ].filter(Boolean);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-20" style={{ width: '75%' }}>
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600">समाचार लोड हुँदैछ...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-20" style={{ width: '75%' }}>
          <div className="text-center">
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6" style={{ width: '75%' }}>
        {/* Large Headline - Main News Title */}
        <div className="mb-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            {displayMainNews.title}
          </h1>
        </div>

        {/* Main News Section - Image Only */}
        <div className="mb-8">
          <Link
            href={displayMainNews._id ? `/news/${displayMainNews._id}` : "#"}
          >
            <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-lg group cursor-pointer">
              <img
                src={getImageUrl(displayMainNews)}
                alt={displayMainNews.title}
                className="w-full h-full object-cover "
              />
            </div>
          </Link>
        </div>

        {/* Featured News Grid - 2 Column Layout */}
        {displayFeaturedNews.length > 0 && (
          <div className="mb-12">
            {/* Section Header with Red Line */}
            <div className="flex items-center mb-6">
              <h2 className="text-3xl font-bold text-red-600 whitespace-nowrap">
                मुख्य समाचार
              </h2>
              <div className="flex-grow h-0.5 bg-red-600 ml-4"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Large Square Image with Title Below */}
            {displayFeaturedNews[1] && (
              <div>
                <Link
                  href={
                    displayFeaturedNews[1]._id
                      ? `/news/${displayFeaturedNews[1]._id}`
                      : "#"
                  }
                >
                  <div className="group cursor-pointer">
                    <div className="rounded overflow-hidden mb-3">
                      <img
                        src={getImageUrl(displayFeaturedNews[1])}
                        alt={displayFeaturedNews[1].title}
                        className="w-full h-full  object-cover "
                      />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 leading-tight group-hover:text-red-600 transition-colors">
                      {displayFeaturedNews[0].title}
                    </h3>
                  </div>
                </Link>
              </div>
            )}

            {/* Right Column - 4 News Items in 2x2 Grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {/* Get 4 news items for the right column */}
              {[
                displayFeaturedNews[1],
                displayHeadlineNews[3],
                displayHeadlineNews[1],
                displayHeadlineNews[4],
              ]
                .filter(Boolean)
                .slice(0, 4)
                .map((item: any, index: number) => (
                  <Link key={item._id || index} href={item._id ? `/news/${item._id}` : "#"}>
                    <div className="group cursor-pointer">
                      <div className="rounded overflow-hidden mb-2">
                        <img
                          src={getImageUrl(item)}
                          alt={item.title}
                          className="w-full h-40 object-cover "
                        />
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-red-600 transition-colors">
                        {item.title}
                      </h4>
                    </div>
                  </Link>
                ))}
            </div>
            </div>
          </div>
        )}

      {/* Pradesh Headlines Section */}
  {allNews.length >= 3 && (
  <div className="bg-yellow-50 border rounded-lg p-6 mb-8">
    <h3 className="text-2xl font-bold text-gray-900 mb-2">
      प्रदेशका हेडलाइन
    </h3>

    {/* Red horizontal line */}
    <hr className="w-full border-red-600 w-20 mb-6" />

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[mainNews, ...featuredNews, ...displayHeadlineNews]
        .filter(Boolean)
        .slice(0, 6)
        .map((item: any) => (
          <Link key={item._id} href={`/news/${item._id}`}>
            <div className="rounded p-4 transition-shadow group cursor-pointer">
              <div className="flex items-center space-x-3">
                <img
                  src={getImageUrl(item)}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded shrink-0"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-red-600 transition-colors">
                    {item.title}
                  </h4>
                </div>
              </div>
            </div>
          </Link>
        ))}
    </div>
  </div>
)}


        {/* Regular News Grid */}
        {displayRegularNews.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-2">
              अन्य समाचार
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayRegularNews.map((item: any) => (
                <Link key={item._id} href={`/news/${item._id}`}>
                  <div className="rounded-lg overflow-hidden transition-shadow group cursor-pointer">
                    <img
                      src={getImageUrl(item)}
                      alt={item.title}
                      className="w-full h-48 object-cover "
                    />
                    <div className="p-4">
                      <h4 className="font-semibold text-lg   text-gray-900 mb-2 leading-tight group-hover:text-red-600 transition-colors">
                        {item.title}
                      </h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* No News Message */}
        {allNews.length <= 1 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center mb-8">
            <h3 className="text-xl font-bold text-blue-900 mb-2">
              यस प्रदेशका नयाँ समाचारहरू चाँडै नै उपलब्ध हुनेछन्
            </h3>
            <p className="text-blue-700">
              हामी यस प्रदेशका ताजा समाचारहरू संकलन गर्दैछौं। कृपया केही समय पछि
              पुनः जाँच्नुहोस्।
            </p>
          </div>
        )}
      </div>
    </div>
  );
}