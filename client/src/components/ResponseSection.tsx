import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResponseSection() {
  return (
    <section className="bg-cream-dark py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-charcoal mb-8">
            Our Response: Equip and Engage
          </h2>
          
          <p className="text-charcoal leading-relaxed text-lg mb-6">
            Klara Project takes a two-part approach. First, we <strong>equip</strong> churches 
            with practical resources—curricula, conversation guides, and pastoral frameworks that 
            help congregations think clearly about AI.
          </p>
          
          <p className="text-charcoal leading-relaxed text-lg mb-8">
            Then, building on that foundation of service and expertise, we <strong>engage</strong> the 
            broader culture to ensure Christian perspectives shape technology development. Influence 
            is earned through demonstrated expertise and genuine service. That's why we start with 
            equipping and build toward engagement.
          </p>

          <Link href="/resources">
            <Button variant="outline" className="border-teal text-teal font-semibold" data-testid="button-see-building">
              See What We're Building
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
