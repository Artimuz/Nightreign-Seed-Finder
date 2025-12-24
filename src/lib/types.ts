import { pagesWebpUrl } from '@/lib/pagesAssets'

export interface Seed {
  seed_id: string
  map_type: string
  slots: Record<string, string>
  nightlord?: string
  Event?: string
  coordinates?: Record<string, { x: number; y: number }>
}

export const MAP_TYPES = [
  {
    key: 'mountaintop',
    title: 'Mountaintop',
    cardImage: pagesWebpUrl('/Images/mapTypes/mountainIcon.webp')
  },
  {
    key: 'noklateo',
    title: 'Noklateo',
    cardImage: pagesWebpUrl('/Images/mapTypes/noklateoIcon.webp')
  },
  {
    key: 'normal',
    title: 'Normal',
    cardImage: pagesWebpUrl('/Images/mapTypes/normalIcon.webp')
  },
  {
    key: 'rotted',
    title: 'Rotted Woods',
    cardImage: pagesWebpUrl('/Images/mapTypes/rotIcon.webp')
  },
  {
    key: 'crater',
    title: 'Crater',
    cardImage: pagesWebpUrl('/Images/mapTypes/craterIcon.webp')
  },
  {
    key: 'forsaken',
    title: '*Coming Soon*',
    cardImage: pagesWebpUrl('/Images/mapTypes/forsakenIcon.webp')
  }
]