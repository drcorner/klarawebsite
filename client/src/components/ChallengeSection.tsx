import { Church, Briefcase, Heart, Bot, Baby, User, Code } from "lucide-react";

const challenges = [
  {
    icon: Church,
    category: "Ministry",
    story: "A pastor uses AI to draft his sermons, saying it frees him for counseling and hospital visits. But part of him misses the wrestling he used to do alone with the text.",
    color: "bg-teal/10 text-teal",
  },
  {
    icon: Baby,
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
    icon: Bot,
    category: "AI Relationships",
    story: "A college student admits he finds it easier to talk to an AI girlfriend than to date. He wants a real girlfriend, but it's awkward and the Christian women he meets aren't interested in him.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Code,
    category: "Ethics",
    story: "A software engineer is building AI systems at work. She's proud of what she's creating—but lately wonders if she should be. She doesn't know how to think Christianly about it, and no one at church has asked.",
    color: "bg-green-100 text-green-600",
  },
];

export default function ChallengeSection() {
  return (
    <section id="challenge-section" className="bg-gradient-to-b from-cream to-cream-dark py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-coral/10 text-coral text-sm font-semibold mb-4">
            The Challenge
          </span>
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-charcoal">
            New challenges in the Age of AI
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {challenges.map((item, index) => (
            <div 
              key={index}
              className={`p-5 rounded-2xl bg-cream border border-charcoal/5 shadow-sm hover:shadow-md hover:border-teal/20 transition-all duration-300 ${index === 6 ? 'lg:col-start-2' : ''}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-xl ${item.color} flex items-center justify-center`}>
                  <item.icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-charcoal-muted uppercase tracking-wide">
                  {item.category}
                </span>
              </div>
              <p className="text-charcoal text-sm leading-relaxed">
                {item.story}
              </p>
            </div>
          ))}
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
