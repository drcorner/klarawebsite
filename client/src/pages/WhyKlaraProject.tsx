import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Building2, Users, BookOpen, TrendingUp, Download, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import churchImage from "@assets/generated_images/church_small_group_bible_study.png";

const approachItems = [
  { icon: Building2, title: "Infrastructure first", description: "Legal formation, website, donor systems before programming." },
  { icon: Users, title: "Intergenerational Leadership", description: "Build a team that can unite churches and donors across generational divides." },
  { icon: BookOpen, title: "Exceptional content", description: "Video curricula developed by professionals." },
  { icon: TrendingUp, title: "Phased complexity", description: "Advanced initiatives only after establishing credibility and expertise." },
];

export default function WhyKlaraProject() {
  const [, setLocation] = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("White paper download:", email);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main>
        <PageHero 
          title="Why Klara Project?" 
          subtitle="Filling a gap no one else is filling"
          variant="image"
          imageSrc={churchImage}
        />

        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-serif text-3xl font-semibold text-charcoal mb-6">
                What Makes Us Different
              </h2>
              <p className="text-charcoal leading-relaxed mb-4">
                Other faith-based organizations address technology ethics at the policy or academic level. 
                The Ethics and Religious Liberty Commission, the Center for Public Justice, various Catholic 
                initiatives—we welcome their work. But Klara Project fills a different gap.
              </p>
              <p className="text-charcoal leading-relaxed mb-4">
                We focus on <strong>practical equipping for local churches</strong> while building toward 
                credible engagement with the technology industry. We create the Sunday school curricula, 
                pastoral frameworks, and conversation guides that ordinary congregations need right now.
              </p>
              <p className="text-charcoal leading-relaxed">
                We position Christians as constructive partners—not just critics—in technology development. 
                We believe influence must be earned through demonstrated expertise and genuine service. 
                That's why we start with equipping and build toward engagement.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-cream-dark py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-8 bg-card border-l-4 border-l-primary">
                <h3 className="font-serif text-2xl font-semibold text-charcoal mb-4">Our Mission</h3>
                <ul className="space-y-3 text-charcoal">
                  <li><strong>Equip</strong> churches and Christians with practical resources for the AI age.</li>
                  <li><strong>Engage</strong> the broader culture to ensure Christian perspectives shape technology development.</li>
                </ul>
              </Card>
              <Card className="p-8 bg-card border-l-4 border-l-gold">
                <h3 className="font-serif text-2xl font-semibold text-charcoal mb-4">Our Vision</h3>
                <p className="text-charcoal leading-relaxed">
                  A future where Christians have both a voice and real choices in the development of 
                  artificial intelligence and robotics—technologies that will define not just our 
                  children's future, but our present reality.
                </p>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
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
                can reason and create, what does make humans unique?
              </p>
              <p className="text-charcoal leading-relaxed mb-4">
                The Christian answer has never been intellect alone. We are embodied souls, created 
                for communion with God and one another. We bear moral responsibility. We are capable 
                of love—not as a computation, but as a choice to give ourselves for another's good. 
                We worship. We hope. We were made to know and be known.
              </p>
              <p className="text-charcoal leading-relaxed font-medium">
                We bring two thousand years of reflection on moral decision-making, the limits of 
                human power, and the nature of genuine relationship. These insights deserve a seat 
                at the table where AI's future is being decided.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-cream-dark py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <h2 className="font-serif text-3xl font-semibold text-charcoal text-center mb-12">
              Our Measured Approach
            </h2>
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

        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-serif text-3xl font-semibold text-charcoal mb-6">
                Investing in the Next Generation
              </h2>
              <p className="text-charcoal leading-relaxed mb-4">
                Investing in the next generation is not just part of The Klara Project's mission—it is 
                central to how we operate. Two generations will be most shaped by AI and robotics: 
                Generation Z and Generation Alpha. We create resources to serve them and their parents, 
                and we build our organization by developing young leaders from within.
              </p>
              <Button 
                variant="outline" 
                className="rounded-full group font-semibold"
                onClick={() => { window.scrollTo(0, 0); setLocation("/next-generation"); }}
                data-testid="button-learn-next-gen"
              >
                Learn More About Our Commitment
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </section>

        <section className="bg-cream-dark py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-serif text-3xl font-semibold text-charcoal mb-4">
                Advisory Board
              </h2>
              <p className="text-charcoal-muted">
                Coming Soon — We are assembling an advisory board with expertise in AI, theology, 
                social enterprise, and education. Announcement forthcoming.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
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
                  We welcome Christians from all traditions who share these convictions and this mission.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-primary py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <Card className="max-w-2xl mx-auto p-8 bg-cream text-center">
              <h3 className="font-serif text-2xl font-semibold text-charcoal mb-4">
                Founding White Paper
              </h3>
              <p className="text-charcoal-muted mb-6">
                A full analysis of the challenges Christians face in AI and robotics development, 
                and our vision for addressing them.
              </p>
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="bg-primary text-cream"
                data-testid="button-download-whitepaper"
              >
                <Download className="w-4 h-4 mr-2" />
                Download White Paper (PDF)
              </Button>
            </Card>
          </div>
        </section>
      </main>
      <Footer />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Founding White Paper</DialogTitle>
            <DialogDescription>
              Enter your email to download the white paper and receive occasional updates.
            </DialogDescription>
          </DialogHeader>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  placeholder="you@example.com"
                  data-testid="input-modal-email"
                />
              </div>
              <Button type="submit" className="w-full bg-primary text-cream" data-testid="button-modal-download">
                Download White Paper
              </Button>
            </form>
          ) : (
            <div className="text-center py-6">
              <Download className="h-8 w-8 text-primary mx-auto mb-4" />
              <p className="text-charcoal">Thank you! Your download will begin shortly.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
