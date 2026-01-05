const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// Automatically inject package.json version
const packageJson = require('./package.json');

const normalizeBaseUrl = (value) => {
  const trimmed = String(value || '').trim()
  if (!trimmed) return ''
  return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed
}

const resolvePagesPublicBaseUrl = () => {
  const explicitPublic = normalizeBaseUrl(process.env.NEXT_PUBLIC_PAGES_PUBLIC_BASE_URL)
  if (explicitPublic) return explicitPublic

  const legacy = normalizeBaseUrl(process.env.NEXT_PUBLIC_PAGES_ASSET_BASE_URL)
  if (legacy) return legacy.endsWith('/public') ? legacy : `${legacy}/public`

  const base = normalizeBaseUrl(process.env.NEXT_PUBLIC_PAGES_BASE_URL)
  if (base) return `${base}/public`

  return ''
}

const pagesPublicBaseUrl = resolvePagesPublicBaseUrl()

const resolvePagesChunksBaseUrl = () => {
  const base = normalizeBaseUrl(process.env.NEXT_PUBLIC_PAGES_BASE_URL)
  return base
}

const pagesChunksBaseUrl = resolvePagesChunksBaseUrl()

const isPagesAssetsEnabled = String(process.env.NEXT_PUBLIC_ENABLE_PAGES_ASSETS || '').trim() === 'true'

const nextConfig = {
  assetPrefix: process.env.NODE_ENV === 'production' && isPagesAssetsEnabled && pagesChunksBaseUrl ? pagesChunksBaseUrl : '' ,
  env: {
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'thefifthmatt.github.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'kevins78.github.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'artimuz.github.io',
        port: '',
        pathname: '/Nightreign-Seed-Finder/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 1080, 1920],
    imageSizes: [16, 32, 64, 128, 256],
    minimumCacheTTL: 31536000,
    qualities: [75, 85],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  httpAgentOptions: {
    keepAlive: true,
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production' 
              ? 'https://nightreign-seed-finder.vercel.app' 
              : 'http://localhost:3000',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, apikey, X-Client-Info',
          },
        ],
      },
      {
        source: '/Images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/manifest.webmanifest',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.(ico|svg|webp|webm|otf)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self';",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://artimuz.github.io https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com;",
              "style-src 'self' 'unsafe-inline' https://artimuz.github.io;",
              "img-src 'self' data: blob: https:;",
              "connect-src 'self' https://*.supabase.co https://*.supabase.io wss://*.supabase.co wss://*.supabase.io https://*.google.com https://*.googlesyndication.com https://*.doubleclick.net https://artimuz.github.io;",
              "font-src 'self' https://artimuz.github.io;",
              "object-src 'none';",
              "base-uri 'self';",
              "form-action 'self';",
            ].join(' '),
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ];
  },
}

module.exports = withBundleAnalyzer(nextConfig)
