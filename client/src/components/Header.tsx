import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";

const navItems = [
  { label: "Why Us", href: "/why-klara-project" },
  { label: "Resources", href: "/resources" },
  { label: "Get Involved", href: "/get-involved" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-lg border-b border-charcoal/5">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />
          
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                    location === item.href 
                      ? "bg-teal text-cream" 
                      : "text-charcoal-muted hover:text-charcoal hover:bg-charcoal/5"
                  }`}
                  data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {item.label}
                </button>
              </Link>
            ))}
            <Link href="/donate">
              <Button 
                size="sm"
                className="ml-3 bg-gradient-to-r from-teal to-teal-dark text-cream font-semibold rounded-full px-6 shadow-sm shadow-teal/20" 
                data-testid="nav-donate"
              >
                Donate
              </Button>
            </Link>
          </nav>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="button-menu-toggle"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-cream z-40">
          <nav className="flex flex-col p-6 gap-1">
            <Link href="/">
              <button
                className={`w-full text-left px-4 py-3 rounded-xl text-lg font-medium transition-colors ${
                  location === "/" ? "bg-teal text-cream" : "text-charcoal"
                }`}
                onClick={() => setIsMenuOpen(false)}
                data-testid="mobile-nav-home"
              >
                Home
              </button>
            </Link>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <button
                  className={`w-full text-left px-4 py-3 rounded-xl text-lg font-medium transition-colors ${
                    location === item.href ? "bg-teal text-cream" : "text-charcoal"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                  data-testid={`mobile-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {item.label}
                </button>
              </Link>
            ))}
            <Link href="/donate">
              <Button 
                className="w-full mt-4 bg-gradient-to-r from-teal to-teal-dark text-cream font-semibold text-lg rounded-full"
                onClick={() => setIsMenuOpen(false)}
                data-testid="mobile-nav-donate"
              >
                Donate
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
