import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // BullMQ, IORedis, and Prisma adapter use Node.js APIs not available in Edge runtime.
  // Mark them as server-only externals so Next.js doesn't try to bundle them.
  serverExternalPackages: [
    "bullmq",
    "ioredis",
    "@prisma/client",
    "@prisma/adapter-pg",
    "pg",
    "cheerio",
  ],
};

export default nextConfig;
