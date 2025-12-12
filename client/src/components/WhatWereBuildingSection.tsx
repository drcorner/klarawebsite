import { Video, MessageSquare, Trophy, GraduationCap, Heart, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const items = [
  {
    icon: Video,
    title: "Video-Based Curriculum",
    description: "A 13-week series for small groups, Sunday school, or workshops—helping Christians apply biblical principles to AI challenges.",
    status: "In Progress",
    gradient: "from-teal to-teal-light",
  },
  {
    icon: MessageSquare,
    title: "Conversation Guides",
    description: "Practical frameworks for pastors on job displacement, raising children in the AI age, and everyday ethical decisions.",
    status: "In Progress",
    gradient: "from-coral to-gold",
  },
  {
    icon: Trophy,
    title: "Student Essay Competition",
    description: "Annual competition where students use AI and submit their process—judged on both product and discernment.",
    status: "Coming Soon",
    gradient: "from-gold to-coral",
  },
  {
    icon: GraduationCap,
    title: "Educational Grants",
    description: "Research funding for students exploring AI, faith, and ethics.",
    status: "Coming Soon",
    gradient: "from-purple-500 to-teal",
  },
  {
    icon: Heart,
    title: "Pastoral Care Resources",
    description: "Training for ministering to families affected by technological unemployment.",
    status: "Coming Soon",
    gradient: "from-coral to-red-500",
  },
];

export default function WhatWereBuildingSection() {
  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-teal/10 to-teal-light/10 text-teal text-sm font-semibold mb-4">
              <Sparkles className="h-4 w-4" />
              Our Programs
            </span>
            <h2 className="font-sans text-3xl md:text-4xl font-bold text-charcoal">
              What We're Building
            </h2>
          </div>
          <Link href="/resources">
            <Button variant="outline" className="border-teal text-teal rounded-full group font-semibold">
              View All Resources
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, index) => (
            <div 
              key={index} 
              className="group relative p-6 rounded-2xl bg-cream border border-charcoal/10 hover:border-teal/30 hover:shadow-lg hover:shadow-teal/5 transition-all duration-300"
              data-testid={`card-building-${index}`}
            >
              <div className="flex items-start justify-between mb-5">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                  <item.icon className="h-6 w-6 text-cream" />
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  item.status === "In Progress" 
                    ? "bg-teal/10 text-teal" 
                    : "bg-charcoal/5 text-charcoal-muted"
                }`}>
                  {item.status}
                </span>
              </div>
              <h3 className="font-semibold text-lg text-charcoal mb-2 group-hover:text-teal transition-colors">
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
