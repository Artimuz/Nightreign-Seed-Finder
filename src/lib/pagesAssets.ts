import { APP_VERSION } from '@/lib/constants/version'

const normalizeBaseUrl = (value: string): string => {
  const trimmed = value.trim()
  if (!trimmed) return ''
  return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed
}

const defaultProdBaseUrl = 'https://artimuz.github.io/Nightreign-Seed-Finder'

const defaultDevBasePath = '/docs-assets'

const resolveBaseUrl = (): string => {
  const configured = normalizeBaseUrl(process.env.NEXT_PUBLIC_PAGES_ASSET_BASE_URL ?? '')
  if (configured) return configured

  if (process.env.NODE_ENV !== 'production') {
    return defaultDevBasePath
  }

  return defaultProdBaseUrl
}

export const PAGES_ASSET_BASE_URL = resolveBaseUrl()

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
