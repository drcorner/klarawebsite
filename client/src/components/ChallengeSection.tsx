export default function ChallengeSection() {
  return (
    <section id="challenge-section" className="bg-gradient-to-b from-cream-dark to-cream py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-charcoal/5 text-charcoal-muted text-sm font-medium mb-4">
            The Challenge
          </span>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="relative p-8 md:p-12 rounded-3xl bg-cream border border-border/50 shadow-sm">
            <div className="absolute -top-3 left-8 w-8 h-8 rounded-full bg-teal flex items-center justify-center">
              <span className="text-cream text-lg font-serif">"</span>
            </div>
            <p className="text-charcoal leading-relaxed text-lg md:text-xl">
              Pastor Michael has led his congregation through a recession and a pandemic. He knows 
              how to walk with families through job loss and uncertainty. But the questions landing 
              on his desk now are different.
            </p>
            <p className="mt-6 text-charcoal leading-relaxed text-lg md:text-xl">
              A longtime member was let go when her firm adopted AI software—and she's not sure her 
              skills will ever be marketable again. A father asks whether it's wise to let his kids 
              use AI tutoring tools. A young engineer feels isolated, unsure how to think Christianly 
              about the systems she's building at work.
            </p>
            <p className="mt-6 text-charcoal leading-relaxed text-lg md:text-xl font-medium">
              These are new questions. Most churches have no framework for them. And Christian voices 
              are largely absent from the rooms where AI's future is being decided.
            </p>
          </div>
        </div>

        <blockquote className="mt-16 max-w-2xl mx-auto text-center">
          <p className="font-serif text-2xl md:text-3xl text-gold italic leading-relaxed">
            "My people are destroyed for lack of knowledge."
          </p>
          <cite className="mt-4 block text-charcoal-muted not-italic">
            —Hosea 4:6
          </cite>
        </blockquote>
      </div>
    </section>
  );
}
