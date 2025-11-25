import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getLoreCategories } from '@/lib/lore/utils'

export const metadata: Metadata = {
  title: 'Nightreign Lore Hub - Characters & Stories',
  description: 'Explore the complete collection of Nightreign lore, featuring legendary Nightlords and brave Nightfarers in an eternal battle against darkness.',
  keywords: 'nightreign lore, nightlords, nightfarers, game characters, fantasy stories, dark fantasy',
  openGraph: {
    title: 'Nightreign Lore Hub - Characters & Stories',
    description: 'Discover the epic tales and legendary characters from the world of Nightreign',
    type: 'article'
  }
}

export default function LorePage() {
  const categories = getLoreCategories()

  return (
    <div className="lore-article">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="lore-title">Nightreign Lore</h1>
        <p className="lore-subtitle">Chronicles of the Eternal Night</p>
        <p className="lore-description max-w-3xl mx-auto">
          In the realm of Nightreign, where eternal darkness has consumed the world, legendary figures emerge to shape the fate of all who dwell within. 
          Explore the rich stories and deep lore of the mighty Nightlords who command vast powers, and the brave Nightfarers who traverse the 
          dangerous paths of this shadowed world.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={category.href}
            className="group block"
          >
            <div className="bg-gray-700/30 backdrop-blur-sm border border-gray-600/50 rounded-lg overflow-hidden transition-all duration-300 hover:border-yellow-400 hover:bg-gray-600/50 hover:transform hover:scale-105">
              
              {/* Category Header */}
              <div className="p-6 border-b border-gray-600/50">
                <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors duration-200 mb-2">
                  {category.title}
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  {category.description}
                </p>
                <div className="text-sm text-gray-500 mt-3">
                  {category.characters.length} legendary characters
                </div>
              </div>

              {/* Character Preview Grid */}
              <div className="p-4">
                <div className="grid grid-cols-4 gap-2">
                  {category.characters.slice(0, 4).map((character) => (
                    <div key={character.id} className="aspect-square">
                      <Image
                        src={character.imageUrl}
                        alt={character.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover rounded border border-gray-600/50"
                      />
                    </div>
                  ))}
                </div>
                {category.characters.length > 4 && (
                  <div className="text-center mt-3">
                    <span className="text-sm text-gray-500">
                      +{category.characters.length - 4} more characters
                    </span>
                  </div>
                )}
              </div>

              {/* Call to Action */}
              <div className="px-6 pb-6">
                <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors duration-200">
                  <span className="text-sm font-medium">Explore {category.title}</span>
                  <svg
                    className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Additional Information */}
      <div className="bg-black/95 border border-gray-600/50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">About the Lore</h3>
        <div className="space-y-4 text-gray-300">
          <p>
            The world of Nightreign exists in perpetual darkness, where ancient powers clash and heroes are forged in the crucible of endless night. 
            Each character carries their own story, their own motivations, and their own role in the greater tapestry of this dark fantasy realm.
          </p>
          <p>
            The <strong className="text-white">Nightlords</strong> are beings of immense power who have risen to prominence in this shadowed world. 
            Each commands unique abilities and leads their own forces in the eternal struggle for dominance and survival.
          </p>
          <p>
            The <strong className="text-white">Nightfarers</strong> are the wandering warriors, rogues, and specialists who traverse the dangerous 
            paths between settlements and strongholds. They are the bridge between the common folk and the legendary powers that shape the world.
          </p>
        </div>
      </div>
    </div>
  )
}