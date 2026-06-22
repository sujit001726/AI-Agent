import * as cheerio from 'cheerio';

const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
const CONTACT_PAGE_PATHS = ['/contact', '/contact-us', '/about', '/about-us', '/info'];

interface EnrichmentResult {
  email: string | null;
  confidence: number; // 0-1 scale
  source: string | null;
}

/**
 * Fetches a website and attempts to extract a contact email address.
 * Strategy:
 *   1. Check for mailto: links on the homepage.
 *   2. Visit common contact pages.
 *   3. Scan page text for email patterns.
 * Returns null email + "no contact found" marker rather than guessing.
 */
export async function enrichWebsite(websiteUrl: string): Promise<EnrichmentResult> {
  try {
    const url = normalizeUrl(websiteUrl);
    const origin = new URL(url).origin;

    // Step 1: Scrape homepage
    const homepageResult = await extractEmailsFromUrl(url);
    if (homepageResult) return homepageResult;

    // Step 2: Try common contact page paths
    for (const path of CONTACT_PAGE_PATHS) {
      const contactUrl = `${origin}${path}`;
      try {
        const result = await extractEmailsFromUrl(contactUrl);
        if (result) return result;
      } catch {
        // Contact page may not exist — skip
      }
    }

    // Step 3: No email found — mark explicitly, don't guess
    return { email: null, confidence: 0, source: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Enrichment failed for ${websiteUrl}: ${message}`);
  }
}

async function extractEmailsFromUrl(url: string): Promise<EnrichmentResult | null> {
  const html = await fetchWithTimeout(url, 8000);
  const $ = cheerio.load(html);

  // Priority 1: mailto: link href attributes
  const mailtoEmails: string[] = [];
  $('a[href^="mailto:"]').each((_, el) => {
    const href = $(el).attr('href') || '';
    const email = href.replace('mailto:', '').split('?')[0].trim();
    if (isValidEmail(email)) mailtoEmails.push(email);
  });

  if (mailtoEmails.length > 0) {
    return { email: mailtoEmails[0], confidence: 0.95, source: url };
  }

  // Priority 2: Email in page text
  const text = $('body').text();
  const matches = text.match(EMAIL_REGEX);
  if (matches) {
    const filtered = matches.filter(isValidEmail).filter(isNotImageEmail);
    if (filtered.length > 0) {
      // Prefer info@, contact@, hello@ over personal emails
      const preferred = filtered.find((e) => /^(info|contact|hello|support|admin)@/i.test(e));
      return {
        email: preferred || filtered[0],
        confidence: preferred ? 0.8 : 0.6,
        source: url,
      };
    }
  }

  return null;
}

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'LeadFlow-Enrichment/1.0 (contact enrichment bot)' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

function normalizeUrl(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
}

function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email) && !email.includes('..') && email.length < 100;
}

function isNotImageEmail(email: string): boolean {
  // Filter out things like "image.png@" which regex can match
  return !/\.(png|jpg|jpeg|gif|webp|svg|css|js)@/i.test(email);
}
