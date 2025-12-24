import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ChallengeSection from "@/components/ChallengeSection";
import StatisticsSection from "@/components/StatisticsSection";
import ResponseSection from "@/components/ResponseSection";
import WhatWereBuildingSection from "@/components/WhatWereBuildingSection";
import FounderSection from "@/components/FounderSection";
import PartnerSection from "@/components/PartnerSection";
import CTASection from "@/components/CTASection";
import { useSEO, SEO_CONFIG } from "@/hooks/use-seo";

export default function Home() {
  useSEO(SEO_CONFIG.home);

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main>
        <HeroSection />
        <ChallengeSection />
        <StatisticsSection />
        <ResponseSection />
        <WhatWereBuildingSection />
        <FounderSection />
        <PartnerSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
