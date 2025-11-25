import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCharacterById } from '@/lib/lore/utils'
import { LoreArticle } from '@/components/lore/LoreArticle'

export const metadata: Metadata = {
  title: 'Duchess - The Fallen Noble | Nightfarers | Nightreign Lore',
  description: 'Discover the Duchess, the proud Fallen Noble of Nightreign. Once a ruler, now an exile who retained her dignity and found strength through adversity.',
  keywords: 'duchess, fallen noble, nightfarer, exiled ruler, noble grace, leadership, nightreign character',
  openGraph: {
    title: 'Duchess - The Fallen Noble',
    description: 'A proud exile who fell from grace but retained her dignity, skills, and noble bearing',
    type: 'article'
  }
}

export default function DuchessPage() {
  const character = getCharacterById('duchess')
  
  if (!character) {
    notFound()
  }

  return <LoreArticle character={character} />
}