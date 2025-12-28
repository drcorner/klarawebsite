# HubSpot Field Requirements for Klara Project Website

## Overview

The website collects data through 4 main forms plus some tracking endpoints. Below are the fields that need to be configured in HubSpot to capture all website submissions.

---

## 1. DONATION FORM

### Contact Properties Needed

| Field Name | HubSpot Property Type | Required | Notes |
|------------|----------------------|----------|-------|
| `email` | Email | Yes | Primary identifier |
| `firstname` | Text | Yes | Standard HubSpot property |
| `lastname` | Text | Yes | Standard HubSpot property |
| `phone` | Phone | No | Optional field |
| `hs_email_optout` | Checkbox | No | Standard property - set to FALSE if communication consent given |

### Deal Properties Needed (for tracking donations)

| Field Name | HubSpot Property Type | Notes |
|------------|----------------------|-------|
| `dealname` | Text | Auto-generated: "{Donor Name} - {Amount}" |
| `amount` | Currency | Donation amount |
| `donation_type` | Dropdown | Values: "monthly", "one-time" |
| `donation_duration` | Dropdown | Values: "ongoing", "3", "6", "12" (for monthly only) |
| `pipeline` | - | Create a "Donations" pipeline |
| `dealstage` | - | Create stage: "Completed" |

### Contact Settings for Donors

- Lifecycle Stage: `customer`
- Lead Status: `Donor`

---

## 2. NEWSLETTER SIGNUP

### Contact Properties Needed

| Field Name | HubSpot Property Type | Required | Notes |
|------------|----------------------|----------|-------|
| `email` | Email | Yes | Primary identifier |

### Contact Settings

- Lifecycle Stage: `subscriber`
- Lead Status: Create custom value `Newsletter Subscriber`

---

## 3. VOLUNTEER FORM

### Contact Properties Needed

| Field Name | HubSpot Property Type | Required | Notes |
|------------|----------------------|----------|-------|
| `email` | Email | Yes | Primary identifier |
| `firstname` | Text | Yes | Standard HubSpot property |
| `lastname` | Text | Yes | Standard HubSpot property |
| `volunteer_expertise` | Dropdown | No | **Custom property needed** |

### Volunteer Expertise Dropdown Values

- `ai-technology` (AI & Technology)
- `theology` (Theology)
- `education` (Education)
- `ministry` (Ministry)
- `social-enterprise` (Social Enterprise)
- `other` (Other)

### Contact Settings

- Lifecycle Stage: `lead`
- Lead Status: Create custom value `Volunteer - {expertise}`

### Notes/Engagements

- Creates a HubSpot Note with the volunteer's message (if provided)

---

## 4. EXPERIENCE/STORY SHARING FORM

### Contact Properties Needed

| Field Name | HubSpot Property Type | Required | Notes |
|------------|----------------------|----------|-------|
| `email` | Email | Yes | Primary identifier |
| `firstname` | Text | Yes | Standard HubSpot property |
| `lastname` | Text | Yes | Standard HubSpot property |
| `name_permission` | Dropdown | No | **Custom property needed** |

### Name Permission Dropdown Values

- `use-name` (Permission to use name)
- `no-name` (Do not use name)

### Contact Settings

- Lifecycle Stage: `lead`
- Lead Status: Create custom value `Experience Shared`

### Notes/Engagements

- Creates a HubSpot Note containing the experience/question text and permission status

---

## 5. WHITE PAPER DOWNLOAD (Tracking)

### Contact Properties Needed

| Field Name | HubSpot Property Type | Required |
|------------|----------------------|----------|
| `email` | Email | Yes |

### Contact Settings

- Lead Status: Create custom value `White Paper Downloaded`

---

## SUMMARY: Custom Properties to Create in HubSpot

### Contact Properties (Custom)

1. **`volunteer_expertise`** - Dropdown
   - Values: ai-technology, theology, education, ministry, social-enterprise, other

2. **`name_permission`** - Dropdown
   - Values: use-name, no-name

### Deal Properties (Custom)

1. **`donation_type`** - Dropdown
   - Values: monthly, one-time

2. **`donation_duration`** - Dropdown
   - Values: ongoing, 3, 6, 12

### Lead Status Values to Create

- `Donor`
- `Newsletter Subscriber`
- `Volunteer - AI & Technology`
- `Volunteer - Theology`
- `Volunteer - Education`
- `Volunteer - Ministry`
- `Volunteer - Social Enterprise`
- `Volunteer - Other`
- `Experience Shared`
- `White Paper Downloaded`

### Pipeline to Create

- **"Donations" Pipeline** (see detailed setup below)

---

## RECOMMENDED HUBSPOT STRUCTURES

### Donations Pipeline Setup

Create a dedicated pipeline for tracking donations:

**Pipeline Name:** `Donations`

| Stage Name | Stage Order | Description |
|------------|-------------|-------------|
| `Pending` | 1 | Payment initiated but not yet confirmed |
| `Completed` | 2 | Payment successfully processed |
| `Failed` | 3 | Payment failed or declined |
| `Refunded` | 4 | Donation was refunded |
| `Recurring Active` | 5 | Monthly donation currently active |
| `Recurring Cancelled` | 6 | Monthly donation was cancelled |

**Deal Properties to Display on Cards:**
- Amount
- Donation Type (one-time/monthly)
- Donation Duration
- Close Date

---

### Contact Lists to Create

Create these **Active Lists** for automatic segmentation:

| List Name | Criteria | Purpose |
|-----------|----------|---------|
| `All Donors` | Lifecycle Stage = Customer | All people who have donated |
| `Monthly Donors - Active` | Lifecycle Stage = Customer AND Donation Type = monthly | Recurring donors |
| `One-Time Donors` | Lifecycle Stage = Customer AND Donation Type = one-time | Single donation contributors |
| `Newsletter Subscribers` | Lead Status = Newsletter Subscriber | Email list for newsletters |
| `Volunteers - All` | Lead Status CONTAINS "Volunteer" | All volunteer signups |
| `Volunteers - AI & Technology` | Lead Status = Volunteer - AI & Technology | Tech volunteers |
| `Volunteers - Theology` | Lead Status = Volunteer - Theology | Theology volunteers |
| `Volunteers - Education` | Lead Status = Volunteer - Education | Education volunteers |
| `Volunteers - Ministry` | Lead Status = Volunteer - Ministry | Ministry volunteers |
| `Experience Shared - Can Use Name` | Lead Status = Experience Shared AND Name Permission = use-name | Stories available for marketing |
| `Experience Shared - Anonymous` | Lead Status = Experience Shared AND Name Permission = no-name | Anonymous stories |
| `White Paper Downloads` | Lead Status = White Paper Downloaded | Engaged prospects |
| `Lapsed Donors` | Lifecycle Stage = Customer AND Last Donation > 12 months ago | Re-engagement targets |
| `High-Value Donors` | Lifecycle Stage = Customer AND Total Donations >= $500 | Major donor stewardship |

---

### Recommended Workflows (Automation)

#### 1. New Donor Welcome Series
**Trigger:** Lifecycle Stage changed to Customer
**Actions:**
1. Send thank you email (immediate)
2. Send impact story email (3 days later)
3. Send newsletter subscription invitation (7 days later)

#### 2. Monthly Donor Onboarding
**Trigger:** Deal created with Donation Type = monthly
**Actions:**
1. Send recurring donor welcome email
2. Add to "Monthly Donors" list
3. Create task for staff follow-up (for donations > $100/month)

#### 3. Volunteer Follow-Up
**Trigger:** Lead Status changed to any "Volunteer -" value
**Actions:**
1. Send volunteer confirmation email (immediate)
2. Create task for volunteer coordinator to review (1 day delay)
3. Send "Getting Started" email (3 days later)

#### 4. Newsletter Welcome
**Trigger:** Lead Status = Newsletter Subscriber
**Actions:**
1. Send welcome email with organization overview
2. Send "What We Do" email (3 days later)

#### 5. Experience Submission Follow-Up
**Trigger:** Lead Status = Experience Shared
**Actions:**
1. Send thank you email for sharing
2. Create task for communications team to review story
3. If Name Permission = use-name, add to "Stories for Marketing" list

#### 6. Lapsed Donor Re-engagement
**Trigger:** Contact in "Lapsed Donors" list
**Actions:**
1. Send "We Miss You" email
2. Wait 7 days
3. Send impact update email with donation CTA

#### 7. Donation Failed Recovery
**Trigger:** Deal Stage = Failed
**Actions:**
1. Send payment failed notification email
2. Create task for follow-up call (1 day delay)

---

### Email Templates to Create

| Template Name | Purpose | Trigger |
|---------------|---------|---------|
| `Donation Thank You - One Time` | Thank donor for one-time gift | After one-time donation |
| `Donation Thank You - Monthly` | Welcome recurring donor | After monthly signup |
| `Volunteer Welcome` | Confirm volunteer signup | After volunteer form |
| `Newsletter Welcome` | Welcome new subscriber | After newsletter signup |
| `Experience Thank You` | Thank for sharing story | After experience form |
| `Monthly Donation Receipt` | Monthly recurring receipt | Monthly (automated) |
| `Year-End Tax Summary` | Annual giving statement | January each year |
| `Donation Failed` | Payment issue notification | When payment fails |
| `Lapsed Donor - We Miss You` | Re-engagement | For lapsed donors |

---

### Property Groups

Organize custom properties into groups for easier management:

| Group Name | Properties to Include |
|------------|----------------------|
| `Donation Information` | donation_type, donation_duration, total_lifetime_donations, first_donation_date, last_donation_date |
| `Volunteer Information` | volunteer_expertise, volunteer_status, volunteer_start_date |
| `Content & Stories` | name_permission, experience_submitted_date |
| `Engagement Tracking` | white_paper_downloaded, newsletter_signup_date |

---

### Additional Custom Properties (Recommended)

These additional properties will help with reporting and segmentation:

#### Contact Properties

| Property Name | Type | Description |
|---------------|------|-------------|
| `total_lifetime_donations` | Number (Currency) | Sum of all donations (can be calculated via workflow) |
| `first_donation_date` | Date | Date of first donation |
| `last_donation_date` | Date | Date of most recent donation |
| `donation_count` | Number | Total number of donations |
| `volunteer_status` | Dropdown | Values: Active, Inactive, Pending |
| `volunteer_start_date` | Date | When they started volunteering |
| `acquisition_source` | Dropdown | Values: Website, Referral, Event, Social Media, Other |
| `newsletter_signup_date` | Date | When they subscribed |

#### Deal Properties

| Property Name | Type | Description |
|---------------|------|-------------|
| `payment_method` | Dropdown | Values: Credit Card, Bank Transfer, Other |
| `stripe_payment_id` | Text | Stripe transaction reference |
| `is_recurring` | Checkbox | Whether this is a recurring donation |

---

### Reporting Dashboards

Create these dashboards for nonprofit management:

#### 1. Fundraising Dashboard
- Total donations this month/quarter/year
- Donations by type (one-time vs monthly)
- New vs returning donors
- Average donation amount
- Monthly recurring revenue (MRR)
- Donor retention rate

#### 2. Engagement Dashboard
- New contacts by source (Newsletter, Volunteer, Donor, Experience)
- Newsletter subscriber growth
- Email open/click rates
- Website form submissions

#### 3. Volunteer Dashboard
- Total volunteers by expertise area
- New volunteer signups this month
- Volunteer pipeline status

#### 4. Stories & Content Dashboard
- Experience submissions
- Stories available for use (with name permission)
- Anonymous stories count

---

### Lifecycle Stage Mapping

| Contact Type | Lifecycle Stage | When to Set |
|--------------|-----------------|-------------|
| Newsletter subscriber only | Subscriber | Newsletter signup |
| Volunteer signup | Lead | Volunteer form submission |
| Experience shared | Lead | Experience form submission |
| White paper download | Lead | After download |
| One-time donor | Customer | After successful donation |
| Monthly donor | Customer | After recurring donation setup |
| Lapsed donor (12+ months) | Customer | Keep as Customer, use list for targeting |

---

## Integration Method

The website uses the **HubSpot API** (not embedded forms) to send data. The contractor will need to:

1. Set up the properties listed above in HubSpot
2. Provide API credentials (Private App token with scopes for Contacts, Deals, and Engagements)
3. The website code already handles the API calls - it just needs valid credentials

---

## API Scopes Required

The HubSpot Private App will need the following scopes:

- `crm.objects.contacts.read`
- `crm.objects.contacts.write`
- `crm.objects.deals.read`
- `crm.objects.deals.write`
- `crm.objects.owners.read`
- `sales-email-read` (for engagement/notes)

---

*Document generated: December 2024*
