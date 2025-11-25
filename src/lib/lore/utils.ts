import { LoreCharacter, LoreCategory } from './types'
import { loreContent } from './contentData'

export function getCharacterById(id: string): LoreCharacter | undefined {
  const allCharacters = [...loreContent.nightlords, ...loreContent.nightfarers]
  return allCharacters.find(character => character.id === id)
}

export function getCharactersByCategory(category: 'nightlord' | 'nightfarer'): LoreCharacter[] {
  return loreContent[category === 'nightlord' ? 'nightlords' : 'nightfarers']
}

export function searchCharacters(query: string): LoreCharacter[] {
  const allCharacters = [...loreContent.nightlords, ...loreContent.nightfarers]
  const searchTerm = query.toLowerCase()
  
  return allCharacters.filter(character =>
    character.name.toLowerCase().includes(searchTerm) ||
    character.title.toLowerCase().includes(searchTerm) ||
    character.description.toLowerCase().includes(searchTerm) ||
    character.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  )
}

export function getRelatedCharacters(currentCharacter: LoreCharacter, limit: number = 3): LoreCharacter[] {
  const allCharacters = [...loreContent.nightlords, ...loreContent.nightfarers]
  const otherCharacters = allCharacters.filter(char => char.id !== currentCharacter.id)
  
  // Score characters by shared tags
  const scored = otherCharacters.map(character => {
    const sharedTags = character.tags.filter(tag => 
      currentCharacter.tags.includes(tag)
    ).length
    const sameCategory = character.category === currentCharacter.category ? 1 : 0
    
    return {
      character,
      score: sharedTags * 2 + sameCategory
    }
  })
  
  // Sort by score and return top results
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.character)
}

export function generateCharacterSlug(character: LoreCharacter): string {
  return character.id
}

export function generateCategoryPath(category: 'nightlord' | 'nightfarer'): string {
  return `/lore/${category === 'nightlord' ? 'nightlords' : 'nightfarers'}`
}

export function generateCharacterPath(character: LoreCharacter): string {
  const categoryPath = generateCategoryPath(character.category)
  return `${categoryPath}/${character.id}`
}

export function getLoreCategories(): LoreCategory[] {
  return [
    {
      id: 'nightlords',
      title: 'Nightlords',
      description: 'The eight powerful lords who command the forces of darkness',
      href: '/lore/nightlords',
      characters: loreContent.nightlords
    },
    {
      id: 'nightfarers',
      title: 'Nightfarers',
      description: 'The wandering warriors who traverse the dark realm',
      href: '/lore/nightfarers',
      characters: loreContent.nightfarers
    }
  ]
}