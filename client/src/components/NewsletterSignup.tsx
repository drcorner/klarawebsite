import { useState } from "react";
import { Mail, Check } from "lucide-react";
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
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setSubmitted(true);
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
            className="flex-1"
            data-testid="input-newsletter-email"
          />
          <Button
            type="submit"
            className="bg-primary text-cream"
            data-testid="button-newsletter-subscribe"
          >
            Subscribe
          </Button>
        </form>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        required
        className="flex-1"
        data-testid="input-newsletter-email-inline"
      />
      <Button
        type="submit"
        className="bg-primary text-cream shrink-0"
        data-testid="button-newsletter-subscribe-inline"
      >
        <Mail className="w-4 h-4 md:mr-2" />
        <span className="hidden md:inline">Subscribe</span>
      </Button>
    </form>
  );
}
