import { nightlordIconOrder, nightlordNames } from '@/lib/constants/icons'

const normalizeValue = (value: string): string => {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9_ ]/g, '')
}

export const normalizeNightlordKey = (value: string | undefined | null): string | null => {
  if (!value) return null

  const trimmed = value.trim()
  if (!trimmed) return null

  const directKeyMatch = trimmed.match(/^(\d+_[A-Za-z0-9]+)$/)
  if (directKeyMatch && nightlordIconOrder.includes(trimmed)) {
    return trimmed
  }

  const normalized = normalizeValue(trimmed)

  const byKey = nightlordIconOrder.find(key => normalizeValue(key) === normalized)
  if (byKey) return byKey

  const byName = nightlordIconOrder.find(key => normalizeValue(nightlordNames[key] ?? '') === normalized)
  if (byName) return byName

  const namePart = normalized.split('_').filter(Boolean)[1]
  if (namePart) {
    const byNamePart = nightlordIconOrder.find(key => normalizeValue(nightlordNames[key] ?? '') === namePart)
    if (byNamePart) return byNamePart
  }

  return null
}
