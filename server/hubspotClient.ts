// HubSpot integration for CRM data management
import { Client } from '@hubspot/api-client';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=hubspot',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('HubSpot not connected');
  }
  return accessToken;
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
// Always call this function again to get a fresh client.
export async function getUncachableHubSpotClient() {
  const accessToken = await getAccessToken();
  return new Client({ accessToken });
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
  try {
    const client = await getUncachableHubSpotClient();
    
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
  try {
    const contactId = await upsertContact({
      email,
      source: 'Newsletter Signup',
    });

    if (contactId) {
      const client = await getUncachableHubSpotClient();
      
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
      const client = await getUncachableHubSpotClient();
      
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
  try {
    const contactId = await upsertContact({
      email,
      source: 'White Paper Download',
    });

    if (contactId) {
      const client = await getUncachableHubSpotClient();
      
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
      const client = await getUncachableHubSpotClient();
      
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
  try {
    const contactId = await upsertContact({
      email,
    });

    if (contactId) {
      const client = await getUncachableHubSpotClient();
      
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
