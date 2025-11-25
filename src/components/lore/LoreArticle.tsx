'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { LoreCharacter } from '@/lib/lore/types'
import { getRelatedCharacters, generateCharacterPath } from '@/lib/lore/utils'

interface LoreArticleProps {
  character: LoreCharacter
}

export const LoreArticle: React.FC<LoreArticleProps> = ({ character }) => {
  const relatedCharacters = getRelatedCharacters(character, 3)
  const categoryName = character.category === 'nightlord' ? 'Nightlords' : 'Nightfarers'
  const categoryPath = character.category === 'nightlord' ? '/lore/nightlords' : '/lore/nightfarers'

  return (
    <>
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link href="/lore" className="breadcrumb-link">Lore</Link>
        <span className="breadcrumb-separator">/</span>
        <Link href={categoryPath} className="breadcrumb-link">{categoryName}</Link>
        <span className="breadcrumb-separator">/</span>
        <span>{character.name}</span>
      </nav>

      <article className="lore-article">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="lore-title">{character.name}</h1>
          <p className="lore-subtitle">{character.title}</p>
          <p className="lore-description">{character.description}</p>
        </header>

        {/* Character Image */}
        <div className="lore-image-container mb-8">
          <Image
            src={character.imageUrl}
            alt={`${character.name} - ${character.title}`}
            width={300}
            height={300}
            className="lore-image"
            priority
          />
        </div>

        {/* Main Lore Content */}
        <div className="lore-section">
          <h2 className="lore-section-title">The Legend</h2>
          <div className="lore-text">{character.lore}</div>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stats-column">
            <h3 className="stats-title text-green-400">Strengths</h3>
            <ul className="stats-list">
              {character.strengths.map((strength, index) => (
                <li key={index} className="stat-item">
                  <div className="stat-bullet bg-green-400"></div>
                  <span className="stat-text">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="stats-column">
            <h3 className="stats-title text-red-400">Weaknesses</h3>
            <ul className="stats-list">
              {character.weaknesses.map((weakness, index) => (
                <li key={index} className="stat-item">
                  <div className="stat-bullet bg-red-400"></div>
                  <span className="stat-text">{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Abilities Section */}
        <div className="lore-section">
          <h2 className="lore-section-title">Abilities & Powers</h2>
          <div className="abilities-grid">
            {character.abilities.map((ability, index) => (
              <div key={index} className="ability-item">
                <div className="ability-name">{ability}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="lore-section">
          <h3 className="text-lg font-semibold text-white mb-3">Character Traits</h3>
          <div className="tag-list">
            {character.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Related Characters */}
        {relatedCharacters.length > 0 && (
          <div className="related-content">
            <h3 className="related-content-title">Related Characters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedCharacters.map((relatedChar) => (
                <Link
                  key={relatedChar.id}
                  href={generateCharacterPath(relatedChar)}
                  className="group block"
                >
                  <div className="character-card">
                    <div className="lore-image-container">
                      <Image
                        src={relatedChar.imageUrl}
                        alt={`${relatedChar.name} - ${relatedChar.title}`}
                        width={150}
                        height={150}
                        className="character-card-image"
                      />
                    </div>
                    
                    <div className="character-card-content">
                      <h4 className="character-card-name group-hover:text-blue-400 transition-colors duration-200">
                        {relatedChar.name}
                      </h4>
                      <p className="character-card-title">
                        {relatedChar.title}
                      </p>
                      <p className="character-card-description text-xs">
                        {relatedChar.description.slice(0, 100)}...
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="related-content border-t border-gray-600/50 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href={categoryPath}
              className="block p-6 bg-gray-700/30 border border-gray-600/50 rounded-lg hover:bg-gray-600/50 hover:border-yellow-400 transition-all duration-200"
            >
              <h4 className="text-lg font-semibold text-white mb-2">Back to {categoryName}</h4>
              <p className="text-gray-400">
                Explore all {categoryName.toLowerCase()} and their stories.
              </p>
            </Link>
            <Link
              href="/lore"
              className="block p-6 bg-gray-700/30 border border-gray-600/50 rounded-lg hover:bg-gray-600/50 hover:border-yellow-400 transition-all duration-200"
            >
              <h4 className="text-lg font-semibold text-white mb-2">All Lore</h4>
              <p className="text-gray-400">
                Return to the main lore hub to explore all content.
              </p>
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}