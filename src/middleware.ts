import { NextRequest, NextResponse } from 'next/server'

type RateEntry = { windowStart: number; count: number }

type LimitConfig = { windowMs: number; maxRequests: number }

type BlockDecision = { shouldBlock: boolean; status: number; reason: string }

type RateDecision = { allowed: boolean; remaining: number }

const ipRateMap = new Map<string, RateEntry>()

setInterval(() => {
  const now = Date.now()
  const cutoff = now - 10 * 60 * 1000

  for (const [key, entry] of ipRateMap.entries()) {
    if (entry.windowStart < cutoff) {
      ipRateMap.delete(key)
    }
  }
}, 60 * 1000)

const toClientIp = (request: NextRequest): string => {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwardedFor?.split(',')[0]?.trim() || realIp || 'unknown'
  return ip.length > 0 ? ip : 'unknown'
}

const toUserAgent = (request: NextRequest): string => request.headers.get('user-agent') ?? ''

const isGoogleCrawlerUserAgent = (userAgent: string): boolean => {
  const ua = userAgent.toLowerCase()

  const signals = [
    'googlebot',
    'adsbot-google',
    'mediapartners-google',
    'google-inspectiontool',
    'apis-google',
    'feedfetcher-google',
  ]

  return signals.some((signal) => ua.includes(signal))
}

const isLikelyAutomatedUserAgent = (userAgent: string): boolean => {
  const ua = userAgent.toLowerCase()

  const signals = [
    'headlesschrome',
    'phantomjs',
    'puppeteer',
    'playwright',
    'selenium',
    'webdriver',
    'python-requests',
    'aiohttp',
    'curl/',
    'wget/',
    'go-http-client',
    'node-fetch',
    'httpclient',
    'java/',
  ]

  return signals.some((signal) => ua.includes(signal))
}

const hasMinimalBrowserHeaders = (request: NextRequest): boolean => {
  const accept = request.headers.get('accept')
  const acceptLanguage = request.headers.get('accept-language')
  const secFetchSite = request.headers.get('sec-fetch-site')

  if (!accept || accept.trim().length === 0) return false
  if (!acceptLanguage || acceptLanguage.trim().length === 0) return false
  if (!secFetchSite || secFetchSite.trim().length === 0) return false

  return true
}

const decideBlocking = (request: NextRequest): BlockDecision => {
  const userAgent = toUserAgent(request)

  if (!userAgent || userAgent.trim().length < 4) {
    return { shouldBlock: true, status: 403, reason: 'missing_user_agent' }
  }

  if (isGoogleCrawlerUserAgent(userAgent)) {
    return { shouldBlock: false, status: 200, reason: 'allowed_google_crawler' }
  }

  if (isLikelyAutomatedUserAgent(userAgent)) {
    return { shouldBlock: true, status: 403, reason: 'automated_user_agent' }
  }

  const method = request.method.toUpperCase()
  if (method === 'GET' && !hasMinimalBrowserHeaders(request)) {
    const accept = request.headers.get('accept') ?? ''
    const looksLikeHtmlNavigation = accept.includes('text/html')

    if (!looksLikeHtmlNavigation) {
      return { shouldBlock: true, status: 403, reason: 'missing_browser_headers' }
    }
  }

  return { shouldBlock: false, status: 200, reason: 'allowed' }
}

const rateLimitKeyFor = (request: NextRequest): string => {
  const ip = toClientIp(request)
  const userAgent = toUserAgent(request).slice(0, 32)
  const path = new URL(request.url).pathname
  const bucket = path.startsWith('/api/') ? 'api' : 'page'
  return `${bucket}:${ip}:${userAgent}`
}

const decideRateLimit = (key: string, config: LimitConfig, now: number): RateDecision => {
  const entry = ipRateMap.get(key)

  if (!entry || now - entry.windowStart >= config.windowMs) {
    ipRateMap.set(key, { windowStart: now, count: 1 })
    return { allowed: true, remaining: Math.max(0, config.maxRequests - 1) }
  }

  if (entry.count >= config.maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  entry.count += 1
  return { allowed: true, remaining: Math.max(0, config.maxRequests - entry.count) }
}

const rateLimitConfigFor = (pathname: string): LimitConfig => {
  if (pathname.startsWith('/api/')) return { windowMs: 10_000, maxRequests: 6 }
  return { windowMs: 10_000, maxRequests: 30 }
}

export function middleware(request: NextRequest) {
  const url = new URL(request.url)
  const pathname = url.pathname

  const blockDecision = decideBlocking(request)
  if (blockDecision.shouldBlock) {
    return new NextResponse('Forbidden', { status: blockDecision.status })
  }

  const config = rateLimitConfigFor(pathname)
  const key = rateLimitKeyFor(request)
  const now = Date.now()
  const rateDecision = decideRateLimit(key, config, now)

  if (!rateDecision.allowed) {
    return new NextResponse('Too Many Requests', { status: 429 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/log', '/api/report-bug'],
}
