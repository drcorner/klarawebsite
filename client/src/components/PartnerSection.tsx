import { useState } from "react";
import { Link } from "wouter";
import { Download, ArrowRight, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PartnerSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Track white paper download in HubSpot
    try {
      await fetch("/api/whitepaper/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch (error) {
      console.error("White paper tracking error:", error);
    }
    
    setSubmitted(true);
  };

  return (
    <section className="relative bg-gradient-to-br from-charcoal via-charcoal to-primary/80 py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(20,184,166,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(249,115,22,0.1),transparent_50%)]" />
      
      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 mb-8 shadow-lg shadow-primary/25">
            <Rocket className="h-8 w-8 text-cream" />
          </div>
          
          <h2 className="font-sans text-3xl md:text-5xl font-bold text-cream mb-6">
            Partner With Us
          </h2>
          
          <p className="text-cream/75 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            The window for Christian influence is narrow but real. Major AI companies are making 
            decisions now that will affect generations. Churches need resources now—not after 
            the crisis arrives.
          </p>

          <blockquote className="my-12 py-8 border-y border-cream/10">
            <p className="font-serif text-xl md:text-2xl text-gold italic leading-relaxed">
              "And let us consider how to stir up one another to love and good works."
            </p>
            <cite className="mt-4 block text-cream/50 not-italic font-medium">
              —Hebrews 10:24
            </cite>
          </blockquote>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/donate">
              <Button 
                size="lg" 
                className="bg-cream text-charcoal hover:bg-cream/90 font-semibold rounded-full group shadow-lg"
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
              className="border-cream/30 text-cream bg-cream/5 hover:bg-cream/10 font-semibold rounded-full"
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
            <DialogTitle className="font-sans text-2xl font-bold">Founding White Paper</DialogTitle>
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
                  className="rounded-xl"
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
                  className="rounded-xl"
                  data-testid="input-whitepaper-name"
                />
              </div>
              <p className="text-sm text-charcoal-muted">
                We'll send you the white paper and occasional updates on Klara Project's work. 
                You can unsubscribe at any time.
              </p>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-primary/80 text-cream font-semibold rounded-full"
                data-testid="button-whitepaper-submit"
              >
                Download White Paper
              </Button>
            </form>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-cream" />
              </div>
              <p className="text-charcoal font-semibold mb-2">Thank you!</p>
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
