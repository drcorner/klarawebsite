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
                <Button
                  variant={location === item.href ? "secondary" : "ghost"}
                  size="sm"
                  className={`rounded-full ${
                    location === item.href ? "bg-teal text-cream" : ""
                  }`}
                  data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {item.label}
                </Button>
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
              <Button
                variant={location === "/" ? "secondary" : "ghost"}
                className={`w-full justify-start text-lg rounded-xl ${
                  location === "/" ? "bg-teal text-cream" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
                data-testid="mobile-nav-home"
              >
                Home
              </Button>
            </Link>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={location === item.href ? "secondary" : "ghost"}
                  className={`w-full justify-start text-lg rounded-xl ${
                    location === item.href ? "bg-teal text-cream" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                  data-testid={`mobile-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {item.label}
                </Button>
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
