import { useState } from "react";
import { ChevronLeft, ChevronRight, User, Briefcase, Heart, MessageCircle, GraduationCap, Users, Code, Church } from "lucide-react";
import { Button } from "@/components/ui/button";

const challenges = [
  {
    icon: GraduationCap,
    category: "Parenting",
    story: "A father learns his teenage son has been using AI to complete school assignments. Is this cheating—or just using a new tool? He wants his son to develop his own thinking, but he also uses AI at work. Where's the line?",
    color: "bg-teal-light/10 text-teal",
  },
  {
    icon: Heart,
    category: "Relationships",
    story: "A wife shares that she's been processing her marriage problems with an AI chatbot rather than the church counselor. Her pastor wonders what she'll find in a chatbot that only knows what you tell it.",
    color: "bg-coral/10 text-coral",
  },
  {
    icon: Briefcase,
    category: "Employment",
    story: "A skilled bookkeeper was let go when her firm adopted AI software and isn't sure her skills will ever be marketable again.",
    color: "bg-gold/10 text-gold-dark",
  },
  {
    icon: User,
    category: "Youth",
    story: "A 13-year-old girl, already anxious about the future, hears a woman she admires at church say, \"I'm glad I won't be around to see it.\" She wonders if it would be better not to be around.",
    color: "bg-red-100 text-red-600",
  },
  {
    icon: MessageCircle,
    category: "Dating",
    story: "A college student admits he finds it easier to talk to AI than to date. He's not sure he sees the point of the awkwardness when a chatbot is always available and never disappoints.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Users,
    category: "Belonging",
    story: "A retired elder who once led the finance committee now can't follow conversations about AI. He feels invisible in a church that used to need him.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Code,
    category: "Ethics",
    story: "A software engineer is building AI systems at work. She's proud of what she's creating—but lately wonders if she should be. She doesn't know how to think Christianly about it, and no one at church has asked.",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Church,
    category: "Ministry",
    story: "A pastor uses AI to draft his sermons, saying it frees him for counseling and hospital visits. But part of him misses the wrestling he used to do alone with the text.",
    color: "bg-teal/10 text-teal",
  },
];

export default function ChallengeSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCards = 3;
  const maxIndex = Math.max(0, challenges.length - visibleCards);

  const next = () => setCurrentIndex(i => Math.min(i + 1, maxIndex));
  const prev = () => setCurrentIndex(i => Math.max(i - 1, 0));

  return (
    <section id="challenge-section" className="bg-gradient-to-b from-cream to-cream-dark py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-coral/10 text-coral text-sm font-semibold mb-4">
            The Challenge
          </span>
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-charcoal mb-4">
            These are real situations
          </h2>
          <p className="text-charcoal-muted max-w-2xl mx-auto">
            Faithful Christians are already facing questions no one taught them to answer.
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:flex items-center gap-2 absolute -top-16 right-0">
            <Button 
              size="icon" 
              variant="outline" 
              onClick={prev}
              disabled={currentIndex === 0}
              className="rounded-full border-charcoal/20"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant="outline" 
              onClick={next}
              disabled={currentIndex >= maxIndex}
              className="rounded-full border-charcoal/20"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="overflow-hidden">
            <div 
              className="flex gap-4 transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * (100 / visibleCards + 1.5)}%)` }}
            >
              {challenges.map((item, index) => (
                <div 
                  key={index}
                  className="flex-shrink-0 w-full md:w-[calc(33.333%-12px)] p-6 rounded-2xl bg-cream border border-border/50 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-semibold text-charcoal-muted uppercase tracking-wide">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-charcoal leading-relaxed">
                    {item.story}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-8 md:hidden">
            {challenges.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentIndex === index ? "bg-teal" : "bg-charcoal/20"
                }`}
              />
            ))}
          </div>
        </div>

        <blockquote className="mt-16 max-w-2xl mx-auto text-center">
          <p className="font-serif text-2xl md:text-3xl text-charcoal italic leading-relaxed">
            "My people are destroyed for lack of knowledge."
          </p>
          <cite className="mt-4 block text-charcoal-muted not-italic font-medium">
            —Hosea 4:6
          </cite>
        </blockquote>
      </div>
    </section>
  );
}
