import { Link } from "wouter";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@assets/generated_images/intergenerational_thoughtful_conversation_photo.png";

export default function HeroSection() {
  const scrollToChallenge = () => {
    document.getElementById("challenge-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Intergenerational conversation about faith and technology" 
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal/90 via-charcoal/75 to-charcoal/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-24">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cream/10 backdrop-blur-sm border border-cream/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-cream/90 text-sm font-medium">Now accepting founding partners</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-cream leading-[1.1] tracking-tight">
            <span className="font-serif">AI Is Here.</span>
            <br />
            <span className="font-sans font-semibold text-cream/90">Help the Church Respond.</span>
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-cream/80 leading-relaxed max-w-xl">
            We're building curriculum for pastors, guides for parents, and programs that develop 
            the next generation of Christian leaders. Join us from the start.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/get-involved">
              <Button 
                size="lg" 
                className="bg-teal hover:bg-teal/90 text-cream font-medium text-base px-6 rounded-full group"
                data-testid="button-hero-get-involved"
              >
                Get Involved
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg"
              onClick={scrollToChallenge}
              className="border-cream/30 text-cream bg-cream/5 backdrop-blur-sm font-medium rounded-full hover:bg-cream/10"
              data-testid="button-hero-learn-more"
            >
              Learn Why This Matters
            </Button>
          </div>
        </div>
      </div>

      <button 
        onClick={scrollToChallenge}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-cream/60 hover:text-cream transition-colors animate-bounce"
        aria-label="Scroll down"
      >
        <ChevronDown className="h-8 w-8" />
      </button>

      <p className="absolute bottom-3 right-4 text-cream/30 text-xs z-10">
        Image generated with AI
      </p>
    </section>
  );
}
