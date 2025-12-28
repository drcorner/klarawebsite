// HubSpot integration for CRM data management
import { Client } from '@hubspot/api-client';

// Environment variable validation
function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// Check if HubSpot is configured (optional integration)
function isHubSpotConfigured(): boolean {
  return !!process.env.HUBSPOT_ACCESS_TOKEN;
}

// Cached HubSpot client
let hubspotClient: Client | null = null;

function getHubSpotClient(): Client {
  if (!hubspotClient) {
    const accessToken = getRequiredEnv('HUBSPOT_ACCESS_TOKEN');
    hubspotClient = new Client({ accessToken });
  }
  return hubspotClient;
}

// For backwards compatibility with existing async code
export async function getUncachableHubSpotClient() {
  return getHubSpotClient();
}

interface ContactData {
  email: string;
  firstName?: string;
  lastName?: string;
  source?: string;
}

interface DonationData {
  email: string;
  donorName: string;
  amount: number;
  donationType: 'one-time' | 'monthly';
  duration?: string;
}

// Create or update a contact in HubSpot
export async function upsertContact(data: ContactData): Promise<string | null> {
  if (!isHubSpotConfigured()) {
    console.log('HubSpot not configured - skipping contact upsert');
    return null;
  }

  try {
    const client = getHubSpotClient();

    // Search for existing contact by email
    const searchResponse = await client.crm.contacts.searchApi.doSearch({
      filterGroups: [{
        filters: [{
          propertyName: 'email',
          operator: 'EQ',
          value: data.email,
        }],
      }],
      properties: ['email', 'firstname', 'lastname'],
      limit: 1,
    });

    const properties: Record<string, string> = {
      email: data.email,
    };

    if (data.firstName) properties.firstname = data.firstName;
    if (data.lastName) properties.lastname = data.lastName;
    if (data.source) properties.hs_lead_status = data.source;

    if (searchResponse.results.length > 0) {
      // Update existing contact
      const contactId = searchResponse.results[0].id;
      await client.crm.contacts.basicApi.update(contactId, { properties });
      console.log(`HubSpot: Updated contact ${data.email} (ID: ${contactId})`);
      return contactId;
    } else {
      // Create new contact
      const createResponse = await client.crm.contacts.basicApi.create({ properties });
      console.log(`HubSpot: Created contact ${data.email} (ID: ${createResponse.id})`);
      return createResponse.id;
    }
  } catch (error: any) {
    console.error('HubSpot upsertContact error:', error.message);
    return null;
  }
}

// Track newsletter subscription
export async function trackNewsletterSignup(email: string): Promise<void> {
  if (!isHubSpotConfigured()) {
    console.log('HubSpot not configured - skipping newsletter signup tracking');
    return;
  }

  try {
    const contactId = await upsertContact({
      email,
      source: 'Newsletter Signup',
    });

    if (contactId) {
      const client = getHubSpotClient();

      // Update contact with newsletter subscription info
      await client.crm.contacts.basicApi.update(contactId, {
        properties: {
          lifecyclestage: 'subscriber',
          hs_lead_status: 'Newsletter Subscriber',
        },
      });

      console.log(`HubSpot: Tracked newsletter signup for ${email}`);
    }
  } catch (error: any) {
    console.error('HubSpot trackNewsletterSignup error:', error.message);
  }
}

// Track donation and update contact
export async function trackDonation(data: DonationData): Promise<void> {
  if (!isHubSpotConfigured()) {
    console.log('HubSpot not configured - skipping donation tracking');
    return;
  }

  try {
    // Parse name into first and last
    const nameParts = data.donorName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const contactId = await upsertContact({
      email: data.email,
      firstName,
      lastName,
      source: 'Donation',
    });

    if (contactId) {
      const client = getHubSpotClient();

      const donationAmount = (data.amount / 100).toFixed(2);
      const donationInfo = data.donationType === 'monthly'
        ? `Monthly: $${donationAmount}${data.duration && data.duration !== 'ongoing' ? ` (${data.duration} months)` : ' (ongoing)'}`
        : `One-time: $${donationAmount}`;

      // Update contact with donor information
      await client.crm.contacts.basicApi.update(contactId, {
        properties: {
          lifecyclestage: 'customer',
          hs_lead_status: 'Donor',
        },
      });

      // Create a deal to track the donation
      await client.crm.deals.basicApi.create({
        properties: {
          dealname: `Donation - ${data.donorName} - ${donationInfo}`,
          amount: donationAmount,
          dealstage: 'closedwon',
          pipeline: 'default',
          closedate: new Date().toISOString(),
        },
        associations: [{
          to: { id: contactId },
          types: [{
            associationCategory: 'HUBSPOT_DEFINED',
            associationTypeId: 3, // Deal to Contact
          }],
        }],
      });

      console.log(`HubSpot: Tracked donation of $${donationAmount} from ${data.email}`);
    }
  } catch (error: any) {
    console.error('HubSpot trackDonation error:', error.message);
  }
}

// Track white paper download
export async function trackWhitePaperDownload(email: string): Promise<void> {
  if (!isHubSpotConfigured()) {
    console.log('HubSpot not configured - skipping white paper download tracking');
    return;
  }

  try {
    const contactId = await upsertContact({
      email,
      source: 'White Paper Download',
    });

    if (contactId) {
      const client = getHubSpotClient();

      await client.crm.contacts.basicApi.update(contactId, {
        properties: {
          lifecyclestage: 'lead',
          hs_lead_status: 'White Paper Downloaded',
        },
      });

      console.log(`HubSpot: Tracked white paper download for ${email}`);
    }
  } catch (error: any) {
    console.error('HubSpot trackWhitePaperDownload error:', error.message);
  }
}

interface PageVisitData {
  visitorId: string;
  page: string;
  email?: string;
}

// Track page visit for returning visitors
export async function trackPageVisit(data: PageVisitData): Promise<void> {
  if (!isHubSpotConfigured()) {
    console.log(`Page visit tracked locally: ${data.visitorId} visited ${data.page}`);
    return;
  }

  try {
    if (!data.email) {
      console.log(`Page visit tracked locally: ${data.visitorId} visited ${data.page}`);
      return;
    }

    const contactId = await upsertContact({
      email: data.email,
      source: 'Website Visitor',
    });

    if (contactId) {
      const client = getHubSpotClient();

      await client.crm.contacts.basicApi.update(contactId, {
        properties: {
          notes_last_updated: new Date().toISOString(),
        },
      });

      console.log(`HubSpot: Tracked page visit for ${data.email} on ${data.page}`);
    }
  } catch (error: any) {
    console.error('HubSpot trackPageVisit error:', error.message);
  }
}

// Update contact communication consent
export async function updateCommunicationConsent(email: string, hasConsent: boolean): Promise<void> {
  if (!isHubSpotConfigured()) {
    console.log('HubSpot not configured - skipping communication consent update');
    return;
  }

  try {
    const contactId = await upsertContact({
      email,
    });

    if (contactId) {
      const client = getHubSpotClient();

      await client.crm.contacts.basicApi.update(contactId, {
        properties: {
          hs_email_optout: hasConsent ? 'false' : 'true',
        },
      });

      console.log(`HubSpot: Updated communication consent for ${email}: ${hasConsent}`);
    }
  } catch (error: any) {
    console.error('HubSpot updateCommunicationConsent error:', error.message);
  }
}

interface VolunteerData {
  email: string;
  firstName: string;
  lastName: string;
  expertise: string;
  message?: string;
}

// Track volunteer signup
export async function trackVolunteerSignup(data: VolunteerData): Promise<void> {
  if (!isHubSpotConfigured()) {
    console.log('HubSpot not configured - skipping volunteer signup tracking');
    return;
  }

  try {
    const contactId = await upsertContact({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      source: `Volunteer - ${data.expertise}`,
    });

    if (contactId) {
      const client = getHubSpotClient();

      // Update contact with volunteer info
      await client.crm.contacts.basicApi.update(contactId, {
        properties: {
          lifecyclestage: 'lead',
          hs_lead_status: `Volunteer - ${data.expertise}`,
        },
      });

      // Add a note with the volunteer's message if provided
      if (data.message) {
        try {
          await client.crm.objects.notes.basicApi.create({
            properties: {
              hs_timestamp: new Date().toISOString(),
              hs_note_body: `Volunteer signup - ${data.expertise}\n\nMessage: ${data.message}`,
            },
            associations: [{
              to: { id: contactId },
              types: [{
                associationCategory: 'HUBSPOT_DEFINED',
                associationTypeId: 202, // Note to Contact
              }],
            }],
          });
        } catch (noteError: any) {
          console.error('HubSpot note creation error:', noteError.message);
        }
      }

      console.log(`HubSpot: Tracked volunteer signup for ${data.email} (${data.expertise})`);
    }
  } catch (error: any) {
    console.error('HubSpot trackVolunteerSignup error:', error.message);
  }
}

interface ExperienceData {
  email: string;
  firstName: string;
  lastName: string;
  experience: string;
  permissionToUse: boolean;
}

// Track experience/feedback submission
export async function trackExperienceSubmission(data: ExperienceData): Promise<void> {
  if (!isHubSpotConfigured()) {
    console.log('HubSpot not configured - skipping experience submission tracking');
    return;
  }

  try {
    const contactId = await upsertContact({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      source: 'Experience Shared',
    });

    if (contactId) {
      const client = getHubSpotClient();

      // Update contact lifecycle
      await client.crm.contacts.basicApi.update(contactId, {
        properties: {
          lifecyclestage: 'lead',
          hs_lead_status: 'Experience Shared',
        },
      });

      // Add a note with the experience content
      const permissionText = data.permissionToUse ? 'Yes, can use with name' : 'Anonymous only';
      try {
        await client.crm.objects.notes.basicApi.create({
          properties: {
            hs_timestamp: new Date().toISOString(),
            hs_note_body: `Experience/Question Shared\n\nPermission to use: ${permissionText}\n\n${data.experience}`,
          },
          associations: [{
            to: { id: contactId },
            types: [{
              associationCategory: 'HUBSPOT_DEFINED',
              associationTypeId: 202, // Note to Contact
            }],
          }],
        });
      } catch (noteError: any) {
        console.error('HubSpot note creation error:', noteError.message);
      }

      console.log(`HubSpot: Tracked experience submission for ${data.email}`);
    }
  } catch (error: any) {
    console.error('HubSpot trackExperienceSubmission error:', error.message);
  }
}
