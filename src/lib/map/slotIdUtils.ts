export function normalizeSlotId(slotId: string): string {
  if (slotId === 'nightlord' || slotId === 'event') return slotId

  if (!/^[0-9]+$/.test(slotId)) return slotId

  const parsed = Number(slotId)
  if (!Number.isFinite(parsed)) return slotId

  return String(parsed)
}
