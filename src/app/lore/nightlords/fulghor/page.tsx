import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCharacterById } from '@/lib/lore/utils'
import { LoreArticle } from '@/components/lore/LoreArticle'

export const metadata: Metadata = {
  title: 'Fulghor - The Lightning Lord | Nightlords | Nightreign Lore',
  description: 'Explore Fulghor, the electrifying Lightning Lord of Nightreign. Swift as lightning and deadly as thunder, commanding electrical fury in battle.',
  keywords: 'fulghor, lightning lord, nightlord, electricity master, speed warrior, storm caller, nightreign character',
  openGraph: {
    title: 'Fulghor - The Lightning Lord',
    description: 'Swift as lightning and twice as deadly, Fulghor brings speed and electrical fury to every battle',
    type: 'article'
  }
}

export default function FulghorPage() {
  const character = getCharacterById('fulghor')
  
  if (!character) {
    notFound()
  }

  return <LoreArticle character={character} />
}