import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NextGeneration() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main>
        <PageHero 
          title="Investing in the Next Generation" 
          subtitle="Central to how we operate"
        />

        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="max-w-3xl mx-auto">
              <p className="text-charcoal leading-relaxed text-lg mb-8">
                Investing in the next generation is not just part of The Klara Project's mission—it is 
                central to how we operate. Two generations will be most shaped by AI and robotics: 
                Generation Z (born 1997–2012) and Generation Alpha (born 2013–2025). We create resources 
                to serve them and their parents, and we build our organization by developing young 
                leaders from within.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-cream-dark py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="max-w-3xl mx-auto">
              <div className="w-16 h-1 bg-primary rounded-full mb-6"></div>
              <h2 className="font-serif text-3xl font-semibold text-charcoal mb-6">
                Generation Z
              </h2>
              <p className="text-charcoal leading-relaxed mb-4">
                Gen Z grew up with smartphones and social media—technologies that shaped them in both 
                challenging and positive ways. They are values-driven, digitally fluent, adaptable, and 
                pragmatic. They prioritize mental health and continuous learning, and they are looking 
                for purpose-driven institutions that align with their values.
              </p>
              <p className="text-charcoal leading-relaxed mb-4">
                Yet this generation also faces real struggles: rates of anxiety and depression have surged, 
                and many carry deep uncertainty about the future. They are entering the workforce at a 
                pivotal moment, as AI reshapes the economy in real time.
              </p>
              <p className="text-charcoal leading-relaxed font-medium">
                No generation will be more affected by the job disruptions ahead—but in a few years, 
                Gen Z will also receive the largest wealth transfer in history. They are not just the 
                people we serve; they are our future partners and donors.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="max-w-3xl mx-auto">
              <div className="w-16 h-1 bg-gold rounded-full mb-6"></div>
              <h2 className="font-serif text-3xl font-semibold text-charcoal mb-6">
                Generation Alpha
              </h2>
              <p className="text-charcoal leading-relaxed mb-4">
                Gen Alpha is the first generation that will never know a world without AI assistants—and 
                many will grow up or experience adolescence with robots in their homes. They bring real 
                strengths: deep digital fluency, comfort with visual and interactive learning, creativity 
                with technology, global awareness, and an early sense of agency and voice.
              </p>
              <p className="text-charcoal leading-relaxed mb-4">
                But they are also showing signs of real struggle: shortened attention spans, rising anxiety 
                even among young children, difficulty tolerating frustration, and loneliness despite constant 
                digital connection.
              </p>
              <p className="text-charcoal leading-relaxed mb-4">
                These patterns pose a particular challenge for the church. Scripture study requires patience 
                and concentration. The Bible calls believers to meditate on God's Word, to chew on it—but 
                when any question can be answered instantly and any text summarized by AI, the habits of 
                slow, deep reflection don't develop naturally.
              </p>
              <p className="text-charcoal leading-relaxed font-medium">
                Gen Alpha will need patient discipleship that helps them build capacities the digital world 
                doesn't cultivate. The decisions being made now about AI values and design will define the 
                world they inherit.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-primary py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <Card className="max-w-3xl mx-auto p-8 md:p-12 bg-cream">
              <div className="w-16 h-1 bg-coral rounded-full mb-6"></div>
              <h2 className="font-serif text-3xl font-semibold text-charcoal mb-6">
                How We Develop Young Leaders
              </h2>
              <p className="text-charcoal leading-relaxed mb-6">
                The church needs these voices, and The Klara Project is structured to develop them. 
                Hiring and mentoring young leaders is a pillar of our approach—not an afterthought.
              </p>
              <ul className="space-y-4 text-charcoal mb-8">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></span>
                  <span>Board representation from Gen Z</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></span>
                  <span>Internships and entry-level positions for emerging talent</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></span>
                  <span>Succession planning built into our structure from the start</span>
                </li>
              </ul>
              <p className="text-charcoal leading-relaxed font-medium text-lg">
                We don't just serve these generations; we platform and develop them.
              </p>
            </Card>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-10 text-center">
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-6">
              Ready to support the next generation?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/get-involved">
                <Button className="bg-primary text-cream rounded-full group font-semibold" data-testid="button-get-involved">
                  Get Involved
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/donate">
                <Button variant="outline" className="rounded-full font-semibold" data-testid="button-donate">
                  Make a Donation
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
