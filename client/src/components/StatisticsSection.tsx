const stats = [
  {
    value: "2026–2027",
    label: "Leading AI companies predict human-level capabilities within this timeframe",
  },
  {
    value: "14 Million",
    label: "Net job loss forecast by the World Economic Forum by 2027",
  },
  {
    value: "12–14%",
    label: "Share of workers who may need to transition to entirely new occupations by 2030",
  },
];

export default function StatisticsSection() {
  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-charcoal text-center mb-4">
          By the Numbers
        </h2>
        <p className="text-charcoal-muted text-center max-w-2xl mx-auto mb-12">
          The transformation is happening now—not in some distant future.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="font-serif text-4xl md:text-5xl font-bold text-gold tracking-tight">
                {stat.value}
              </p>
              <p className="mt-4 text-charcoal-muted leading-relaxed">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
