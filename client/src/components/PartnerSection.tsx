import { useState } from "react";
import { Link } from "wouter";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PartnerSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("White paper download requested:", { email, firstName });
    setSubmitted(true);
  };

  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-charcoal mb-8">
            Partner With Us
          </h2>
          
          <p className="text-charcoal leading-relaxed text-lg mb-8">
            The window for Christian influence is narrow but real. Major AI companies are making 
            decisions now that will affect generations. Churches need resources now—not after 
            the crisis arrives.
          </p>

          <blockquote className="my-10 py-6 border-y border-border">
            <p className="font-serif text-xl md:text-2xl text-gold italic leading-relaxed">
              "And let us consider how to stir up one another to love and good works."
            </p>
            <cite className="mt-3 block text-charcoal-muted not-italic">
              —Hebrews 10:24
            </cite>
          </blockquote>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/donate">
              <Button 
                size="lg" 
                className="bg-teal text-cream font-semibold"
                data-testid="button-partner-donate"
              >
                Support Our Mission
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setIsModalOpen(true)}
              className="border-teal text-teal font-semibold"
              data-testid="button-partner-whitepaper"
            >
              <Download className="mr-2 h-4 w-4" />
              Read the White Paper
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Founding White Paper</DialogTitle>
            <DialogDescription>
              A full analysis of AI's impact on churches and families, the Christian intellectual 
              tradition's relevance to technology ethics, and our vision for equipping and engaging.
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
                  data-testid="input-whitepaper-email"
                />
              </div>
              <div>
                <Label htmlFor="firstName">First Name (optional)</Label>
                <Input 
                  id="firstName"
                  type="text" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Your first name"
                  data-testid="input-whitepaper-name"
                />
              </div>
              <p className="text-sm text-charcoal-muted">
                We'll send you the white paper and occasional updates on Klara Project's work. 
                You can unsubscribe at any time.
              </p>
              <Button 
                type="submit" 
                className="w-full bg-teal text-cream font-semibold"
                data-testid="button-whitepaper-submit"
              >
                Download White Paper
              </Button>
            </form>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-teal" />
              </div>
              <p className="text-charcoal font-medium mb-2">Thank you!</p>
              <p className="text-charcoal-muted text-sm">
                Your download will begin shortly. Check your email for the full white paper.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
