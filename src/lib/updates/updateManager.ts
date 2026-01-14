import { UpdatePost } from './types'
import { pagesWebpUrl } from '@/lib/pagesAssets'

const updatePosts: UpdatePost[] = [
  {
    id: "update-1.2.29",
    version: "1.2.29",
    title: "Nightlord Pre-Selection & UI Enhancements",
    content: `Choose your Nightlord before selecting a map! This update brings a new pre-selection system along with visual improvements and performance optimizations.

### What's New:
- **Nightlord Pre-Selection**: Select your Nightlord on the home page before choosing your map

![The new component](${pagesWebpUrl("/Images/UI/preSelectNightlord.webp")})

- **Smart Seed Filtering**: See how many seeds are available for each map with your selected Nightlord
- **Persistent Selection**: Your Nightlord choice is remembered and automatically applied when building your map
- **Visual Enhancements**: New decorative borders added throughout the site for better visual consistency

### Improvements:
- **Faster Loading**: Map cards now appear instantly on page load
- **Smoother Animations**: Card hover effects are more responsive and polished
- **Better Tracking**: Improved analytics to help us understand how you use the site

### How to Use:
1. On the home page, click the Nightlord selector
2. Choose your desired Nightlord from the modal
3. Check the seed counts displayed on each map card
4. Select your map and start building your route

Your Nightlord selection will be automatically applied and cleared after each search!`,
    priority: "medium",
    publishDate: "2026-01-14T11:00:00Z",
    category: "feature",
    showInModal: false,
    tags: ["nightlord", "ui", "performance", "quality-of-life"]
  },
  {
    id: "update-1.2.0",
    version: "1.2.0",
    title: "Great Hollow is finally here",
    content: `Great Hollow has officially arrived in the app!

### Highlights:
- **New map: Great Hollow**: Fully available in map selection
- **More complete results**: Great Hollow now supports an **Underground toggle** on the result map
- **Clearer layering**: Underground shows on top with a darkened layer to help readability

### Special thanks:
- Huge thanks to **Kevins78** for providing the source data that made this update possible.

Thanks for using SeedFinder. Let me know what you want added next.`,
    priority: "high",
    publishDate: "2026-01-01T00:00:00Z",
    category: "feature",
    showInModal: true,
    tags: ["great-hollow", "map", "slots", "results", "underground"]
  },
  {
    id: "update-1.1.15",
    version: "1.1.15",
    title: "Spawn Location Selection Feature",
    content: `We're excited to introduce the new **Spawn Location Selection** feature! You can now choose your spawn location on the map.

### What's New:
- **Interactive Spawn Selection**: Click on any valid spawn point on the map
- **Visual Spawn Indicators**: Clear markers show available spawn locations

### How to Use:
1. Open any map view
2. Look for the spawn location icons
3. Click on your spawn point
4. The selection will be highlighted and saved automatically`,
    image: pagesWebpUrl("/data/updates/images/1.1.15_update_picture.webp"),
    priority: "high",
    publishDate: "2024-11-27T23:00:00Z",
    category: "feature",
    showInModal: true,
    tags: ["spawn", "map", "selection", "feature", "gameplay"]
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
