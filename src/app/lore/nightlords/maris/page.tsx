import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCharacterById } from '@/lib/lore/utils'
import { LoreArticle } from '@/components/lore/LoreArticle'

export const metadata: Metadata = {
  title: 'Maris - The Storm Bringer | Nightlords | Nightreign Lore',
  description: 'Discover Maris, the unpredictable Storm Bringer of Nightreign. Master of seas and storms, commanding water and wind with elemental fury.',
  keywords: 'maris, storm bringer, nightlord, elemental master, water control, storm magic, nightreign character',
  openGraph: {
    title: 'Maris - The Storm Bringer',
    description: 'Master of seas and storms, Maris commands the fury of water and wind with unpredictable power',
    type: 'article'
  }
}

export default function MarisPage() {
  const character = getCharacterById('maris')
  
  if (!character) {
    notFound()
  }

  return <LoreArticle character={character} />
}