const stats = [
  {
    value: "2026–2030",
    label: "Leading AI companies predict human-level capabilities within this timeframe",
    accent: "text-[hsl(220,70%,75%)]",
  },
  {
    value: "92 Million",
    label: "Jobs eliminated by AI by 2030—even as new ones emerge",
    accent: "text-coral",
  },
  {
    value: "190 Million",
    label: "People using AI chatbot ChatGPT daily",
    accent: "text-gold",
  },
];

export default function StatisticsSection() {
  return (
    <section className="bg-charcoal py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <p className="text-cream/60 uppercase tracking-[0.2em] text-sm font-medium mb-4">
            The Urgency
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-cream">
            The transformation is happening now
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center group"
            >
              <p className={`font-serif text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight ${stat.accent} leading-none`}>
                {stat.value}
              </p>
              <div className="w-12 h-px bg-cream/20 mx-auto my-6" />
              <p className="text-cream/70 leading-relaxed text-base max-w-xs mx-auto">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <blockquote className="mt-16 max-w-3xl mx-auto text-center">
          <p className="font-serif text-xl md:text-2xl text-cream italic leading-relaxed">
            "Almost all humans at almost everything"
          </p>
          <cite className="mt-4 block text-cream/60 not-italic font-medium">
            — Dario Amodei, CEO of Anthropic, on AI capabilities within 2–3 years
          </cite>
        </blockquote>
      </div>
    </section>
  );
}
