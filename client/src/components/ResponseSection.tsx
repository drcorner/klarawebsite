import { Link } from "wouter";
import { ArrowRight, BookOpen, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResponseSection() {
  return (
    <section className="bg-cream-dark py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal/10 text-teal text-sm font-semibold mb-4">
            Our Approach
          </span>
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-charcoal">
            Equip and Engage
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          <div className="p-8 rounded-2xl bg-cream border border-charcoal/5 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal to-teal-light flex items-center justify-center mb-6 shadow-sm">
              <BookOpen className="h-7 w-7 text-cream" />
            </div>
            <h3 className="font-bold text-xl text-charcoal mb-3">Equip</h3>
            <p className="text-charcoal-muted leading-relaxed">
              We provide churches with practical resources—curricula, conversation guides, and 
              pastoral frameworks that help congregations think clearly about AI.
            </p>
          </div>
          
          <div className="p-8 rounded-2xl bg-cream border border-charcoal/5 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold to-coral flex items-center justify-center mb-6 shadow-sm">
              <Users className="h-7 w-7 text-cream" />
            </div>
            <h3 className="font-bold text-xl text-charcoal mb-3">Engage</h3>
            <p className="text-charcoal-muted leading-relaxed">
              Building on that foundation, we engage the broader culture to ensure Christian 
              perspectives shape technology development. Influence is earned.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link href="/why-klara-project">
            <Button className="bg-gradient-to-r from-teal to-teal-dark text-cream rounded-full group font-semibold shadow-sm" data-testid="button-see-building">
              Learn More About Our Mission
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
