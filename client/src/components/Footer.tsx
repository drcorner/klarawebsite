import { useState } from "react";
import { Link } from "wouter";
import { Mail, ArrowRight, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "./Logo";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Why Klara Project?", href: "/why-klara-project" },
  { label: "Resources", href: "/resources" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "Donate", href: "/donate" },
  { label: "Manage Donation", href: "/manage-donation" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async () => {
    if (!email || isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        setIsSubscribed(true);
        setEmail("");
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-charcoal text-cream">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2">
            <Logo variant="light" />
            <p className="mt-4 text-cream/60 text-sm leading-relaxed max-w-md">
              Equipping churches with practical resources. Engaging the culture to ensure 
              Christian perspectives shape technology development.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-cream mb-4 text-sm uppercase tracking-wide">Navigation</h4>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span 
                    className="text-cream/60 hover:text-primary transition-colors text-sm"
                    data-testid={`footer-nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="font-semibold text-cream mb-4 text-sm uppercase tracking-wide">Stay Informed</h4>
            <p className="text-cream/60 text-sm mb-4">
              Get updates on resources and opportunities.
            </p>
            {isSubscribed ? (
              <div className="flex items-center gap-2 text-primary text-sm">
                <Check className="h-4 w-4" />
                Thanks for subscribing!
              </div>
            ) : (
              <div className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                  className="bg-cream/10 border-cream/20 text-cream placeholder:text-cream/40 rounded-full text-sm"
                  data-testid="input-footer-email"
                />
                <Button 
                  size="icon" 
                  className="bg-primary text-cream shrink-0 rounded-full" 
                  onClick={handleSubscribe}
                  disabled={isLoading || !email}
                  data-testid="button-footer-subscribe"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                </Button>
              </div>
            )}
            <div className="mt-6">
              <h4 className="font-semibold text-cream mb-2 text-sm uppercase tracking-wide">Contact</h4>
              <a 
                href="mailto:info@klaraproject.org" 
                className="text-primary hover:text-primary/80 transition-colors text-sm inline-flex items-center gap-1"
                data-testid="link-contact-email"
              >
                <Mail className="h-4 w-4" />
                info@klaraproject.org
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-cream/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-cream/40 text-sm text-center md:text-left">
            © 2025 Klara Project. All rights reserved.
            <span className="hidden md:inline"> · </span>
            <br className="md:hidden" />
            Operating Christians for Responsible AI and Robotics.
          </p>
          <nav className="flex gap-4">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span 
                  className="text-cream/40 hover:text-cream transition-colors text-sm"
                  data-testid={`footer-legal-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
