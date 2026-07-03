# Changelog

All notable changes to LeadFlow AI are documented here.

---

## [Unreleased]

### Added
- AI Agents directory-style homepage with full-screen background, category tabs, and search bar
- Redesigned login page with split-panel layout (branding left, auth form right)
- Red "Sign In" CTA button with enterprise encryption badge

---

## [0.3.0] – 2026-07-03

### Changed
- **Homepage**: Complete redesign to AI Agents directory layout
  - Full-viewport background image with dark overlay
  - Sticky transparent navbar with logo, nav links, sign-in, cart, and "Add a listing" button
  - Bold "Discover. Compare. Stay Ahead." hero headline
  - Category tabs: AI Agents, AI Tools, Events, Jobs, AI Agencies
  - Unified white search bar with category + pricing dropdowns and purple Search button
- **Login page**: Redesigned to split-screen LeadFlow branding layout
  - Left: gradient background, feature list, SOC2/GDPR badges
  - Right: Google OAuth, email/password form, "Sign In" button with arrow

### Fixed
- Killed stale Next.js dev server process that was blocking port 3000
- Updated docker-compose postgres password

---

## [0.2.0] – 2026-06-28

### Added
- Background worker using BullMQ for async campaign processing
- Redis-based job queue with retry logic
- Real-time campaign status polling from frontend
- Resend email webhook handler for delivery tracking (opened, bounced, delivered)
- Unsubscribe route for email compliance
- Framer Motion animations across homepage hero and sections

### Changed
- Hero section redesigned with two-column layout (text + campaign form)
- Added animated placeholder cycling in instruction input
- Stats section with live counters (2.5M+ leads, 150+ countries)

---

## [0.1.0] – 2026-06-15

### Added
- Initial Next.js 16 project setup with TypeScript and Tailwind CSS 4
- NextAuth v5 with Google OAuth and credentials provider
- Prisma ORM with PostgreSQL adapter
- Campaign creation API (`POST /api/campaigns`)
- Campaign listing API (`GET /api/campaigns`)
- Google Maps Places API (New) integration for business discovery
- Claude AI natural language instruction parser
- Cheerio-based website scraper for contact enrichment
- Personalized email outreach via Resend API
- Campaign detail page with leads table
- About, Features, Pricing, Contact static pages
- Global dark design system with glass morphism cards
