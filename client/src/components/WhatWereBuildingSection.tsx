import { Video, MessageSquare, Trophy, GraduationCap, Heart, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const items = [
  {
    icon: Video,
    title: "Video-Based Curriculum",
    description: "A 13-week series for small groups, Sunday school, or workshops—helping Christians apply biblical principles to AI challenges.",
    status: "In Progress",
  },
  {
    icon: MessageSquare,
    title: "Conversation Guides",
    description: "Practical frameworks for pastors on job displacement, raising children in the AI age, and everyday ethical decisions.",
    status: "In Progress",
  },
  {
    icon: Trophy,
    title: "Student Essay Competition",
    description: "Annual competition where students use AI and submit their process—judged on both product and discernment.",
    status: "Coming Soon",
  },
  {
    icon: GraduationCap,
    title: "Educational Grants",
    description: "Research funding for students exploring AI, faith, and ethics.",
    status: "Coming Soon",
  },
  {
    icon: Heart,
    title: "Pastoral Care Resources",
    description: "Training for ministering to families affected by technological unemployment.",
    status: "Coming Soon",
  },
];

export default function WhatWereBuildingSection() {
  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-teal/10 text-teal text-sm font-medium mb-4">
              Our Programs
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-charcoal">
              What We're Building
            </h2>
          </div>
          <Link href="/resources">
            <Button variant="outline" className="border-teal text-teal rounded-full group">
              View All Resources
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {items.map((item, index) => (
            <div 
              key={index} 
              className="group p-6 rounded-2xl bg-gradient-to-br from-cream to-cream-dark/30 border border-border/50 hover:shadow-md hover:border-teal/20 transition-all duration-300"
              data-testid={`card-building-${index}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-teal/10 flex items-center justify-center group-hover:bg-teal/20 transition-colors">
                  <item.icon className="h-5 w-5 text-teal" />
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  item.status === "In Progress" 
                    ? "bg-gold/10 text-gold-dark" 
                    : "bg-charcoal/5 text-charcoal-muted"
                }`}>
                  {item.status}
                </span>
              </div>
              <h3 className="font-semibold text-charcoal mb-2 group-hover:text-teal transition-colors">
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
