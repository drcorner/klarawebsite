import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Link } from "wouter";

const COOKIE_CONSENT_KEY = "klara_cookie_consent";
const VISITOR_ID_KEY = "klara_visitor_id";

function generateVisitorId(): string {
  return 'v_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

export function getVisitorId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(VISITOR_ID_KEY);
}

export function hasConsent(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(COOKIE_CONSENT_KEY) === 'accepted';
}

export async function trackPageVisit(page: string): Promise<void> {
  if (!hasConsent()) return;
  
  const visitorId = getVisitorId();
  if (!visitorId) return;
  
  try {
    await fetch('/api/track-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId, page }),
    });
  } catch (error) {
    console.error('Failed to track visit:', error);
  }
}

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    
    let visitorId = localStorage.getItem(VISITOR_ID_KEY);
    if (!visitorId) {
      visitorId = generateVisitorId();
      localStorage.setItem(VISITOR_ID_KEY, visitorId);
    }
    
    document.cookie = `klara_visitor=${visitorId}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
    
    trackPageVisit(window.location.pathname);
    
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
      data-testid="cookie-consent-banner"
    >
      <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-lg p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <p className="text-slate-700 text-sm md:text-base leading-relaxed">
              We use cookies to improve your experience and understand how our site is used. 
              By continuing, you agree to our{" "}
              <Link 
                href="/privacy-policy" 
                className="text-primary hover:text-primary/80 underline underline-offset-2"
                data-testid="link-privacy-policy"
              >
                Privacy Policy
              </Link>.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecline}
              className="text-slate-600 border-slate-300"
              data-testid="button-decline-cookies"
            >
              Decline
            </Button>
            <Button
              size="sm"
              onClick={handleAccept}
              className="bg-gradient-to-r from-primary to-primary/80 text-white"
              data-testid="button-accept-cookies"
            >
              Accept
            </Button>
          </div>
          <button
            onClick={handleDecline}
            className="absolute top-3 right-3 md:hidden text-slate-400 hover:text-slate-600"
            aria-label="Close"
            data-testid="button-close-cookie-banner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
