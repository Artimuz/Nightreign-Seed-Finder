import https from 'node:https'

const pagesBaseUrl = String(process.env.NEXT_PUBLIC_PAGES_BASE_URL || '').trim().replace(/\/$/, '')
const buildId = String(process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || process.env.NEXT_PUBLIC_BUILD_ID || '').trim()

if (!pagesBaseUrl) {
  throw new Error('NEXT_PUBLIC_PAGES_BASE_URL is required')
}

if (!buildId) {
  throw new Error('Build id not available. Set NEXT_PUBLIC_BUILD_ID or run in CI with GITHUB_SHA/VERCEL_GIT_COMMIT_SHA')
}

const url = `${pagesBaseUrl}/_next/static/${buildId}/_buildManifest.js`

const request = (targetUrl) =>
  new Promise((resolve, reject) => {
    https
      .get(targetUrl, (res) => {
        const statusCode = res.statusCode ?? 0
        res.resume()
        resolve(statusCode)
      })
      .on('error', reject)
  })

const main = async () => {
  const status = await request(url)
  if (status < 200 || status >= 400) {
    throw new Error(`Pages build manifest not reachable: ${url} (status ${status})`)
  }
}

await main()
