import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  const sitemap = siteUrl ? `${siteUrl.replace(/\/$/, '')}/sitemap.xml` : undefined

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap,
  }
}
