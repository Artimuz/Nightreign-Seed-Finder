import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCharacterById } from '@/lib/lore/utils'
import { LoreArticle } from '@/components/lore/LoreArticle'

export const metadata: Metadata = {
  title: 'Adel - The Noble Strategist | Nightlords | Nightreign Lore',
  description: 'Discover Adel, the Noble Strategist of Nightreign. A diplomatic mind with strategic brilliance, she balances politics and warfare with equal skill.',
  keywords: 'adel, noble strategist, nightlord, diplomat, strategic genius, political master, nightreign character',
  openGraph: {
    title: 'Adel - The Noble Strategist',
    description: 'A diplomatic mind with strategic brilliance, Adel balances politics and warfare with equal skill',
    type: 'article'
  }
}

export default function AdelPage() {
  const character = getCharacterById('adel')
  
  if (!character) {
    notFound()
  }

  return <LoreArticle character={character} />
}