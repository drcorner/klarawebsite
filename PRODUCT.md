# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users for product decisions are **church leaders** (pastors, small group leaders) seeking practical resources so their congregations can navigate AI with Christian clarity.

Confirmed secondary audiences:

- **Christian parents** navigating AI with their families
- **Major founding donors** and **monthly supporters** (primary conversion path on the public site)
- **Students** interested in essay competitions and grants
- **Christian technologists** seeking frameworks for their work

## Product Purpose

The Klara Project is a Christian nonprofit website (klaraproject.org) that builds trust, captures leads, accepts donations, and positions the organization as a credible voice on faith and AI.

Success means churches get usable curricula and guides, supporters can give and stay engaged, and the organization earns the standing to engage culture and technology development—not merely critique it.

## Positioning

Klara starts where churches actually live: Sunday school curricula, pastoral frameworks, and conversation guides for ordinary congregations—then builds toward credible engagement with the technology industry.

Mechanism neighbors cannot truthfully copy: **equip first, engage second**—practical congregational resources before policy advocacy or academic research alone; Christians as constructive partners, not only critics; influence earned through demonstrated expertise and genuine service. Trans-denominational.

Mission triad: **Equip** churches · **Engage** culture · **Empower** the next generation.

## Operating Context

Public marketing and donation site with:

- Homepage narrative (challenge, response, what we’re building, founder, partner/white paper, CTA)
- About / mission and approach
- Next-generation programs
- Get involved (donate, volunteer, newsletter, share, church inquiry)
- Donate and donor portal (Stripe checkout, email verification, subscription management)
- Privacy and terms

Integrations in active use or planned: **Stripe** (donations), **HubSpot** (contacts, email, page tracking gated by cookie consent), **reCAPTCHA v3** on donation flows. Dev command: `npm run dev` (Express serves the Vite client).

## Capabilities and Constraints

Confirmed functionality: multi-page React SPA; Stripe one-time and monthly donations (including fixed-term monthly options); donor portal; newsletter and form submissions; white paper download with email gate; cookie consent and HubSpot page-visit tracking; rate limiting and spam protection on APIs.

Must preserve: Christian nonprofit identity; domain **klaraproject.org**; founder **Dr. Anthony R. Pisani** and SafeSide studio co-location facts when leadership context is shown; legal pages and donation trust requirements.

Undecided / do not invent: specific pricing or fundraising totals not already published; third-party testimonials or partner logos not present in the repo; claims that programs are fully launched when site copy still frames founding/build phase.

## Brand Commitments

- Name: **The Klara Project** / **Klara Project**
- Tagline in live chrome: **Christian Clarity for the AI Age**
- Voice: trustworthy, human, warm, institutionally credible—not startup-flashy; must not read as generic AI-generated marketing (mission addresses AI and human dignity)
- Founder identity and SafeSide production-studio co-location are factual brand context when leadership is presented

## Evidence on Hand

- Site copy and page structure under `client/src/`
- Build specification and pasted briefs in `attached_assets/` (including founder photo and generated imagery)
- Design notes in `design_guidelines.md` / `replit.md` (visual authority is separate from this product record)
- HubSpot planning docs under `docs/`
- White paper path referenced as `/klara-project-white-paper.pdf`

Do not fabricate testimonials, press, customer logos, or outcome metrics beyond what these sources contain.

## Product Principles

1. **Equip before engage** — Congregational usefulness comes before cultural influence claims.
2. **Earn trust** — Design and copy must support both grassroots monthly givers and major founding donors.
3. **Stay human** — Relational, church-real language and imagery; never undermine the anti–AI-generic credibility constraint.
4. **Conversion without hype** — Donations and lead capture are core jobs; they must feel institutional and clear, not coercive.
5. **Preserve product truth** — Founder, mission triad, legal/donation realities, and live integrations are not decorative copy.

## Accessibility & Inclusion

Target **WCAG 2.1 AA** (contrast, keyboard access, semantic structure, focus visibility, reduced-motion respect) as specified in the project build requirements.
