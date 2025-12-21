import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="bg-primary py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-cream mb-4">
          Ready to join us?
        </h2>
        <p className="text-cream/80 text-lg mb-8 max-w-2xl mx-auto">
          Learn more about our mission or support the work of equipping churches for the AI age.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/about">
            <Button
              variant="outline"
              className="bg-transparent border-cream text-cream hover:bg-cream hover:text-primary rounded-full group font-semibold px-8"
              data-testid="button-cta-about"
            >
              About Us
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/donate">
            <Button
              className="bg-cream text-primary hover:bg-cream/90 rounded-full font-semibold px-8"
              data-testid="button-cta-donate"
            >
              Donate
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
