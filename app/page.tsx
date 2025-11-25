import BreakingNews from '@/components/BreakingNews'
import FeaturedNews from '@/components/FeaturedNews'
import LatestNews from '@/components/LatestNews'
import PoliticsSection from '@/components/PoliticsSection'
import Footer from '@/components/Footer'
import GlobalNews from '@/components/GlobalNews'
import SportsNews from '@/components/SportsNews'
import TechNews from '@/components/TechNews'
import PortfolioSection from '@/components/Portfolio'
export default function Home() {
  return (
    <>
   
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BreakingNews />
        <FeaturedNews />
        <LatestNews />
      
        <SportsNews/>
        <PortfolioSection/>
        <TechNews/>
        <PoliticsSection />
      </div>
      <Footer />
    </>
  )
}