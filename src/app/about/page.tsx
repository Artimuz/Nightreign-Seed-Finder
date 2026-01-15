import type { Metadata } from 'next'
import { DecoratedArticle, PageNavButtons } from '@/components'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn the story behind Nightreign Seed Finder and the community that supports it.',
}

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 pb-24 pt-28 text-gray-100">
      <DecoratedArticle>
        <header>
          <h1 className="text-3xl font-semibold">About Nightreign Seed Finder</h1>
        </header>

        <div className="mt-8 space-y-5 text-gray-300">
          <p>
            Nightreign Seed Finder started as a small personal tool to help me iterate on seed patterns shared by the community and data
            miners such as thefifthmatt and kevins78.
          </p>
          <p>
            Once I shared it with friends, the response was immediate. They encouraged me to post it on the Steam discussions, and from
            there the project grew into something much bigger than I expected.
          </p>
          <p>
            Since then, the site has been shaped by constant feedback: bug reports, feature requests, usability suggestions, and the kind
            of detailed notes that only a passionate community would take the time to write. Many of the best improvements came directly
            from these conversations.
          </p>
          <p>
            Every update that lands well is a reminder that this is not a solo project in practice. It is supported by people who share
            results, validate data, help others learn the tool, and keep the quality bar high.
          </p>
          <p>
            Looking ahead, I want the site to be ready for new content if FromSoftware ever decides to expand Nightreign. It might be
            unlikely, but I love this game, and there is nothing wrong with dreaming. The goal is to keep the foundation flexible so new
            maps, events, or systems can be added without having to rebuild everything from scratch.
          </p>
        </div>

        <PageNavButtons
          title="More"
          links={[
            { href: '/how-to-use', label: 'How to Use' },
            { href: '/faq', label: 'FAQ' },
            { href: '/updates', label: 'Updates' },
            { href: '/about', label: 'About' },
          ]}
        />
      </DecoratedArticle>
    </div>
  )
}
