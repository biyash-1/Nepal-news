"use client";

import BreakingNews from "@/components/BreakingNews";
import LocalLevelNews from "@/components/LocalLevel";
import HealthNews from "@/components/Health";
import PoliticsSection from "@/components/PoliticsSection";
import Footer from "@/components/Footer";
import SportsNews from "@/components/SportsNews";
import TechNews from "@/components/TechNews";
import PortfolioSection from "@/components/Portfolio";
import EntertainmentNews from "@/components/Entertainment";
import AdBanner from "@/components/AdBanner";
import { useHomeNews } from "@/app/hooks/useHomeNews";
import { useAds } from "@/app/hooks/useAds";
import GlobalNews from "@/components/GlobalNews";
import EducationNews from "@/components/EducationNews";

export default function Home() {
  const {
    breakingNews,
    localLevelNews,
    healthNews,
    sportsNews,
    techNews,
    politicsNews,
    portfolioNews,
    entertainmentNews,
    globalNews,
    educationNews,
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

        <AdBanner
          ad={ads.belowBreaking}
          position="home-below-breaking"
          className="my-6"
        />

        <LocalLevelNews articles={localLevelNews} />

        <AdBanner
          ad={ads.belowFeatured}
          position="home-below-featured"
          className="my-6"
        />

        <HealthNews articles={healthNews} />

        <AdBanner
          ad={ads.belowLatest}
          position="home-below-latest"
          className="my-6"
        />

        <EntertainmentNews articles={entertainmentNews} />

        <SportsNews articles={sportsNews} />

        <AdBanner
          ad={ads.belowSports}
          position="home-below-sports"
          className="my-6"
        />
        <EducationNews articles={educationNews} />

        <PortfolioSection articles={portfolioNews} />

        <AdBanner
          ad={ads.belowPortfolio}
          position="home-below-portfolio"
          className="my-6"
        />

        <TechNews articles={techNews} />
        <GlobalNews articles={globalNews} />

        <AdBanner
          ad={ads.belowTech}
          position="home-below-tech"
          className="my-6"
        />

        <PoliticsSection articles={politicsNews} />

        <AdBanner
          ad={ads.belowPolitics}
          position="home-below-politics"
          className="my-6"
        />
      </div>
    </>
  );
}
