import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const items = [
  {
    title: "Curricula and Conversation Guides",
    description: "Series for small groups, Sunday school, or workshops—helping Christians apply biblical principles to AI challenges.",
    status: "In Progress",
  },
  {
    title: "Next Generation Grants and Competitions",
    description: "Funding and challenges that equip young Christians to engage AI thoughtfully—judged on both product and Christian discernment.",
    status: "Coming Soon",
  },
  {
    title: "Family Resources",
    description: "Practical resources for pastors and families on job displacement, raising children in the AI age, and everyday ethical decisions.",
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
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="text-primary uppercase tracking-[0.2em] text-sm font-medium mb-4">
              Our Programs
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-normal text-charcoal">
              What We're Building
            </h2>
          </div>
          <Link href="/resources">
            <Button variant="outline" className="border-primary text-primary rounded-full group font-semibold">
              View All Resources
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
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
                  item.status === "In Progress" 
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
