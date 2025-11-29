"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useLocalData } from "@/app/hooks/useLocalData";
import { localCategories } from "@/app/datas/localCategories";

const getLocationLabel = (key: string) => {
  const locationMap: Record<string, string> = {
    kathmandu: "काठमाडौं",
    lalitpur: "ललितपुर",
    bhaktapur: "भक्तपुर",
    pokhara: "पोखरा",
    biratnagar: "बिराटनगर",
  };
  return locationMap[key] ?? key;
};

export default function LocationPage() {
  const params = useParams();
  const locationKey = params?.location as string;
  const locationLabel = getLocationLabel(locationKey);

  const { articles, featuredArticles, loading, error } = useLocalData(locationKey);

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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            पुनः प्रयास गर्नुहोस्
          </button>
        </div>
      </div>
    );
  }

  const mainFeatured = featuredArticles[0];
  const secondaryFeatured = featuredArticles.slice(1, 3);
  const remainingArticles = articles.slice(6);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-3 text-sm text-gray-600">
            <Link href="/local-level" className="hover:text-green-600 font-medium">
              स्थानीय तह
            </Link>
            <span className="text-green-500">›</span>
            <span className="text-gray-900 font-semibold bg-green-100 px-3 py-1 rounded-full">
              {locationLabel}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{locationLabel}</h1>
          <div className="w-20 h-1 bg-green-600 mx-auto mb-3"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {locationLabel} सम्बन्धी ताजा स्थानीय समाचार, विकास कार्य र अपडेटहरू
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Breaking News */}
        {mainFeatured && (
          <div className="mb-8 border-l-4 border-red-500 bg-red-50 pl-4 py-2">
            <div className="flex items-center space-x-4">
              <span className="bg-red-500 text-white px-3 py-1 text-sm font-bold rounded">
                ब्रेकिङ
              </span>
              <Link
                href={`/news/${mainFeatured._id}`}
                className="text-base font-semibold text-gray-900 hover:text-red-600 transition-colors line-clamp-1"
              >
                {mainFeatured.title}
              </Link>
              <span className="text-sm text-gray-500 hidden md:block">{mainFeatured.time}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-8">
            {/* Featured Article */}
            {mainFeatured && (
              <div className="mb-8">
                <Link
                  href={`/news/${mainFeatured._id}`}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <img
                      src={mainFeatured.image}
                      alt={mainFeatured.title}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                      <div className="text-white">
                        <span className="bg-green-600 text-white px-3 py-1 text-sm font-medium rounded-full mb-2 inline-block">
                          मुख्य समाचार
                        </span>
                        <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-2 group-hover:text-green-300 transition-colors">
                          {mainFeatured.title}
                        </h2>
                        <div className="flex items-center space-x-4 text-green-200 text-sm">
                          <span>{mainFeatured.time}</span>
                          {mainFeatured.ward && (
                            <>
                              <span>•</span>
                              <span>{mainFeatured.ward}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Secondary Featured */}
            {secondaryFeatured.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {secondaryFeatured.map((item) => (
                  <Link
                    key={item._id}
                    href={`/news/${item._id}`}
                    className="group border-l-4 border-green-500 pl-4"
                  >
                    <div className="space-y-3">
                      <div className="overflow-hidden rounded-lg">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors leading-tight mb-2">
                          {item.title}
                        </h3>
                        <div className="flex items-center space-x-3 text-sm text-gray-500">
                          <span>{item.time}</span>
                          {item.ward && (
                            <>
                              <span>•</span>
                              <span>{item.ward}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Remaining Articles */}
            {remainingArticles.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">
                  {locationLabel} का अन्य समाचार
                </h3>
                <div className="space-y-4">
                  {remainingArticles.map((item) => (
                    <Link
                      key={item._id}
                      href={`/local-level/${locationKey}/${item._id}`}
                      className="group flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex-shrink-0 w-20 h-20 overflow-hidden rounded-lg">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-semibold text-gray-900 group-hover:text-green-600 transition-colors leading-tight mb-1 line-clamp-2">
                          {item.title}
                        </h4>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>{item.time}</span>
                          {item.ward && (
                            <>
                              <span>•</span>
                              <span>{item.ward}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-4 space-y-6">
            {/* Local Info Box */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-5 border border-green-100">
              <h4 className="text-lg font-bold text-gray-900 mb-3">{locationLabel} बारे</h4>
              <div className="text-gray-700 text-sm leading-relaxed">
                <p>
                  यो स्थानीय तहको मुख्य समाचार पृष्ठ हो। यहाँ तपाईंले {locationLabel} सम्बन्धी 
                  ताजा समाचार, विकास कार्य, र स्थानीय सरकारी अपडेटहरू पाउन सक्नुहुन्छ।
                </p>
              </div>
            </div>

            {/* Trending */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="text-lg font-bold text-gray-900 mb-4">{locationLabel} मा ट्रेन्डिङ</h4>
              <div className="space-y-3">
                {articles.slice(0, 4).map((item, index) => (
                  <Link
                    key={item._id}
                    href={`/local-level/${locationKey}/${item._id}`}
                    className="flex items-start space-x-3 group"
                  >
                    <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-800 rounded-full text-xs font-bold flex items-center justify-center mt-0.5">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-semibold text-gray-900 group-hover:text-green-600 transition-colors leading-tight line-clamp-2">
                        {item.title}
                      </h5>
                      <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                        <span>{item.time}</span>
                        {item.ward && (
                          <>
                            <span>•</span>
                            <span>{item.ward}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Other Locations */}
            <div className="bg-gray-50 rounded-xl p-5">
              <h4 className="text-lg font-bold text-gray-900 mb-4">अन्य स्थानहरू</h4>
              <div className="grid grid-cols-2 gap-2">
                {localCategories
                  .filter((cat) => cat.key !== "all" && cat.key !== locationKey)
                  .map((loc) => (
                    <Link
                      key={loc.key}
                      href={`/local-level/${loc.key}`}
                      className={`p-3 rounded-lg text-center transition-all ${
                        locationKey === loc.key
                          ? "bg-green-600 text-white shadow-lg transform scale-105"
                          : "bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 hover:shadow-md border border-gray-200"
                      }`}
                    >
                      <div className="font-semibold text-xs leading-tight">{loc.label}</div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
