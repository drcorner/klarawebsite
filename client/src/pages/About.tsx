import { Link } from "wouter";
import { Building2, Users, BookOpen, TrendingUp, Download, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import churchImage from "@assets/generated_images/church_small_group_bible_study.png";

const approachItems = [
  { icon: Building2, title: "Infrastructure first", description: "Build the foundation first—legal structure, digital presence, and sustainable funding—before launching programs." },
  { icon: Users, title: "Intergenerational leadership", description: "Assemble leadership that bridges generational divides, combining seasoned wisdom with emerging voices." },
  { icon: BookOpen, title: "Exceptional content", description: "Produce video curricula with professional polish and theological depth." },
  { icon: TrendingUp, title: "Phased complexity", description: "Pursue advanced initiatives only after earning credibility through proven results." },
];

export default function About() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main>
        <PageHero
          title="About"
          subtitle="Filling a gap no one else is filling"
          variant="image"
          imageSrc={churchImage}
        />

        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-serif text-3xl font-semibold text-charcoal mb-6">
                Klara's Contribution
              </h2>
              <p className="text-charcoal leading-relaxed mb-4">
                Most faith-based technology initiatives focus on policy advocacy or academic research—important
                work, but far from the average church member's Sunday morning.
              </p>
              <p className="text-charcoal leading-relaxed mb-4">
                Klara Project starts where churches actually live. We create the Sunday school curricula,
                pastoral frameworks, and conversation guides that ordinary congregations need <em>right now</em>—then
                build toward credible engagement with the technology industry.
              </p>
              <p className="text-charcoal leading-relaxed">
                We position Christians as constructive partners, not just critics. Influence must be earned
                through demonstrated expertise and genuine service. That's why we equip first and engage second.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-cream-dark py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-8 bg-card border-l-4 border-l-primary">
                <h3 className="font-serif text-2xl font-semibold text-charcoal mb-4">Our Mission</h3>
                <ul className="space-y-3 text-charcoal">
                  <li><strong>Equip</strong> churches with practical resources for the AI age.</li>
                  <li><strong>Engage</strong> culture to ensure Christian perspectives shape technology.</li>
                  <li><strong>Empower</strong> the next generation to lead with wisdom and faith.</li>
                </ul>
              </Card>
              <Card className="p-8 bg-card border-l-4 border-l-gold">
                <h3 className="font-serif text-2xl font-semibold text-charcoal mb-4">Our Vision</h3>
                <p className="text-charcoal leading-relaxed">
                  A future where Christians have both a voice and real choices in AI and robotics
                  development—technologies shaping not just our children's world, but ours today.
                </p>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-10 md:py-14">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <Card className="max-w-2xl mx-auto p-8 bg-primary/5 border-primary/20 text-center">
              <h3 className="font-serif text-2xl font-semibold text-charcoal mb-4">
                Want to go deeper?
              </h3>
              <p className="text-charcoal-muted mb-6">
                Our founding white paper offers a fuller analysis of the challenges Christians
                face in AI development—and a detailed roadmap for meaningful engagement.
              </p>
              <a
                href="/klara-project-white-paper.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                <Button
                  className="bg-primary text-cream"
                  data-testid="button-download-whitepaper"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download White Paper (PDF)
                </Button>
              </a>
            </Card>
          </div>
        </section>

        <section className="bg-cream-dark py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-serif text-3xl font-semibold text-charcoal mb-6">
                What Christians Bring
              </h2>
              <p className="text-charcoal leading-relaxed mb-4">
                Why should technology companies and policymakers listen to Christians? Because the 
                Christian tradition offers intellectual resources that secular AI ethics lacks.
              </p>
              <p className="text-charcoal leading-relaxed mb-4">
                The doctrine of <em>imago Dei</em>—that humans are made in God's image—grounds human
                dignity in something transcendent, not merely cognitive capability. But if machines
                can reason and create, what <em>still</em> makes humans unique?
              </p>
              <p className="text-charcoal leading-relaxed mb-4">
                The Christian answer has never been intellect alone. We are embodied souls, created
                for communion with God and one another. We bear moral responsibility. We are capable
                of love—not as a computation, but as a choice to give ourselves for another's good.
                We worship. We hope. We were made to know and be known.
              </p>
              <p className="text-charcoal leading-relaxed mb-4">
                We understand that relationship existed in the Godhead before time—that humans were
                created for genuine communion, not mere connection. This gives us a framework for
                helping people navigate emotional bonds with AI systems: not with fear or condemnation,
                but with clarity about what genuine relationship requires and what it offers that
                simulation cannot.
              </p>
              <p className="text-charcoal leading-relaxed font-medium">
                We bring two thousand years of reflection on moral decision-making, the limits of
                human power, and the nature of genuine relationship. These insights don't just
                deserve a seat at the table—they're essential to getting AI right.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-cream-dark py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <h2 className="font-serif text-3xl font-semibold text-charcoal text-center mb-12">
              The Klara Project
            </h2>
            <p className="text-charcoal text-center mb-10 max-w-2xl mx-auto">
              Our name comes from the German word for "clear"—reflecting our commitment to bring clarity and thoughtful direction in an age of rapid technological change.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {approachItems.map((item, index) => (
                <Card key={index} className="p-6 bg-card border-card-border">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-charcoal mb-2">{item.title}</h3>
                  <p className="text-charcoal-muted text-sm">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-serif text-3xl font-semibold text-charcoal mb-6">
                Investing in the Next Generation
              </h2>
              <p className="text-charcoal leading-relaxed mb-4">
                Investing in the next generation isn't just part of our mission—it's how we operate.
                Gen Z and Gen Alpha will be most shaped by AI and robotics. We create resources to
                serve them and their parents, and we develop young leaders from within our own organization.
              </p>
              <Link href="/next-generation">
                <Button 
                  variant="outline" 
                  className="rounded-full group font-semibold"
                  data-testid="button-learn-next-gen"
                >
                  Learn More About Our Commitment
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-serif text-3xl font-semibold text-charcoal mb-6">
                Statement of Faith
              </h2>
              <div className="space-y-4 text-charcoal leading-relaxed">
                <p>
                  We affirm the historic Christian faith as expressed in the Nicene Creed—belief in
                  one God, Father, Son, and Holy Spirit; in Jesus Christ as Lord and Savior; in the
                  Holy Spirit who gives life to the Church; and in the hope of resurrection.
                </p>
                <p>
                  We believe that all people are created in the image of God (<em>imago Dei</em>),
                  possessing inherent dignity and worth that no technology can replicate or replace.
                </p>
                <p>
                  We believe the Scriptures call Christians to be salt and light in the world—engaging
                  culture, including technology, with wisdom, discernment, and love.
                </p>
                <p className="font-medium">
                  Whether you're Catholic, Orthodox, Protestant, or simply exploring—if you share
                  these convictions and this mission, you're welcome here.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-primary py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-10 text-center">
            <h2 className="font-serif text-2xl font-semibold text-cream mb-6">
              Ready to get involved?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/get-involved">
                <Button
                  variant="outline"
                  className="bg-transparent border-cream text-cream hover:bg-cream hover:text-primary rounded-full group font-semibold px-8"
                  data-testid="button-cta-get-involved"
                >
                  Get Involved
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/donate">
                <Button
                  className="bg-cream text-primary hover:bg-cream/90 rounded-full font-semibold px-8"
                  data-testid="button-cta-donate"
                >
                  Donate
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
