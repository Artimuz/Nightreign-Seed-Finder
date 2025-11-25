import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCharacterById } from '@/lib/lore/utils'
import { LoreArticle } from '@/components/lore/LoreArticle'

export const metadata: Metadata = {
  title: 'Wylder - The Beast Master | Nightfarers | Nightreign Lore',
  description: 'Explore Wylder, the wild Beast Master of Nightreign. A primal warrior who commands nature\'s fury and fights alongside savage animal allies.',
  keywords: 'wylder, beast master, nightfarer, nature warrior, animal commander, primal fighter, nightreign character',
  openGraph: {
    title: 'Wylder - The Beast Master',
    description: 'A wild warrior who commands nature\'s fury and fights alongside savage animal allies',
    type: 'article'
  }
}

export default function WylderPage() {
  const character = getCharacterById('wylder')
  
  if (!character) {
    notFound()
  }

  return <LoreArticle character={character} />
}