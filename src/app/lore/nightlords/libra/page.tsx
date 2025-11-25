import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCharacterById } from '@/lib/lore/utils'
import { LoreArticle } from '@/components/lore/LoreArticle'

export const metadata: Metadata = {
  title: 'Libra - The Balance Keeper | Nightlords | Nightreign Lore',
  description: 'Learn about Libra, the just Balance Keeper of Nightreign. Guardian of justice and order, weighing all actions with fairness and moral clarity.',
  keywords: 'libra, balance keeper, nightlord, justice guardian, moral authority, truth seeker, nightreign character',
  openGraph: {
    title: 'Libra - The Balance Keeper',
    description: 'Guardian of justice and order, Libra weighs all actions with careful consideration and fairness',
    type: 'article'
  }
}

export default function LibraPage() {
  const character = getCharacterById('libra')
  
  if (!character) {
    notFound()
  }

  return <LoreArticle character={character} />
}