import { useState } from "react";
import { Link } from "wouter";
import { Mail, ArrowRight, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "./Logo";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Next Generation", href: "/next-generation" },
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
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    if (!email || isLoading) return;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("That doesn't look like an email address. Check it and try again.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        setIsSubscribed(true);
        setEmail("");
      } else {
        setError("We couldn't add you to the list. Please try again in a moment.");
      }
    } catch {
      setError("We couldn't reach the server. Check your connection and try again.");
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
            <p className="mt-4 text-cream/70 text-sm leading-relaxed max-w-md">
              <strong className="text-cream/90">Equip.</strong> Churches with practical resources for the AI age.{" "}
              <strong className="text-cream/90">Engage.</strong> Culture to shape technology development.{" "}
              <strong className="text-cream/90">Empower.</strong> The next generation to lead with wisdom and faith.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-cream mb-4 text-sm uppercase tracking-wide">Navigation</h3>
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span 
                    className="inline-flex items-center py-1.5 text-cream/70 hover:text-cream transition-colors text-sm"
                    data-testid={`footer-nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="font-semibold text-cream mb-4 text-sm uppercase tracking-wide">Stay Informed</h3>
            <p className="text-cream/70 text-sm mb-4">
              Get updates on resources and opportunities.
            </p>
            {isSubscribed ? (
              <div className="flex items-center gap-2 text-gold text-sm" data-testid="text-footer-subscribed">
                <Check className="h-4 w-4" />
                Thanks for subscribing!
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <Input 
                    type="email" 
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (error) setError(null); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                    aria-invalid={!!error}
                    className="bg-cream/10 border-cream/20 text-cream placeholder:text-cream/50 rounded-full text-sm"
                    data-testid="input-footer-email"
                  />
                  <Button 
                    size="icon" 
                    className="bg-primary text-cream shrink-0 rounded-full" 
                    onClick={handleSubscribe}
                    disabled={isLoading || !email}
                    aria-label="Subscribe"
                    data-testid="button-footer-subscribe"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  </Button>
                </div>
                {error && (
                  <p role="alert" className="mt-2 text-gold text-sm" data-testid="text-footer-subscribe-error">
                    {error}
                  </p>
                )}
              </>
            )}
            <div className="mt-6">
              <h3 className="font-semibold text-cream mb-2 text-sm uppercase tracking-wide">Contact</h3>
              <a 
                href="mailto:info@klaraproject.org" 
                className="text-gold hover:text-gold-muted transition-colors text-sm inline-flex items-center gap-1 py-1"
                data-testid="link-contact-email"
              >
                <Mail className="h-4 w-4" />
                info@klaraproject.org
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-cream/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-cream/70 text-sm">
              © {new Date().getFullYear()} Klara Project, Inc. All rights reserved.
              <span className="hidden md:inline"> · </span>
              <br className="md:hidden" />
              Operating Christians for Responsible AI and Robotics.
            </p>
            <p className="text-cream/70 text-sm mt-1">
              Klara Project, Inc. · 3300 Monroe Ave, Suite 323, Rochester, New York 14618
            </p>
          </div>
          <nav className="flex gap-4">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className="inline-flex items-center py-2 text-cream/70 hover:text-cream transition-colors text-sm"
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
