import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCharacterById } from '@/lib/lore/utils'
import { LoreArticle } from '@/components/lore/LoreArticle'

export const metadata: Metadata = {
  title: 'Gladius - The Warrior Lord | Nightlords | Nightreign Lore',
  description: 'Learn about Gladius, the legendary Warrior Lord of Nightreign. Master of combat and honor, his tactical brilliance and unwavering courage inspire hope in the darkest times.',
  keywords: 'gladius, warrior lord, nightlord, combat master, tactical genius, nightreign character',
  openGraph: {
    title: 'Gladius - The Warrior Lord',
    description: 'Master of combat and honor, Gladius leads with unwavering courage and tactical brilliance',
    type: 'article'
  }
}

export default function GladiusPage() {
  const character = getCharacterById('gladius')
  
  if (!character) {
    notFound()
  }

  return <LoreArticle character={character} />
}