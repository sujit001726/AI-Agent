import { Queue, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

/** Shared connection for BullMQ */
export const redisConnection = new IORedis(REDIS_URL, {
  maxRetriesPerRequest: null,
});

// Queue definitions
export const discoveryQueue = new Queue('discovery', { connection: redisConnection as any });
export const enrichmentQueue = new Queue('enrichment', { connection: redisConnection as any });
export const outreachQueue = new Queue('outreach', { connection: redisConnection as any });

// QueueEvents for progress monitoring (used in API routes)
export const discoveryEvents = new QueueEvents('discovery', { connection: redisConnection as any });
export const enrichmentEvents = new QueueEvents('enrichment', { connection: redisConnection as any });

// Job payload types
export interface DiscoveryJobData {
  campaignId: string;
  location: string;
  category: string;
  maxResults: number;
  sortBy: string;
}

export interface EnrichmentJobData {
  leadId: string;
  website: string | null;
  campaignId: string;
}

export interface OutreachJobData {
  leadId: string;
  campaignId: string;
}
