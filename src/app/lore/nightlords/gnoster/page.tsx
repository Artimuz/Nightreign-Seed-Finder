import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCharacterById } from '@/lib/lore/utils'
import { LoreArticle } from '@/components/lore/LoreArticle'

export const metadata: Metadata = {
  title: 'Gnoster - The Knowledge Seeker | Nightlords | Nightreign Lore',
  description: 'Explore Gnoster, the ancient Knowledge Seeker of Nightreign. This mysterious scholar wields forbidden wisdom and arcane powers beyond mortal comprehension.',
  keywords: 'gnoster, knowledge seeker, nightlord, ancient scholar, forbidden magic, arcane wisdom, nightreign character',
  openGraph: {
    title: 'Gnoster - The Knowledge Seeker',
    description: 'An ancient scholar of forbidden knowledge, Gnoster wields wisdom as his greatest weapon',
    type: 'article'
  }
}

export default function GnosterPage() {
  const character = getCharacterById('gnoster')
  
  if (!character) {
    notFound()
  }

  return <LoreArticle character={character} />
}