import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResponseSection() {
  return (
    <section className="bg-cream-dark py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-14">
          <p className="text-primary uppercase tracking-[0.2em] text-sm font-medium mb-4">
            Our Approach
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-charcoal">
            Equip. Engage. Empower.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          <div className="p-8 rounded-2xl bg-cream border border-charcoal/5 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-1 bg-primary rounded-full mb-6"></div>
            <h3 className="font-bold text-xl text-charcoal mb-3">Equip</h3>
            <p className="text-charcoal-muted leading-relaxed">
              Churches with practical resources for the AI age.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-cream border border-charcoal/5 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-1 bg-gold rounded-full mb-6"></div>
            <h3 className="font-bold text-xl text-charcoal mb-3">Engage</h3>
            <p className="text-charcoal-muted leading-relaxed">
              Culture to shape technology development.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-cream border border-charcoal/5 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-1 bg-coral rounded-full mb-6"></div>
            <h3 className="font-bold text-xl text-charcoal mb-3">Empower</h3>
            <p className="text-charcoal-muted leading-relaxed">
              The next generation to lead with wisdom and faith.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link href="/about">
            <Button className="bg-primary text-cream rounded-full group font-semibold shadow-sm" data-testid="button-see-building">
              Learn More About Our Mission
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
