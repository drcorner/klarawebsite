import { Link } from "wouter";
import { ArrowRight, BookOpen, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResponseSection() {
  return (
    <section className="bg-gradient-to-b from-cream-dark to-cream py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-teal/10 text-teal text-sm font-medium mb-4">
            Our Approach
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-charcoal">
            Equip and Engage
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          <div className="p-8 rounded-2xl bg-cream border border-border/50">
            <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center mb-5">
              <BookOpen className="h-6 w-6 text-teal" />
            </div>
            <h3 className="font-semibold text-xl text-charcoal mb-3">Equip</h3>
            <p className="text-charcoal-muted leading-relaxed">
              We provide churches with practical resources—curricula, conversation guides, and 
              pastoral frameworks that help congregations think clearly about AI.
            </p>
          </div>
          
          <div className="p-8 rounded-2xl bg-cream border border-border/50">
            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-5">
              <Users className="h-6 w-6 text-gold" />
            </div>
            <h3 className="font-semibold text-xl text-charcoal mb-3">Engage</h3>
            <p className="text-charcoal-muted leading-relaxed">
              Building on that foundation, we engage the broader culture to ensure Christian 
              perspectives shape technology development. Influence is earned.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link href="/why-klara-project">
            <Button variant="outline" className="border-teal text-teal rounded-full group" data-testid="button-see-building">
              Learn More About Our Mission
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
