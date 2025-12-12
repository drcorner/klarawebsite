import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main>
        <PageHero title="Privacy Policy" />

        <section className="py-16 md:py-24">
          <div className="max-w-3xl mx-auto px-6 md:px-10">
            <div className="prose prose-charcoal max-w-none">
              <p className="text-charcoal-muted text-sm mb-8">
                Last updated: January 2025
              </p>

              <h2 className="font-serif text-2xl font-semibold text-charcoal mt-8 mb-4">
                Information We Collect
              </h2>
              <p className="text-charcoal leading-relaxed mb-4">
                We collect information you provide directly to us, including:
              </p>
              <ul className="text-charcoal leading-relaxed mb-6 list-disc pl-6 space-y-2">
                <li>Name and email address when you sign up for our newsletter</li>
                <li>Contact information when you reach out to us</li>
                <li>Payment information when you make a donation (processed securely by Stripe)</li>
                <li>Information you provide in forms on our website</li>
              </ul>

              <h2 className="font-serif text-2xl font-semibold text-charcoal mt-8 mb-4">
                How We Use Your Information
              </h2>
              <p className="text-charcoal leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="text-charcoal leading-relaxed mb-6 list-disc pl-6 space-y-2">
                <li>Send you newsletters and updates about our work</li>
                <li>Process donations and provide receipts</li>
                <li>Respond to your inquiries and requests</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2 className="font-serif text-2xl font-semibold text-charcoal mt-8 mb-4">
                Third-Party Services
              </h2>
              <p className="text-charcoal leading-relaxed mb-4">
                We use the following third-party services:
              </p>
              <ul className="text-charcoal leading-relaxed mb-6 list-disc pl-6 space-y-2">
                <li><strong>Stripe</strong> for payment processing. We do not store your payment card details.</li>
                <li><strong>HubSpot</strong> for email marketing and contact management.</li>
                <li><strong>Google Analytics</strong> for website analytics.</li>
              </ul>

              <h2 className="font-serif text-2xl font-semibold text-charcoal mt-8 mb-4">
                Cookies and Tracking
              </h2>
              <p className="text-charcoal leading-relaxed mb-6">
                We use cookies and similar tracking technologies to analyze website traffic and 
                improve your experience. You can control cookies through your browser settings.
              </p>

              <h2 className="font-serif text-2xl font-semibold text-charcoal mt-8 mb-4">
                Data Retention
              </h2>
              <p className="text-charcoal leading-relaxed mb-6">
                We retain your information for as long as necessary to fulfill the purposes 
                described in this policy, unless a longer retention period is required by law.
              </p>

              <h2 className="font-serif text-2xl font-semibold text-charcoal mt-8 mb-4">
                Your Rights
              </h2>
              <p className="text-charcoal leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="text-charcoal leading-relaxed mb-6 list-disc pl-6 space-y-2">
                <li>Unsubscribe from our emails at any time using the link in any email</li>
                <li>Request access to your personal data</li>
                <li>Request deletion of your personal data</li>
                <li>Correct inaccurate information</li>
              </ul>

              <h2 className="font-serif text-2xl font-semibold text-charcoal mt-8 mb-4">
                Contact Us
              </h2>
              <p className="text-charcoal leading-relaxed mb-6">
                If you have questions about this Privacy Policy or wish to exercise your rights, 
                please contact us at{" "}
                <a href="mailto:info@klaraproject.org" className="text-teal underline">
                  info@klaraproject.org
                </a>
              </p>

              <h2 className="font-serif text-2xl font-semibold text-charcoal mt-8 mb-4">
                Changes to This Policy
              </h2>
              <p className="text-charcoal leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any 
                changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
