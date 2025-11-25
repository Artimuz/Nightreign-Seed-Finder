import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getCharactersByCategory, generateCharacterPath } from '@/lib/lore/utils'

export const metadata: Metadata = {
  title: 'Nightlords - Legendary Rulers of Darkness | Nightreign Lore',
  description: 'Meet the eight legendary Nightlords of Nightreign: Gladius, Adel, Gnoster, Maris, Libra, Fulghor, Caligo, and Heolstor. Discover their powers, stories, and roles in the eternal night.',
  keywords: 'nightlords, gladius, adel, gnoster, maris, libra, fulghor, caligo, heolstor, nightreign characters',
  openGraph: {
    title: 'Nightlords - Legendary Rulers of Darkness',
    description: 'Discover the eight mighty Nightlords who command the forces of darkness in Nightreign',
    type: 'article'
  }
}

export default function NightlordsPage() {
  const nightlords = getCharactersByCategory('nightlord')

  return (
    <>
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link href="/lore" className="breadcrumb-link">Lore</Link>
        <span className="breadcrumb-separator">/</span>
        <span>Nightlords</span>
      </nav>

      <div className="lore-article">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="lore-title">The Nightlords</h1>
          <p className="lore-subtitle">Eight Legendary Rulers of the Dark Realm</p>
          <p className="lore-description max-w-3xl mx-auto">
            In the eternal darkness of Nightreign, eight powerful beings have risen to prominence as the Nightlords. 
            Each commands vast armies, wields incredible powers, and shapes the very fabric of this shadowed world. 
            They are leaders, warriors, scholars, and forces of nature—united in purpose yet diverse in their methods 
            and philosophies. Here are their stories.
          </p>
        </div>

        {/* Nightlords Grid */}
        <div className="character-grid mb-12">
          {nightlords.map((nightlord) => (
            <Link
              key={nightlord.id}
              href={generateCharacterPath(nightlord)}
              className="group block"
            >
              <div className="character-card">
                <div className="lore-image-container">
                  <Image
                    src={nightlord.imageUrl}
                    alt={`${nightlord.name} - ${nightlord.title}`}
                    width={200}
                    height={200}
                    className="character-card-image"
                  />
                </div>
                
                <div className="character-card-content">
                  <h3 className="character-card-name group-hover:text-blue-400 transition-colors duration-200">
                    {nightlord.name}
                  </h3>
                  <p className="character-card-title">
                    {nightlord.title}
                  </p>
                  <p className="character-card-description">
                    {nightlord.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="tag-list mt-3">
                    {nightlord.tags.slice(0, 3).map((tag) => (
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
          <h2 className="lore-section-title">The Council of Shadows</h2>
          <div className="lore-text">
            The eight Nightlords rarely gather in one place, for their combined presence would shake the very foundations 
            of reality. Yet when the greatest threats emerge, they set aside their individual pursuits to form the Council 
            of Shadows—a gathering that has turned the tide of countless conflicts throughout the dark age.
          </div>
          <div className="lore-text">
            Each Nightlord brings unique strengths to this alliance: Gladius provides military leadership and tactical 
            brilliance, while Adel handles diplomacy and strategic planning. Gnoster offers ancient knowledge and magical 
            insight, as Maris controls the seas and weather patterns crucial for transportation and warfare.
          </div>
          <div className="lore-text">
            Libra ensures that their methods remain just and their cause remains righteous, while Fulghor delivers 
            overwhelming force when subtlety fails. Caligo gathers intelligence and eliminates threats from the shadows, 
            and Heolstor commands powers over life and death that can turn the tide of any battle.
          </div>
        </div>

        {/* Powers Section */}
        <div className="lore-section">
          <h2 className="lore-section-title">The Source of Their Power</h2>
          <div className="lore-text">
            The Nightlords draw their incredible abilities from various sources, each as unique as the lords themselves. 
            Some, like Gladius, have perfected their natural talents through decades of training and combat experience. 
            Others, like Gnoster, have delved into forbidden knowledge that grants power at great personal cost.
          </div>
          <div className="lore-text">
            The eternal night itself seems to have awakened dormant abilities in some, while others have made pacts 
            with forces beyond mortal understanding. What unites them all is their unwavering commitment to their cause 
            and their willingness to bear the burden of leadership in humanity&apos;s darkest hour.
          </div>
        </div>

        {/* Navigation */}
        <div className="related-content">
          <h3 className="related-content-title">Explore More</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/lore/nightfarers"
              className="block p-6 bg-gray-700/30 border border-gray-600/50 rounded-lg hover:bg-gray-600/50 hover:border-yellow-400 transition-all duration-200"
            >
              <h4 className="text-lg font-semibold text-white mb-2">The Nightfarers</h4>
              <p className="text-gray-400">
                Discover the brave warriors and specialists who traverse the dangerous paths of Nightreign.
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