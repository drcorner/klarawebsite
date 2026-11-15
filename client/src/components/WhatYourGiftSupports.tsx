import { Video, GraduationCap, Heart, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";

const items = [
  {
    icon: Video,
    title: "Curriculum development",
    description: "Video-based resources that help churches think clearly about AI.",
  },
  {
    icon: GraduationCap,
    title: "Educational grants",
    description: "Funding for students exploring AI, faith, and ethics.",
  },
  {
    icon: Heart,
    title: "Pastoral resources",
    description: "Training for ministering to families facing technological unemployment.",
  },
  {
    icon: Lightbulb,
    title: "Public engagement",
    description: "Research and outreach that earn Christians credibility with the technology industry.",
  },
];

export default function WhatYourGiftSupports() {
  return (
    <section className="py-12">
      <h2 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal mb-8 text-center">
        What your gift supports
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, index) => (
          <Card key={index} className="p-6 bg-card border-card-border text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <item.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-charcoal mb-2">{item.title}</h3>
            <p className="text-charcoal-muted text-sm">{item.description}</p>
          </Card>
        ))}
      </div>

      <blockquote className="mt-12 text-center">
        <p className="font-serif text-xl md:text-2xl text-gold italic leading-relaxed">
          "And let us consider how to stir up one another to love and good works."
        </p>
        <cite className="mt-3 block text-charcoal-muted not-italic">
          Hebrews 10:24
        </cite>
      </blockquote>
    </section>
  );
}
