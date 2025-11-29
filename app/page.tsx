"use client";

import BreakingNews from '@/components/BreakingNews';
import FeaturedNews from '@/components/FeaturedNews';
import LatestNews from '@/components/LatestNews';
import PoliticsSection from '@/components/PoliticsSection';
import Footer from '@/components/Footer';
import SportsNews from '@/components/SportsNews';
import TechNews from '@/components/TechNews';
import PortfolioSection from '@/components/Portfolio';
import { useHomeNews } from "@/app/hooks/useHomeNews";

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
    error
  } = useHomeNews();

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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BreakingNews main={breakingNews.main} marquee={breakingNews.marquee} />
        <FeaturedNews articles={featuredNews} />
        <LatestNews articles={latestNews} />
        <SportsNews articles={sportsNews} />
        <PortfolioSection articles={portfolioNews} />
        <TechNews articles={techNews} />
        <PoliticsSection articles={politicsNews} />
      </div>
      <Footer />
    </>
  );
}