import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Why The Klara Project?", href: "/why-klara-project" },
  { label: "Resources", href: "/resources" },
  { label: "Get Involved", href: "/get-involved" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Logo />
          
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={`text-charcoal font-medium ${
                    location === item.href ? "bg-cream-dark" : ""
                  }`}
                  data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            <Link href="/donate">
              <Button className="ml-4 bg-teal text-cream font-semibold" data-testid="nav-donate">
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
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-cream z-40">
          <nav className="flex flex-col p-6 gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-lg ${
                    location === item.href ? "bg-cream-dark" : ""
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
                className="w-full mt-4 bg-teal text-cream font-semibold text-lg"
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
