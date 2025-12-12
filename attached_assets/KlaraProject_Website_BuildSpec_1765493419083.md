# The Klara Project — Website Build Specification

**Document Purpose**: Complete specification for building the Klara Project website. This document contains everything needed for an AI coding agent (Claude Code, Replit, Cursor, etc.) to design and build the site.

**Client**: The Klara Project (Christian nonprofit)
**Domain**: klaraproject.org
**Mission**: "Clarity for Christians in the Age of AI" — equipping churches with practical resources and engaging culture to ensure Christian perspectives shape technology development.

---

## Table of Contents
1. [Project Overview & Goals](#1-project-overview--goals)
2. [Technical Stack](#2-technical-stack)
3. [Design System](#3-design-system)
4. [Logo Creation](#4-logo-creation)
5. [Site Architecture](#5-site-architecture)
6. [Page-by-Page Specifications](#6-page-by-page-specifications)
7. [Stripe Integration](#7-stripe-integration)
8. [HubSpot Integration](#8-hubspot-integration)
9. [SEO Requirements](#9-seo-requirements)
10. [Accessibility Requirements](#10-accessibility-requirements)
11. [Legal Pages](#11-legal-pages)
12. [Photography & Imagery](#12-photography--imagery)
13. [Deployment & Maintenance](#13-deployment--maintenance)

---

## 1. Project Overview & Goals

### Primary Goals
1. **Build trust and credibility** — This site must appeal to both small monthly donors ($25/month) and major founding donors ($25,000+). Design must convey established institution, not startup.
2. **Encourage donations** — Optimize for monthly recurring gifts as primary conversion goal.
3. **Capture leads** — Email list building through resource downloads (white paper, updates).
4. **Establish thought leadership** — Position founder and organization as credible voices on AI and faith.

### Critical Design Constraints
- **Must NOT look AI-generated** — The mission addresses concerns about AI and human dignity. Generic AI aesthetics would undermine credibility.
- **Modern but timeless** — Avoid trendy design that dates quickly. Think "established institution" not "tech startup."
- **Human warmth over cold efficiency** — Every design choice should emphasize the human, relational nature of the mission.

### Target Audiences
1. **Church leaders** (pastors, small group leaders) seeking resources
2. **Christian parents** navigating AI with their families
3. **Major donors** (Christian philanthropists, $5,000–$25,000+)
4. **Monthly supporters** (grassroots Christians, $10–$100/month)
5. **Students** interested in essay competition and grants
6. **Christian technologists** seeking frameworks for their work

---

## 2. Technical Stack

### Recommended Stack
- **Framework**: Next.js 14+ (App Router) or Astro — static site generation for performance
- **Styling**: Tailwind CSS with custom configuration
- **Hosting**: Vercel (preferred) or Netlify
- **CMS**: Consider Sanity, Contentful, or simple Markdown files for non-technical maintenance
- **Forms**: HubSpot embedded forms
- **Payments**: Stripe Checkout (not custom payment forms)
- **Analytics**: HubSpot tracking + Google Analytics 4

### Why This Stack
- **Performance**: Static generation ensures fast loading (critical for donation conversion)
- **Maintainability**: Non-technical staff can update content with AI assistance
- **Cost**: Low hosting costs appropriate for nonprofit
- **Integrations**: Native support for Stripe and HubSpot

### Package Requirements
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "@stripe/stripe-js": "^2.0.0",
    "tailwindcss": "^3.4.0",
    "lucide-react": "latest",
    "framer-motion": "^10.0.0"
  }
}
```

---

## 3. Design System

### Design Philosophy
**"Grounded Clarity"** — Warm, human, trustworthy. The visual language of an established institution that takes its mission seriously. Not cold or clinical. Not trendy or flashy. Timeless.

Think: A well-designed university press publication meets a thoughtful nonprofit annual report.

### Color Palette

```css
:root {
  /* Backgrounds */
  --bg-primary: #FAF8F5;        /* Warm cream — main background */
  --bg-secondary: #F0EDEA;      /* Soft warm gray — section alternates */
  --bg-accent: #E8E4E0;         /* Slightly darker warm gray — cards */
  
  /* Text */
  --text-primary: #2D2A27;      /* Deep warm charcoal — body text */
  --text-secondary: #5C5652;    /* Muted charcoal — secondary text */
  --text-muted: #8A847E;        /* Light charcoal — captions, metadata */
  
  /* Accent Colors */
  --accent-primary: #1E4D4A;    /* Deep teal-green — primary buttons, links */
  --accent-primary-hover: #163B39;  /* Darker teal for hover states */
  --accent-secondary: #C9A962;  /* Warm gold — highlights, special elements */
  --accent-secondary-muted: #D4BC82;  /* Lighter gold for backgrounds */
  
  /* Functional */
  --success: #2E7D4A;           /* Green for success states */
  --error: #A63D3D;             /* Muted red for errors */
  --border: #DDD8D3;            /* Warm gray for borders */
  --border-light: #EBE7E3;      /* Lighter border for subtle dividers */
}
```

**Color Usage Rules**:
- Cream background (`--bg-primary`) for main content areas
- Alternate with warm gray (`--bg-secondary`) for visual rhythm between sections
- Deep teal (`--accent-primary`) for all interactive elements: buttons, links, CTAs
- Gold (`--accent-secondary`) used sparingly for emphasis: key statistics, pull quotes, founder section accent
- Never use pure white (#FFFFFF) or pure black (#000000)

### Typography

**Font Stack**:
```css
:root {
  --font-heading: 'Source Serif 4', 'Georgia', serif;
  --font-body: 'IBM Plex Sans', 'Helvetica Neue', sans-serif;
  --font-accent: 'IBM Plex Sans', sans-serif; /* For UI elements, buttons */
}
```

**Why These Fonts**:
- **Source Serif 4**: Modern serif with excellent readability. Conveys authority and tradition without being stuffy. Variable font for performance.
- **IBM Plex Sans**: Humanist sans-serif with warmth. Designed for clarity and accessibility. Avoids the generic feel of Inter/Roboto.

**Font Loading**:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&display=swap" rel="stylesheet">
```

**Type Scale**:
```css
/* Headings */
.h1 { font-size: 3rem; line-height: 1.1; font-weight: 700; letter-spacing: -0.02em; }
.h2 { font-size: 2.25rem; line-height: 1.2; font-weight: 600; letter-spacing: -0.01em; }
.h3 { font-size: 1.5rem; line-height: 1.3; font-weight: 600; }
.h4 { font-size: 1.25rem; line-height: 1.4; font-weight: 600; }

/* Body */
.body-large { font-size: 1.25rem; line-height: 1.6; }
.body { font-size: 1.0625rem; line-height: 1.7; }  /* 17px — slightly larger than default for readability */
.body-small { font-size: 0.9375rem; line-height: 1.6; }
.caption { font-size: 0.8125rem; line-height: 1.5; }

/* Mobile adjustments */
@media (max-width: 768px) {
  .h1 { font-size: 2.25rem; }
  .h2 { font-size: 1.75rem; }
  .h3 { font-size: 1.25rem; }
}
```

### Spacing System

Use an 8px base grid:
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-24: 6rem;     /* 96px */
--space-32: 8rem;     /* 128px */
```

**Section Spacing**:
- Between major sections: `--space-24` (96px) on desktop, `--space-16` (64px) on mobile
- Within sections: `--space-12` (48px)
- Between related elements: `--space-6` (24px)

### Component Specifications

#### Buttons

**Primary Button**:
```css
.btn-primary {
  background: var(--accent-primary);
  color: #FFFFFF;
  font-family: var(--font-accent);
  font-weight: 600;
  font-size: 1rem;
  padding: 0.875rem 1.75rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
.btn-primary:hover {
  background: var(--accent-primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(30,77,74,0.15);
}
```

**Secondary Button**:
```css
.btn-secondary {
  background: transparent;
  color: var(--accent-primary);
  border: 2px solid var(--accent-primary);
  font-family: var(--font-accent);
  font-weight: 600;
  font-size: 1rem;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}
.btn-secondary:hover {
  background: var(--accent-primary);
  color: #FFFFFF;
}
```

#### Cards
```css
.card {
  background: #FFFFFF;
  border-radius: 8px;
  padding: var(--space-8);
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
  border: 1px solid var(--border-light);
}
```

#### Input Fields
```css
.input {
  font-family: var(--font-body);
  font-size: 1rem;
  padding: 0.875rem 1rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: #FFFFFF;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(30,77,74,0.1);
}
```

### Layout

**Max Width**: 1200px for content, with 24px gutters (48px total padding on mobile, 80px on desktop)

**Grid**:
- Use CSS Grid for page layouts
- 12-column grid on desktop
- Single column with occasional 2-column on mobile

**Breakpoints**:
```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
```

---

## 4. Logo Creation

### Logo Requirements

Create a logo for "The Klara Project" with the following specifications:

**Concept Direction**:
- The name "Klara" derives from "Clarity" — the logo should suggest illumination, insight, clarity
- Should work for a Christian nonprofit without being overtly religious (no crosses in main logo)
- Must convey: trustworthiness, wisdom, warmth, intellectual seriousness
- Avoid: tech startup aesthetic, generic nonprofit look, AI/robot imagery

**Technical Requirements**:
- Primary logo: Wordmark "The Klara Project" (or "KLARA" with "PROJECT" smaller)
- Icon version: Standalone mark that works at 32x32px (favicon)
- Color versions: Full color, single color (teal), reversed (white on dark)
- File formats: SVG (primary), PNG at multiple sizes

**Suggested Approaches** (choose one):
1. **Typographic focus**: Custom lettering for "KLARA" with subtle distinctive element — perhaps the "K" has a subtle light motif, or the "A" is treated distinctively
2. **Abstract mark + wordmark**: Simple geometric mark suggesting light/clarity (a lens, a beam, overlapping circles creating light) paired with clean wordmark
3. **Monogram**: Stylized "K" that can stand alone

**Style**:
- Clean, not ornate
- Timeless rather than trendy
- Sophisticated but approachable
- Should look good in the deep teal accent color

**For the Build**: If logo creation is not possible, create a clean typographic treatment:
- "THE KLARA PROJECT" in Source Serif 4, 600 weight
- "THE" smaller, above "KLARA PROJECT"
- Deep teal color
- This can serve until professional logo is developed

---

## 5. Site Architecture

### Navigation Structure

```
Primary Navigation:
├── Home
├── Why The Klara Project?
├── Resources
├── Get Involved
└── Donate (CTA button, styled differently)

Footer Navigation:
├── Home
├── Why The Klara Project?
├── Resources
├── Get Involved
├── Donate
├── Privacy Policy
├── Terms of Service
└── Contact

Hidden (until content exists):
└── Updates/Blog (build the page but exclude from navigation)
```

### URL Structure
```
/                           → Homepage
/why-klara-project          → Mission, differentiators, faith statement
/resources                  → Resource library and downloads
/get-involved               → Ways to participate
/donate                     → Donation page
/updates                    → Blog/news (hidden from nav initially)
/privacy-policy             → Privacy policy
/terms-of-service          → Terms of service
```

---

## 6. Page-by-Page Specifications

### 6.1 Homepage

**Purpose**: Introduce the mission, establish credibility, drive donations

**Hero Section**:
- Headline: "AI Is Here. Help the Church Respond."
- Subhead: "Curriculum for pastors. Guides for parents. Programs for the generations who will live with AI longest. Join us from the start."
- Primary CTA: "Get Involved" (button, links to /get-involved)
- Secondary CTA: "Learn Why This Matters" (text link, scrolls to Challenge section)
- Background: Warm cream with subtle texture (paper grain or very subtle pattern)
- Hero image: Intergenerational conversation — older adult and young person in genuine dialogue. Source high-quality stock photo. If using AI-generated, add small text: "Image generated with AI"

**The Challenge Section**:
Background: Alternate to `--bg-secondary`

Story box (styled as a subtle card or inset):
```
Pastor Michael has led his congregation through a recession and a pandemic. He knows how to walk with families through job loss and uncertainty. But the questions landing on his desk now are different.

A longtime member was let go when her firm adopted AI software—and she's not sure her skills will ever be marketable again. A father asks whether it's wise to let his kids use AI tutoring tools. A young engineer feels isolated, unsure how to think Christianly about the systems she's building at work.

These are new questions. Most churches have no framework for them. And Christian voices are largely absent from the rooms where AI's future is being decided.
```

Scripture quote (styled distinctively, perhaps with gold accent):
> "My people are destroyed for lack of knowledge." —Hosea 4:6

**By the Numbers Section**:
Three statistics in a horizontal layout (single column on mobile):

| Statistic | Label |
|-----------|-------|
| 2026–2027 | Leading AI companies predict human-level capabilities within this timeframe |
| 14 Million | Net job loss forecast by the World Economic Forum by 2027 |
| 12–14% | Share of workers who may need to transition to entirely new occupations by 2030 |

Style: Large numbers in Source Serif, gold accent color. Labels in body text.

**Our Response Section**:
Headline: "Our Response: Equip and Engage"

Body text:
```
The Klara Project takes a two-part approach. First, we equip churches with practical resources—curricula, conversation guides, and pastoral frameworks that help congregations think clearly about AI. Then, building on that foundation of service and expertise, we engage the broader culture to ensure Christian perspectives shape technology development.

Influence is earned through demonstrated expertise and genuine service. That's why we start with equipping and build toward engagement.
```

CTA: "See What We're Building →" (links to section below or /resources)

**What We're Building Section**:
Grid of 5 items (2 columns on desktop, 1 on mobile), each as a card:

1. **Video-Based Curriculum** — A 13-week series for small groups, Sunday school, or workshops—helping Christians apply biblical principles to AI challenges.

2. **Conversation Guides** — Practical frameworks for pastors on job displacement, raising children in the AI age, and everyday ethical decisions.

3. **Student Essay Competition** — Annual competition where students use AI and submit their process—judged on both product and discernment.

4. **Educational Grants** — Research funding for students exploring AI, faith, and ethics.

5. **Pastoral Care Resources** — Training for ministering to families affected by technological unemployment.

**Founder Section**:
Background: Warm cream or subtle teal tint

Layout: Two columns — photo left, text right (stacked on mobile)

Content:
```
About the Founder

The idea for The Klara Project was born when Dr. Pisani taught a Sunday school class on faith and AI and watched people young and old leave encouraged—strengthened in their faith and in the reality that the core of our humanity is relationship with God, not our reason or abilities.

Anthony R. Pisani, Ph.D., is a clinical psychologist, internationally recognized leader in suicide prevention, and entrepreneur. A committed Christian, he came to faith as an adult while in graduate school. He has been married 25 years and is the father of three. He is an active member of Cornerstone Presbyterian Church in Rochester, New York.

Dr. Pisani is the founder of SafeSide Prevention, a mission-driven company providing suicide prevention training to government agencies, military branches, and health systems across the United States, Australia, New Zealand, and the United Kingdom.

The Klara Project is co-located with SafeSide's full-service production studio, providing immediate access to professional video production and communications infrastructure.
```

Photo: Professional headshot of Tony (will be provided)

**Video Embed** (when available):
Place below or alongside founder section. 16:9 aspect ratio. YouTube or Vimeo embed.

**Partner With Us Section**:
Headline: "Partner With Us"

Body:
```
The window for Christian influence is narrow but real. Major AI companies are making decisions now that will affect generations. Churches need resources now—not after the crisis arrives.
```

Scripture:
> "And let us consider how to stir up one another to love and good works." —Hebrews 10:24

CTA buttons:
- Primary: "Support Our Mission" → /donate
- Secondary: "Read the White Paper" → opens download modal (email capture)

---

### 6.2 Why The Klara Project Page (/why-klara-project)

**Hero**:
- Headline: "Why The Klara Project?"
- Subhead: "Filling a gap no one else is filling"

**What Makes Us Different Section**:
```
Other faith-based organizations address technology ethics at the policy or academic level. The Ethics and Religious Liberty Commission, the Center for Public Justice, various Catholic initiatives—we welcome their work. But The Klara Project fills a different gap.

We focus on practical equipping for local churches while building toward credible engagement with the technology industry. We create the Sunday school curricula, pastoral frameworks, and conversation guides that ordinary congregations need right now. We position Christians as constructive partners—not just critics—in technology development.

We believe influence must be earned through demonstrated expertise and genuine service. That's why we start with equipping and build toward engagement.
```

**Mission & Vision Section**:
Two-column layout with teal accent borders:

**Our Mission**
- **Equip** churches and Christians with practical resources for the AI age.
- **Engage** the broader culture to ensure Christian perspectives shape technology development.

**Our Vision**
A future where Christians have both a voice and real choices in the development of artificial intelligence and robotics—technologies that will define not just our children's future, but our present reality.

**What Christians Bring Section**:
```
Why should technology companies and policymakers listen to Christians? Because the Christian tradition offers intellectual resources that secular AI ethics lacks.

The doctrine of imago Dei—that humans are made in God's image—grounds human dignity in something transcendent, not merely cognitive capability. But if machines can reason and create, what does make humans unique?

The Christian answer has never been intellect alone. We are embodied souls, created for communion with God and one another. We bear moral responsibility. We are capable of love—not as a computation, but as a choice to give ourselves for another's good. We worship. We hope. We were made to know and be known.

We bring two thousand years of reflection on moral decision-making, the limits of human power, and the nature of genuine relationship. These insights deserve a seat at the table where AI's future is being decided.
```

**Our Measured Approach Section**:
Four items with subtle icons:
- **Infrastructure first.** Legal formation, website, donor systems before programming.
- **Early operational support.** Executive coordinator hired in the foundation phase.
- **Content through contractors.** Video curricula developed by professionals.
- **Phased complexity.** Advanced initiatives only after establishing credibility and expertise.

**Investing in the Next Generation Section**:
```
Generation Z will be most affected by AI transformation. They enter a workforce being reshaped in real time and will live with the consequences of decisions being made today.

The Klara Project is committed to developing Gen Z leaders within our organization: board representation, hiring young leaders when consistent with excellence, and building succession planning from the start. We don't just serve this generation; we platform and develop them.

We are positioned at a strategic moment: the largest wealth transfer in history is underway. Our commitment to young leaders positions us to build relationships with emerging philanthropists who will shape Christian giving for decades.
```

**Advisory Board Section**:
Headline: "Advisory Board"
Content: "Coming Soon — We are assembling an advisory board with expertise in AI, theology, social enterprise, and education. Announcement forthcoming."

**Faith Statement Section**:
```
We affirm the historic Christian faith as expressed in the Nicene Creed—belief in one God, Father, Son, and Holy Spirit; in Jesus Christ as Lord and Savior; in the Holy Spirit who gives life to the Church; and in the hope of resurrection.

We believe that all people are created in the image of God (imago Dei), possessing inherent dignity and worth that no technology can replicate or replace.

We believe the Scriptures call Christians to be salt and light in the world—engaging culture, including technology, with wisdom, discernment, and love.

We welcome Christians from all traditions who share these convictions and this mission.
```

**White Paper Download CTA**:
Card with:
- Headline: "Founding White Paper"
- Body: "A full analysis of the challenges Christians face in AI and robotics development, and our vision for addressing them."
- CTA: "Download White Paper (PDF)" → triggers email capture modal

---

### 6.3 Resources Page (/resources)

**Hero**:
- Headline: "Resources"
- Subhead: "Practical tools for churches and Christians"

**Now Available Section**:
Card for White Paper:
- Title: "Founding White Paper"
- Description: "A full analysis of AI's impact on churches and families, the Christian intellectual tradition's relevance to technology ethics, and our vision for equipping and engaging."
- CTA: "Download White Paper (PDF)" → email capture modal

**In Progress Section**:
Headline: "In Progress—With Your Help"
Subhead: "We're building these resources now. Your support accelerates this work."

**Video-Based Curriculum**:
```
A 13-week series designed for small groups, Sunday school classes, or weekend workshops. Video segments introduce key concepts; discussion guides help participants apply biblical principles to AI challenges affecting their families and workplaces. Churches can use the full series or select modules for shorter engagements.
```
CTA: "Join our mailing list for development updates →" (email capture)

**Conversation Guides**:
```
Practical frameworks for church leaders to facilitate discussions about AI in your congregation:
• "When AI Takes Jobs: A Pastoral Response"
• "Raising Children in the Age of AI"
• "Christian Ethics for Everyday AI Decisions"
• "Relationships in an AI World"
```

**Coming As We Grow Section**:
Headline: "Coming as We Grow"
Subhead: "These programs launch as funding allows. Founding gifts make them possible sooner."

**Student Essay Competition**:
```
An annual competition inviting students from Christian colleges to write original essays on what the church needs in the age of AI. What makes this competition distinctive: students must use AI in their writing process and submit their complete AI conversations alongside their essays. Judging considers not only the final product—originality, practicality, and biblical soundness—but also the thinking and discernment demonstrated in how students collaborated with AI tools.
```

**Educational Grants**:
```
Small research grants for undergraduate and graduate students exploring questions at the intersection of AI, faith, and ethics. These grants cultivate the next generation of Christian voices in technology while producing scholarship that benefits the broader community.
```

**Resources by Audience Section**:
Three cards:

1. **For Churches** — Resources for pastors and church leaders to help congregations navigate technological change and prepare for members facing job displacement.

2. **For Families** — Practical guidance for parents making decisions about AI tools, educational technology, and home robotics.

3. **For Technologists** — Frameworks for Christians working in tech who want to think carefully about their work's ethical implications.

Footer text: "We're building this library as we grow."
CTA: "Stay informed as new resources launch →" (email capture)

---

### 6.4 Get Involved Page (/get-involved)

**Hero**:
- Headline: "Get Involved"
- Subhead: "Join us in equipping churches and engaging the culture"

**Give Section**:
```
Individual giving is the backbone of our funding strategy. Your donation directly supports curriculum development, educational grants, and the infrastructure needed for sustainable growth. Every contribution—from monthly support to founding gifts—helps us serve churches and represent Christian perspectives where decisions are being made.
```
CTA: "Support Our Mission →" (primary button, links to /donate)

**Stay Informed Section**:
```
Join our mailing list for updates on resources, research, and opportunities to engage.
```
Inline form: Email field + Subscribe button (HubSpot form)

**Volunteer Your Expertise Section**:
```
We're seeking professionals with backgrounds in AI, technology, education, theology, social enterprise, and ministry to contribute to specific projects or serve in advisory roles.
```
CTA: "Express Interest →" (links to contact form or mailto)

**Share Our Mission Section**:
```
Help spread awareness by sharing our resources with your church, small group, or professional networks. The more Christians engage with these issues, the stronger our collective voice.
```
Social share buttons: Facebook, X/Twitter, Email, LinkedIn

**Bring Us to Your Church Section**:
```
Interested in hosting a workshop, speaker, or pilot program? We're looking for church partners.
```
CTA: "Contact Us →" (mailto or contact form)

---

### 6.5 Donate Page (/donate)

**Critical**: This page must be optimized for conversion. Follow nonprofit donation page best practices.

**Hero**:
- Headline: "Support Our Mission"
- Subhead: "Equipping churches. Engaging the culture."

**Opening Copy**:
```
Your donation helps us create practical resources for churches and ensure Christian perspectives shape AI development. Every gift—monthly support or one-time contribution—moves this mission forward.
```

**Tax Deductibility Notice** (styled as a subtle info box):
```
The Klara Project has applied for 501(c)(3) tax-exempt status. Upon approval, donations will be tax-deductible retroactive to our date of incorporation. We will notify donors when approval is received.
```

**Donation Form Section**:

**Layout**: Single column, clean, no distractions

**Monthly vs One-Time Toggle**:
- **Monthly** selected by default (toggle at top)
- Clear visual indication of selected state

**Amount Buttons** (Monthly):
$25 | $50 | $100 | $250 | Custom

**Amount Buttons** (One-Time):
$50 | $100 | $250 | $500 | $1,000 | Custom

**Impact Statements** (show based on selected amount):
- $25/month: "Supports curriculum development for one small group module"
- $50/month: "Funds one student research grant application review"
- $100/month: "Enables one pastor conversation guide to reach 10 churches"
- $250/month: "Sponsors one student essay competition prize"

**Form Fields**:
- Email (required)
- Name (required)
- Message/dedication (optional, collapsible)

**CTA Button**: "Complete Donation" (green/teal, prominent)

**Security Note**: Small lock icon with "Secure donation processed by Stripe"

**Founding Gifts Section**:
Below the main form, separated visually:

Headline: "Founding Gifts"

```
Founding gifts of $1,000 or more provide the stable foundation this mission requires. These contributions fund curriculum development, educational grants, and the infrastructure that enables sustainable growth.
```

Amount buttons: $1,000 | $2,500 | $5,000 | $10,000 | $25,000 | Other Amount

```
Want to learn more before giving? We'd welcome the chance to share our plans and answer your questions.
```

CTA: "Schedule a Conversation with Our Founder →" (Calendly link or mailto)

**What Your Gift Supports Section**:
Four items with icons:
- **Curriculum Development** — Video-based resources that help churches think clearly about AI.
- **Educational Grants** — Funding for students exploring AI, faith, and ethics.
- **Pastoral Resources** — Training for ministering to families facing technological unemployment.
- **Thought Leadership** — Research and engagement that earns Christians a seat at the table.

**Closing Scripture**:
> "And let us consider how to stir up one another to love and good works." —Hebrews 10:24

---

### 6.6 Updates Page (/updates) — Hidden Initially

**Structure**: Simple blog layout
- List of posts with title, date, excerpt
- Individual post pages
- Categories/tags optional

**Note**: Build this page but exclude from navigation until content exists. Add to navigation when first post is published.

---

### 6.7 Header & Navigation

**Desktop Navigation**:
- Logo left
- Nav links center-right: Home | Why The Klara Project? | Resources | Get Involved
- Donate button (styled as primary button) far right

**Mobile Navigation**:
- Logo left
- Hamburger menu right
- Full-screen overlay with nav items
- Donate button prominent at bottom

**Sticky Header**: Header should become sticky on scroll with subtle shadow

---

### 6.8 Footer

**Layout**: Three or four columns

**Column 1: Brand**
- Logo
- Tagline: "Clarity for Christians in the Age of AI"
- Brief: "Equipping churches with practical resources. Engaging the culture to ensure Christian perspectives shape technology development."

**Column 2: Navigation**
- Home
- Why The Klara Project?
- Resources
- Get Involved
- Donate

**Column 3: Legal & Contact**
- Privacy Policy
- Terms of Service
- Contact: info@klaraproject.org

**Column 4: Newsletter Signup** (optional, could combine with Column 3)
- "Stay informed"
- Email field + Subscribe button

**Bottom Bar**:
- © 2025 The Klara Project. All rights reserved.
- "The Klara Project operates Christians for Responsible AI and Robotics."

---

## 7. Stripe Integration

### Requirements
- Use Stripe Checkout (hosted payment page) — NOT embedded custom forms
- Support both one-time and recurring (monthly) donations
- Support multiple preset amounts + custom amount
- Pass metadata: donor email, donation type, amount, any message

### Implementation Approach

**Create Stripe Products**:
- One-time donation product (price determined at checkout)
- Monthly recurring donation product (price determined at checkout)

**Checkout Flow**:
1. User selects amount and frequency on /donate page
2. Click "Complete Donation" calls API route
3. API route creates Stripe Checkout session with:
   - Selected price/amount
   - Billing mode (payment vs subscription)
   - Success URL: /donate/thank-you
   - Cancel URL: /donate
   - Metadata: source, campaign, etc.
4. User redirected to Stripe Checkout
5. After payment, redirected to thank you page
6. Webhook receives payment confirmation, triggers HubSpot update

**Stripe Checkout Session Creation** (example):
```javascript
// /api/create-checkout-session

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const { amount, frequency, email } = await request.json();
  
  const session = await stripe.checkout.sessions.create({
    mode: frequency === 'monthly' ? 'subscription' : 'payment',
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: frequency === 'monthly' 
            ? 'Monthly Donation to The Klara Project'
            : 'Donation to The Klara Project',
        },
        unit_amount: amount * 100, // Stripe uses cents
        ...(frequency === 'monthly' && { recurring: { interval: 'month' } }),
      },
      quantity: 1,
    }],
    customer_email: email,
    success_url: `${process.env.NEXT_PUBLIC_URL}/donate/thank-you?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/donate`,
    metadata: {
      source: 'website',
      frequency: frequency,
    },
  });
  
  return Response.json({ url: session.url });
}
```

**Thank You Page** (/donate/thank-you):
- Headline: "Thank You for Your Gift"
- Confirmation message
- Share buttons
- Link back to homepage

### Stripe Webhook
Set up webhook to handle:
- `checkout.session.completed`
- `invoice.paid` (for recurring)

Webhook should:
- Log donation to database/spreadsheet
- Trigger HubSpot contact update
- Send confirmation email (can use Stripe's built-in receipts)

---

## 8. HubSpot Integration

### Requirements
- Email capture forms throughout site
- Contact tracking (page views, form submissions)
- Donation events synced from Stripe
- Support for future ad tracking

### HubSpot Tracking Code
Add to `<head>` of all pages:
```html
<!-- Start of HubSpot Embed Code -->
<script type="text/javascript" id="hs-script-loader" async defer src="//js.hs-scripts.com/YOUR_PORTAL_ID.js"></script>
<!-- End of HubSpot Embed Code -->
```

### Forms to Implement

**1. Newsletter Signup** (multiple locations)
Fields:
- Email (required)

On submit:
- Add to HubSpot contact
- Add to "Newsletter" list
- Show success message inline

**2. White Paper Download**
Triggered by: "Download White Paper" buttons

Modal form fields:
- Email (required)
- First Name (optional)
- Church/Organization (optional)

On submit:
- Add to HubSpot contact
- Add to "White Paper Downloads" list
- Trigger white paper PDF download
- Show success message with download link

Explanation text in modal:
```
We'll send you the white paper and occasional updates on The Klara Project's work. You can unsubscribe at any time.
```

**3. Volunteer Interest**
Fields:
- Email (required)
- Name (required)
- Area of expertise (dropdown: AI/Technology, Theology, Education, Ministry, Social Enterprise, Other)
- Brief message (textarea)

On submit:
- Create HubSpot contact with properties
- Notification to team

### HubSpot Form Implementation Options

**Option A: HubSpot Embedded Forms**
Use HubSpot's form builder, embed via iframe or HubSpot form API. Simplest approach, less design control.

**Option B: Custom Forms with HubSpot API**
Build custom-styled forms, submit via HubSpot Forms API:
```javascript
// Submit to HubSpot
await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fields: [
      { name: 'email', value: email },
      { name: 'firstname', value: firstName },
    ],
    context: {
      pageUri: window.location.href,
      pageName: document.title,
    },
  }),
});
```

**Recommendation**: Use Option B (custom forms) for design consistency, with HubSpot tracking code for page view tracking.

### Donation Sync
When Stripe webhook fires, update HubSpot contact:
- Set property: `last_donation_date`
- Set property: `total_donated` (increment)
- Set property: `donor_type` (monthly/one-time)
- Add to appropriate list

---

## 9. SEO Requirements

### Technical SEO

**Meta Tags** (per page):
```html
<title>Page Title | The Klara Project</title>
<meta name="description" content="Page-specific description, 150-160 chars">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://klaraproject.org/page-url">
```

**Open Graph Tags**:
```html
<meta property="og:title" content="Page Title | The Klara Project">
<meta property="og:description" content="Description">
<meta property="og:image" content="https://klaraproject.org/og-image.jpg">
<meta property="og:url" content="https://klaraproject.org/page-url">
<meta property="og:type" content="website">
<meta property="og:site_name" content="The Klara Project">
```

**Twitter Cards**:
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Page Title">
<meta name="twitter:description" content="Description">
<meta name="twitter:image" content="https://klaraproject.org/twitter-image.jpg">
```

**Structured Data** (Organization):
```json
{
  "@context": "https://schema.org",
  "@type": "NonProfit",
  "name": "The Klara Project",
  "description": "Clarity for Christians in the Age of AI",
  "url": "https://klaraproject.org",
  "logo": "https://klaraproject.org/logo.png",
  "sameAs": [
    "https://facebook.com/klaraproject",
    "https://twitter.com/klaraproject"
  ]
}
```

### Page-Specific SEO

**Homepage**:
- Title: "The Klara Project | Clarity for Christians in the Age of AI"
- Description: "Equipping churches with practical AI resources and engaging culture to ensure Christian perspectives shape technology development. Curricula, guides, and grants for the AI age."

**Why The Klara Project**:
- Title: "Why The Klara Project? | Christian AI Ethics & Church Resources"
- Description: "Learn why Christians need dedicated resources for the AI age. Trans-denominational, practical equipping for churches plus credible cultural engagement."

**Resources**:
- Title: "Resources | The Klara Project"
- Description: "Practical tools for churches and Christians navigating AI: video curriculum, conversation guides, student programs, and pastoral care resources."

**Get Involved**:
- Title: "Get Involved | The Klara Project"
- Description: "Join the mission to equip churches and engage culture on AI. Donate, volunteer expertise, share resources, or bring us to your church."

**Donate**:
- Title: "Support Our Mission | The Klara Project"
- Description: "Your donation supports curriculum development, student grants, and pastoral resources for the AI age. Monthly and one-time giving options."

### Performance
- Achieve Lighthouse score of 90+ on Performance, Accessibility, Best Practices, SEO
- Implement lazy loading for images
- Optimize images (WebP format, appropriate sizes)
- Minimize JavaScript bundle size

---

## 10. Accessibility Requirements

### WCAG 2.1 AA Compliance

**Color Contrast**:
- All text must meet 4.5:1 contrast ratio (body text)
- Large text (18px+ or 14px+ bold): 3:1 minimum
- Interactive elements: 3:1 against adjacent colors

**Verify with design system**:
- Deep charcoal (#2D2A27) on cream (#FAF8F5): ~12:1 ✓
- Deep teal (#1E4D4A) on cream: ~7:1 ✓
- White on deep teal: ~8:1 ✓

**Keyboard Navigation**:
- All interactive elements must be focusable
- Focus states must be visible (don't remove outline without replacement)
- Tab order must be logical
- Skip to main content link at top

**Screen Reader Support**:
- Semantic HTML (proper heading hierarchy, landmarks)
- Alt text for all images
- ARIA labels where needed
- Form labels properly associated

**Focus States**:
```css
:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}
```

**Reduced Motion**:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Testing Checklist**:
- [ ] Navigate entire site using only keyboard
- [ ] Test with screen reader (VoiceOver, NVDA)
- [ ] Verify color contrast with tool (WebAIM, Stark)
- [ ] Check heading hierarchy
- [ ] Verify form labels
- [ ] Test at 200% zoom

---

## 11. Legal Pages

### Privacy Policy (/privacy-policy)

Generate a privacy policy covering:
- Information collected (email, name, donation info)
- How information is used (communications, donation processing)
- Third-party services (Stripe, HubSpot, analytics)
- Cookies and tracking
- Data retention
- User rights (access, deletion)
- Contact information
- Updates to policy

**Key Points to Include**:
- We collect email addresses for newsletter and resource delivery
- We use HubSpot for email marketing and contact management
- We use Stripe for payment processing (we don't store payment details)
- We use cookies for analytics and site functionality
- Users can unsubscribe from emails at any time
- Users can request data deletion by contacting us

### Terms of Service (/terms-of-service)

Generate terms covering:
- Acceptance of terms
- Use of website and resources
- Intellectual property
- Donations and refunds
- Limitation of liability
- Governing law
- Changes to terms
- Contact information

**Key Points**:
- Resources are provided for personal and church use
- Donations are generally non-refundable but contact us with concerns
- Content is copyrighted by The Klara Project
- We're not liable for decisions made based on our content

---

## 12. Photography & Imagery

### Photography Guidelines

**Subject Matter**:
- Intergenerational groups in genuine conversation
- Church settings (small groups, worship, community)
- Families with technology (but not staged/awkward)
- Professionals in collaborative settings
- Diverse representation (age, ethnicity, context)

**Style**:
- Natural lighting preferred
- Warm color temperature
- Authentic, not overly posed
- High quality (minimum 2000px wide)

**What to Avoid**:
- Stock photo clichés (pointing at screens, fake smiles)
- Cold, clinical tech imagery
- Robots or AI visualizations
- Anything that reads as "corporate"

### Image Sources

**Preferred**: Real photography when available
- Founder headshot (required)
- SafeSide studio/team (if appropriate)
- Church partners (with permission)

**Stock Photos**:
- Unsplash (free, high quality)
- Pexels (free)
- Consider paid: Stocksy (authentic feel), Death to Stock

**AI-Generated Images**:
If using AI-generated images:
- Must be photorealistic
- Must include disclosure: "Image generated with AI"
- Place disclosure as small text below image
- Use sparingly — real photos preferred

### Required Images

1. **Hero image**: Intergenerational conversation
2. **Founder headshot**: Professional, warm
3. **OG/social sharing image**: 1200x630px, branded
4. **Favicon**: 32x32, 16x16, from logo
5. **Resource placeholder images**: For curriculum, guides, etc.

---

## 13. Deployment & Maintenance

### Deployment

**Recommended**: Vercel
- Connect to GitHub repository
- Automatic deployments on push to main
- Preview deployments for pull requests
- Built-in SSL, CDN, analytics

**Environment Variables**:
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
HUBSPOT_PORTAL_ID=...
HUBSPOT_FORM_GUID_NEWSLETTER=...
HUBSPOT_FORM_GUID_WHITEPAPER=...
NEXT_PUBLIC_URL=https://klaraproject.org
```

### Domain Configuration
- Primary: klaraproject.org
- Redirect: www.klaraproject.org → klaraproject.org
- SSL: Required (automatic with Vercel)

### Maintenance Considerations

**For Non-Technical Maintainers**:
- Content updates via CMS (Sanity/Contentful) or Markdown files
- AI coding agents can help with changes
- Document all custom code clearly
- Keep dependencies updated (Dependabot)

**Regular Tasks**:
- Review and respond to form submissions
- Update content as needed
- Monitor donation processing
- Check analytics monthly
- Update dependencies quarterly

### Cost Estimates

| Service | Monthly Cost |
|---------|--------------|
| Vercel (Pro) | $20 |
| HubSpot Marketing Starter | $20 |
| Stripe | 2.9% + $0.30 per transaction |
| Domain renewal | ~$15/year |
| **Total (before Stripe fees)** | **~$45/month** |

---

## Appendix A: Content Checklist

Before launch, ensure all content is ready:

- [ ] Homepage copy finalized
- [ ] Why The Klara Project copy finalized
- [ ] Resources page copy finalized
- [ ] Get Involved page copy finalized
- [ ] Donate page copy finalized
- [ ] Founder bio and headshot
- [ ] White paper PDF ready for download
- [ ] Privacy policy reviewed
- [ ] Terms of service reviewed
- [ ] OG images created
- [ ] Favicon created
- [ ] All forms tested
- [ ] Stripe integration tested (use test mode)
- [ ] HubSpot tracking verified
- [ ] Mobile responsiveness verified
- [ ] Accessibility audit completed

---

## Appendix B: Post-Launch Checklist

After launch:

- [ ] Submit sitemap to Google Search Console
- [ ] Verify Google Analytics/HubSpot tracking
- [ ] Test donation flow with real payment
- [ ] Set up Stripe webhook notifications
- [ ] Configure HubSpot email sequences
- [ ] Create social media accounts (if not existing)
- [ ] Share launch with networks
- [ ] Monitor for errors (Vercel logs)

---

**End of Specification**

*This document provides complete guidance for building the Klara Project website. Questions or clarifications should be addressed before beginning development.*
