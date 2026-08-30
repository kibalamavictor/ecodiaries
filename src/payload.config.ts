import { postgresAdapter } from '@payloadcms/db-postgres'
import { neonConfig, Pool as NeonPool } from '@neondatabase/serverless'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import pg from 'pg'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import ws from 'ws'

import { Categories } from './collections/Categories'
import { ImpactUpdates, InterestLeads, Organizations } from './collections/Atlas'
import { CommunityProjects, ContactSubmissions, PartnerOrganisations, PodcastEpisodes, Programmes, Series, Solutions, Videos } from './collections/Content'
import { Contributors } from './collections/Contributors'
import { Media } from './collections/Media'
import { NewsletterSubscribers } from './collections/NewsletterSubscribers'
import { Stories } from './collections/Stories'
import { Users } from './collections/Users'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const connectionString =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  'postgres://postgres:postgres@127.0.0.1:5432/ecodiaries'

// Neon: use serverless driver (WebSocket). Plain pg TCP to Neon often times out on Vercel.
const useNeonDriver = connectionString.includes('neon.tech')

if (useNeonDriver) {
  neonConfig.webSocketConstructor = ws
  // Fetch mode is reliable on Vercel; WebSocket-only for local Neon when explicitly set.
  neonConfig.poolQueryViaFetch = process.env.VERCEL
    ? true
    : process.env.NEON_WEBSOCKET_ONLY !== 'true'
}

const pgDriver = useNeonDriver ? { Pool: NeonPool } : pg

const isNeon = connectionString.includes('neon.tech')
const poolSsl = isNeon && !useNeonDriver ? { rejectUnauthorized: false } : undefined

const plugins = []

if (process.env.S3_BUCKET) {
  plugins.push(
    s3Storage({
      collections: { media: true },
      bucket: process.env.S3_BUCKET,
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: process.env.S3_REGION || 'auto',
        endpoint: process.env.S3_ENDPOINT,
      },
    }),
  )
} else if (process.env.BLOB_READ_WRITE_TOKEN) {
  plugins.push(
    vercelBlobStorage({
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: true,
      // Bypass Vercel's 4.5MB serverless body limit for phone photos / video files.
      clientUploads: true,
    }),
  )
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
  },
  collections: [
    Users,
    Media,
    Categories,
    Stories,
    Contributors,
    Solutions,
    Organizations,
    ImpactUpdates,
    InterestLeads,
    Programmes,
    Series,
    PodcastEpisodes,
    Videos,
    PartnerOrganisations,
    CommunityProjects,
    ContactSubmissions,
    NewsletterSubscribers,
  ],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-me',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pg: pgDriver as typeof pg,
    push: process.env.PAYLOAD_DB_PUSH === 'true',
    pool: {
      connectionString,
      ...(poolSsl ? { ssl: poolSsl } : {}),
      max: process.env.VERCEL || useNeonDriver ? 3 : 10,
      idleTimeoutMillis: process.env.VERCEL || useNeonDriver ? 5000 : 30000,
      connectionTimeoutMillis: process.env.VERCEL || useNeonDriver ? 120000 : 30000,
    },
  }),
  sharp,
  plugins,
})
