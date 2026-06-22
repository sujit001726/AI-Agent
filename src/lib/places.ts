/**
 * Google Places API Text Search helper.
 * Uses the official Places API v1 (not scraping).
 */

export interface PlaceResult {
  placeId: string;
  name: string;
  address: string;
  rating: number | null;
  website: string | null;
  phone: string | null;
}

const BASE_URL = 'https://places.googleapis.com/v1/places:searchText';

const FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.rating',
  'places.websiteUri',
  'places.nationalPhoneNumber',
].join(',');

export async function searchPlaces(
  query: string,
  maxResults: number,
  pageToken?: string
): Promise<{ results: PlaceResult[]; nextPageToken?: string }> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) throw new Error('GOOGLE_PLACES_API_KEY is not set');

  const body: Record<string, unknown> = {
    textQuery: query,
    pageSize: Math.min(maxResults, 20),
  };
  if (pageToken) body.pageToken = pageToken;

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': FIELD_MASK,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Google Places API error: ${response.status} ${err}`);
  }

  const data = await response.json();
  const places: PlaceResult[] = (data.places || []).map((p: Record<string, unknown>) => {
    const displayName = p.displayName as { text?: string } | undefined;
    return {
      placeId: p.id as string,
      name: displayName?.text ?? 'Unknown',
      address: (p.formattedAddress as string) ?? '',
      rating: typeof p.rating === 'number' ? p.rating : null,
      website: (p.websiteUri as string | null) ?? null,
      phone: (p.nationalPhoneNumber as string | null) ?? null,
    };
  });

  return { results: places, nextPageToken: data.nextPageToken };
}

/**
 * In DEV_MODE, returns simulated places data so the pipeline can be tested
 * without a real Google Places API key.
 */
export function getSimulatedPlaces(query: string, maxResults: number): PlaceResult[] {
  const places: PlaceResult[] = [];
  for (let i = 1; i <= maxResults; i++) {
    places.push({
      placeId: `simulated-place-${i}`,
      name: `${query} Business #${i}`,
      address: `${i} Main Street, Simulated City`,
      rating: parseFloat((3 + Math.random() * 2).toFixed(1)),
      website: i % 3 === 0 ? null : `https://example-business-${i}.com`,
      phone: `+1-555-000-${String(i).padStart(4, '0')}`,
    });
  }
  return places;
}
