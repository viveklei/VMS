import { Router, Request, Response } from 'express';

const router = Router();

// Cache variables for Zoho Token and Customers
let cachedAccessToken = '';
let tokenExpiryTime = 0;
let cachedCustomers: any[] = [];
let lastCacheTime = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes cache

async function getZohoAccessToken(): Promise<string> {
  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Missing Zoho OAuth credentials in environment.');
  }

  // Return cached token if valid
  if (cachedAccessToken && Date.now() < tokenExpiryTime) {
    return cachedAccessToken;
  }

  console.log('[Zoho API] Refreshing Access Token...');
  const tokenUrl = 'https://accounts.zoho.com/oauth/v2/token';
  const params = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'refresh_token'
  });

  const response = await fetch(`${tokenUrl}?${params.toString()}`, {
    method: 'POST'
  });

  const data = (await response.json()) as any;
  if (!response.ok || !data.access_token) {
    throw new Error(`Failed to refresh Zoho token: ${JSON.stringify(data)}`);
  }

  // Token expires in 1 hour (3600 seconds), cache for 50 minutes to be safe
  cachedAccessToken = data.access_token;
  tokenExpiryTime = Date.now() + 50 * 60 * 1000;
  console.log('[Zoho API] Access Token Refreshed Successfully.');
  return cachedAccessToken;
}

function getCityOrStateCoordinates(addressStr: string): [number, number] {
  const query = addressStr.toLowerCase();

  // 1. Specific Cities/Suburbs first (high resolution)
  if (query.includes('noida')) return [28.6273, 77.3725];
  if (query.includes('gurugram') || query.includes('gurgaon') || query.includes('cyber city')) return [28.4595, 77.0266];
  if (query.includes('faridabad')) return [28.4089, 77.3178];
  if (query.includes('ghaziabad')) return [28.6692, 77.4538];
  
  if (query.includes('pune')) return [18.5204, 73.8567];
  if (query.includes('navi mumbai')) return [19.0330, 73.0297];
  if (query.includes('thane')) return [19.2183, 72.9781];
  if (query.includes('mumbai') || query.includes('bombay')) return [19.0760, 72.8777];
  if (query.includes('nagpur')) return [21.1458, 79.0882];
  if (query.includes('nashik')) return [19.9975, 73.7898];
  if (query.includes('aurangabad')) return [19.8762, 75.3433];
  
  if (query.includes('bangalore') || query.includes('bengaluru')) return [12.9716, 77.5946];
  if (query.includes('chennai') || query.includes('madras')) return [13.0827, 80.2707];
  if (query.includes('coimbatore')) return [11.0168, 76.9558];
  if (query.includes('madurai')) return [9.9252, 78.1198];
  
  if (query.includes('hyderabad')) return [17.3850, 78.4867];
  if (query.includes('kolkata') || query.includes('calcutta')) return [22.5726, 88.3639];
  
  if (query.includes('ahmedabad')) return [23.0225, 72.5714];
  if (query.includes('surat')) return [21.1702, 72.8311];
  if (query.includes('vadodara') || query.includes('baroda')) return [22.3072, 73.1812];
  if (query.includes('rajkot')) return [22.3039, 70.8022];
  
  if (query.includes('jaipur')) return [26.9124, 75.7873];
  if (query.includes('jodhpur')) return [26.2389, 73.0243];
  if (query.includes('udaipur')) return [24.5854, 73.7125];
  
  if (query.includes('indore')) return [22.7196, 75.8577];
  if (query.includes('bhopal')) return [23.2599, 77.4126];
  if (query.includes('gwalior')) return [26.2183, 78.1828];
  
  if (query.includes('lucknow')) return [26.8467, 80.9462];
  if (query.includes('kanpur')) return [26.4499, 80.3319];
  if (query.includes('agra')) return [27.1767, 78.0081];
  if (query.includes('varanasi') || query.includes('banaras')) return [25.3176, 82.9739];
  if (query.includes('prayagraj') || query.includes('allahabad')) return [25.4358, 81.8463];
  
  if (query.includes('patna')) return [25.5941, 85.1376];
  if (query.includes('ranchi')) return [23.3441, 85.3096];
  if (query.includes('jamshedpur')) return [22.8046, 86.2029];
  
  if (query.includes('kochi') || query.includes('cochin')) return [9.9312, 76.2673];
  if (query.includes('trivandrum') || query.includes('thiruvananthapuram')) return [8.5241, 76.9366];
  
  if (query.includes('visakhapatnam') || query.includes('vizag')) return [17.6868, 83.2185];
  if (query.includes('vijayawada')) return [16.5062, 80.6480];
  
  if (query.includes('chandigarh')) return [30.7333, 76.7794];
  if (query.includes('ludhiana')) return [30.9010, 75.8573];
  if (query.includes('amritsar')) return [31.6340, 74.8723];
  if (query.includes('jalandhar')) return [31.3260, 75.5762];
  
  if (query.includes('dehradun')) return [30.3165, 78.0322];
  if (query.includes('guwahati')) return [26.1445, 91.7362];
  if (query.includes('panaji') || query.includes('goa')) return [15.4909, 73.8278];
  if (query.includes('delhi')) return [28.6139, 77.2090];

  // 2. States / Regions (wider resolution fallbacks)
  if (query.includes('haryana')) return [29.0588, 76.0856];
  if (query.includes('maharashtra')) return [19.0760, 72.8777];
  if (query.includes('karnataka')) return [12.9716, 77.5946];
  if (query.includes('tamil nadu')) return [13.0827, 80.2707];
  if (query.includes('west bengal')) return [22.5726, 88.3639];
  if (query.includes('telangana')) return [17.3850, 78.4867];
  if (query.includes('andhra pradesh')) return [15.9129, 79.7400];
  if (query.includes('gujarat')) return [22.2587, 71.1924];
  if (query.includes('rajasthan')) return [26.9124, 75.7873];
  if (query.includes('punjab')) return [31.1471, 75.3412];
  if (query.includes('uttar pradesh')) return [26.8467, 80.9462];
  if (query.includes('bihar')) return [25.0961, 85.3131];
  if (query.includes('madhya pradesh')) return [22.9734, 78.6569];
  if (query.includes('kerala')) return [10.8505, 76.2711];
  if (query.includes('odisha') || query.includes('orissa')) return [20.9517, 85.0985];
  if (query.includes('jharkhand')) return [23.6102, 85.2799];
  if (query.includes('chhattisgarh')) return [21.2787, 81.8661];
  if (query.includes('assam')) return [26.2006, 92.9376];
  if (query.includes('uttarakhand')) return [30.0668, 79.0193];
  if (query.includes('himachal')) return [31.1048, 77.1734];
  if (query.includes('jammu') || query.includes('kashmir')) return [33.7782, 76.5762];

  return [20.5937, 78.9629]; // Central India default
}

// OpenStreetMap Nominatim geocoder helper
async function geocodeAddress(addressStr: string, index: number): Promise<[number, number]> {
  // Extract city from address to place fallback coordinates accurately in the right region of India
  const baseCoords = getCityOrStateCoordinates(addressStr);

  // To respect Nominatim rate limit (1 request/sec), only query live geocoder for the first 5 contacts
  if (index < 5) {
    try {
      const query = encodeURIComponent(addressStr);
      const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;
      
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'LEIFleetOpsVMS/1.0 (admin@fleetops.lei)'
        }
      });
      
      if (res.ok) {
        const data = (await res.json()) as any;
        if (Array.isArray(data) && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          if (!isNaN(lat) && !isNaN(lon)) {
            return [lat, lon];
          }
        }
      }
    } catch (e) {
      console.warn(`[Geocoder] Failed to geocode address: "${addressStr}". Fallback active.`);
    }
  }

  // Deterministic scatter offset so contacts in the same region do not overlap on top of each other
  const latOffset = (((index * 13) % 100) - 50) / 1000;
  const lonOffset = (((index * 19) % 100) - 50) / 1000;
  return [baseCoords[0] + latOffset, baseCoords[1] + lonOffset];
}

router.get('/customers', async (req: Request, res: Response) => {
  try {
    const orgId = process.env.ZOHO_ORGANIZATION_ID;
    if (!orgId) {
      throw new Error('ZOHO_ORGANIZATION_ID is not configured in .env');
    }

    // Return cached customer list if fresh
    if (cachedCustomers.length > 0 && (Date.now() - lastCacheTime) < CACHE_DURATION) {
      console.log(`[Zoho API] Returning ${cachedCustomers.length} cached customer records.`);
      return res.json(cachedCustomers);
    }

    let contacts: any[] = [];
    let page = 1;
    let hasMore = true;
    const accessToken = await getZohoAccessToken();

    while (hasMore) {
      console.log(`[Zoho API] Fetching page ${page} of customers from Zoho Books...`);
      const booksUrl = `https://www.zohoapis.com/books/v3/contacts?organization_id=${orgId}&contact_type=customer&page=${page}&per_page=200`;
      const booksRes = await fetch(booksUrl, {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      const booksData = (await booksRes.json()) as any;
      if (!booksRes.ok || !booksData.contacts) {
        throw new Error(`Failed to fetch contacts on page ${page}: ${JSON.stringify(booksData)}`);
      }

      contacts = contacts.concat(booksData.contacts);
      
      const pageContext = booksData.page_context;
      hasMore = pageContext ? pageContext.has_more_page : false;
      page++;

      // Safety break to prevent infinite loops
      if (page > 15) break;
    }

    console.log(`[Zoho API] Total fetched contacts from all pages: ${contacts.length}`);

    // Map and geocode contacts concurrently (Processing ALL Zoho customer records)
    const geocodedCustomers = await Promise.all(
      contacts.map(async (contact: any, index: number) => {
        const name = contact.company_name || contact.contact_name || 'Zoho Customer';
        
        const addr = contact.billing_address || contact.shipping_address || {};

        const city = addr.city || contact.city || '';
        const state = addr.state || contact.state || contact.place_of_contact_formatted || '';
        const zip = addr.zip || contact.zip || '';

        // Assemble address
        const addressParts = [
          addr.address || contact.address || '',
          city,
          state,
          zip,
          addr.country || contact.country || ''
        ].filter(Boolean);
        
        // Default search query if no address specified
        const addressStr = addressParts.length > 0 
          ? addressParts.join(', ') 
          : `${name}, ${state || 'India'}`;
        
        const coords = await geocodeAddress(addressStr, index);
        
        // Use the most specific location label available
        const displayCity = city || state || 'India';

        return {
          name,
          coords,
          status: 'Pending',
          address: addressStr,
          city: displayCity,
          contactId: contact.contact_id
        };
      })
    );

    cachedCustomers = geocodedCustomers;
    lastCacheTime = Date.now();

    res.json(geocodedCustomers);
  } catch (error: any) {
    console.error('[Zoho Route Error]:', error.message);
    res.status(500).json({ 
      message: 'Failed to retrieve Zoho Books customer list', 
      error: error.message 
    });
  }
});

router.get('/customers/:contactId', async (req: Request, res: Response) => {
  try {
    const { contactId } = req.params;
    const orgId = process.env.ZOHO_ORGANIZATION_ID;
    if (!orgId) {
      throw new Error('ZOHO_ORGANIZATION_ID is not configured in .env');
    }

    const accessToken = await getZohoAccessToken();
    const url = `https://www.zohoapis.com/books/v3/contacts/${contactId}?organization_id=${orgId}`;
    
    console.log(`[Zoho API] Fetching details for contact ${contactId}...`);
    const response = await fetch(url, {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    const data = (await response.json()) as any;
    if (!response.ok || !data.contact) {
      throw new Error(`Failed to fetch contact details: ${JSON.stringify(data)}`);
    }

    const contact = data.contact;
    const addr = contact.billing_address || contact.shipping_address || {};

    const city = addr.city || '';
    const state = addr.state || contact.place_of_contact_formatted || '';
    const zip = addr.zip || '';
    const country = addr.country || 'India';
    const street = addr.address || '';

    const addressParts = [street, city, state, zip, country].filter(Boolean);
    const addressStr = addressParts.length > 0 ? addressParts.join(', ') : `${contact.contact_name}, ${state || 'India'}`;

    console.log(`[Geocoder] On-demand geocoding for "${contact.contact_name}" | Address: "${addressStr}" | PIN: "${zip}" | City: "${city}" | State: "${state}"`);
    
    const coords = await preciseGeocode(zip, city, state, street, contact.contact_name);

    res.json({
      contactId: contact.contact_id,
      name: contact.contact_name,
      address: addressStr,
      city: city || state || 'India',
      coords
    });
  } catch (error: any) {
    console.error('[Zoho Detail Error]:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Geocode a manual address input (for starting point)
router.get('/geocode', async (req: Request, res: Response) => {
  try {
    const address = req.query.address as string;
    if (!address || address.trim().length < 3) {
      return res.status(400).json({ error: 'Address query is required (min 3 characters)' });
    }

    console.log(`[Geocoder] Manual address geocoding: "${address}"`);
    const coords = await nominatimGeocode(address);
    res.json({ address, coords });
  } catch (error: any) {
    console.error('[Geocode Error]:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ─── Professional Multi-Step Geocoding ───────────────────────────────────────

async function nominatimGeocode(query: string): Promise<[number, number]> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=in`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'LEIFleetOpsVMS/1.0 (admin@fleetops.lei)' }
    });
    if (res.ok) {
      const data = (await res.json()) as any;
      if (Array.isArray(data) && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        if (!isNaN(lat) && !isNaN(lon)) {
          return [lat, lon];
        }
      }
    }
  } catch (e: any) {
    console.warn(`[Nominatim] Failed for query "${query}":`, e.message);
  }
  return [0, 0]; // signal failure
}

async function preciseGeocode(zip: string, city: string, state: string, street: string, companyName: string): Promise<[number, number]> {
  // Step 1: PIN code geocoding (most reliable for Indian addresses)
  if (zip && zip.length >= 5) {
    console.log(`[Geocoder] Step 1: Trying PIN code "${zip}" + city "${city}"...`);
    const pinQuery = city ? `${zip}, ${city}, India` : `${zip}, India`;
    const coords = await nominatimGeocode(pinQuery);
    if (coords[0] !== 0) {
      console.log(`[Geocoder] ✅ PIN code resolved: ${coords[0]}, ${coords[1]}`);
      return coords;
    }
    // Try PIN code alone
    const coords2 = await nominatimGeocode(`${zip}, India`);
    if (coords2[0] !== 0) {
      console.log(`[Geocoder] ✅ PIN code (alone) resolved: ${coords2[0]}, ${coords2[1]}`);
      return coords2;
    }
  }

  // Step 2: City + State geocoding
  if (city) {
    console.log(`[Geocoder] Step 2: Trying city "${city}", state "${state}"...`);
    const cityQuery = state ? `${city}, ${state}, India` : `${city}, India`;
    const coords = await nominatimGeocode(cityQuery);
    if (coords[0] !== 0) {
      console.log(`[Geocoder] ✅ City+State resolved: ${coords[0]}, ${coords[1]}`);
      return coords;
    }
  }

  // Step 3: Full street address geocoding
  if (street && city) {
    console.log(`[Geocoder] Step 3: Trying full address "${street}, ${city}"...`);
    const fullQuery = [street, city, state, 'India'].filter(Boolean).join(', ');
    const coords = await nominatimGeocode(fullQuery);
    if (coords[0] !== 0) {
      console.log(`[Geocoder] ✅ Full address resolved: ${coords[0]}, ${coords[1]}`);
      return coords;
    }
  }

  // Step 4: State-only geocoding
  if (state) {
    console.log(`[Geocoder] Step 4: Trying state "${state}"...`);
    const coords = await nominatimGeocode(`${state}, India`);
    if (coords[0] !== 0) {
      console.log(`[Geocoder] ✅ State resolved: ${coords[0]}, ${coords[1]}`);
      return coords;
    }
  }

  // Step 5: Hardcoded state center fallback
  console.log(`[Geocoder] Step 5: Using hardcoded state fallback for "${state || city || companyName}"`);
  return getStateFallbackCoords(state || city || '');
}

function getStateFallbackCoords(region: string): [number, number] {
  return getCityOrStateCoordinates(region);
}

export default router;
