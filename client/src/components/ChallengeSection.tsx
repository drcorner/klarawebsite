import { Card } from "@/components/ui/card";

export default function ChallengeSection() {
  return (
    <section id="challenge-section" className="bg-cream-dark py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-charcoal text-center mb-12">
          The Challenge
        </h2>
        
        <Card className="max-w-3xl mx-auto p-8 md:p-10 bg-cream border-border">
          <p className="text-charcoal leading-relaxed text-lg">
            Pastor Michael has led his congregation through a recession and a pandemic. He knows 
            how to walk with families through job loss and uncertainty. But the questions landing 
            on his desk now are different.
          </p>
          <p className="mt-4 text-charcoal leading-relaxed text-lg">
            A longtime member was let go when her firm adopted AI software—and she's not sure her 
            skills will ever be marketable again. A father asks whether it's wise to let his kids 
            use AI tutoring tools. A young engineer feels isolated, unsure how to think Christianly 
            about the systems she's building at work.
          </p>
          <p className="mt-4 text-charcoal leading-relaxed text-lg font-medium">
            These are new questions. Most churches have no framework for them. And Christian voices 
            are largely absent from the rooms where AI's future is being decided.
          </p>
        </Card>

        <blockquote className="mt-12 max-w-2xl mx-auto text-center">
          <p className="font-serif text-2xl md:text-3xl text-gold italic leading-relaxed">
            "My people are destroyed for lack of knowledge."
          </p>
          <cite className="mt-4 block text-charcoal-muted text-lg not-italic">
            —Hosea 4:6
          </cite>
        </blockquote>
      </div>
    </section>
  );
}
