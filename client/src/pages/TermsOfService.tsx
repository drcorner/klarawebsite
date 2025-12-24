import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { useSEO, SEO_CONFIG } from "@/hooks/use-seo";

export default function TermsOfService() {
  useSEO(SEO_CONFIG.termsOfService);

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main>
        <PageHero title="Terms of Service" />

        <section className="py-16 md:py-24">
          <div className="max-w-3xl mx-auto px-6 md:px-10">
            <div className="prose prose-charcoal max-w-none">
              <p className="text-charcoal-muted text-sm mb-8">
                Last updated: January 2025
              </p>

              <h2 className="font-serif text-2xl font-semibold text-charcoal mt-8 mb-4">
                Acceptance of Terms
              </h2>
              <p className="text-charcoal leading-relaxed mb-6">
                By accessing and using the Klara Project website (klaraproject.org), you accept 
                and agree to be bound by these Terms of Service. If you do not agree to these 
                terms, please do not use our website.
              </p>

              <h2 className="font-serif text-2xl font-semibold text-charcoal mt-8 mb-4">
                Use of Website and Resources
              </h2>
              <p className="text-charcoal leading-relaxed mb-4">
                Our resources are provided for:
              </p>
              <ul className="text-charcoal leading-relaxed mb-6 list-disc pl-6 space-y-2">
                <li>Personal educational use</li>
                <li>Use within church and small group settings</li>
                <li>Non-commercial purposes</li>
              </ul>
              <p className="text-charcoal leading-relaxed mb-6">
                You may not reproduce, distribute, or create derivative works from our content 
                for commercial purposes without written permission.
              </p>

              <h2 className="font-serif text-2xl font-semibold text-charcoal mt-8 mb-4">
                Intellectual Property
              </h2>
              <p className="text-charcoal leading-relaxed mb-6">
                All content on this website, including text, graphics, logos, and downloadable 
                resources, is the property of Klara Project and is protected by copyright 
                laws. Our resources may be shared within church settings with proper attribution 
                but may not be sold or used for commercial purposes.
              </p>

              <h2 className="font-serif text-2xl font-semibold text-charcoal mt-8 mb-4">
                Donations
              </h2>
              <p className="text-charcoal leading-relaxed mb-4">
                Donations to Klara Project are generally non-refundable. However, we understand 
                that circumstances may change. If you have concerns about a donation, please 
                contact us at{" "}
                <a href="mailto:info@klaraproject.org" className="text-primary underline">
                  info@klaraproject.org
                </a>
                , and we will work with you to address your situation.
              </p>
              <p className="text-charcoal leading-relaxed mb-6">
                Klara Project has applied for 501(c)(3) tax-exempt status. Upon approval, 
                donations will be tax-deductible retroactive to our date of incorporation.
              </p>

              <h2 className="font-serif text-2xl font-semibold text-charcoal mt-8 mb-4">
                Disclaimer
              </h2>
              <p className="text-charcoal leading-relaxed mb-6">
                Our resources are provided for educational and informational purposes. While we 
                strive to provide accurate and helpful content, we make no warranties about the 
                completeness, reliability, or accuracy of this information. Any action you take 
                based on our content is at your own risk.
              </p>

              <h2 className="font-serif text-2xl font-semibold text-charcoal mt-8 mb-4">
                Limitation of Liability
              </h2>
              <p className="text-charcoal leading-relaxed mb-6">
                The Klara Project shall not be liable for any indirect, incidental, special, 
                consequential, or punitive damages resulting from your use of or inability to 
                use our website or resources.
              </p>

              <h2 className="font-serif text-2xl font-semibold text-charcoal mt-8 mb-4">
                Governing Law
              </h2>
              <p className="text-charcoal leading-relaxed mb-6">
                These Terms of Service are governed by the laws of the State of New York, 
                without regard to its conflict of law principles.
              </p>

              <h2 className="font-serif text-2xl font-semibold text-charcoal mt-8 mb-4">
                Changes to Terms
              </h2>
              <p className="text-charcoal leading-relaxed mb-6">
                We reserve the right to modify these Terms of Service at any time. Changes will 
                be effective immediately upon posting to the website. Your continued use of the 
                website after changes constitutes acceptance of the new terms.
              </p>

              <h2 className="font-serif text-2xl font-semibold text-charcoal mt-8 mb-4">
                Contact Us
              </h2>
              <p className="text-charcoal leading-relaxed">
                If you have questions about these Terms of Service, please contact us at{" "}
                <a href="mailto:info@klaraproject.org" className="text-primary underline">
                  info@klaraproject.org
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
