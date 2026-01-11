import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | Nightreign Seed Finder',
  description: 'Learn the story behind Nightreign Seed Finder.',
}

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 pb-24 pt-28 text-gray-100">
      <article className="rounded-xl border border-gray-600/40 bg-black/85 p-6 backdrop-blur-sm sm:p-10">
        <header>
          <h1 className="text-3xl font-semibold">About Nightreign Seed Finder</h1>
        </header>

        <div className="mt-8 space-y-5 text-gray-300">
          <p>
            The Nightreign Seed Finder tool was originally created for personal use, because it made it easier to iterate on seed
            patterns gathered by data miners such as thefifthmatt and kevins78.
          </p>
          <p>
            The tool was well received by friends who encouraged me to display the tool on the Steam discussions, and the rest is
            history.
          </p>
          <p>
            The tool gained, and it is still gaining, a massive amount of users. I am trying every day to optimize it to its maximum,
            and it has been an amazing experience.
          </p>
        </div>
      </article>
    </div>
  )
}
