// HubSpot integration for CRM data management
import { Client } from "@hubspot/api-client";
import { FilterOperatorEnum } from "@hubspot/api-client/lib/codegen/crm/contacts/models/Filter";
import { AssociationSpecAssociationCategoryEnum } from "@hubspot/api-client/lib/codegen/crm/objects/notes/models/AssociationSpec";
export const HUBSPOT_IDS = {
  PIPELINE_DONATIONS: "2172758749",
  STAGE_DONATIONS_PENDING: "3463253736",
  STAGE_DONATIONS_COMPLETED: "3463253737",
  STAGE_RECURRING_ACTIVE: "3463253738",
  STAGE_RECURRING_RENEWED: "3463253739",
  STAGE_RECURRING_CANCELLED: "3463253740",
  STAGE_PAYMENT_FAILED: "3463253741",

  PIPELINE_ENGAGEMENT: "default",
  STAGE_NEW_INQUIRY: "2845838016",
  STAGE_IN_PROGRESS: "2845838017",
  STAGE_RESPONDED: "2845838018",
  STAGE_CLOSED: "2845838019",
};

const LIFECYCLE_ORDER: Record<string, number> = {
  subscriber: 1,
  lead: 2,
  marketingqualifiedlead: 3,
  salesqualifiedlead: 4,
  opportunity: 5,
  customer: 6,
  evangelist: 7,
  other: 0,
};

// function isLifecycleProgression(current: string, next: string): boolean {
//   return (LIFECYCLE_ORDER[next] ?? 0) > (LIFECYCLE_ORDER[current] ?? 0);
// }

// // Environment variable validation
// function getRequiredEnv(name: string): string {
//   const value = process.env[name];
//   if (!value) {
//     throw new Error(`Missing required environment variable: ${name}`);
//   }
//   return value;
// }
// function mapExpertiseLabel(value: string): string {
//   switch (value) {
//     case "ai-technology":
//       return "AI & Technology";
//     case "theology":
//       return "Theology";
//     case "education":
//       return "Education";
//     case "ministry":
//       return "Ministry";
//     case "social-enterprise":
//       return "Social Enterprise";
//     default:
//       return "Other";
//   }
// }

function isLifecycleProgression(current: string, next: string): boolean {
  return (LIFECYCLE_ORDER[next] ?? 0) > (LIFECYCLE_ORDER[current] ?? 0);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function isHubSpotConfigured(): boolean {
  return !!process.env.HUBSPOT_ACCESS_TOKEN;
}

let hubspotClient: Client | null = null;
function getHubSpotClient(): Client {
  if (!hubspotClient) {
    hubspotClient = new Client({
      accessToken: getRequiredEnv("HUBSPOT_ACCESS_TOKEN"),
    });
  }
  return hubspotClient;
}

export async function getUncachableHubSpotClient() {
  return getHubSpotClient();
}

// ─── Interfaces ──────────────────────────────────────────────────────────────
interface ContactData {
  email: string;
  firstName?: string;
  lastName?: string;
  lifecycleStage?: string;
  leadStatus?: string;
  phone?: string;
}

export interface DonationData {
  email: string;
  donorName: string;
  amount: number; // cents
  donationType: "one-time" | "monthly";
  duration?: string;
  phone?: string;
  stripeSessionId?: string;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
}

interface VolunteerData {
  email: string;
  firstName: string;
  lastName: string;
  expertise: string;
  message?: string;
}

interface ExperienceData {
  email: string;
  firstName: string;
  lastName: string;
  experience: string;
  permissionToUse: boolean;
}

interface InquiryData {
  email: string;
  firstName: string;
  lastName: string;
  message: string;
  churchName?: string;
}

// ─── Engagement source helper ─────────────────────────────────────────────────
// engagement_source is a multi-checkbox — we must read current value and append.
async function appendEngagementSource(
  client: Client,
  contactId: string,
  source: string,
): Promise<void> {
  try {
    const contact = await client.crm.contacts.basicApi.getById(contactId, [
      "engagement_source",
    ]);
    const current: string = contact.properties.engagement_source || "";
    const existing = current ? current.split(";").map((s) => s.trim()) : [];
    if (!existing.includes(source)) {
      existing.push(source);
      await client.crm.contacts.basicApi.update(contactId, {
        properties: { engagement_source: existing.join(";") },
      });
    }
  } catch {
    // If property doesn't exist yet, just set it
    await client.crm.contacts.basicApi.update(contactId, {
      properties: { engagement_source: source },
    });
  }
}

// ─── upsertContact ────────────────────────────────────────────────────────────
export async function upsertContact(data: ContactData): Promise<string | null> {
  if (!isHubSpotConfigured()) return null;

  try {
    const client = getHubSpotClient();

    const searchResponse = await client.crm.contacts.searchApi.doSearch({
      filterGroups: [
        {
          filters: [
            {
              propertyName: "email",
              operator: FilterOperatorEnum.Eq,
              value: data.email,
            },
          ],
        },
      ],
      properties: ["email", "firstname", "lastname", "lifecyclestage"],
      limit: 1,
    });

    const properties: Record<string, string> = { email: data.email };
    if (data.firstName) properties.firstname = data.firstName;
    if (data.lastName) properties.lastname = data.lastName;
    if (data.phone) properties.phone = data.phone;

    if (searchResponse.results.length > 0) {
      const existing = searchResponse.results[0];
      const contactId = existing.id;
      const currentStage = existing.properties.lifecyclestage || "";

      // Only set lifecycle stage if it's a progression
      if (
        data.lifecycleStage &&
        isLifecycleProgression(currentStage, data.lifecycleStage)
      ) {
        properties.lifecyclestage = data.lifecycleStage;
      }

      await client.crm.contacts.basicApi.update(contactId, { properties });
      return contactId;
    } else {
      if (data.lifecycleStage) properties.lifecyclestage = data.lifecycleStage;
      const created = await client.crm.contacts.basicApi.create({ properties });
      return created.id;
    }
  } catch (error: any) {
    console.error("HubSpot upsertContact error:", error.message);
    return null;
  }
}

// ─── trackDonation ────────────────────────────────────────────────────────────
export async function trackDonation(data: DonationData): Promise<void> {
  console.log(
    "HubSpot trackDonation called with data:",
    JSON.stringify(data, null, 2),
  );
  if (!isHubSpotConfigured()) return;

  try {
    const client = getHubSpotClient();
    const [firstname, ...rest] = data.donorName.split(" ");
    const lastname = rest.join(" ") || "Donor";

    const contactId = await upsertContact({
      email: data.email,
      firstName: firstname,
      lastName: lastname,
      phone: data.phone,
      lifecycleStage: "customer",
    });
    console.log("🚀 ~ trackDonation ~ contactId:", contactId);
    if (!contactId) return;

    // Update contact-level donation fields
    const contactUpdate: Record<string, string> = {
      hs_lead_status: "Donor",
      donation_frequency: data.donationType,
    };
    if (data.stripeCustomerId) {
      contactUpdate.stripe_customer_id = data.stripeCustomerId;
    }
    console.log(
      "👤 Contact properties being sent to HubSpot:",
      JSON.stringify(contactUpdate, null, 2),
    );
    await client.crm.contacts.basicApi.update(contactId, {
      properties: contactUpdate,
    });

    await appendEngagementSource(client, contactId, "donation");

    // Determine pipeline stage
    const stage =
      data.donationType === "monthly"
        ? HUBSPOT_IDS.STAGE_RECURRING_ACTIVE
        : HUBSPOT_IDS.STAGE_DONATIONS_COMPLETED;

    const dealProperties: Record<string, string> = {
      dealname: `${data.donorName} - $${data.amount / 100}`,
      amount: (data.amount / 100).toString(),
      pipeline: HUBSPOT_IDS.PIPELINE_DONATIONS,
      dealstage: stage,
      donation_type: data.donationType,
      closedate: new Date().toISOString(),
    };
    if (data.donationType === "monthly" && data.duration) {
      dealProperties.donation_duration = data.duration;
    }
    if (data.stripeSessionId) {
      dealProperties.stripe_session_id = data.stripeSessionId;
    }
    if (data.stripeSubscriptionId) {
      dealProperties.stripe_subscription_id = data.stripeSubscriptionId;
      dealProperties.subscription_status = "active";
    }
    console.log(
      "🏦 Deal properties being sent to HubSpot:",
      JSON.stringify(dealProperties, null, 2),
    );
    const deal = await client.crm.deals.basicApi.create({
      properties: dealProperties,
    });

    await client.crm.associations.v4.basicApi.create(
      "deals",
      deal.id,
      "contacts",
      contactId,
      [
        {
          associationTypeId: 3,
          associationCategory:
            AssociationSpecAssociationCategoryEnum.HubspotDefined,
        },
      ],
    );

    console.log(`HubSpot: Donation deal created for ${data.email}`);
  } catch (error: any) {
    console.error("HubSpot trackDonation error:", error?.message || error);
    throw error;
  }
}

// ─── trackNewsletterSignup ────────────────────────────────────────────────────
export async function trackNewsletterSignup(email: string): Promise<void> {
  if (!isHubSpotConfigured()) return;

  try {
    const contactId = await upsertContact({
      email,
      lifecycleStage: "subscriber",
    });
    if (!contactId) return;

    const client = getHubSpotClient();
    await client.crm.contacts.basicApi.update(contactId, {
      properties: { hs_lead_status: "Newsletter Subscriber" },
    });
    await appendEngagementSource(client, contactId, "newsletter");

    console.log(`HubSpot: Newsletter subscriber tracked for ${email}`);
  } catch (error: any) {
    console.error("HubSpot trackNewsletterSignup error:", error);
  }
}

// ─── trackWhitePaperDownload ──────────────────────────────────────────────────
export async function trackWhitePaperDownload(email: string): Promise<void> {
  if (!isHubSpotConfigured()) return;

  try {
    const contactId = await upsertContact({ email, lifecycleStage: "lead" });
    if (!contactId) return;

    const client = getHubSpotClient();
    await client.crm.contacts.basicApi.update(contactId, {
      properties: { hs_lead_status: "White Paper Downloaded" },
    });
    await appendEngagementSource(client, contactId, "whitepaper");

    console.log(`HubSpot: White paper download tracked for ${email}`);
  } catch (error: any) {
    console.error(
      "HubSpot trackWhitePaperDownload error:",
      error?.body || error,
    );
  }
}

// ─── trackVolunteerSignup ─────────────────────────────────────────────────────
const VOLUNTEER_LEAD_STATUS_MAP: Record<string, string> = {
  "ai-technology": "Volunteer – AI & Technology",
  theology: "Volunteer – Theology",
  education: "Volunteer – Education",
  ministry: "Volunteer – Ministry",
  "social-enterprise": "Volunteer – Social Enterprise",
  other: "Volunteer – Other",
};

export async function trackVolunteerSignup(data: VolunteerData): Promise<void> {
  if (!isHubSpotConfigured()) return;

  try {
    const contactId = await upsertContact({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      lifecycleStage: "lead",
    });
    if (!contactId) return;

    const client = getHubSpotClient();
    const expertiseKey = data.expertise || "other";
    const leadStatus =
      VOLUNTEER_LEAD_STATUS_MAP[expertiseKey] || "Volunteer – Other";

    await client.crm.contacts.basicApi.update(contactId, {
      properties: {
        hs_lead_status: leadStatus,
        volunteer_expertise: expertiseKey,
      },
    });
    await appendEngagementSource(client, contactId, "volunteer");

    // Create deal in Engagement pipeline
    const deal = await client.crm.deals.basicApi.create({
      properties: {
        dealname: `Volunteer – ${data.firstName} ${data.lastName} (${leadStatus})`,
        pipeline: HUBSPOT_IDS.PIPELINE_ENGAGEMENT,
        dealstage: HUBSPOT_IDS.STAGE_NEW_INQUIRY,
        closedate: new Date().toISOString(),
      },
    });

    await client.crm.associations.v4.basicApi.create(
      "deals",
      deal.id,
      "contacts",
      contactId,
      [
        {
          associationTypeId: 3,
          associationCategory:
            AssociationSpecAssociationCategoryEnum.HubspotDefined,
        },
      ],
    );

    // Keep note for message content
    if (data.message) {
      const note = await client.crm.objects.notes.basicApi.create({
        properties: {
          hs_timestamp: new Date().toISOString(),
          hs_note_body: `Volunteer signup\n\nExpertise: ${leadStatus}\n\nMessage:\n${data.message}`,
        },
        associations: [
          {
            to: { id: contactId },
            types: [
              {
                associationCategory:
                  AssociationSpecAssociationCategoryEnum.HubspotDefined,
                associationTypeId: 202,
              },
            ],
          },
        ],
      });
      if (deal?.id) {
        try {
          await client.crm.associations.v4.basicApi.create(
            "notes",
            note.id,
            "deals",
            deal.id,
            [
              {
                associationTypeId: 214,
                associationCategory:
                  AssociationSpecAssociationCategoryEnum.HubspotDefined,
              },
            ],
          );
        } catch (e: any) {
          console.error(
            "trackVolunteerSignup: failed to associate note with deal:",
            e?.message,
          );
        }
      }
      // const note = await client.crm.objects.notes.basicApi.create({
      //   properties: {
      //     hs_timestamp: new Date().toISOString(),
      //     hs_note_body: noteBody,
      //   },
      //   associations: [
      //     {
      //       to: { id: contactId },
      //       types: [
      //         {
      //           associationCategory:
      //             AssociationSpecAssociationCategoryEnum.HubspotDefined,
      //           associationTypeId: 202,
      //         },
      //       ],
      //     },
      //   ],
      // });

      // Associate note with deal too
      if (deal?.id) {
        try {
          await client.crm.associations.v4.basicApi.create(
            "notes",
            note.id,
            "deals",
            deal.id,
            [
              {
                associationTypeId: 214,
                associationCategory:
                  AssociationSpecAssociationCategoryEnum.HubspotDefined,
              },
            ],
          );
        } catch (e: any) {
          console.error(
            "trackVolunteerSignup: failed to associate note with deal:",
            e?.message,
          );
        }
      }
    }

    console.log(`HubSpot: Volunteer tracked for ${data.email}`);
  } catch (error: any) {
    console.error("HubSpot trackVolunteerSignup error:", error);
  }
}

// ─── trackExperienceSubmission ────────────────────────────────────────────────
export async function trackExperienceSubmission(
  data: ExperienceData,
): Promise<void> {
  if (!isHubSpotConfigured()) return;

  try {
    const contactId = await upsertContact({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      lifecycleStage: "lead",
    });
    if (!contactId) return;

    const client = getHubSpotClient();

    await client.crm.contacts.basicApi.update(contactId, {
      properties: {
        hs_lead_status: "Experience Shared",
        name_permission: data.permissionToUse ? "use-name" : "no-name",
      },
    });
    await appendEngagementSource(client, contactId, "experience");

    // Create deal in Engagement pipeline
    const deal = await client.crm.deals.basicApi.create({
      properties: {
        dealname: `Experience – ${data.firstName} ${data.lastName}`,
        pipeline: HUBSPOT_IDS.PIPELINE_ENGAGEMENT,
        dealstage: HUBSPOT_IDS.STAGE_NEW_INQUIRY,
        closedate: new Date().toISOString(),
      },
    });

    await client.crm.associations.v4.basicApi.create(
      "deals",
      deal.id,
      "contacts",
      contactId,
      [
        {
          associationTypeId: 3,
          associationCategory:
            AssociationSpecAssociationCategoryEnum.HubspotDefined,
        },
      ],
    );

    // Note with experience content
    const permissionText = data.permissionToUse
      ? "Permission to use name"
      : "Do not use name";
    const notes = await client.crm.objects.notes.basicApi.create({
      properties: {
        hs_timestamp: new Date().toISOString(),
        hs_note_body: `Experience / Question Shared\n\nName permission: ${permissionText}\n\nMessage:\n${data.experience}`,
      },
      associations: [
        {
          to: { id: contactId },
          types: [
            {
              associationCategory:
                AssociationSpecAssociationCategoryEnum.HubspotDefined,
              associationTypeId: 202,
            },
          ],
        },
      ],
    });
    if (deal?.id) {
      try {
        await client.crm.associations.v4.basicApi.create(
          "notes",
          notes.id,
          "deals",
          deal.id,
          [
            {
              associationTypeId: 214,
              associationCategory:
                AssociationSpecAssociationCategoryEnum.HubspotDefined,
            },
          ],
        );
      } catch (e: any) {
        console.error(
          "trackExperienceSubmission: failed to associate note with deal:",
          e?.message,
        );
      }
    }
    console.log(`HubSpot: Experience submission tracked for ${data.email}`);
  } catch (error: any) {
    console.error(
      "HubSpot trackExperienceSubmission error:",
      error?.body || error,
    );
  }
}

// ─── trackInquiry (new — church/workshop) ────────────────────────────────────
export async function trackInquiry(data: InquiryData): Promise<void> {
  if (!isHubSpotConfigured()) return;

  try {
    const contactId = await upsertContact({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      lifecycleStage: "lead",
    });
    if (!contactId) return;

    const client = getHubSpotClient();

    // Step 1 — Update lead status (isolated so failure doesn't block note)
    try {
      await client.crm.contacts.basicApi.update(contactId, {
        properties: { hs_lead_status: "Church Inquiry" },
      });
    } catch (e: any) {
      console.error("trackInquiry: failed to set hs_lead_status:", e?.message);
    }

    // Step 2 — Append engagement source (isolated)
    try {
      await appendEngagementSource(client, contactId, "church_inquiry");
    } catch (e: any) {
      console.error(
        "trackInquiry: failed to append engagement source:",
        e?.message,
      );
    }

    // Step 3 — Create deal in Engagement pipeline (isolated)
    let deal: any = null;
    try {
      const dealName = data.churchName
        ? `Church Inquiry – ${data.churchName} (${data.firstName} ${data.lastName})`
        : `Church Inquiry – ${data.firstName} ${data.lastName}`;

      deal = await client.crm.deals.basicApi.create({
        properties: {
          dealname: dealName,
          pipeline: HUBSPOT_IDS.PIPELINE_ENGAGEMENT,
          dealstage: HUBSPOT_IDS.STAGE_NEW_INQUIRY,
          closedate: new Date().toISOString(),
        },
      });

      await client.crm.associations.v4.basicApi.create(
        "deals",
        deal.id,
        "contacts",
        contactId,
        [
          {
            associationTypeId: 3,
            associationCategory:
              AssociationSpecAssociationCategoryEnum.HubspotDefined,
          },
        ],
      );
      console.log(`trackInquiry: deal created ${deal.id}`);
    } catch (e: any) {
      console.error("trackInquiry: failed to create deal:", e?.message);
    }

    // Step 4 — Create note with message (isolated — always runs)
    // Step 4 — Create note associated with both contact AND deal
    try {
      const noteBody = [
        "Church/Workshop Inquiry",
        data.churchName ? `Church: ${data.churchName}` : null,
        `Email: ${data.email}`,
        "",
        "Message:",
        data.message,
      ]
        .filter((line) => line !== null)
        .join("\n");

      const note = await client.crm.objects.notes.basicApi.create({
        properties: {
          hs_timestamp: new Date().toISOString(),
          hs_note_body: noteBody,
        },
        associations: [
          // Associate with contact
          {
            to: { id: contactId },
            types: [
              {
                associationCategory:
                  AssociationSpecAssociationCategoryEnum.HubspotDefined,
                associationTypeId: 202, // Note → Contact
              },
            ],
          },
        ],
      });

      // Associate note with deal separately (if deal was created)
      if (deal?.id) {
        try {
          await client.crm.associations.v4.basicApi.create(
            "notes",
            note.id,
            "deals",
            deal.id,
            [
              {
                associationTypeId: 214, // Note → Deal
                associationCategory:
                  AssociationSpecAssociationCategoryEnum.HubspotDefined,
              },
            ],
          );
          console.log(
            `trackInquiry: note ${note.id} associated with deal ${deal.id}`,
          );
        } catch (e: any) {
          console.error(
            "trackInquiry: failed to associate note with deal:",
            e?.message,
          );
        }
      }

      console.log(`trackInquiry: note created for ${data.email}`);
    } catch (e: any) {
      console.error("trackInquiry: failed to create note:", e?.message);
    }

    console.log(`HubSpot: Church inquiry tracked for ${data.email}`);
  } catch (error: any) {
    console.error("HubSpot trackInquiry error:", error?.body || error);
  }
}

// ─── updateCommunicationConsent ───────────────────────────────────────────────
export async function updateCommunicationConsent(
  email: string,
  hasConsent: boolean,
): Promise<void> {
  if (!isHubSpotConfigured()) return;

  try {
    const contactId = await upsertContact({ email });
    if (!contactId) return;

    const client = getHubSpotClient();
    await client.crm.contacts.basicApi.update(contactId, {
      properties: {
        communication_consent: hasConsent ? "true" : "false",
      },
    });
  } catch (error: any) {
    console.error("HubSpot updateCommunicationConsent error:", error.message);
  }
}

// ─── findDealBySubscriptionId (used by webhooks) ──────────────────────────────
export async function findDealBySubscriptionId(
  subscriptionId: string,
): Promise<string | null> {
  if (!isHubSpotConfigured()) return null;

  try {
    const client = getHubSpotClient();
    const results = await client.crm.deals.searchApi.doSearch({
      filterGroups: [
        {
          filters: [
            {
              propertyName: "stripe_subscription_id",
              operator: FilterOperatorEnum.Eq,
              value: subscriptionId,
            },
          ],
        },
      ],
      properties: ["dealname"],
      limit: 1,
    });
    return results.results[0]?.id ?? null;
  } catch {
    return null;
  }
}

// ─── updateDealStage ──────────────────────────────────────────────────────────
export async function updateDealStage(
  dealId: string,
  stage: string,
  extraProperties?: Record<string, string>,
): Promise<void> {
  if (!isHubSpotConfigured()) return;

  try {
    const client = getHubSpotClient();
    await client.crm.deals.basicApi.update(dealId, {
      properties: { dealstage: stage, ...(extraProperties ?? {}) },
    });
  } catch (error: any) {
    console.error("HubSpot updateDealStage error:", error.message);
  }
}

// ─── incrementLifetimeDonations ───────────────────────────────────────────────
export async function incrementLifetimeDonations(
  email: string,
  amountCents: number,
): Promise<void> {
  if (!isHubSpotConfigured()) return;

  try {
    const client = getHubSpotClient();
    const searchResponse = await client.crm.contacts.searchApi.doSearch({
      filterGroups: [
        {
          filters: [
            {
              propertyName: "email",
              operator: FilterOperatorEnum.Eq,
              value: email,
            },
          ],
        },
      ],
      properties: ["total_lifetime_donations"],
      limit: 1,
    });

    if (!searchResponse.results.length) return;

    const contact = searchResponse.results[0];
    const current = parseFloat(
      contact.properties.total_lifetime_donations || "0",
    );
    const updated = (current + amountCents / 100).toFixed(2);

    await client.crm.contacts.basicApi.update(contact.id, {
      properties: { total_lifetime_donations: updated },
    });
  } catch (error: any) {
    console.error("HubSpot incrementLifetimeDonations error:", error.message);
  }
}

// ─── trackPageVisit (unchanged) ───────────────────────────────────────────────
export async function trackPageVisit(data: {
  visitorId: string;
  page: string;
  email?: string;
}): Promise<void> {
  if (!isHubSpotConfigured() || !data.email) return;
  try {
    const contactId = await upsertContact({ email: data.email });
    if (!contactId) return;
    const client = getHubSpotClient();
    await client.crm.contacts.basicApi.update(contactId, {
      properties: { notes_last_updated: new Date().toISOString() },
    });
  } catch (error: any) {
    console.error("HubSpot trackPageVisit error:", error.message);
  }
}
