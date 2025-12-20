const items = [
  {
    title: "Video-Based Curriculum",
    description: "A 13-week series for small groups and Sunday school. Each session introduces key concepts, then guides participants in applying biblical principles to AI challenges in their families and workplaces.",
    status: "In Development",
  },
  {
    title: "Conversation Guides",
    description: "Practical frameworks for church leaders: 'When AI Takes Jobs,' 'Raising Children in the Age of AI,' 'Christian Ethics for Everyday AI Decisions,' and 'Relationships in an AI World.'",
    status: "In Development",
  },
  {
    title: "Family Resources",
    description: "Guidance for parents making decisions about AI tools, educational technology, and home robotics—grounded in biblical wisdom.",
    status: "Coming Soon",
  },
  {
    title: "Public Engagement",
    description: "Coalition building, media presence, and thought leadership positioning Christians as constructive partners in AI development.",
    status: "Coming Soon",
  },
];

export default function WhatWereBuildingSection() {
  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-12">
          <p className="text-primary uppercase tracking-[0.2em] text-sm font-medium mb-4">
            Our Programs
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-charcoal">
            What We're Building
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <div 
              key={index} 
              className="group relative p-6 rounded-2xl bg-cream border border-charcoal/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              data-testid={`card-building-${index}`}
            >
              <div className="flex items-start justify-end mb-4">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  item.status === "In Development"
                    ? "bg-primary/10 text-primary"
                    : "bg-charcoal/5 text-charcoal-muted"
                }`}>
                  {item.status}
                </span>
              </div>
              <h3 className="font-semibold text-lg text-charcoal mb-2 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-charcoal-muted text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
