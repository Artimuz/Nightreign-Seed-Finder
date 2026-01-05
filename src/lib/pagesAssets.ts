import { APP_VERSION } from '@/lib/constants/version'

const normalizeBaseUrl = (value: string): string => {
  const trimmed = value.trim()
  if (!trimmed) return ''
  return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed
}

const defaultProdPagesBaseUrl = 'https://artimuz.github.io/Nightreign-Seed-Finder'

const defaultDevBasePath = '/'

const resolvePagesBaseUrl = (): string => {
  const configured = normalizeBaseUrl(process.env.NEXT_PUBLIC_PAGES_BASE_URL ?? '')
  if (configured) return configured

  if (process.env.NODE_ENV !== 'production') {
    return defaultDevBasePath
  }

  return defaultProdPagesBaseUrl
}

const resolvePublicBaseUrl = (): string => {
  const explicitPublic = normalizeBaseUrl(process.env.NEXT_PUBLIC_PAGES_PUBLIC_BASE_URL ?? '')
  if (explicitPublic) return explicitPublic

  const legacy = normalizeBaseUrl(process.env.NEXT_PUBLIC_PAGES_ASSET_BASE_URL ?? '')
  if (legacy) {
    if (legacy.endsWith('/public')) return legacy
    return `${legacy}/public`
  }

  const base = resolvePagesBaseUrl()
  if (base.startsWith('/')) return base
  return `${base}/public`
}

export const PAGES_BASE_URL = resolvePagesBaseUrl()
export const PAGES_ASSET_BASE_URL = resolvePublicBaseUrl()

const stripQuery = (value: string): string => (value.split('?')[0] ?? '')

const hasSupportedExtension = (pathValue: string, extensions: string[]): boolean => {
  const urlPart = stripQuery(pathValue).toLowerCase()
  return extensions.some((ext) => urlPart.endsWith(ext))
}

export const pagesAssetUrl = (pathValue: string, extensions: string[]): string => {
  if (!pathValue) return pathValue

  const normalizedPath = pathValue.startsWith('/') ? pathValue : `/${pathValue}`
  if (!hasSupportedExtension(normalizedPath, extensions)) return normalizedPath

  const base = PAGES_ASSET_BASE_URL

  if (base.startsWith('/')) {
    const join = base.endsWith('/') ? base.slice(0, -1) : base
    const withoutLeading = normalizedPath.startsWith('/') ? normalizedPath.slice(1) : normalizedPath
    const withBase = `${join}/${withoutLeading}`
    const separator = withBase.includes('?') ? '&' : '?'
    return withBase.includes('v=') ? withBase : `${withBase}${separator}v=${encodeURIComponent(APP_VERSION)}`
  }

  const url = new URL(`${base}${normalizedPath}`)
  if (!url.searchParams.has('v')) {
    url.searchParams.set('v', APP_VERSION)
  }
  return url.toString()
}

export const pagesWebpUrl = (pathValue: string): string => pagesAssetUrl(pathValue, ['.webp'])
export const pagesPngUrl = (pathValue: string): string => pagesAssetUrl(pathValue, ['.png'])
export const pagesIcoUrl = (pathValue: string): string => pagesAssetUrl(pathValue, ['.ico'])
export const pagesJsonUrl = (pathValue: string): string => pagesAssetUrl(pathValue, ['.json'])

const isRemoteAssetUrl = (value: string): boolean => /^https?:\/\//i.test(value)

export const pagesStaticAssetUrl = (pathValue: string): string => {
  if (!pathValue) return pathValue
  if (isRemoteAssetUrl(pathValue) || pathValue.startsWith('data:') || pathValue.startsWith('blob:')) return pathValue

  return pagesAssetUrl(pathValue, ['.webp', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webm', '.otf', '.json'])
}
