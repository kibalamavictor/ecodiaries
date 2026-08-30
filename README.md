# EcoDiaries Platform

**This folder is the complete, self-contained app** — Next.js 15 + Payload CMS 3 + PostgreSQL.

Open **this folder** in Cursor (not the parent `ecodiaries/` root).

## Quick start

```bash
cd platform
npm install
npm run db:up
npm run seed
npm run dev
```

- Public site: http://localhost:3000
- Payload admin: http://localhost:3000/admin
- Custom studio: http://localhost:3000/studio

## What's inside

| Path | Purpose |
|------|---------|
| `src/app/(frontend)/` | Public website |
| `src/app/(payload)/` | Payload CMS admin (`/admin`) |
| `src/app/(studio)/` | Custom Tailwind studio (`/studio`) |
| `src/collections/` | Payload collections |
| `src/lib/cms/` | CMS data fetchers |
| `src/lib/studio/` | Studio helpers |
| `src/components/` | React components |
| `src/scripts/` | Database seed scripts |
| `tests/e2e/` | Playwright tests |
| `design-reference/` | Static HTML/CSS design spec (reference only) |
| `media/` | Local dev uploads (gitignored in production) |

## Environment

Copy `.env.example` to `.env` if needed. Your existing `.env` was copied here during consolidation.
