import { Quote } from "lucide-react";
import founderImage from "@assets/Pisani-SpeakingPhoto1_1765542350944.jpeg";

export default function FounderSection() {
  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-teal/20 via-teal-light/10 to-gold/10 rounded-3xl blur-xl" />
              <img 
                src={founderImage} 
                alt="Dr. Anthony R. Pisani, Founder of Klara Project" 
                className="relative w-full max-w-md mx-auto lg:mx-0 rounded-2xl shadow-xl"
              />
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <span className="inline-block px-4 py-1.5 rounded-full bg-teal/10 text-teal text-sm font-semibold mb-4">
              Leadership
            </span>
            <h2 className="font-sans text-3xl md:text-4xl font-bold text-charcoal mb-6">
              About the Founder
            </h2>
            
            <div className="relative mb-6 p-6 rounded-2xl bg-gradient-to-br from-teal/5 to-transparent border border-teal/10">
              <Quote className="absolute top-4 left-4 h-8 w-8 text-teal/20" />
              <p className="text-charcoal leading-relaxed pl-8 italic">
                The idea for Klara Project was born when Dr. Pisani taught a Sunday school class 
                on faith and AI and watched people young and old leave encouraged—strengthened in their 
                faith and in the reality that the core of our humanity is relationship with God.
              </p>
            </div>
            
            <p className="text-charcoal leading-relaxed mb-4">
              <strong className="text-charcoal">Anthony R. Pisani, Ph.D.</strong>, is a clinical psychologist, internationally 
              recognized leader in suicide prevention, and entrepreneur. A committed Christian, he 
              came to faith as an adult while in graduate school. He has been married for 25 years and 
              is the father of three.
            </p>
            
            <p className="text-charcoal-muted leading-relaxed mb-6">
              Dr. Pisani is the founder of SafeSide Prevention, a mission-driven company providing 
              suicide prevention training to government agencies, military branches, and health 
              systems across the United States, Australia, New Zealand, and the United Kingdom.
            </p>
            
            <div className="p-4 rounded-xl bg-charcoal/5 border border-charcoal/5">
              <p className="text-charcoal-muted text-sm">
                Klara Project is co-located with SafeSide's full-service production studio, 
                providing immediate access to professional video production infrastructure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
