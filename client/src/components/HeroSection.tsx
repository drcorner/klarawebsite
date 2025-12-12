import { Link } from "wouter";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@assets/generated_images/intergenerational_thoughtful_conversation_photo.png";

export default function HeroSection() {
  const scrollToChallenge = () => {
    document.getElementById("challenge-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[80vh] md:min-h-[85vh] flex items-center">
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Intergenerational conversation about faith and technology" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/85 via-charcoal/70 to-charcoal/40" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-20">
        <div className="max-w-2xl">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-cream leading-tight tracking-tight">
            AI Is Here.
            <br />
            Help the Church Respond.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-cream-dark/90 leading-relaxed">
            We're building curriculum for pastors, guides for parents, and programs that develop 
            the next generation of Christian leaders. Join us from the start.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link href="/get-involved">
              <Button 
                size="lg" 
                className="bg-teal text-cream font-semibold text-lg px-8"
                data-testid="button-hero-get-involved"
              >
                Get Involved
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg"
              onClick={scrollToChallenge}
              className="border-cream/30 text-cream bg-cream/10 backdrop-blur-sm font-semibold"
              data-testid="button-hero-learn-more"
            >
              Learn Why This Matters
              <ArrowDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <p className="absolute bottom-4 right-4 text-cream/40 text-xs z-10">
        Image generated with AI
      </p>
    </section>
  );
}
