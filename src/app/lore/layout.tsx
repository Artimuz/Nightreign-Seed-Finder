import type { Metadata } from 'next'
import '../../styles/lore.css'
import '../../styles/sidebar.css'

export const metadata: Metadata = {
  title: 'Nightreign Lore - Characters & Stories',
  description: 'Explore the rich lore and stories of Nightreign\'s legendary Nightlords and Nightfarers',
  keywords: 'nightreign, lore, nightlords, nightfarers, characters, stories, game lore',
  authors: [{ name: 'Nightreign Seed Finder Team' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Nightreign Lore - Characters & Stories',
    description: 'Discover the legendary characters and epic tales from the world of Nightreign',
    type: 'website',
    images: [
      {
        url: '/Images/logo_header.webp',
        width: 314,
        height: 105,
        alt: 'Nightreign Logo'
      }
    ]
  }
}

export default function LoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="lore-container">
      <div className="lore-content">
        {children}
      </div>
    </div>
  )
}