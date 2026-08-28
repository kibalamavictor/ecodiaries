import { withPayload } from '@payloadcms/next/withPayload'
import bundleAnalyzer from '@next/bundle-analyzer'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)
const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/programmes', destination: '/opportunities', permanent: true },
      { source: '/programmes/:slug', destination: '/opportunities/:slug', permanent: true },
      { source: '/watch', destination: '/', permanent: true },
      { source: '/watch/:path*', destination: '/', permanent: true },
      { source: '/listen', destination: '/', permanent: true },
      { source: '/listen/:path*', destination: '/', permanent: true },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/openfreemap/:path*',
        destination: 'https://tiles.openfreemap.org/:path*',
      },
    ]
  },
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      'lucide-react',
      'recharts',
      'maplibre-gl',
      'react-map-gl',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-tooltip',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-avatar',
    ],
    serverActions: {
      bodySizeLimit: '8mb',
    },
  },
  env: {
    NEXT_PUBLIC_STUDIO_BLOB_UPLOAD: process.env.BLOB_READ_WRITE_TOKEN ? 'true' : '',
  },
  compress: true,
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
  async headers() {
    return [
      {
        source: '/logo.svg',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/favicon.svg',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/_next/static/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },
  serverExternalPackages: [
    'payload',
    '@payloadcms/db-postgres',
    '@neondatabase/serverless',
    'ws',
    'sharp',
    'pino',
    'pino-pretty',
  ],
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    deviceSizes: [384, 640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: '*.amazonaws.com' },
      { protocol: 'https', hostname: '*.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: '*.blob.vercel-storage.com' },
    ],
    localPatterns: [{ pathname: '/api/media/file/**' }],
  },
  turbopack: {
    root: path.resolve(dirname),
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    webpackConfig.performance = {
      ...webpackConfig.performance,
      maxAssetSize: 512 * 1024,
      maxEntrypointSize: 512 * 1024,
      hints: 'warning',
    }
    return webpackConfig
  },
}

export default withBundleAnalyzer(withPayload(nextConfig, { devBundleServerPackages: false }))
