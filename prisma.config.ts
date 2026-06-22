import { defineConfig } from 'prisma/config';
import { config } from 'dotenv';

// Load .env before Prisma reads it
config();

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
