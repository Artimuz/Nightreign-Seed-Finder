export interface LoreCharacter {
  id: string
  name: string
  title: string
  description: string
  lore: string
  abilities: string[]
  strengths: string[]
  weaknesses: string[]
  imageUrl: string
  category: 'nightlord' | 'nightfarer'
  tags: string[]
}

export interface LoreContent {
  nightlords: LoreCharacter[]
  nightfarers: LoreCharacter[]
}

export interface LoreNavItem {
  title: string
  href: string
  description: string
  icon?: string
}

export interface LoreCategory {
  id: string
  title: string
  description: string
  href: string
  characters: LoreCharacter[]
}