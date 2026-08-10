import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmailGateModal from "@/components/EmailGateModal";

export default function PartnerSection() {
  const [showEmailGate, setShowEmailGate] = useState(false);

  const handleWhitepaperEmailSubmit = async (email: string) => {
    const res = await fetch("/api/whitepaper/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      throw new Error("Tracking failed");
    }

    window.open("/klara-project-white-paper.pdf", "_blank");
  };

  return (
    <section className="relative bg-gradient-to-br from-charcoal via-charcoal to-primary/80 py-16 md:py-20 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-sans text-3xl md:text-5xl font-bold text-cream mb-6">
            Partner With Us
          </h2>

          <p className="text-cream/80 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            The window for Christian influence is narrow but real. Major AI companies are making
            decisions now that will affect generations. Churches need resources now—not after
            the crisis arrives.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/donate">
              <Button
                size="lg"
                className="bg-cream text-primary hover:bg-cream/90 rounded-full font-semibold px-8 group"
                data-testid="button-partner-donate"
              >
                Become a Founding Partner
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setShowEmailGate(true)}
              className="border-cream/40 text-cream bg-cream/10 font-medium rounded-full hover:bg-cream/20"
              data-testid="button-partner-whitepaper"
            >
              <Download className="mr-2 h-4 w-4" />
              Get the White Paper
            </Button>
          </div>

          <p className="mt-6 text-cream/70 text-sm leading-relaxed max-w-xl mx-auto">
            Secure donations processed by Stripe. Klara Project has applied for 501(c)(3)
            tax-exempt status; upon approval, donations will be tax-deductible retroactive
            to our date of incorporation.
          </p>

          <blockquote className="mt-12 py-8 border-y border-cream/10">
            <p className="font-serif text-xl md:text-2xl text-gold italic leading-relaxed">
              "And let us consider how to stir up one another to love and good works."
            </p>
            <cite className="mt-4 block text-cream/60 not-italic font-medium">
              —Hebrews 10:24
            </cite>
          </blockquote>
        </div>
      </div>

      <EmailGateModal
        isOpen={showEmailGate}
        onClose={() => setShowEmailGate(false)}
        onSubmit={handleWhitepaperEmailSubmit}
      />
    </section>
  );
}
