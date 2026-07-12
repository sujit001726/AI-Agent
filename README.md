# LeadFlow AI 🚀

> **AI-powered lead generation platform** — Find, enrich, and reach any business worldwide using Google Maps + Claude AI.

![Next.js](https://img.shields.io/badge/Next.js-16.2.9-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.x-38bdf8?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-7.x-2D3748?logo=prisma)

n

---

## 🧑‍💻 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS 4 |
| AI | Claude AI (Anthropic SDK) |
| Maps | Google Places API (New) |
| Email | Resend |
| Auth | NextAuth v5 + Google OAuth |
| Database | PostgreSQL + Prisma ORM |
| Queue | BullMQ + Redis |
| Scraping | Cheerio |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- Redis (or use Docker Compose)
- API keys: Google Maps, Anthropic (Claude), Resend, Google OAuth

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/sujit001726/AI-Agent.git
cd AI-Agent

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env

# 4. Fill in your API keys in .env
# 5. Start the database via Docker
docker-compose up -d

# 6. Run Prisma migrations
npm run db:push

# 7. Start development servers (Next.js + Worker)
npm run dev:all
```

### Development Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Next.js dev server |
| `npm run dev:worker` | Start BullMQ worker |
| `npm run dev:all` | Start both concurrently |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:push` | Push schema to database |
| `npm run build` | Production build |

---

## 🗂️ Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Homepage (AI Agents Directory)
│   ├── login/            # Auth pages
│   ├── campaign/[id]/    # Campaign detail view
│   ├── api/              # API routes (campaigns, leads, webhooks)
│   ├── about/            # About page
│   ├── features/         # Features page
│   ├── pricing/          # Pricing page
│   └── contact/          # Contact page
├── lib/                  # Core utilities
│   ├── auth.ts           # NextAuth config
│   ├── claude.ts         # AI instruction parser
│   ├── places.ts         # Google Maps integration
│   ├── bullmq.ts         # Queue configuration
│   └── email-template.ts # Email builder
└── workers/
    └── index.ts          # Background job processor
```

---

## 🔑 Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# Authentication
AUTH_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# AI
ANTHROPIC_API_KEY=...

# Maps
GOOGLE_MAPS_API_KEY=...

# Email
RESEND_API_KEY=...
EMAIL_FROM=...

# Redis
REDIS_URL=redis://localhost:6379
```

---

## 📄 License

MIT © 2026 LeadFlow AI
