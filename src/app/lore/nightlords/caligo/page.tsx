import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCharacterById } from '@/lib/lore/utils'
import { LoreArticle } from '@/components/lore/LoreArticle'

export const metadata: Metadata = {
  title: 'Caligo - The Shadow Master | Nightlords | Nightreign Lore',
  description: 'Discover Caligo, the enigmatic Shadow Master of Nightreign. Master of stealth, deception, and shadow magic, he moves unseen through the darkness.',
  keywords: 'caligo, shadow master, nightlord, stealth master, shadow magic, spy, assassin, nightreign character',
  openGraph: {
    title: 'Caligo - The Shadow Master',
    description: 'Master of shadows and deception, Caligo moves unseen and strikes from the darkness itself',
    type: 'article'
  }
}

export default function CaligoPage() {
  const character = getCharacterById('caligo')
  
  if (!character) {
    notFound()
  }

  return <LoreArticle character={character} />
}