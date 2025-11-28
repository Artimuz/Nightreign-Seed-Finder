export interface Seed {
  seed_id: string
  map_type: string
  slots: Record<string, string>
  nightlord?: string
  Event?: string
  coordinates?: Record<string, { x: number; y: number }>
  'Spawn Slot'?: string
}

export const MAP_TYPES = [
  {
    key: 'mountaintop',
    title: 'Mountaintop',
    cardImage: '/Images/mapTypes/mountainIcon.webp'
  },
  {
    key: 'noklateo',
    title: 'Noklateo',
    cardImage: '/Images/mapTypes/noklateoIcon.webp'
  },
  {
    key: 'normal',
    title: 'Normal',
    cardImage: '/Images/mapTypes/normalIcon.webp'
  },
  {
    key: 'rotted',
    title: 'Rotted Woods',
    cardImage: '/Images/mapTypes/rotIcon.webp'
  },
  {
    key: 'crater',
    title: 'Crater',
    cardImage: '/Images/mapTypes/craterIcon.webp'
  }
]