import type { MetadataRoute } from 'next'

type SitemapEntry = MetadataRoute.Sitemap[number]

type SitemapConfig = {
  baseUrl: string
  nowIso: string
}

const toBaseUrl = (raw: string | undefined): string => {
  const value = (raw ?? '').trim()
  return value.length > 0 ? value.replace(/\/$/, '') : 'http://localhost:3000'
}

const toEntry = (config: SitemapConfig, path: string, changeFrequency: SitemapEntry['changeFrequency']): SitemapEntry => ({
  url: `${config.baseUrl}${path}`,
  lastModified: config.nowIso,
  changeFrequency,
  priority: path === '/' ? 1 : 0.7,
})

export default function sitemap(): MetadataRoute.Sitemap {
  const config: SitemapConfig = {
    baseUrl: toBaseUrl(process.env.NEXT_PUBLIC_SITE_URL),
    nowIso: new Date().toISOString(),
  }

  return [
    toEntry(config, '/', 'weekly'),
    toEntry(config, '/map/normal', 'weekly'),
    toEntry(config, '/map/crater', 'weekly'),
    toEntry(config, '/map/mountaintop', 'weekly'),
    toEntry(config, '/map/rotted', 'weekly'),
    toEntry(config, '/map/noklateo', 'weekly'),
    toEntry(config, '/map/greatHollow', 'weekly'),
    toEntry(config, '/how-to-use', 'monthly'),
    toEntry(config, '/faq', 'monthly'),
    toEntry(config, '/updates', 'weekly'),
    toEntry(config, '/about', 'monthly'),
    toEntry(config, '/contact', 'monthly'),
    toEntry(config, '/privacy-policy', 'monthly'),
    toEntry(config, '/legal', 'monthly'),
    toEntry(config, '/terms', 'monthly'),
    toEntry(config, '/support-the-project', 'monthly'),
  ]
}
