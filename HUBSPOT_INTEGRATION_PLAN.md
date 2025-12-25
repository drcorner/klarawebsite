# HubSpot Integration Plan for Klara Project

## Current State Summary

### ✅ Already Connected
1. **Donation Form** → HubSpot contact + deal created after Stripe checkout
2. **Newsletter Signup** (Footer) → HubSpot contact with "subscriber" lifecycle
3. **Page Visit Tracking** → Tracks returning visitors via cookie consent

### ❌ Not Connected (Needs Implementation)
1. **Volunteer Your Expertise Form** - Currently only console.log()
2. **Share Your Experience/Feedback Form** - Currently only console.log()
3. **Church/Workshop Inquiry** - Only a mailto link, no data capture

---

## Implementation Plan

### Phase 1: Code Changes Required

#### 1.1 Volunteer Form Connection

**Frontend:** `client/src/pages/GetInvolved.tsx` (lines 35-42)

Replace the console.log with API call:
```typescript
// Current (line 38):
console.log("Volunteer form submitted:", data);

// Change to:
const response = await fetch('/api/volunteers/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});
```

**Backend:** Add new endpoint in `server/routes.ts`
```typescript
app.post('/api/volunteers/submit', moderateRateLimiter, async (req, res) => {
  const { firstName, lastName, email, expertise, message } = req.body;

  await hubspot.trackVolunteerSignup({
    email,
    firstName,
    lastName,
    expertise,
    message
  });

  // Optional: Send confirmation email via SendGrid

  res.json({ success: true });
});
```

**HubSpot Client:** Add to `server/hubspotClient.ts`
```typescript
export async function trackVolunteerSignup(data: {
  email: string;
  firstName: string;
  lastName: string;
  expertise: string;
  message?: string;
}) {
  const contactId = await upsertContact(data.email, {
    firstname: data.firstName,
    lastname: data.lastName,
    hs_lead_status: `Volunteer - ${data.expertise}`,
    lifecyclestage: 'lead'
  });

  // Add note with expertise and message details
  await addNoteToContact(contactId, `Volunteer signup: ${data.expertise}. ${data.message || ''}`);
}
```

---

#### 1.2 Share Your Experience Form Connection

**Frontend:** `client/src/pages/GetInvolved.tsx` (lines 47-54)

Replace console.log with API call:
```typescript
// Current (line 50):
console.log("Experience form submitted:", data);

// Change to:
const response = await fetch('/api/experience/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});
```

**Backend:** Add new endpoint in `server/routes.ts`
```typescript
app.post('/api/experience/submit', moderateRateLimiter, async (req, res) => {
  const { firstName, lastName, email, experience, permission } = req.body;

  await hubspot.trackExperienceSubmission({
    email,
    firstName,
    lastName,
    experience,
    permissionToUse: permission === 'use-name'
  });

  // Send acknowledgment email via SendGrid

  res.json({ success: true });
});
```

**HubSpot Client:** Add to `server/hubspotClient.ts`
```typescript
export async function trackExperienceSubmission(data: {
  email: string;
  firstName: string;
  lastName: string;
  experience: string;
  permissionToUse: boolean;
}) {
  const contactId = await upsertContact(data.email, {
    firstname: data.firstName,
    lastname: data.lastName,
    hs_lead_status: 'Experience Shared',
    lifecyclestage: 'lead'
  });

  // Add note with the experience content
  const note = `Experience/Feedback Shared:\n${data.experience}\n\nPermission to use: ${data.permissionToUse ? 'Yes, with name' : 'Anonymous only'}`;
  await addNoteToContact(contactId, note);
}
```

---

#### 1.3 Church/Workshop Inquiry (Optional Enhancement)

**Current:** Just a mailto link
**Enhancement Option:** Add a simple contact form that captures:
- Church/Organization name
- Contact person name/email
- Inquiry type (workshop, presentation, consultation)
- Message

This would require a new form component and `/api/church-inquiry/submit` endpoint.

---

### Phase 2: Railway Configuration

#### 2.1 Environment Variables Required

In Railway dashboard, add:

| Variable | Description | How to Get |
|----------|-------------|------------|
| `HUBSPOT_ACCESS_TOKEN` | Private app access token | HubSpot → Settings → Integrations → Private Apps |

**Steps:**
1. Go to Railway project dashboard
2. Click on your service
3. Go to "Variables" tab
4. Add `HUBSPOT_ACCESS_TOKEN` with the value from HubSpot

---

### Phase 3: HubSpot Configuration

#### 3.1 Create Private App (If Not Done)

1. Log into HubSpot → Settings (gear icon)
2. Go to Integrations → Private Apps
3. Click "Create a private app"
4. Name: "Klara Website Integration"
5. **Scopes Required:**
   - `crm.objects.contacts.read`
   - `crm.objects.contacts.write`
   - `crm.objects.deals.read`
   - `crm.objects.deals.write`
   - `timeline` (optional, for activity tracking)
6. Click "Create app"
7. Copy the access token → Add to Railway

#### 3.2 Create Custom Properties (Recommended)

In HubSpot → Settings → Properties → Contact Properties:

| Property Name | Internal Name | Type | Options |
|---------------|---------------|------|---------|
| Volunteer Expertise | `volunteer_expertise` | Dropdown | AI/Technology, Theology, Education, Ministry, Social Enterprise, Other |
| Donation Frequency | `donation_frequency` | Dropdown | One-time, Monthly |
| Experience Permission | `experience_permission` | Dropdown | Use with name, Anonymous only |
| Source | `contact_source` | Dropdown | Newsletter, Donation, Volunteer, Experience Feedback, Workshop Inquiry |

#### 3.3 Create Lists for Segmentation

1. **Newsletter Subscribers** - Filter: lifecycle stage = subscriber
2. **Donors** - Filter: has associated deal
3. **Volunteers** - Filter: hs_lead_status contains "Volunteer"
4. **Experience Sharers** - Filter: hs_lead_status = "Experience Shared"

#### 3.4 Set Up Workflows (Optional)

**Welcome Email Workflow:**
- Trigger: Contact created with lifecycle = subscriber
- Action: Send welcome email

**Volunteer Follow-up Workflow:**
- Trigger: Contact created with hs_lead_status contains "Volunteer"
- Action: Create task for team to follow up

**Donation Thank You Workflow:**
- Trigger: Deal created in pipeline
- Action: Send personalized thank you (if not handled by SendGrid)

---

## Implementation Checklist

### Code (Developer Tasks)
- [ ] Add `trackVolunteerSignup()` function to `hubspotClient.ts`
- [ ] Add `trackExperienceSubmission()` function to `hubspotClient.ts`
- [ ] Add `addNoteToContact()` helper function to `hubspotClient.ts`
- [ ] Create `/api/volunteers/submit` endpoint in `routes.ts`
- [ ] Create `/api/experience/submit` endpoint in `routes.ts`
- [ ] Update GetInvolved.tsx volunteer form to call API
- [ ] Update GetInvolved.tsx experience form to call API
- [ ] Add success/error states to both forms
- [ ] Test locally with HubSpot sandbox/test portal

### Railway (DevOps Tasks)
- [ ] Add `HUBSPOT_ACCESS_TOKEN` environment variable
- [ ] Redeploy application

### HubSpot (Admin Tasks)
- [ ] Create private app with required scopes
- [ ] Generate and save access token
- [ ] Create custom contact properties (optional but recommended)
- [ ] Create contact lists for segmentation
- [ ] Set up automated workflows (optional)
- [ ] Test integration with test contacts

---

## Data Flow Summary

```
┌─────────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Website Forms     │────▶│  Express API    │────▶│    HubSpot      │
└─────────────────────┘     └─────────────────┘     └─────────────────┘
                                    │
                                    ▼
                            ┌─────────────────┐
                            │    SendGrid     │
                            │   (Emails)      │
                            └─────────────────┘

Form → Endpoint → HubSpot Contact/Deal:
─────────────────────────────────────────
Newsletter     → /api/newsletter/subscribe      → Contact (subscriber)
Donation       → /api/create-checkout-session   → Contact + Deal (via thank you)
Volunteer      → /api/volunteers/submit [NEW]   → Contact (lead) + Note
Experience     → /api/experience/submit [NEW]   → Contact (lead) + Note
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `server/hubspotClient.ts` | Add 2 new tracking functions + note helper |
| `server/routes.ts` | Add 2 new API endpoints |
| `client/src/pages/GetInvolved.tsx` | Connect both forms to API |

---

## Testing Plan

1. **Local Testing:**
   - Set `HUBSPOT_ACCESS_TOKEN` in `.env`
   - Submit test forms
   - Verify contacts appear in HubSpot

2. **Staging Testing:**
   - Deploy to Railway staging (if available)
   - Test full flow with real HubSpot portal

3. **Production:**
   - Add production token to Railway
   - Deploy and verify

---

## Questions to Resolve

1. Should church/workshop inquiries have a form, or is mailto sufficient?
2. Should volunteers receive a confirmation email?
3. Should experience submissions trigger a notification to the team?
4. Any additional custom properties needed in HubSpot?
