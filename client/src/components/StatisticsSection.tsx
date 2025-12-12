import { TrendingUp, Users, Shuffle } from "lucide-react";

const stats = [
  {
    icon: TrendingUp,
    value: "2026–2030",
    label: "Leading AI companies predict human-level capabilities within this timeframe",
    gradient: "from-teal-light to-teal",
  },
  {
    icon: Users,
    value: "14M",
    suffix: " jobs",
    label: "Net job loss forecast by the World Economic Forum by 2027",
    gradient: "from-coral to-gold",
  },
  {
    icon: Shuffle,
    value: "12–14%",
    label: "Share of workers who may need to transition to entirely new occupations by 2030",
    gradient: "from-gold to-coral",
  },
];

export default function StatisticsSection() {
  return (
    <section className="bg-charcoal py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal-light/20 text-teal-light text-sm font-semibold mb-4">
            The Urgency
          </span>
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-cream">
            The transformation is happening now
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="relative p-8 rounded-2xl bg-charcoal-muted/20 border border-cream/10 text-center group hover:bg-charcoal-muted/30 transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                <stat.icon className="h-7 w-7 text-cream" />
              </div>
              <p className={`text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                {stat.value}
                {stat.suffix && <span className="text-2xl opacity-70">{stat.suffix}</span>}
              </p>
              <p className="mt-4 text-cream/70 leading-relaxed text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
