# Scope of Work: Klara Project Website — HubSpot Integration (Phase 2)

## Project Overview

The Klara Project website (Node.js/Express backend, React frontend) has an existing HubSpot integration that captures contacts and creates deals when users donate, sign up for the newsletter, volunteer, share experiences, or download a white paper. However, the integration has significant gaps:

1. **No real-time notifications** — The site owner receives no alerts when actions occur on the website
2. **Sparse labeling** — Contacts, deals, and pipeline items in HubSpot lack context; it's not immediately transparent what a contact did or how they engaged
3. **Pipeline gaps** — Some donors do not enter a pipeline at all (e.g., if they close their browser before the thank-you page loads), and non-donation engagements (volunteers, experience submissions) have no pipeline presence
4. **Church/workshop inquiry form is not tracked** — Still uses a `mailto:` link with no HubSpot capture

The freelancer will configure HubSpot (custom properties, pipelines, workflows, notifications) AND modify the website codebase to close these gaps.

---

## Area 1: Real-Time Owner Notifications

### Current State
- The only emails sent are donation thank-you emails **to the donor** via SendGrid (`server/sendgridClient.ts`)
- The site owner receives **zero alerts** when any website action occurs
- No HubSpot workflows are configured

### Requirements

**1.1 — HubSpot Workflow Notifications**
Configure HubSpot workflows to send the site owner an email notification when:
- A new donation deal is created
- A new volunteer signup contact is created/updated
- A new experience/feedback submission occurs
- A newsletter signup occurs
- A white paper download occurs

Each notification email should include the contact's name, email, and the specific action they took (donation amount, volunteer expertise, etc.).

**1.2 — HubSpot Mobile Push Notifications**
Evaluate and configure HubSpot mobile app push notifications for high-priority events (new donations at minimum). Document whether the HubSpot plan supports this or if an upgrade is needed.

**1.3 — Server-Side Backup Notifications**
As a complement to HubSpot workflows (which may have delays), add immediate server-side notification emails via SendGrid in `server/routes.ts` at each form submission endpoint. This ensures the owner gets an email within seconds, independent of HubSpot workflow timing.

**Endpoints to add owner notification emails:**
- `/api/send-donation-thank-you` (line ~705 in `server/routes.ts`)
- `/api/newsletter/subscribe` (line ~732)
- `/api/whitepaper/download` (line ~756)
- `/api/volunteers/submit` (line ~802)
- `/api/experience/submit` (line ~832)

New email template(s) should be added to `server/sendgridClient.ts`.

---

## Area 2: HubSpot Deal & Contact Labeling Improvements

### Current State
- Deals are created with names like `"Donation - John Doe - $50 One-Time"` — there is no structured metadata beyond this string
- Deal pipeline is `"default"` with stage `"closedwon"` — no progression tracking
- Contacts have only basic fields: `email`, `firstname`, `lastname`, `lifecyclestage`
- No way to see at a glance in HubSpot *how* a contact engaged (donor vs. volunteer vs. newsletter subscriber)
- Donation frequency, duration, Stripe reference, and subscription status are not stored in HubSpot

### Requirements

**2.1 — Custom Contact Properties (HubSpot Configuration)**
Create the following custom contact properties in HubSpot:

| Property | Type | Purpose |
|----------|------|---------|
| `engagement_source` | Multi-checkbox | How they engaged: Donation, Volunteer, Newsletter, Experience, White Paper, Church Inquiry |
| `donation_frequency` | Dropdown | One-Time, Monthly |
| `total_lifetime_donations` | Number (currency) | Running total of all donations |
| `volunteer_expertise` | Single-line text | Area of expertise from volunteer form |
| `communication_consent` | Checkbox | Whether they opted in to communications |
| `stripe_customer_id` | Single-line text | Stripe customer ID for cross-reference |

**2.2 — Custom Deal Properties (HubSpot Configuration)**
Create the following custom deal properties:

| Property | Type | Purpose |
|----------|------|---------|
| `donation_type` | Dropdown | One-Time, Monthly |
| `donation_duration` | Number | Duration in months (for fixed-term recurring) |
| `stripe_session_id` | Single-line text | Stripe checkout session ID |
| `stripe_subscription_id` | Single-line text | Stripe subscription ID (for recurring) |
| `subscription_status` | Dropdown | Active, Cancelled, Failed, Completed |

**2.3 — Code Updates to Populate New Properties**
Update all tracking functions in `server/hubspotClient.ts` to populate the new properties:

- `trackDonation()` (line 127): Add `engagement_source`, `donation_frequency`, `stripe_customer_id`, and all new deal properties
- `trackNewsletterSignup()` (line 99): Add `engagement_source = Newsletter`
- `trackWhitePaperDownload()` (line 187): Add `engagement_source = White Paper`
- `trackVolunteerSignup()` (line 290): Add `engagement_source = Volunteer`, `volunteer_expertise`
- `trackExperienceSubmission()` (line 353): Add `engagement_source = Experience`
- `updateCommunicationConsent()` (line 254): Populate `communication_consent` custom property in addition to `hs_email_optout`

**Important:** `engagement_source` is a multi-checkbox because a single contact may engage in multiple ways (e.g., donate AND volunteer). Each function should **append** to this field, not overwrite it.

---

## Area 3: Pipeline & Lifecycle Stage Fixes

### Current State
- All donation deals go to `"default"` pipeline at `"closedwon"` — no ability to track pending, recurring, failed, or cancelled states
- Volunteers and experience submitters are marked as `"lead"` lifecycle but create **no deal or ticket** — they only get a HubSpot Note (association type 202), making them invisible in pipeline views
- Church/workshop inquiry form in `client/src/pages/GetInvolved.tsx` (line 127) is a `mailto:` link — no data is captured in HubSpot
- Lifecycle stages can regress (e.g., a customer who signs up for newsletter could be downgraded to subscriber)

### Requirements

**3.1 — Custom Donations Pipeline (HubSpot Configuration)**
Create a "Donations" pipeline with the following stages:
- Pending (checkout started but not completed)
- Completed (one-time donation received)
- Recurring Active (monthly subscription active)
- Recurring Renewed (payment received on existing subscription)
- Recurring Cancelled (subscription cancelled)
- Payment Failed

**3.2 — Engagement Pipeline (HubSpot Configuration)**
Create an "Engagement" pipeline for non-donation interactions:
- New Inquiry
- In Progress
- Responded
- Closed

**3.3 — Update Deal Creation Code**
Modify `trackDonation()` in `server/hubspotClient.ts` (line 162-177) to:
- Use the custom "Donations" pipeline instead of `"default"`
- Set appropriate stage based on donation type (Completed for one-time, Recurring Active for monthly)

**3.4 — Create Deals for Non-Donation Engagements**
Update `trackVolunteerSignup()` and `trackExperienceSubmission()` in `server/hubspotClient.ts` to create deals in the "Engagement" pipeline in addition to (or instead of) creating Notes.

**3.5 — Church/Workshop Inquiry Form**
- Convert the `mailto:` link in `client/src/pages/GetInvolved.tsx` (line ~127) to a proper form
- Create a new API endpoint `/api/inquiry/submit` in `server/routes.ts`
- Add a `trackInquiry()` function in `server/hubspotClient.ts` that creates a contact and a deal in the Engagement pipeline
- Include owner notification email

**3.6 — Lifecycle Stage Protection**
Add logic to `upsertContact()` in `server/hubspotClient.ts` (line 50-96) to prevent lifecycle stage regression. Before setting lifecycle stage, check the current stage and only set it if the new stage is a progression (subscriber → lead → opportunity → customer).

---

## Area 4: Stripe Webhook → HubSpot Sync

### Current State
`server/webhookHandlers.ts` receives Stripe webhook events (`checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.created/updated/deleted`) but **only logs them** to the console. No HubSpot updates occur from webhooks.

Currently, HubSpot deal creation happens in the `/api/send-donation-thank-you` endpoint (called from the thank-you page). **If a donor closes their browser before the thank-you page loads, the donation is never recorded in HubSpot.**

### Requirements

**4.1 — Move Deal Creation to Webhook**
Move HubSpot deal creation from the thank-you page flow to the `checkout.session.completed` webhook handler. This ensures every completed payment enters HubSpot regardless of browser behavior.

Update `server/webhookHandlers.ts` to call `trackDonation()` on `checkout.session.completed`. The Stripe session metadata already contains all needed fields (donor name, email, amount, frequency, duration, communication consent).

**4.2 — Handle Recurring Payment Events**
Add webhook handlers for:
- `invoice.paid`: Update the existing deal's stage or create a new deal for the renewal payment. Increment the contact's `total_lifetime_donations` property.
- `invoice.payment_failed`: Update deal stage to "Payment Failed". Trigger an immediate owner notification.
- `customer.subscription.deleted`: Update deal stage to "Recurring Cancelled".

**4.3 — Deduplicate Thank-You Page Tracking**
After moving deal creation to the webhook, update `/api/send-donation-thank-you` in `server/routes.ts` (line ~705) to **not** call `trackDonation()` redundantly. It should still send the thank-you email and update communication consent, but deal creation should be webhook-driven only.

---

## Area 5: Newsletter Signup Frontend Fix

### Current State
`client/src/components/NewsletterSignup.tsx` has a `console.log` on form submit (line 17). The backend endpoint `/api/newsletter/subscribe` exists and works, but the frontend never calls it.

### Requirements
- Wire `NewsletterSignup.tsx` to call `/api/newsletter/subscribe` via fetch/POST
- Add appropriate loading/success/error states in the UI
- Confirm end-to-end: form submit → API → HubSpot contact creation with `engagement_source = Newsletter` and `lifecyclestage = subscriber`

---

## Technical Reference

### Key Files

| File | Purpose |
|------|---------|
| `server/hubspotClient.ts` | All HubSpot API interactions — contact upsert, deal creation, tracking functions |
| `server/routes.ts` | Express API endpoints for all form submissions and donation flows |
| `server/webhookHandlers.ts` | Stripe webhook event handlers (currently logging only) |
| `server/sendgridClient.ts` | SendGrid email templates and sending functions |
| `client/src/components/DonationForm.tsx` | Donation form frontend |
| `client/src/components/NewsletterSignup.tsx` | Newsletter signup component (needs API wiring) |
| `client/src/pages/GetInvolved.tsx` | Volunteer, experience, and church inquiry forms |
| `shared/schema.ts` | Database schema (Drizzle ORM) |

### Tech Stack
- **Backend:** Node.js, Express.js, TypeScript
- **Frontend:** React, Vite, TypeScript
- **Database:** PostgreSQL with Drizzle ORM
- **Payments:** Stripe (checkout sessions + webhooks)
- **Email:** SendGrid
- **CRM:** HubSpot (REST API via `@hubspot/api-client`)
- **Environment:** All secrets in `.env` (see `.env.example`)

### Current HubSpot API Usage
- Contact search: `POST /crm/v3/objects/contacts/search`
- Contact create: `POST /crm/v3/objects/contacts`
- Contact update: `PATCH /crm/v3/objects/contacts/{id}`
- Deal create: `POST /crm/v3/objects/deals`
- Note create: `POST /crm/v3/objects/notes`
- Associations: `PUT /crm/v4/objects/{from}/{id}/associations/{to}/{toId}` with type 3 (deal→contact) and 202 (note→contact)

---

## Acceptance Criteria

1. **Owner receives email notification within 2 minutes** of any form submission or donation on the website
2. **HubSpot mobile push notification fires** for new donations (or documented reason why it can't with current plan)
3. **All contacts show clear source labeling** — looking at any contact in HubSpot, it is immediately obvious how they engaged
4. **All donations appear in a dedicated "Donations" pipeline** with correct stage (completed, recurring active, cancelled, failed)
5. **Recurring donations update deal status** automatically on renewal, cancellation, or failure via Stripe webhooks
6. **Volunteer and experience submissions create pipeline items** in the Engagement pipeline (not just notes)
7. **Church/workshop inquiry form captures data in HubSpot** — no more mailto link
8. **Newsletter signup works end-to-end** from frontend component to HubSpot contact
9. **No donations are lost** — webhook-driven deal creation ensures all payments are tracked regardless of browser behavior
10. **Lifecycle stages never regress** — a customer who subscribes to the newsletter stays a customer

---

## Deliverables

1. HubSpot configuration: custom properties, pipelines, and workflows as specified above
2. Code changes to all files listed in the Technical Reference section
3. Documentation of any HubSpot plan limitations encountered
4. Testing evidence showing each acceptance criterion is met
