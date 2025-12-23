import { Rocket } from "lucide-react";

export default function PartnerSection() {
  return (
    <section className="relative bg-gradient-to-br from-charcoal via-charcoal to-primary/80 py-16 md:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(20,184,166,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(249,115,22,0.1),transparent_50%)]" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 mb-8 shadow-lg shadow-primary/25">
            <Rocket className="h-8 w-8 text-cream" />
          </div>

          <h2 className="font-sans text-3xl md:text-5xl font-bold text-cream mb-6">
            Partner With Us
          </h2>

          <p className="text-cream/75 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            The window for Christian influence is narrow but real. Major AI companies are making
            decisions now that will affect generations. Churches need resources now—not after
            the crisis arrives.
          </p>

          <blockquote className="mt-12 py-8 border-y border-cream/10">
            <p className="font-serif text-xl md:text-2xl text-gold italic leading-relaxed">
              "And let us consider how to stir up one another to love and good works."
            </p>
            <cite className="mt-4 block text-cream/50 not-italic font-medium">
              —Hebrews 10:24
            </cite>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
