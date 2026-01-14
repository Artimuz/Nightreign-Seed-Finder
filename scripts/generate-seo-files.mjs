import { writeFile } from 'fs/promises'
import path from 'path'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nightreign-seed-finder.vercel.app'
const baseUrl = SITE_URL.replace(/\/$/, '')

const generateRobotsTxt = () => {
  return `# robots.txt
User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`
}

const generateSitemapXml = () => {
  const now = new Date().toISOString()
  
  const urls = [
    { path: '/', priority: 1.0, changefreq: 'weekly' },
    { path: '/map/normal', priority: 0.8, changefreq: 'weekly' },
    { path: '/map/crater', priority: 0.8, changefreq: 'weekly' },
    { path: '/map/mountaintop', priority: 0.8, changefreq: 'weekly' },
    { path: '/map/rotted', priority: 0.8, changefreq: 'weekly' },
    { path: '/map/noklateo', priority: 0.8, changefreq: 'weekly' },
    { path: '/map/greatHollow', priority: 0.8, changefreq: 'weekly' },
    { path: '/how-to-use', priority: 0.7, changefreq: 'monthly' },
    { path: '/faq', priority: 0.7, changefreq: 'monthly' },
    { path: '/updates', priority: 0.7, changefreq: 'weekly' },
    { path: '/about', priority: 0.6, changefreq: 'monthly' },
    { path: '/contact', priority: 0.6, changefreq: 'monthly' },
    { path: '/privacy-policy', priority: 0.5, changefreq: 'monthly' },
    { path: '/legal', priority: 0.5, changefreq: 'monthly' },
    { path: '/terms', priority: 0.5, changefreq: 'monthly' },
    { path: '/support-the-project', priority: 0.6, changefreq: 'monthly' },
  ]
  
  const urlEntries = urls.map(({ path, priority, changefreq }) => `  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`
}

const main = async () => {
  const publicDir = path.join(process.cwd(), 'public')
  const docsDir = path.join(process.cwd(), 'docs')
  
  const robotsTxt = generateRobotsTxt()
  const sitemapXml = generateSitemapXml()
  
  await writeFile(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf-8')
  await writeFile(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf-8')
  
  await writeFile(path.join(docsDir, 'robots.txt'), robotsTxt, 'utf-8')
  await writeFile(path.join(docsDir, 'sitemap.xml'), sitemapXml, 'utf-8')
  
  console.log('✓ robots.txt generated in public/ and docs/')
  console.log('✓ sitemap.xml generated in public/ and docs/')
}

await main()
