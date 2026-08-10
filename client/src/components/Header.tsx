import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";

const navItems = [
  { label: "About", href: "/about" },
  { label: "Next Generation", href: "/next-generation" },
  { label: "Get Involved", href: "/get-involved" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-lg border-b border-charcoal/5">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:bg-primary focus:text-cream focus:px-4 focus:py-2 focus:rounded-full focus:text-sm"
      >
        Skip to content
      </a>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />
          
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={location === item.href ? "secondary" : "ghost"}
                  className={`rounded-full text-[15px] ${
                    location === item.href ? "bg-primary text-cream" : ""
                  }`}
                  data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            <div className="ml-3 flex flex-col items-center">
              <Link href="/donate">
                <Button
                  className="bg-gradient-to-r from-primary to-primary/80 text-cream font-semibold rounded-full px-6 shadow-sm shadow-primary/20 text-[15px]"
                  data-testid="nav-donate"
                >
                  Donate
                </Button>
              </Link>
              <Link href="/manage-donation">
                <span
                  className="inline-flex items-center px-2 py-1 mt-0.5 text-xs text-charcoal-muted hover:text-primary transition-colors"
                  data-testid="nav-manage-giving"
                >
                  Manage your giving
                </span>
              </Link>
            </div>
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
        <>
          <div 
            className="md:hidden fixed inset-0 top-16 bg-charcoal/50 z-40"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="md:hidden fixed left-0 right-0 top-16 bg-cream z-50 border-b border-charcoal/10 shadow-lg">
            <nav className="flex flex-col p-4 gap-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
              <Link href="/">
                <Button
                  variant={location === "/" ? "secondary" : "ghost"}
                  className={`w-full justify-start text-lg rounded-xl ${
                    location === "/" ? "bg-primary text-cream" : ""
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
                      location === item.href ? "bg-primary text-cream" : ""
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                    data-testid={`mobile-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
              <div className="mt-4 flex flex-col items-center">
                <Link href="/donate">
                  <Button
                    className="w-full bg-gradient-to-r from-primary to-primary/80 text-cream font-semibold text-lg rounded-full"
                    onClick={() => setIsMenuOpen(false)}
                    data-testid="mobile-nav-donate"
                  >
                    Donate
                  </Button>
                </Link>
                <Link href="/manage-donation">
                  <span
                    className="inline-flex items-center justify-center min-h-[44px] px-4 mt-1 text-sm text-charcoal-muted hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                    data-testid="mobile-nav-manage-giving"
                  >
                    Manage your giving
                  </span>
                </Link>
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
