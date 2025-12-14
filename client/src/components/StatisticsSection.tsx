const stats = [
  {
    value: "2026–2030",
    label: "Leading AI companies predict human-level capabilities within this timeframe",
    accent: "text-[hsl(220,70%,75%)]",
  },
  {
    value: "14M",
    label: "Net job loss forecast by the World Economic Forum by 2027",
    accent: "text-coral",
  },
  {
    value: "14%",
    label: "Share of workers who may need to transition to entirely new occupations by 2030",
    accent: "text-gold",
  },
];

export default function StatisticsSection() {
  return (
    <section className="bg-charcoal py-20 md:py-28">
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
      </div>
    </section>
  );
}
