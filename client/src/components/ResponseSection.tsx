import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResponseSection() {
  return (
    <section className="bg-cream-dark py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-14">
          <p className="text-primary uppercase tracking-[0.2em] text-sm font-medium mb-4">
            Our Approach
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-charcoal">
            Equip and Engage
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          <div className="p-8 rounded-2xl bg-cream border border-charcoal/5 shadow-sm hover:shadow-md transition-shadow">
            <span className="font-serif text-6xl font-bold text-primary/15 leading-none block mb-4">E</span>
            <h3 className="font-bold text-xl text-charcoal mb-3">Equip</h3>
            <p className="text-charcoal-muted leading-relaxed">
              We provide churches with practical resources—curricula, conversation guides, and 
              pastoral frameworks that help congregations think clearly about AI.
            </p>
          </div>
          
          <div className="p-8 rounded-2xl bg-cream border border-charcoal/5 shadow-sm hover:shadow-md transition-shadow">
            <span className="font-serif text-6xl font-bold text-gold/30 leading-none block mb-4">E</span>
            <h3 className="font-bold text-xl text-charcoal mb-3">Engage</h3>
            <p className="text-charcoal-muted leading-relaxed">
              Building on that foundation, we engage the broader culture to ensure Christian 
              perspectives shape technology development. Influence is earned.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link href="/why-klara-project">
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
