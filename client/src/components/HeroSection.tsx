import { Link } from "wouter";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@assets/generated_images/intergenerational_thoughtful_conversation_photo.png";

export default function HeroSection() {
  const scrollToChallenge = () => {
    document.getElementById("challenge-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Intergenerational conversation about faith and technology" 
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal/95 via-charcoal/80 to-teal-dark/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-24">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-light/20 backdrop-blur-sm border border-teal-light/30 mb-8">
            <span className="w-2 h-2 rounded-full bg-teal-light animate-pulse" />
            <span className="text-cream text-sm font-medium">Now accepting founding partners</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
            <span className="text-cream font-sans font-black">AI Is Here.</span>
            <br />
            <span className="bg-gradient-to-r from-teal-light to-gold bg-clip-text text-transparent font-sans font-bold">
              Help the Church Respond.
            </span>
          </h1>
          
          <p className="mt-8 text-lg md:text-xl text-cream/80 leading-relaxed max-w-xl">
            We're building curriculum for pastors, guides for parents, and programs that develop 
            the next generation of Christian leaders. Join us from the start.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link href="/get-involved">
              <Button 
                size="lg" 
                className="bg-teal hover:bg-teal-hover text-cream font-semibold text-base px-8 rounded-full group shadow-lg shadow-teal/25"
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
              className="border-cream/40 text-cream bg-cream/10 backdrop-blur-md font-medium rounded-full hover:bg-cream/20"
              data-testid="button-hero-learn-more"
            >
              Learn Why This Matters
            </Button>
          </div>
        </div>
      </div>

      <button 
        onClick={scrollToChallenge}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-cream/50 hover:text-cream transition-colors"
        aria-label="Scroll down"
      >
        <ChevronDown className="h-8 w-8 animate-bounce" />
      </button>

      <p className="absolute bottom-3 right-4 text-cream/25 text-xs z-10">
        Image generated with AI
      </p>
    </section>
  );
}
