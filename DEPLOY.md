# EcoDiaries — Production deployment

The live app is deployed from **`platform/` only** (not the repo root or `_to-delete/`).

## Live URLs

| Environment | URL |
|-------------|-----|
| **Production** | https://ecodiaries-platform.vercel.app |
| **Vercel project** | `ecodiaries-platform` |
| **Payload admin** | https://ecodiaries-platform.vercel.app/admin |
| **Studio** | https://ecodiaries-platform.vercel.app/studio |

> The older `ecodiaries` Vercel project is a separate deployment — ignore it.

## Presentation checklist

Before sharing the site publicly, run through this list:

1. **Build locally** — `cd platform && npm run typecheck && npm run build`
2. **Deploy** — `npm run deploy:prod` (or `npx vercel deploy --prod --yes` from `platform/`)
3. **Smoke-test key pages** (mobile + desktop):
   - `/` — homepage
   - `/stories`, `/solutions`, `/community`, `/about`
   - `/terms`, `/privacy`, `/cookies` — legal pages + mobile nav
   - `/changemakers/solarworks-coop` — org profile + impact band
   - `/opportunities`
4. **Verify API** — `curl https://ecodiaries-platform.vercel.app/api/stories?limit=1` returns `totalDocs > 0`
5. **Forms** — ensure `TURNSTILE_SKIP_VERIFY=true` on Vercel until Turnstile keys are configured
6. **Favicon** — tab icon should show the green (`#156611`) EcoDiaries mark

## Stack (free tier)

- **Hosting:** Vercel Hobby
- **Database:** Neon Postgres (`ecodiaries-platform` project)
- **Media:** Local Payload uploads (add Vercel Blob or R2 for persistent uploads — see below)

## Redeploy after code changes

```bash
cd platform
npm run deploy:prod
```

Or step by step:

```bash
cd platform
npm run typecheck
npm run build
npx vercel deploy --prod --yes
```

## Reseed production database

Schema must exist before seeding. If `/api/stories` returns 500 or pages show "No stories", run **schema push first** from a machine with the Neon connection string:

```bash
cd platform
# Use the Neon pooled connection string from Vercel → ecodiaries-platform → Settings → Environment Variables
export DATABASE_URL='postgresql://...neon.tech/neondb?sslmode=require'
export PAYLOAD_SECRET='your-production-payload-secret'

PAYLOAD_DB_PUSH=true npm run db:push
npm run seed:prod
```

Verify: `curl https://ecodiaries-platform.vercel.app/api/stories?limit=1` returns stories JSON with `totalDocs > 0`.

> **Important:** Always use `ecodiaries-platform` production env vars — not the old `ecodiaries` Supabase project.

## Required Vercel environment variables

| Variable | Production value |
|----------|------------------|
| `DATABASE_URL` | Neon Postgres pooled connection string |
| `PAYLOAD_SECRET` | Payload CMS secret (32+ chars) |
| `NEXT_PUBLIC_SERVER_URL` | `https://ecodiaries-platform.vercel.app` |
| `TURNSTILE_SKIP_VERIFY` | `true` until real Turnstile keys are configured |

Optional: `RESEND_API_KEY`, `BLOB_READ_WRITE_TOKEN`, S3/R2 vars, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`.

## Add persistent media storage (recommended)

Vercel serverless cannot store uploaded files on disk. In the Vercel dashboard:

1. Open project **ecodiaries-platform** → **Storage** → **Create Blob store**
2. Link `BLOB_READ_WRITE_TOKEN` to the project
3. Re-enable `@payloadcms/storage-vercel-blob` in `payload.config.ts` and regenerate `importMap.js`
4. Redeploy

Until then, CMS-uploaded media may not persist across deploys; seeded content uses Payload media records.

## Custom domain (optional)

To use `ecodiaries.org` instead of the Vercel subdomain:

1. Vercel → **ecodiaries-platform** → **Settings** → **Domains** → add domain
2. Update DNS at your registrar per Vercel instructions
3. Set `NEXT_PUBLIC_SERVER_URL` to `https://ecodiaries.org` and redeploy
