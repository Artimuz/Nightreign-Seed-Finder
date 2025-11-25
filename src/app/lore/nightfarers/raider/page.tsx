import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCharacterById } from '@/lib/lore/utils'
import { LoreArticle } from '@/components/lore/LoreArticle'

export const metadata: Metadata = {
  title: 'Raider - The Swift Striker | Nightfarers | Nightreign Lore',
  description: 'Discover the Raider, the fierce Swift Striker of Nightreign. A savage warrior specializing in lightning-fast attacks and tactical retreats.',
  keywords: 'raider, swift striker, nightfarer, nomad warrior, guerrilla tactics, fast attacks, nightreign character',
  openGraph: {
    title: 'Raider - The Swift Striker',
    description: 'A fierce warrior specializing in lightning-fast attacks and tactical retreats',
    type: 'article'
  }
}

export default function RaiderPage() {
  const character = getCharacterById('raider')
  
  if (!character) {
    notFound()
  }

  return <LoreArticle character={character} />
}