import founderImage from "@assets/generated_images/professional_male_founder_headshot.png";

export default function FounderSection() {
  return (
    <section className="bg-cream-dark py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gold rounded-full" />
            <img 
              src={founderImage} 
              alt="Dr. Anthony R. Pisani, Founder of Klara Project" 
              className="w-full max-w-md mx-auto lg:mx-0 rounded-lg shadow-lg"
            />
            <p className="mt-2 text-charcoal-light text-xs text-center lg:text-left">
              Image generated with AI - placeholder for founder photo
            </p>
          </div>
          
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-charcoal mb-6">
              About the Founder
            </h2>
            
            <p className="text-charcoal leading-relaxed mb-4">
              The idea for Klara Project was born when Dr. Pisani taught a Sunday school class 
              on faith and AI and watched people young and old leave encouraged—strengthened in their 
              faith and in the reality that the core of our humanity is relationship with God, not 
              our reason or abilities.
            </p>
            
            <p className="text-charcoal leading-relaxed mb-4">
              <strong>Anthony R. Pisani, Ph.D.</strong>, is a clinical psychologist, internationally 
              recognized leader in suicide prevention, and entrepreneur. A committed Christian, he 
              came to faith as an adult while in graduate school. He has been married 25 years and 
              is the father of three. He is an active member of Cornerstone Presbyterian Church in 
              Rochester, New York.
            </p>
            
            <p className="text-charcoal leading-relaxed mb-4">
              Dr. Pisani is the founder of SafeSide Prevention, a mission-driven company providing 
              suicide prevention training to government agencies, military branches, and health 
              systems across the United States, Australia, New Zealand, and the United Kingdom.
            </p>
            
            <p className="text-charcoal-muted leading-relaxed text-sm italic">
              Klara Project is co-located with SafeSide's full-service production studio, 
              providing immediate access to professional video production and communications infrastructure.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
