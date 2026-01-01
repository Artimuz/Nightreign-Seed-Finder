import { UpdatePost } from './types'
import { pagesWebpUrl } from '@/lib/pagesAssets'

const updatePosts: UpdatePost[] = [
  {
    "id": "update-1.2.0",
    "version": "1.2.0",
    "title": "Great Hollow is finally here",
    "content": "Great Hollow has officially arrived in the app!\n\n### Highlights:\n- **New map: Great Hollow**: Fully available in map selection\n- **More complete results**: Great Hollow now supports an **Underground toggle** on the result map\n- **Clearer layering**: Underground shows on top with a darkened layer to help readability\n\n### Special thanks:\n- Huge thanks to **Kevins78** for providing the source data that made this update possible.\n\nThanks for using SeedFinder. Let me know what you want added next.",
    "priority": "high",
    "publishDate": "2026-01-01T00:00:00Z",
    "category": "feature",
    "showInModal": true,
    "tags": ["great-hollow", "map", "slots", "results", "underground"]
  },
  {
    "id": "update-1.1.15",
    "version": "1.1.15",
    "title": "Spawn Location Selection Feature",
    "content": "We're excited to introduce the new **Spawn Location Selection** feature! You can now choose your spawn location on the map.\n\n### What's New:\n- **Interactive Spawn Selection**: Click on any valid spawn point on the map\n- **Visual Spawn Indicators**: Clear markers show available spawn locations\n\n### How to Use:\n1. Open any map view\n2. Look for the spawn location icons\n3. Click on your spawn point\n4. The selection will be highlighted and saved automatically",
    "image": pagesWebpUrl("/data/updates/images/1.1.15_update_picture.webp"),
    "priority": "high",
    "publishDate": "2024-11-27T23:00:00Z",
    "category": "feature",
    "showInModal": true,
    "tags": ["spawn", "map", "selection", "feature", "gameplay"]
  }
]

export const getAllUpdates = (): UpdatePost[] => {
  return updatePosts.sort((a, b) => 
    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  )
}

export const getModalUpdates = (): UpdatePost[] => {
  return getAllUpdates().filter(update => update.showInModal)
}

export const getUpdateById = (id: string): UpdatePost | undefined => {
  return updatePosts.find(update => update.id === id)
}

export const getUnseenUpdates = (dismissedIds: string[]): UpdatePost[] => {
  return getModalUpdates().filter(update => !dismissedIds.includes(update.id))
}