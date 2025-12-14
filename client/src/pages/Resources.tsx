import { useState } from "react";
import { Church, Users, Laptop, Download } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ResourceCard from "@/components/ResourceCard";
import AudienceCard from "@/components/AudienceCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const audienceCards = [
  {
    icon: Church,
    title: "For Churches",
    description: "Resources for pastors and church leaders to help congregations navigate technological change and prepare for members facing job displacement.",
  },
  {
    icon: Users,
    title: "For Families",
    description: "Practical guidance for parents making decisions about AI tools, educational technology, and home robotics.",
  },
  {
    icon: Laptop,
    title: "For Technologists",
    description: "Frameworks for Christians working in tech who want to think carefully about their work's ethical implications.",
  },
];

export default function Resources() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleDownload = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Download requested:", email);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main>
        <PageHero 
          title="Resources" 
          subtitle="Practical tools for churches and Christians"
        />

        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <h2 className="font-serif text-3xl font-semibold text-charcoal mb-8">
              Now Available
            </h2>
            <ResourceCard
              title="Founding White Paper"
              description="A full analysis of AI's impact on churches and families, the Christian intellectual tradition's relevance to technology ethics, and our vision for equipping and engaging."
              status="available"
              onDownload={handleDownload}
            />
          </div>
        </section>

        <section className="bg-cream-dark py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <h2 className="font-serif text-3xl font-semibold text-charcoal mb-2">
              In Progress—With Your Help
            </h2>
            <p className="text-charcoal-muted mb-8">
              We're building these resources now. Your support accelerates this work.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <ResourceCard
                title="Video-Based Curriculum"
                description="A 13-week series designed for small groups, Sunday school classes, or weekend workshops. Video segments introduce key concepts; discussion guides help participants apply biblical principles to AI challenges affecting their families and workplaces."
                status="in-progress"
                onLearnMore={() => console.log("Learn more about curriculum")}
              />
              <ResourceCard
                title="Conversation Guides"
                description="Practical frameworks for church leaders to facilitate discussions about AI in your congregation: 'When AI Takes Jobs,' 'Raising Children in the Age of AI,' 'Christian Ethics for Everyday AI Decisions,' and 'Relationships in an AI World.'"
                status="in-progress"
                onLearnMore={() => console.log("Learn more about guides")}
              />
            </div>

            <NewsletterSignup variant="card" />
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <h2 className="font-serif text-3xl font-semibold text-charcoal mb-2">
              Coming as We Grow
            </h2>
            <p className="text-charcoal-muted mb-8">
              These programs launch as funding allows. Founding gifts make them possible sooner.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResourceCard
                title="Student Essay Competition"
                description="An annual competition inviting students from Christian colleges to write original essays on what the church needs in the age of AI. Students must use AI in their writing process and submit their complete AI conversations—judged on both product and discernment."
                status="coming-soon"
              />
              <ResourceCard
                title="Educational Grants"
                description="Small research grants for undergraduate and graduate students exploring questions at the intersection of AI, faith, and ethics. These grants cultivate the next generation of Christian voices in technology while producing scholarship that benefits the broader community."
                status="coming-soon"
              />
            </div>
          </div>
        </section>

        <section className="bg-cream-dark py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <h2 className="font-serif text-3xl font-semibold text-charcoal text-center mb-4">
              Resources by Audience
            </h2>
            <p className="text-charcoal-muted text-center mb-12">
              We're building this library as we grow.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {audienceCards.map((card, index) => (
                <AudienceCard key={index} {...card} />
              ))}
            </div>

            <div className="text-center">
              <NewsletterSignup className="max-w-md mx-auto" />
              <p className="text-charcoal-muted text-sm mt-4">
                Stay informed as new resources launch
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Download White Paper</DialogTitle>
            <DialogDescription>
              Enter your email to receive the founding white paper.
            </DialogDescription>
          </DialogHeader>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="download-email">Email *</Label>
                <Input 
                  id="download-email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  placeholder="you@example.com"
                  data-testid="input-download-email"
                />
              </div>
              <Button type="submit" className="w-full bg-primary text-cream" data-testid="button-confirm-download">
                <Download className="w-4 h-4 mr-2" />
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
