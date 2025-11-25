import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCharacterById } from '@/lib/lore/utils'
import { LoreArticle } from '@/components/lore/LoreArticle'

export const metadata: Metadata = {
  title: 'Guardian - The Stalwart Protector | Nightfarers | Nightreign Lore',
  description: 'Meet the Guardian, the unwavering Stalwart Protector of Nightreign. A defensive specialist whose shield and courage protect all who stand behind them.',
  keywords: 'guardian, stalwart protector, nightfarer, defensive warrior, shield master, protector, nightreign character',
  openGraph: {
    title: 'Guardian - The Stalwart Protector',
    description: 'An unwavering defender whose shield and courage protect all who stand behind them',
    type: 'article'
  }
}

export default function GuardianPage() {
  const character = getCharacterById('guardian')
  
  if (!character) {
    notFound()
  }

  return <LoreArticle character={character} />
}