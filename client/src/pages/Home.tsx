import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ChallengeSection from "@/components/ChallengeSection";
import StatisticsSection from "@/components/StatisticsSection";
import ResponseSection from "@/components/ResponseSection";
import WhatWereBuildingSection from "@/components/WhatWereBuildingSection";
import FounderSection from "@/components/FounderSection";
import PartnerSection from "@/components/PartnerSection";

export default function Home() {
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
      </main>
      <Footer />
    </div>
  );
}
