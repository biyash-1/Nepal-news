"use client";

import BreakingNews from "@/components/BreakingNews";
import FeaturedNews from "@/components/FeaturedNews";
import LatestNews from "@/components/LatestNews";
import PoliticsSection from "@/components/PoliticsSection";
import Footer from "@/components/Footer";
import SportsNews from "@/components/SportsNews";
import TechNews from "@/components/TechNews";
import PortfolioSection from "@/components/Portfolio";
import AdBanner from "@/components/AdBanner";
import { useHomeNews } from "@/app/hooks/useHomeNews";
import { useAds } from "@/app/hooks/useAds";

export default function Home() {
  const {
    breakingNews,
    featuredNews,
    latestNews,
    sportsNews,
    techNews,
    politicsNews,
    portfolioNews,
    loading,
    error,
  } = useHomeNews();

  const { ads } = useAds();

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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            पुनः प्रयास गर्नुहोस्
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto px-4 sm:px-6 py-8 max-w-[90%]">


        <BreakingNews main={breakingNews.main} marquee={breakingNews.marquee} />

        {/* Ad - Below Breaking News */}
        <AdBanner ad={ads.belowBreaking} position="home-below-breaking" className="my-6" />

        <FeaturedNews articles={featuredNews} />

        {/* Ad - Below Featured News */}
        <AdBanner ad={ads.belowFeatured} position="home-below-featured" className="my-6" />

        <LatestNews articles={latestNews} />

        {/* Ad - Below Latest News */}
        <AdBanner ad={ads.belowLatest} position="home-below-latest" className="my-6" />

        <SportsNews articles={sportsNews} />

        {/* Ad - Below Sports */}
        <AdBanner ad={ads.belowSports} position="home-below-sports" className="my-6" />

        <PortfolioSection articles={portfolioNews} />

        {/* Ad - Below Portfolio */}
        <AdBanner ad={ads.belowPortfolio} position="home-below-portfolio" className="my-6" />

        <TechNews articles={techNews} />

        {/* Ad - Below Tech News */}
        <AdBanner ad={ads.belowTech} position="home-below-tech" className="my-6" />

        <PoliticsSection articles={politicsNews} />

        {/* Ad - Below Politics */}
        <AdBanner ad={ads.belowPolitics} position="home-below-politics" className="my-6" />
      </div>
    </>
  );
}