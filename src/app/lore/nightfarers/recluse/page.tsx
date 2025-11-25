import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCharacterById } from '@/lib/lore/utils'
import { LoreArticle } from '@/components/lore/LoreArticle'

export const metadata: Metadata = {
  title: 'Recluse - The Solitary Trapper | Nightfarers | Nightreign Lore',
  description: 'Discover the Recluse, the cunning Solitary Trapper of Nightreign. A patient loner who prefers traps and ambushes to direct confrontation.',
  keywords: 'recluse, solitary trapper, nightfarer, trap master, ambush specialist, patient hunter, nightreign character',
  openGraph: {
    title: 'Recluse - The Solitary Trapper',
    description: 'A cunning loner who prefers traps and ambushes to direct confrontation',
    type: 'article'
  }
}

export default function ReclusePage() {
  const character = getCharacterById('recluse')
  
  if (!character) {
    notFound()
  }

  return <LoreArticle character={character} />
}