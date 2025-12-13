# The Klara Project Website

## Overview
A sophisticated nonprofit website for The Klara Project, a Christian nonprofit with the mission "Christian Clarity for the AI Age." The site equips churches with practical resources and engages culture to ensure Christian perspectives shape technology development.

## Project Architecture

### Frontend (React + Vite)
- **Framework**: React with Vite, TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with custom warm cream/teal color palette
- **Typography**: Source Serif 4 (headings), IBM Plex Sans (body)
- **UI Components**: Shadcn/UI component library

### Design System
- **Philosophy**: "Grounded Clarity" - warm, human, trustworthy
- **Colors**: 
  - Primary background: Warm cream (#FAF8F5)
  - Accent: Deep teal (#1E4D4A)
  - Gold accent for statistics and highlights (#C9A962)
  - Charcoal text (#2D2A27)
- **No dark mode** - Site uses warm cream aesthetic

### Pages
- `/` - Homepage with hero, mission overview, statistics, founder bio
- `/why-klara-project` - Mission, vision, faith statement, approach
- `/resources` - Resource library with downloadable white paper
- `/get-involved` - Donation, newsletter, volunteer, sharing options
- `/donate` - Donation form with monthly/one-time options
- `/donate/thank-you` - Thank you confirmation page
- `/manage-donation` - Donor portal with email verification, view history, manage payment
- `/privacy-policy` - Privacy policy
- `/terms-of-service` - Terms of service

### Key Components
- `Header.tsx` - Navigation with mobile hamburger menu
- `Footer.tsx` - Site footer with newsletter signup
- `HeroSection.tsx` - Main hero with background image
- `DonationForm.tsx` - Interactive donation form with amount selection and fixed-term duration options
- `PartnerSection.tsx` - White paper download with email capture modal

### Backend (Express)
- **Framework**: Express.js
- **Stripe Integration**: Ready for payment processing
- **Port**: 5000

## Integrations
- **Stripe**: Configured for donation processing (sandbox mode)
- **HubSpot**: Planned for form submissions and email marketing (API key method)

## Recent Changes
- Initial build of complete website prototype
- All 8 pages implemented with full content
- AI-generated images for hero and sections
- Mobile-responsive design
- Interactive forms with state management
- Stripe integration with working checkout sessions
- Donor portal with email verification (code-based authentication)
- Donor dashboard showing subscription and payment history with Stripe portal integration
- Fixed-term donation option for monthly subscriptions (3, 6, 12 months with auto-cancel)
- Cookie consent banner with visitor tracking integration
- Page visit tracking to HubSpot (gated behind cookie consent)
- Communication consent checkbox on donation form (synced to HubSpot)

## Development Notes
- Run with `npm run dev`
- Frontend served on port 5000
- Images stored in `attached_assets/generated_images/`
