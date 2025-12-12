import { Video, MessageSquare, Trophy, GraduationCap, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";

const items = [
  {
    icon: Video,
    title: "Video-Based Curriculum",
    description: "A 13-week series for small groups, Sunday school, or workshops—helping Christians apply biblical principles to AI challenges.",
  },
  {
    icon: MessageSquare,
    title: "Conversation Guides",
    description: "Practical frameworks for pastors on job displacement, raising children in the AI age, and everyday ethical decisions.",
  },
  {
    icon: Trophy,
    title: "Student Essay Competition",
    description: "Annual competition where students use AI and submit their process—judged on both product and discernment.",
  },
  {
    icon: GraduationCap,
    title: "Educational Grants",
    description: "Research funding for students exploring AI, faith, and ethics.",
  },
  {
    icon: Heart,
    title: "Pastoral Care Resources",
    description: "Training for ministering to families affected by technological unemployment.",
  },
];

export default function WhatWereBuildingSection() {
  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-charcoal text-center mb-4">
          What We're Building
        </h2>
        <p className="text-charcoal-muted text-center max-w-2xl mx-auto mb-12">
          Practical resources for churches and Christians navigating the AI age.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <Card 
              key={index} 
              className="p-6 bg-card border-card-border"
              data-testid={`card-building-${index}`}
            >
              <div className="w-12 h-12 rounded-lg bg-teal/10 flex items-center justify-center mb-4">
                <item.icon className="h-6 w-6 text-teal" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-charcoal mb-2">
                {item.title}
              </h3>
              <p className="text-charcoal-muted leading-relaxed">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
