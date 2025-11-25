import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getCharactersByCategory, generateCharacterPath } from '@/lib/lore/utils'

export const metadata: Metadata = {
  title: 'Nightfarers - Wandering Warriors of Darkness | Nightreign Lore',
  description: 'Meet the eight brave Nightfarers of Nightreign: Revenant, Executor, Raider, Ironeye, Wylder, Guardian, Recluse, and Duchess. Discover their unique skills and tragic stories.',
  keywords: 'nightfarers, revenant, executor, raider, ironeye, wylder, guardian, recluse, duchess, nightreign characters',
  openGraph: {
    title: 'Nightfarers - Wandering Warriors of Darkness',
    description: 'Discover the eight brave warriors who traverse the dangerous paths of Nightreign',
    type: 'article'
  }
}

export default function NightfarersPage() {
  const nightfarers = getCharactersByCategory('nightfarer')

  return (
    <>
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link href="/lore" className="breadcrumb-link">Lore</Link>
        <span className="breadcrumb-separator">/</span>
        <span>Nightfarers</span>
      </nav>

      <div className="lore-article">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="lore-title">The Nightfarers</h1>
          <p className="lore-subtitle">Wandering Warriors of the Dark Realm</p>
          <p className="lore-description max-w-3xl mx-auto">
            In the dangerous paths between settlements and strongholds of Nightreign, the Nightfarers walk alone. 
            These brave souls are warriors, specialists, and survivors who have chosen to face the darkness on their own terms. 
            Each carries their own burden, their own story of loss and redemption, and their own unique skills 
            that make them invaluable allies in the fight for survival.
          </p>
        </div>

        {/* Nightfarers Grid */}
        <div className="character-grid mb-12">
          {nightfarers.map((nightfarer) => (
            <Link
              key={nightfarer.id}
              href={generateCharacterPath(nightfarer)}
              className="group block"
            >
              <div className="character-card">
                <div className="lore-image-container">
                  <Image
                    src={nightfarer.imageUrl}
                    alt={`${nightfarer.name} - ${nightfarer.title}`}
                    width={200}
                    height={200}
                    className="character-card-image"
                  />
                </div>
                
                <div className="character-card-content">
                  <h3 className="character-card-name group-hover:text-blue-400 transition-colors duration-200">
                    {nightfarer.name}
                  </h3>
                  <p className="character-card-title">
                    {nightfarer.title}
                  </p>
                  <p className="character-card-description">
                    {nightfarer.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="tag-list mt-3">
                    {nightfarer.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="tag text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Lore Section */}
        <div className="lore-section">
          <h2 className="lore-section-title">The Path of Shadows</h2>
          <div className="lore-text">
            Unlike the mighty Nightlords who command from their strongholds, the Nightfarers choose the life of wanderers. 
            They travel the treacherous roads between settlements, carrying news, eliminating threats, and serving as the 
            vital connections that keep isolated communities from falling to despair and madness.
          </div>
          <div className="lore-text">
            Each Nightfarer has walked a different path to their current life. Some, like the Revenant, were transformed 
            by tragedy into something beyond mortal limitations. Others, like the Duchess, fell from grace and found 
            strength in their trials. What unites them all is their choice to face the darkness rather than hide from it.
          </div>
        </div>

        {/* Skills Section */}
        <div className="lore-section">
          <h2 className="lore-section-title">Masters of Survival</h2>
          <div className="lore-text">
            The Nightfarers have developed unique skills that allow them to survive in the most hostile environments 
            of Nightreign. The Executor never abandons a hunt, while Ironeye never misses their mark. Wylder commands 
            the beasts of the wild, and the Guardian protects all who stand behind their shield.
          </div>
          <div className="lore-text">
            Their diverse abilities make them invaluable when gathered together, though they rarely stay in one place 
            for long. Each serves the greater cause in their own way, whether through the Raider&apos;s lightning strikes, 
            the Recluse&apos;s patient traps, or the Duchess&apos;s natural leadership.
          </div>
        </div>

        {/* Navigation */}
        <div className="related-content">
          <h3 className="related-content-title">Explore More</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/lore/nightlords"
              className="block p-6 bg-gray-700/30 border border-gray-600/50 rounded-lg hover:bg-gray-600/50 hover:border-yellow-400 transition-all duration-200"
            >
              <h4 className="text-lg font-semibold text-white mb-2">The Nightlords</h4>
              <p className="text-gray-400">
                Discover the eight legendary rulers who command the forces of darkness.
              </p>
            </Link>
            <Link
              href="/lore"
              className="block p-6 bg-gray-700/30 border border-gray-600/50 rounded-lg hover:bg-gray-600/50 hover:border-yellow-400 transition-all duration-200"
            >
              <h4 className="text-lg font-semibold text-white mb-2">All Lore</h4>
              <p className="text-gray-400">
                Return to the main lore hub to explore all characters and stories.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}