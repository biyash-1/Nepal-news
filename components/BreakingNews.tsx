"use client";

import Link from "next/link";

interface Article {
  id: string;
  title: string;
  content: string;
  image?: string;
}

interface BreakingNewsProps {
  main: Article | null;
  marquee: Article[];
}

const getImageUrl = (article: Article | null) => {
  if (!article) return "https://images.unsplash.com/photo-1546422904-90eab23c3d7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80";
  return article.image || "https://images.unsplash.com/photo-1546422904-90eab23c3d7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80";
};

export default function BreakingNews({ main, marquee }: BreakingNewsProps) {
  // Filter out duplicates from marquee array
  const uniqueMarquee = marquee.filter((article, index, self) =>
    index === self.findIndex((a) => a.id === article.id)
  );

  // Get unique articles for different sections
  const marqueeTickerItems = uniqueMarquee.slice(0, 4); // For ticker
  const headlineItems = uniqueMarquee.slice(0, 2); // For headline sections

  return (
    <div>
      <div className="bg-red-600 text-white py-5 overflow-hidden">
        <div className="flex items-center">
          <span className="bg-white text-red-600 px-3 py-1 rounded font-bold mr-4">
            ताजा समाचार
          </span>
          <div className="breaking-news whitespace-nowrap overflow-hidden">
            <span className="inline-block animate-marquee">
              {marqueeTickerItems.length > 0 ? (
                marqueeTickerItems.map((news, index) => (
                  <span key={`${news.id}-${index}-ticker`}>
                    {news.title}
                    {index < marqueeTickerItems.length - 1 && " • "}
                  </span>
                ))
              ) : (
                "प्रधानमन्त्रीको नयाँ कार्यक्रम घोषणा • विद्युत् आपूर्तिमा सुधार • राष्ट्रिय लिगको तयारी सकियो •"
              )}
            </span>
          </div>
        </div>
      </div>

      <section className="w-full mx-auto py-2">
        <h2 className="text-xl font-bold text-red-600 mb-4 border-b-4 border-red-600 inline-block pb-1">
          आजको मुख्य समाचार
        </h2>

        {/* Two Headliners */}
        <div className="mb-8 space-y-6">
          <Link
            href={headlineItems[0] ? `/news/${headlineItems[0].id}` : "#"}
            className="block group"
          >
            <div className="bg-white shadow-lg hover:shadow-xl rounded-2xl p-8 min-h-[140px] transition-all flex items-center justify-center">
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center group-hover:text-red-600 transition-colors leading-snug">
                {headlineItems[0]?.title || "प्रधानमन्त्रीको नयाँ कार्यक्रम घोषणा"}
              </h3>
            </div>
          </Link>

          <Link
            href={headlineItems[1] ? `/news/${headlineItems[1].id}` : "#"}
            className="block group"
          >
            <div className="bg-white shadow-lg hover:shadow-xl rounded-2xl p-8 min-h-[140px] transition-all flex items-center justify-center">
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center group-hover:text-red-600 transition-colors leading-snug">
                {headlineItems[1]?.title || "विद्युत आपूर्तिमा सुधार"}
              </h3>
            </div>
          </Link>
        </div>

        {main && (
          <Link href={`/news/${main.id}`} className="group cursor-pointer">
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden flex flex-col lg:flex-row">
              <div className="lg:w-1/2">
                <img
                  src={getImageUrl(main)}
                  alt={main?.title || "मुख्य समाचार"}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="lg:w-1/2 p-4 flex flex-col justify-center">
                <h3 className="text-5xl font-bold mb-3 text-gray-800 group-hover:text-red-600 transition-colors">
                  {main.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {main.content?.substring(0, 230)}...
                </p>
                <button className="mt-5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg w-fit transition-colors">
                  थप पढ्नुहोस् →
                </button>
              </div>
            </div>
          </Link>
        )}

        {/* Additional headlines - use different articles than the ones above */}
        <div className="mb-8 space-y-6 mt-6">
          {uniqueMarquee.slice(2, 4).map((article, index) => (
            <Link
              key={`${article.id}-${index}-bottom`}
              href={`/news/${article.id}`}
              className="block group"
            >
              <div className="bg-white shadow-lg hover:shadow-xl rounded-2xl p-8 min-h-[140px] transition-all flex items-center justify-center">
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center group-hover:text-red-600 transition-colors leading-snug">
                  {article.title || `समाचार ${index + 3}`}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </div>
  );
}