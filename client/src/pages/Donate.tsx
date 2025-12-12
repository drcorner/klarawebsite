import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import DonationForm from "@/components/DonationForm";
import WhatYourGiftSupports from "@/components/WhatYourGiftSupports";

export default function Donate() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main>
        <PageHero 
          title="Support Our Mission" 
          subtitle="Equipping churches. Engaging the culture."
        />

        <section className="py-16 md:py-24">
          <div className="max-w-3xl mx-auto px-6 md:px-10">
            <p className="text-charcoal leading-relaxed text-lg mb-12 text-center">
              Your donation helps us create practical resources for churches and ensure Christian 
              perspectives shape AI development. Every gift—monthly support or one-time contribution—moves 
              this mission forward.
            </p>
            
            <DonationForm />
          </div>
        </section>

        <section className="bg-cream-dark py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <WhatYourGiftSupports />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
