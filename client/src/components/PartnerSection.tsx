import { useState } from "react";
import { Link } from "wouter";
import { Download, ArrowRight, Heart } from "lucide-react";
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
    <section className="relative bg-teal py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-teal via-teal to-teal-dark opacity-90" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-cream/5 to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cream/10 mb-6">
            <Heart className="h-7 w-7 text-cream" />
          </div>
          
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-cream mb-6">
            Partner With Us
          </h2>
          
          <p className="text-cream/80 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            The window for Christian influence is narrow but real. Major AI companies are making 
            decisions now that will affect generations. Churches need resources now—not after 
            the crisis arrives.
          </p>

          <blockquote className="my-10 py-6 border-y border-cream/20">
            <p className="font-serif text-xl md:text-2xl text-gold italic leading-relaxed">
              "And let us consider how to stir up one another to love and good works."
            </p>
            <cite className="mt-3 block text-cream/60 not-italic">
              —Hebrews 10:24
            </cite>
          </blockquote>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/donate">
              <Button 
                size="lg" 
                className="bg-cream text-teal hover:bg-cream/90 font-medium rounded-full group"
                data-testid="button-partner-donate"
              >
                Support Our Mission
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setIsModalOpen(true)}
              className="border-cream/30 text-cream bg-cream/5 hover:bg-cream/10 font-medium rounded-full"
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
                  className="rounded-lg"
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
                  className="rounded-lg"
                  data-testid="input-whitepaper-name"
                />
              </div>
              <p className="text-sm text-charcoal-muted">
                We'll send you the white paper and occasional updates on Klara Project's work. 
                You can unsubscribe at any time.
              </p>
              <Button 
                type="submit" 
                className="w-full bg-teal text-cream font-medium rounded-full"
                data-testid="button-whitepaper-submit"
              >
                Download White Paper
              </Button>
            </form>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
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
