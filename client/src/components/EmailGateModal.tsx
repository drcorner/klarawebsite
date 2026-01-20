import { useState } from "react";
import { Mail, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface EmailGateModalProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
}

export default function EmailGateModal({
  isOpen,
  title = "Get the White Paper",
  description = "Enter your email to receive instant access to our founding white paper.",
  confirmLabel = "Continue to Download",
  onClose,
  onSubmit,
}: EmailGateModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSubmit(email);
      onClose();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <Card className="relative w-full max-w-md p-6 bg-card">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-charcoal-muted hover:text-charcoal"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <h2 className="font-serif text-xl font-semibold text-charcoal">
            {title}
          </h2>
        </div>

        <p className="text-sm text-charcoal-muted mb-6">{description}</p>

        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button
            className="w-full bg-primary text-cream font-semibold"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing…
              </>
            ) : (
              confirmLabel
            )}
          </Button>

          <p className="text-xs text-charcoal-muted text-center">
            We’ll only use your email for occasional updates. You can
            unsubscribe anytime.
          </p>
        </div>
      </Card>
    </div>
  );
}
