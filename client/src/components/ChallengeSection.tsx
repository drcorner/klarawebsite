const challenges = [
  {
    category: "Ministry",
    story: "A pastor uses AI to draft his sermons, saying it frees him for counseling and hospital visits. But part of him misses the wrestling he used to do alone with the text.",
  },
  {
    category: "Parenting",
    story: "A father learns his teenage son has been using AI to complete school assignments. Is this cheating—or just using a new tool? He wants his son to develop his own thinking, but he also uses AI at work. Where's the line?",
  },
  {
    category: "AI Advice",
    story: "A husband shares that he's been processing his marriage problems with an AI chatbot rather than the church counselor. His pastor wonders what marital counsel he'll get from a chatbot that only knows what you tell it.",
  },
  {
    category: "Employment",
    story: "A skilled bookkeeper was let go when her firm adopted AI software and isn't sure her skills will ever be marketable again.",
  },
  {
    category: "Youth",
    story: "A 13-year-old girl, already anxious about the future, hears a woman she admires at church say about AI superintelligence, \"I'm glad I won't be around to see it.\" The girl wonders if she'd be better off dead too.",
  },
  {
    category: "AI Relationships",
    story: "A college student admits he finds it easier to talk to an AI girlfriend than to date. He wants a real girlfriend, but it's awkward and the Christian women he meets aren't interested in him.",
  },
  {
    category: "Ethics",
    story: "A software engineer is building AI systems at work. She's proud of what she's creating—but lately wonders if she should be. She doesn't know how to think Christianly about it, and no one at church has asked.",
  },
];

const getCardColors = (index: number) => {
  const isEven = index % 2 === 0;
  return {
    accentColor: isEven ? "text-primary" : "text-gold-dark",
    bgColor: isEven ? "bg-primary/5" : "bg-gold/5",
  };
};

export default function ChallengeSection() {
  return (
    <section id="challenge-section" className="bg-gradient-to-b from-cream to-cream-dark py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-coral/10 text-coral text-sm font-semibold mb-4">
            The Challenge
          </span>
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-charcoal">
            Faithful Christians face challenges in the age of AI
          </h2>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <p className="text-charcoal text-lg leading-relaxed mb-4">
            AI is transforming how we work, learn, and live—faster than anyone predicted. Families wrestle with AI's influence on their children. Christians form emotional bonds with AI systems that simulate companionship. Deepfakes erode trust in truth itself. Churches will soon face waves of members navigating technological unemployment—with young adults entering the workforce and family life amid unprecedented uncertainty.
          </p>
          <p className="text-charcoal text-lg leading-relaxed">
            Yet many Christians—though grounded in Scripture—feel unprepared to apply biblical principles to challenges this new, and Christian voices are absent from the rooms where AI's future is being decided.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {challenges.map((item, index) => {
            const colors = getCardColors(index);
            return (
              <div 
                key={index}
                className={`p-5 rounded-2xl ${colors.bgColor} border border-charcoal/5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300`}
              >
                <span className={`text-xs font-semibold ${colors.accentColor} uppercase tracking-wide mb-3 block`}>
                  {item.category}
                </span>
                <p className="text-charcoal text-sm leading-relaxed">
                  {item.story}
                </p>
              </div>
            );
          })}
        </div>

        <blockquote className="mt-16 max-w-3xl mx-auto text-center">
          <p className="font-serif text-xl md:text-2xl text-charcoal italic leading-relaxed">
            "See to it that no one takes you captive by philosophy and empty deceit, according to human tradition, according to the elemental spirits of the world, and not according to Christ."
          </p>
          <cite className="mt-4 block text-charcoal-muted not-italic font-medium">
            —Colossians 2:8
          </cite>
        </blockquote>
      </div>
    </section>
  );
}
