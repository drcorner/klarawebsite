import { Link } from "wouter";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "./Logo";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Why The Klara Project?", href: "/why-klara-project" },
  { label: "Resources", href: "/resources" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "Donate", href: "/donate" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
];

export default function Footer() {
  return (
    <footer className="bg-charcoal text-cream-dark">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2">
            <Logo variant="light" />
            <p className="mt-4 text-cream-dark/80 font-serif italic">
              Clarity for Christians in the Age of AI
            </p>
            <p className="mt-4 text-cream-dark/70 text-sm leading-relaxed max-w-md">
              Equipping churches with practical resources. Engaging the culture to ensure 
              Christian perspectives shape technology development.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-cream mb-4">Navigation</h4>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span 
                    className="text-cream-dark/70 hover:text-cream transition-colors text-sm"
                    data-testid={`footer-nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="font-semibold text-cream mb-4">Stay Informed</h4>
            <p className="text-cream-dark/70 text-sm mb-4">
              Get updates on resources and opportunities to engage.
            </p>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="bg-charcoal-muted/50 border-charcoal-light/30 text-cream placeholder:text-cream-dark/50"
                data-testid="input-footer-email"
              />
              <Button className="bg-teal text-cream shrink-0" data-testid="button-footer-subscribe">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-6">
              <h4 className="font-semibold text-cream mb-2">Contact</h4>
              <a 
                href="mailto:info@klaraproject.org" 
                className="text-cream-dark/70 hover:text-cream transition-colors text-sm"
                data-testid="link-contact-email"
              >
                info@klaraproject.org
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-charcoal-light/30 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-cream-dark/50 text-sm text-center md:text-left">
            © 2025 The Klara Project. All rights reserved.
            <br className="md:hidden" />
            <span className="hidden md:inline"> · </span>
            The Klara Project operates Christians for Responsible AI and Robotics.
          </p>
          <nav className="flex gap-4">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span 
                  className="text-cream-dark/50 hover:text-cream transition-colors text-sm"
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
