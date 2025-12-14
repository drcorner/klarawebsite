import { useEffect, useRef } from "react";
import { Link, useSearch } from "wouter";
import { Heart, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function DonateThankYou() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const sessionId = params.get('session_id');
  const emailSentRef = useRef(false);

  useEffect(() => {
    if (sessionId && !emailSentRef.current) {
      emailSentRef.current = true;
      fetch('/api/send-donation-thank-you', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      }).then(res => {
        if (res.ok) {
          console.log('Thank you email sent successfully');
        }
      }).catch(err => console.error('Failed to send thank-you email:', err));
    }
  }, [sessionId]);

  const shareUrl = encodeURIComponent("https://klaraproject.org");
  const shareText = encodeURIComponent("I just supported Klara Project - equipping churches for the AI age. Join me!");

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="py-20 md:py-28">
        <div className="max-w-2xl mx-auto px-6 md:px-10 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8">
            <Heart className="h-10 w-10 text-primary" />
          </div>
          
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-charcoal mb-6">
            Thank You for Your Gift
          </h1>
          
          <p className="text-charcoal leading-relaxed text-lg mb-8">
            Your generosity helps us equip churches with practical AI resources and ensure 
            Christian perspectives shape technology development. You're making a difference 
            for congregations and families navigating this transformative era.
          </p>
          
          <Card className="p-6 bg-cream-dark border-card-border mb-8">
            <p className="text-charcoal-muted text-sm">
              A confirmation email has been sent to your address. If you have any questions 
              about your donation, please contact us at{" "}
              <a href="mailto:info@klaraproject.org" className="text-primary underline">
                info@klaraproject.org
              </a>
            </p>
          </Card>

          <div className="mb-8">
            <p className="text-charcoal-muted mb-4 flex items-center justify-center gap-2">
              <Share2 className="w-4 h-4" />
              Spread the word
            </p>
            <div className="flex justify-center gap-3">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="icon" className="border-primary text-primary">
                  <Facebook className="w-4 h-4" />
                </Button>
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="icon" className="border-primary text-primary">
                  <Twitter className="w-4 h-4" />
                </Button>
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="icon" className="border-primary text-primary">
                  <Linkedin className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </div>

          <Link href="/">
            <Button variant="outline" className="border-primary text-primary" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Homepage
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
