import HeroSection from "../../components/home/HeroSection";
import FeaturedJobs from "../../components/home/FeaturedJobs";
import CategoryGrid from "../../components/home/CategoryGrid";
import TopCompanies from "../../components/home/TopCompanies";
import HowItWorks from "../../components/home/HowItWorks";
import StatsSection from "../../components/home/StatsSection";
import CTASection from "../../components/home/CTASection";
export default function HomePage() {
  return (<main><HeroSection /><StatsSection /><HowItWorks /><CategoryGrid /><FeaturedJobs /><TopCompanies /><CTASection /></main>);
}
