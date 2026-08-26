import { useState } from "react";
import { Mail, Check, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NewsletterSignupProps {
  variant?: "inline" | "card";
  className?: string;
}

export default function NewsletterSignup({
  variant = "inline",
  className = "",
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubmitted(true);
        setEmail("");
      } else {
        const data = await response.json().catch(() => null);
        setError(data?.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Newsletter subscription error:", err);
      setError("Unable to connect. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={`flex items-center gap-2 text-primary ${className}`}>
        <Check className="w-5 h-5" />
        <span>Thank you for subscribing!</span>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div
        className={`bg-cream-dark border border-border rounded-lg p-6 ${className}`}
      >
        <h3 className="font-serif text-xl font-semibold text-charcoal mb-2">
          Stay Informed
        </h3>
        <p className="text-charcoal-muted mb-4">
          Join our mailing list for updates on resources, research, and
          opportunities to engage.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            required
            disabled={isLoading}
            className="flex-1"
            data-testid="input-newsletter-email"
          />
          <Button
            type="submit"
            className="bg-primary text-cream"
            disabled={isLoading}
            data-testid="button-newsletter-subscribe"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Subscribe"
            )}
          </Button>
        </form>
        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          required
          disabled={isLoading}
          className="flex-1"
          data-testid="input-newsletter-email-inline"
        />
        <Button
          type="submit"
          className="bg-primary text-cream shrink-0"
          disabled={isLoading}
          data-testid="button-newsletter-subscribe-inline"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Mail className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Subscribe</span>
            </>
          )}
        </Button>
      </form>
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
