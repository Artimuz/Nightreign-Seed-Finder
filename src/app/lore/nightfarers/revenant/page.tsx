import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCharacterById } from '@/lib/lore/utils'
import { LoreArticle } from '@/components/lore/LoreArticle'

export const metadata: Metadata = {
  title: 'Revenant - The Returned Warrior | Nightfarers | Nightreign Lore',
  description: 'Learn about Revenant, the tragic Returned Warrior of Nightreign. An undead hero haunted by memories, seeking redemption through eternal service.',
  keywords: 'revenant, returned warrior, nightfarer, undead warrior, redemption, cursed hero, nightreign character',
  openGraph: {
    title: 'Revenant - The Returned Warrior',
    description: 'An undead warrior haunted by memories of past life, seeking redemption through eternal service',
    type: 'article'
  }
}

export default function RevenantPage() {
  const character = getCharacterById('revenant')
  
  if (!character) {
    notFound()
  }

  return <LoreArticle character={character} />
}