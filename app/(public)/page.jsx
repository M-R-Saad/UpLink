import HeroSection from "../../components/home/HeroSection";
import StatsSection from "../../components/home/StatsSection";
import HowItWorks from "../../components/home/HowItWorks";
import CategoryGrid from "../../components/home/CategoryGrid";
import FeaturedJobs from "../../components/home/FeaturedJobs";
import TopCompanies from "../../components/home/TopCompanies";
import CTASection from "../../components/home/CTASection";

export const metadata = {
  title: "UpLink — Find Your Next Opportunity",
  description:
    "Discover thousands of job opportunities from top companies. Build your resume, apply with ease, and land your dream career on UpLink.",
};

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <StatsSection />
      <HowItWorks />
      <CategoryGrid />
      <FeaturedJobs />
      <TopCompanies />
      <CTASection />
    </main>
  );
}
