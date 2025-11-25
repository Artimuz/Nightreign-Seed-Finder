import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCharacterById } from '@/lib/lore/utils'
import { LoreArticle } from '@/components/lore/LoreArticle'

export const metadata: Metadata = {
  title: 'Executor - The Relentless Hunter | Nightfarers | Nightreign Lore',
  description: 'Meet the Executor, the methodical Relentless Hunter of Nightreign. A justice-seeker who never stops pursuing targets marked for elimination.',
  keywords: 'executor, relentless hunter, nightfarer, justice seeker, methodical tracker, pursuit specialist, nightreign character',
  openGraph: {
    title: 'Executor - The Relentless Hunter',
    description: 'A methodical justice-seeker who never stops pursuing targets marked for elimination',
    type: 'article'
  }
}

export default function ExecutorPage() {
  const character = getCharacterById('executor')
  
  if (!character) {
    notFound()
  }

  return <LoreArticle character={character} />
}