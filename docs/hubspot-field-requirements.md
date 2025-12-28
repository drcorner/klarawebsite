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

- **"Donations" Pipeline** with stage: "Completed"

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
