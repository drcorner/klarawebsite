import { useState } from "react";
import { Link } from "wouter";
import { HandHeart, Mail, Users, Share2, Church, Facebook, Twitter, Linkedin, Copy, Check, MessageSquare, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import NewsletterSignup from "@/components/NewsletterSignup";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import familyImage from "@assets/generated_images/christian_family_dinner_conversation.png";

export default function GetInvolved() {
  const [volunteerForm, setVolunteerForm] = useState({
    name: "",
    email: "",
    expertise: "",
    message: "",
  });
  const [volunteerSubmitted, setVolunteerSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [experienceForm, setExperienceForm] = useState({
    name: "",
    email: "",
    experience: "",
    namePermission: "use-name",
  });
  const [experienceSubmitted, setExperienceSubmitted] = useState(false);

  const handleVolunteerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Volunteer form submitted:", volunteerForm);
    setVolunteerSubmitted(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://klaraproject.org");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExperienceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Experience form submitted:", experienceForm);
    setExperienceSubmitted(true);
  };

  const shareUrl = encodeURIComponent("https://klaraproject.org");
  const shareText = encodeURIComponent("Check out Klara Project - equipping churches for the AI age.");

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main>
        <PageHero 
          title="Get Involved" 
          subtitle="Join us in equipping churches and engaging the culture"
          variant="image"
          imageSrc={familyImage}
        />

        {/* Bring Us to Your Church - Prominent Section */}
        <section className="bg-primary py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-20 h-20 rounded-full bg-cream/10 flex items-center justify-center mx-auto mb-8">
                <Church className="h-10 w-10 text-cream" />
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-cream mb-6">
                Bring Us to Your Church
              </h2>
              <p className="text-cream/80 leading-relaxed text-lg mb-8">
                Interested in hosting a workshop, speaker, or pilot program? We're looking for 
                church partners to help us develop and test our resources in real congregational 
                settings.
              </p>
              <a href="mailto:info@klaraproject.org">
                <Button className="bg-cream text-primary font-semibold rounded-full group" data-testid="button-contact-church">
                  Contact Us
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Volunteer Your Expertise */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h2 className="font-serif text-3xl font-semibold text-charcoal mb-6">
                  Volunteer Your Expertise
                </h2>
                <p className="text-charcoal leading-relaxed mb-6">
                  We're seeking professionals with backgrounds in AI, technology, education, theology, 
                  social enterprise, and ministry to contribute to specific projects or serve in 
                  advisory roles.
                </p>
              </div>
              
              {!volunteerSubmitted ? (
                <Card className="p-8 bg-card border-card-border">
                  <form onSubmit={handleVolunteerSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="vol-name">Name *</Label>
                        <Input
                          id="vol-name"
                          value={volunteerForm.name}
                          onChange={(e) => setVolunteerForm({ ...volunteerForm, name: e.target.value })}
                          required
                          placeholder="Your name"
                          data-testid="input-volunteer-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="vol-email">Email *</Label>
                        <Input
                          id="vol-email"
                          type="email"
                          value={volunteerForm.email}
                          onChange={(e) => setVolunteerForm({ ...volunteerForm, email: e.target.value })}
                          required
                          placeholder="you@example.com"
                          data-testid="input-volunteer-email"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="vol-expertise">Area of Expertise</Label>
                      <Select 
                        value={volunteerForm.expertise} 
                        onValueChange={(value) => setVolunteerForm({ ...volunteerForm, expertise: value })}
                      >
                        <SelectTrigger data-testid="select-expertise">
                          <SelectValue placeholder="Select your expertise" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ai-technology">AI/Technology</SelectItem>
                          <SelectItem value="theology">Theology</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="ministry">Ministry</SelectItem>
                          <SelectItem value="social-enterprise">Social Enterprise</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="vol-message">Brief Message</Label>
                      <Textarea
                        id="vol-message"
                        value={volunteerForm.message}
                        onChange={(e) => setVolunteerForm({ ...volunteerForm, message: e.target.value })}
                        placeholder="Tell us about your background and how you'd like to help..."
                        rows={4}
                        data-testid="textarea-volunteer-message"
                      />
                    </div>
                    <Button type="submit" className="w-full bg-primary text-cream font-semibold" data-testid="button-volunteer-submit">
                      Express Interest
                    </Button>
                  </form>
                </Card>
              ) : (
                <Card className="p-8 bg-card border-card-border flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Check className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-charcoal mb-2">
                      Thank You!
                    </h3>
                    <p className="text-charcoal-muted">
                      We've received your interest and will be in touch soon.
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </section>

        {/* Share Our Mission */}
        <section className="bg-cream-dark py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Share2 className="h-8 w-8 text-primary" />
                </div>
                <h2 className="font-serif text-3xl font-semibold text-charcoal mb-6">
                  Share Our Mission
                </h2>
                <p className="text-charcoal leading-relaxed mb-6">
                  Help spread awareness by sharing our resources with your church, small group, or 
                  professional networks. The more Christians engage with these issues, the stronger 
                  our collective voice.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="border-primary text-primary" data-testid="button-share-facebook">
                      <Facebook className="w-4 h-4 mr-2" />
                      Facebook
                    </Button>
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="border-primary text-primary" data-testid="button-share-twitter">
                      <Twitter className="w-4 h-4 mr-2" />
                      Twitter
                    </Button>
                  </a>
                  <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="border-primary text-primary" data-testid="button-share-linkedin">
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </Button>
                  </a>
                  <Button 
                    variant="outline" 
                    className="border-primary text-primary"
                    onClick={handleCopyLink}
                    data-testid="button-copy-link"
                  >
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? "Copied!" : "Copy Link"}
                  </Button>
                </div>
              </div>

              <Card className="p-8 bg-card border-card-border">
                <div className="flex items-center gap-4 mb-6">
                  <Mail className="h-6 w-6 text-primary" />
                  <h3 className="font-serif text-2xl font-semibold text-charcoal">
                    Stay Informed
                  </h3>
                </div>
                <p className="text-charcoal-muted mb-6">
                  Join our mailing list for updates on resources, research, and opportunities to engage.
                </p>
                <NewsletterSignup />
              </Card>
            </div>
          </div>
        </section>

        {/* Give */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <HandHeart className="h-8 w-8 text-primary" />
                </div>
                <h2 className="font-serif text-3xl font-semibold text-charcoal mb-6">
                  Give
                </h2>
                <p className="text-charcoal leading-relaxed mb-6">
                  Individual giving is the backbone of our funding strategy. Your donation directly 
                  supports curriculum development, educational grants, and the infrastructure needed 
                  for sustainable growth. Every contribution—from monthly support to founding gifts—helps 
                  us serve churches and represent Christian perspectives where decisions are being made.
                </p>
                <Link href="/donate">
                  <Button className="bg-primary text-cream font-semibold" data-testid="button-donate">
                    Donate
                  </Button>
                </Link>
              </div>

              {/* Share Your Experience Form */}
              <Card className="p-8 bg-card border-card-border">
                <div className="flex items-center gap-4 mb-6">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  <h3 className="font-serif text-2xl font-semibold text-charcoal">
                    Share Your Experience or Questions
                  </h3>
                </div>
                <p className="text-charcoal-muted mb-6">
                  We answer questions and reflect on experiences in our media. Tell us what you'd like to see us cover.
                </p>
                {!experienceSubmitted ? (
                  <form onSubmit={handleExperienceSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="exp-name">Name *</Label>
                        <Input
                          id="exp-name"
                          value={experienceForm.name}
                          onChange={(e) => setExperienceForm({ ...experienceForm, name: e.target.value })}
                          required
                          placeholder="Your name"
                          data-testid="input-experience-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="exp-email">Email *</Label>
                        <Input
                          id="exp-email"
                          type="email"
                          value={experienceForm.email}
                          onChange={(e) => setExperienceForm({ ...experienceForm, email: e.target.value })}
                          required
                          placeholder="you@example.com"
                          data-testid="input-experience-email"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="exp-experience">Your Experience or Question *</Label>
                      <Textarea
                        id="exp-experience"
                        value={experienceForm.experience}
                        onChange={(e) => setExperienceForm({ ...experienceForm, experience: e.target.value })}
                        required
                        placeholder="Share your experience with AI or ask a question you'd like us to address..."
                        rows={4}
                        data-testid="textarea-experience"
                      />
                    </div>
                    <div>
                      <Label className="mb-3 block">Permission to use in our materials</Label>
                      <RadioGroup
                        value={experienceForm.namePermission}
                        onValueChange={(value) => setExperienceForm({ ...experienceForm, namePermission: value })}
                        className="flex flex-col gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="use-name" id="use-name" data-testid="radio-use-name" />
                          <Label htmlFor="use-name" className="font-normal cursor-pointer">Use my name</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="no-name" id="no-name" data-testid="radio-no-name" />
                          <Label htmlFor="no-name" className="font-normal cursor-pointer">Do not use my name</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <Button type="submit" className="w-full bg-primary text-cream font-semibold" data-testid="button-experience-submit">
                      Submit
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Check className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-charcoal mb-2">
                      Thank You!
                    </h3>
                    <p className="text-charcoal-muted">
                      We appreciate you sharing your experience or question with us.
                    </p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
