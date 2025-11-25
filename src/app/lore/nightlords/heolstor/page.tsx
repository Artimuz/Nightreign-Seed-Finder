import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCharacterById } from '@/lib/lore/utils'
import { LoreArticle } from '@/components/lore/LoreArticle'

export const metadata: Metadata = {
  title: 'Heolstor - The Death Lord | Nightlords | Nightreign Lore',
  description: 'Discover Heolstor, the fearsome Death Lord of Nightreign. Master of necromancy and commander of the undead, wielding death itself as a weapon.',
  keywords: 'heolstor, death lord, nightlord, necromancer, undead commander, death magic, nightreign character',
  openGraph: {
    title: 'Heolstor - The Death Lord',
    description: 'Commander of the undead and master of necromancy, Heolstor wields death itself as a weapon',
    type: 'article'
  }
}

export default function HeolstorPage() {
  const character = getCharacterById('heolstor')
  
  if (!character) {
    notFound()
  }

  return <LoreArticle character={character} />
}