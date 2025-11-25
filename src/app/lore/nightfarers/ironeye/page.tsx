import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCharacterById } from '@/lib/lore/utils'
import { LoreArticle } from '@/components/lore/LoreArticle'

export const metadata: Metadata = {
  title: 'Ironeye - The Perfect Marksman | Nightfarers | Nightreign Lore',
  description: 'Learn about Ironeye, the calculating Perfect Marksman of Nightreign. A sharpshooter whose arrows and bolts never miss their intended target.',
  keywords: 'ironeye, perfect marksman, nightfarer, sniper, precision shooter, analytical warrior, nightreign character',
  openGraph: {
    title: 'Ironeye - The Perfect Marksman',
    description: 'A calculating sharpshooter whose arrows and bolts never miss their intended target',
    type: 'article'
  }
}

export default function IroneyePage() {
  const character = getCharacterById('ironeye')
  
  if (!character) {
    notFound()
  }

  return <LoreArticle character={character} />
}