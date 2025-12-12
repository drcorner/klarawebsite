import { TrendingUp, Users, Briefcase } from "lucide-react";

const stats = [
  {
    icon: TrendingUp,
    value: "2026–2027",
    label: "Leading AI companies predict human-level capabilities within this timeframe",
  },
  {
    icon: Users,
    value: "14M",
    suffix: " jobs",
    label: "Net job loss forecast by the World Economic Forum by 2027",
  },
  {
    icon: Briefcase,
    value: "12–14%",
    label: "Share of workers who may need to transition to entirely new occupations by 2030",
  },
];

export default function StatisticsSection() {
  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-gold/10 text-gold text-sm font-medium mb-4">
            The Urgency
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-charcoal">
            The transformation is happening now
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="relative p-8 rounded-2xl bg-gradient-to-br from-cream-dark/50 to-cream border border-border/50 text-center group hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <stat.icon className="h-6 w-6 text-teal" />
              </div>
              <p className="font-serif text-4xl md:text-5xl font-bold text-gold tracking-tight">
                {stat.value}
                {stat.suffix && <span className="text-2xl text-gold/70">{stat.suffix}</span>}
              </p>
              <p className="mt-4 text-charcoal-muted leading-relaxed text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
