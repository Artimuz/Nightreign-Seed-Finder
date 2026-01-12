import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How to Use',
  description: 'Learn how to use Nightreign Seed Finder step by step.',
}

type HowToSection = {
  title: string
  description: string
  bullets?: string[]
}

const sections: HowToSection[] = [
  {
    title: '1: Map type selection',
    description: 'There are 6 types of maps in Elden Ring Nightreign, and they can contain exclusive events.',
  },
  {
    title: '2: Map builder',
    description:
      "With the map type selected, you can draw your map layout on the Map Builder canvas. You don't need to complete it—only until there is only 1 possible seed remaining.",
    bullets: [
      'The pattern match usually takes 1 to 4 buildings informed on the map.',
      'It can be greatly sped up with the addition of the Nightlord and the Spawn point.',
    ],
  },
  {
    title: '3: The map result',
    description: 'Once you find a result you will see the map with the whole information such as:',
    bullets: [
      'All buildings, and enemies on it.',
      'Nightlord status summary.',
      'Event warnings.',
      'Evergoals enemies identified.',
      'Function to find Crystals (for the Great Hollow only).',
    ],
  },
  {
    title: '4: Error report',
    description:
      'If any information or behavior appears to be wrong on the site, you can inform it at the bottom of the page, using the Report button. Feel free to use this feature to also message me or give any feedback.',
  },
]

export default function HowToUsePage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 pb-24 pt-28 text-gray-100">
      <article className="rounded-xl border border-gray-600/40 bg-black/85 p-6 backdrop-blur-sm sm:p-10">
        <header>
          <h1 className="text-3xl font-semibold">Nightreign Seed Finder</h1>
          <p className="mt-1 text-lg font-medium text-gray-200">How to Use</p>
          <div className="mt-6 rounded-lg border border-amber-600/40 bg-amber-950/30 px-5 py-4 text-gray-200">
            <p className="font-semibold">Warning:</p>
            <p className="mt-2 text-gray-200">
              This tool may spoil part of the experience for new players. Keep that in mind before introducing it to others or using it
              too early in your own playthrough.
            </p>
          </div>
        </header>

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section.title} className="rounded-lg border border-gray-600/40 bg-black/20 p-5">
              <h2 className="text-lg font-semibold">{section.title}</h2>
              <p className="mt-2 text-gray-300">{section.description}</p>
              {section.bullets ? (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-gray-300">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </article>
    </div>
  )
}
