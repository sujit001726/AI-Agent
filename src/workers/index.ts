/**
 * LeadFlow Background Worker
 * ---
 * Runs as a standalone Node.js process alongside `next dev`.
 * Handles three agent queues:
 *   - discovery:  finds businesses via Google Places API
 *   - enrichment: scrapes websites for contact emails
 *   - outreach:   sends personalized emails via Resend (or mocks in DEV_MODE)
 *
 * Start with: npx tsx src/workers/index.ts
 */

import 'dotenv/config';
import { searchPlaces, getSimulatedPlaces, PlaceResult } from '../lib/places';
import 'dotenv/config';
import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { prisma } from '../lib/prisma';
import { enrichWebsite } from '../lib/enrichment';
import { renderTemplate, generateUnsubscribeUrl, injectUnsubscribeFooter } from '../lib/email-template';
import type { DiscoveryJobData, EnrichmentJobData, OutreachJobData } from '../lib/bullmq';
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const DEV_MODE = process.env.DEV_MODE === 'true';
const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

const redisConnection = new IORedis(REDIS_URL, { maxRetriesPerRequest: null });

// ─────────────────────────────────────────────
// DISCOVERY AGENT
// ─────────────────────────────────────────────
const discoveryWorker = new Worker<DiscoveryJobData>(
  'discovery',
  async (job: Job<DiscoveryJobData>) => {
    const { campaignId, location, category, maxResults } = job.data;

    await prisma.campaign.update({
      where: { id: campaignId },
      data: { status: 'DISCOVERING' },
    });

    console.log(`[Discovery] Starting for campaign ${campaignId}: "${category}" in "${location}"`);

    let results: PlaceResult[] = [];

    if (DEV_MODE) {
      // Use simulated data in dev mode
      results = getSimulatedPlaces(`${category} in ${location}`, maxResults);
      console.log(`[Discovery] DEV_MODE: Generated ${results.length} simulated places`);
    } else {
      // Real Google Places API with pagination
      let pageToken: string | undefined;
      do {
        const query = `${category} in ${location}`;
        const { results: pageResults, nextPageToken } = await searchPlaces(
          query,
          maxResults - results.length,
          pageToken
        );
        results.push(...pageResults);
        pageToken = nextPageToken;

        if (results.length >= maxResults) break;
        // Google requires a short delay between paginated requests
        if (pageToken) await sleep(2000);
      } while (pageToken && results.length < maxResults);
    }

    // Store leads and enqueue enrichment jobs
    const { Queue } = await import('bullmq');
    const enrichmentQueue = new Queue('enrichment', { connection: redisConnection });

    let savedCount = 0;
    for (const place of results) {
      try {
        const lead = await prisma.lead.upsert({
          where: { campaignId_placeId: { campaignId, placeId: place.placeId } },
          create: {
            campaignId,
            placeId: place.placeId,
            name: place.name,
            address: place.address,
            rating: place.rating,
            website: place.website,
            phone: place.phone,
            enrichmentStatus: 'PENDING',
          },
          update: {}, // If it already exists, don't overwrite
        });

        savedCount++;

        // Enqueue enrichment job for this lead
        await enrichmentQueue.add(
          'enrich-lead',
          { leadId: lead.id, website: place.website, campaignId } satisfies EnrichmentJobData,
          { attempts: 3, backoff: { type: 'exponential', delay: 5000 } }
        );
      } catch (err) {
        console.error(`[Discovery] Failed to save place ${place.placeId}:`, err);
      }
    }

    await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        status: 'ENRICHING',
        leadsDiscoveredCount: savedCount,
        totalLeadsExpected: savedCount,
      },
    });

    console.log(`[Discovery] Saved ${savedCount} leads for campaign ${campaignId}`);
    return { savedCount };
  },
  { connection: redisConnection, concurrency: 2 }
);

// ─────────────────────────────────────────────
// ENRICHMENT AGENT
// ─────────────────────────────────────────────
const enrichmentWorker = new Worker<EnrichmentJobData>(
  'enrichment',
  async (job: Job<EnrichmentJobData>) => {
    const { leadId, website, campaignId } = job.data;

    await prisma.lead.update({
      where: { id: leadId },
      data: { enrichmentStatus: 'ENRICHING' },
    });

    let email: string | null = null;
    let emailConfidence: number | null = null;
    let enrichmentStatus = 'NO_CONTACT_FOUND';

    if (website) {
      try {
        const result = await enrichWebsite(website);
        if (result.email) {
          // Check suppression list before storing
          const suppressed = await prisma.suppression.findUnique({
            where: { email: result.email },
          });

          if (!suppressed) {
            email = result.email;
            emailConfidence = result.confidence;
            enrichmentStatus = 'ENRICHED';
          } else {
            enrichmentStatus = 'NO_CONTACT_FOUND';
            console.log(`[Enrichment] Email ${result.email} is on suppression list`);
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`[Enrichment] Error for lead ${leadId}:`, message);
        await prisma.lead.update({
          where: { id: leadId },
          data: { enrichmentStatus: 'FAILED', enrichmentError: message },
        });

        // Update campaign enrichment count
        await incrementEnrichedCount(campaignId);
        throw err; // Re-throw for BullMQ retry
      }
    }
    // No website provided — mark as no contact found (not a failure)

    await prisma.lead.update({
      where: { id: leadId },
      data: { email, emailConfidence, enrichmentStatus },
    });

    await incrementEnrichedCount(campaignId);

    console.log(
      `[Enrichment] Lead ${leadId}: status=${enrichmentStatus} email=${email ?? 'none'}`
    );

    return { email, enrichmentStatus };
  },
  { connection: redisConnection, concurrency: 5 }
);

// ─────────────────────────────────────────────
// OUTREACH AGENT
// ─────────────────────────────────────────────
const outreachWorker = new Worker<OutreachJobData>(
  'outreach',
  async (job: Job<OutreachJobData>) => {
    const { leadId, campaignId } = job.data;

    const [lead, campaign] = await Promise.all([
      prisma.lead.findUniqueOrThrow({ where: { id: leadId } }),
      prisma.campaign.findUniqueOrThrow({ where: { id: campaignId } }),
    ]);

    if (!lead.email) {
      console.log(`[Outreach] Lead ${leadId} has no email — skipping`);
      return { skipped: true };
    }

    // Suppression list check before each send
    const suppressed = await prisma.suppression.findUnique({ where: { email: lead.email } });
    if (suppressed) {
      console.log(`[Outreach] ${lead.email} is suppressed — skipping`);
      await prisma.lead.update({ where: { id: leadId }, data: { outreachStatus: 'FAILED' } });
      return { skipped: true, reason: 'suppressed' };
    }

    const templateBody = campaign.emailTemplateBody || defaultTemplate();
    const templateSubject = campaign.emailTemplateSubject || `Partnership Opportunity - ${campaign.category}`;

    const context = {
      name: lead.name,
      city: campaign.location,
      website: lead.website,
      email: lead.email,
      address: lead.address,
      phone: lead.phone,
      category: campaign.category,
    };

    const renderedSubject = renderTemplate(templateSubject, context);
    const renderedBody = renderTemplate(templateBody, context);
    const unsubscribeUrl = generateUnsubscribeUrl(leadId, BASE_URL);
    const finalHtmlBody = injectUnsubscribeFooter(
      `<div style="font-family:sans-serif;max-width:600px">${renderedBody}</div>`,
      unsubscribeUrl
    );

    if (DEV_MODE) {
      // ── REVIEW-DRIVEN MODE: Never auto-execute real sends ──
      console.log(`\n[Outreach] 🧪 DEV_MODE — Simulated send (no real email)`);
      console.log(`  To:      ${lead.email}`);
      console.log(`  Subject: ${renderedSubject}`);
      console.log(`  Body:    ${renderedBody.substring(0, 120)}...`);
      console.log(`  Unsub:   ${unsubscribeUrl}\n`);

      const mockMessageId = `dev-${Date.now()}-${leadId}`;

      await prisma.outreachLog.upsert({
        where: { leadId },
        create: { leadId, resendMessageId: mockMessageId, status: 'SENT' },
        update: { resendMessageId: mockMessageId, status: 'SENT' },
      });
      await prisma.lead.update({ where: { id: leadId }, data: { outreachStatus: 'SENT' } });

      return { sent: true, dev: true, messageId: mockMessageId };
    }

    // ── LIVE MODE: Only reached after explicit review approval ──
    // This block is intentionally left guarded behind DEV_MODE=false
    // Approval flow described in implementation plan before enabling.
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data: sendData, error } = await resend.emails.send({
      from: 'LeadFlow <outreach@yourdomain.com>',
      to: lead.email,
      subject: renderedSubject,
      html: finalHtmlBody,
      headers: { 'List-Unsubscribe': `<${unsubscribeUrl}>` },
    });

    if (error || !sendData) {
      throw new Error(`Resend error: ${JSON.stringify(error)}`);
    }

    await prisma.outreachLog.upsert({
      where: { leadId },
      create: { leadId, resendMessageId: sendData.id, status: 'SENT' },
      update: { resendMessageId: sendData.id, status: 'SENT' },
    });
    await prisma.lead.update({ where: { id: leadId }, data: { outreachStatus: 'SENT' } });

    console.log(`[Outreach] Sent to ${lead.email}, messageId=${sendData.id}`);
    return { sent: true, messageId: sendData.id };
  },
  { connection: redisConnection, concurrency: 3 }
);

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
async function incrementEnrichedCount(campaignId: string) {
  const updated = await prisma.campaign.update({
    where: { id: campaignId },
    data: { leadsEnrichedCount: { increment: 1 } },
    select: { leadsEnrichedCount: true, totalLeadsExpected: true },
  });

  if (updated.leadsEnrichedCount >= updated.totalLeadsExpected) {
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { status: 'COMPLETED' },
    });
    console.log(`[Enrichment] Campaign ${campaignId} completed!`);
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function defaultTemplate(): string {
  return `
<p>Hi {{name}},</p>
<p>We came across your business in {{city}} and would love to explore a partnership opportunity with you.</p>
<p>Could we schedule a quick 15-minute call this week?</p>
<p>Looking forward to connecting,<br>The LeadFlow Team</p>
`.trim();
}

// ─────────────────────────────────────────────
// Worker Event Handlers
// ─────────────────────────────────────────────
for (const [name, worker] of [
  ['discovery', discoveryWorker],
  ['enrichment', enrichmentWorker],
  ['outreach', outreachWorker],
] as const) {
  worker.on('completed', (job) => console.log(`[${name}] Job ${job.id} completed`));
  worker.on('failed', (job, err) =>
    console.error(`[${name}] Job ${job?.id} failed:`, err.message)
  );
}

console.log('🚀 LeadFlow workers started (discovery, enrichment, outreach)');
console.log(`   DEV_MODE: ${DEV_MODE ? '✅ enabled (simulated sends)' : '❌ disabled (real sends)'}`);

// Graceful shutdown
process.on('SIGTERM', async () => {
  await Promise.all([
    discoveryWorker.close(),
    enrichmentWorker.close(),
    outreachWorker.close(),
  ]);
  await prisma.$disconnect();
  process.exit(0);
});
