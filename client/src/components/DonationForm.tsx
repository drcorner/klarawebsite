import { useState } from "react";
import { Lock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

const monthlyAmounts = [25, 50, 100, 250];
const oneTimeAmounts = [50, 100, 250, 500, 1000];
const foundingAmounts = [1000, 2500, 5000, 10000, 25000];

const impactStatements: Record<number, string> = {
  25: "Supports curriculum development for one small group module",
  50: "Funds one student research grant application review",
  100: "Enables one pastor conversation guide to reach 10 churches",
  250: "Sponsors one student essay competition prize",
};

interface DonationFormProps {
  showFoundingGifts?: boolean;
}

export default function DonationForm({ showFoundingGifts = true }: DonationFormProps) {
  const [frequency, setFrequency] = useState<"monthly" | "one-time">("monthly");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const amounts = frequency === "monthly" ? monthlyAmounts : oneTimeAmounts;
  const currentAmount = customAmount ? parseInt(customAmount) : selectedAmount;

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAmount || !email || !name) return;
    
    setIsProcessing(true);
    console.log("Processing donation:", { amount: currentAmount, frequency, email, name });
    
    setTimeout(() => {
      setIsProcessing(false);
      alert(`Thank you for your ${frequency} donation of $${currentAmount}!`);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <Card className="p-6 md:p-8 bg-card border-card-border">
        <form onSubmit={handleDonate} className="space-y-6">
          <div className="flex bg-cream-dark rounded-lg p-1">
            <button
              type="button"
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                frequency === "monthly" 
                  ? "bg-teal text-cream" 
                  : "text-charcoal"
              }`}
              onClick={() => setFrequency("monthly")}
              data-testid="button-frequency-monthly"
            >
              <Calendar className="inline-block w-4 h-4 mr-2" />
              Monthly
            </button>
            <button
              type="button"
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                frequency === "one-time" 
                  ? "bg-teal text-cream" 
                  : "text-charcoal"
              }`}
              onClick={() => setFrequency("one-time")}
              data-testid="button-frequency-onetime"
            >
              One-Time
            </button>
          </div>

          <div>
            <Label className="text-charcoal-muted mb-3 block">Select Amount</Label>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {amounts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  className={`py-3 px-4 rounded-md font-semibold border-2 transition-colors ${
                    selectedAmount === amount && !customAmount
                      ? "bg-teal text-cream border-teal" 
                      : "bg-cream border-border text-charcoal"
                  }`}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount("");
                  }}
                  data-testid={`button-amount-${amount}`}
                >
                  ${amount}
                </button>
              ))}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-muted">$</span>
                <Input
                  type="number"
                  placeholder="Other"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                  className="pl-7 h-full"
                  data-testid="input-custom-amount"
                />
              </div>
            </div>
          </div>

          {frequency === "monthly" && currentAmount && impactStatements[currentAmount] && (
            <div className="bg-gold/10 border border-gold/30 rounded-lg p-4">
              <p className="text-charcoal text-sm">
                <strong className="text-gold">${currentAmount}/month</strong> {impactStatements[currentAmount]}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
                data-testid="input-donor-name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                data-testid="input-donor-email"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            size="lg"
            className="w-full bg-teal text-cream font-semibold text-lg"
            disabled={!currentAmount || isProcessing}
            data-testid="button-complete-donation"
          >
            {isProcessing ? "Processing..." : `Complete ${frequency === "monthly" ? "Monthly " : ""}Donation`}
          </Button>

          <div className="flex items-center justify-center gap-2 text-charcoal-muted text-sm">
            <Lock className="w-4 h-4" />
            Secure donation processed by Stripe
          </div>
        </form>
      </Card>

      <div className="bg-cream-dark border border-border rounded-lg p-4 text-center">
        <p className="text-charcoal-muted text-sm">
          The Klara Project has applied for 501(c)(3) tax-exempt status. Upon approval, 
          donations will be tax-deductible retroactive to our date of incorporation. 
          We will notify donors when approval is received.
        </p>
      </div>

      {showFoundingGifts && (
        <Card className="p-6 md:p-8 bg-cream-dark border-gold/30">
          <h3 className="font-serif text-2xl font-semibold text-charcoal mb-4">
            Founding Gifts
          </h3>
          <p className="text-charcoal-muted mb-6">
            Founding gifts of $1,000 or more provide the stable foundation this mission requires. 
            These contributions fund curriculum development, educational grants, and the 
            infrastructure that enables sustainable growth.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
            {foundingAmounts.map((amount) => (
              <Button
                key={amount}
                variant="outline"
                className="border-gold text-gold font-semibold"
                onClick={() => {
                  setFrequency("one-time");
                  setSelectedAmount(null);
                  setCustomAmount(amount.toString());
                }}
                data-testid={`button-founding-${amount}`}
              >
                ${amount.toLocaleString()}
              </Button>
            ))}
          </div>

          <p className="text-charcoal-muted text-sm mb-4">
            Want to learn more before giving? We'd welcome the chance to share our plans 
            and answer your questions.
          </p>
          
          <Button 
            variant="outline" 
            className="border-teal text-teal"
            data-testid="button-schedule-conversation"
          >
            Schedule a Conversation with Our Founder
          </Button>
        </Card>
      )}
    </div>
  );
}
