import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllUpdates } from '@/lib/updates/updateManager'

export const metadata: Metadata = {
  title: 'Updates | Nightreign Seed Finder',
  description: 'Browse release notes and updates for Nightreign Seed Finder.',
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function UpdatesPage() {
  const updates = getAllUpdates()

  return (
    <div className="mx-auto w-full max-w-4xl px-6 pb-24 pt-28 text-gray-100">
      <article className="rounded-xl border border-gray-600/40 bg-black/85 p-6 backdrop-blur-sm sm:p-10">
        <header>
          <h1 className="text-3xl font-semibold">Updates</h1>
          <p className="mt-3 text-gray-300">
            Release notes, new features, and fixes. Each update has a dedicated page you can share.
          </p>
        </header>

        <div className="mt-10 space-y-4">
          {updates.map((update) => (
            <Link
              key={update.id}
              href={`/updates/${update.id}`}
              prefetch={false}
              className="block rounded-lg border border-gray-600/40 bg-black/20 p-5 hover:border-gray-500"
            >
              <div className="flex flex-wrap items-center gap-2">
                {update.version ? (
                  <span className="rounded bg-blue-600 px-2 py-1 text-xs font-semibold text-white">v{update.version}</span>
                ) : null}
                <span className="text-xs text-gray-400">{formatDate(update.publishDate)}</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-400">{update.category}</span>
              </div>
              <h2 className="mt-2 text-lg font-semibold text-white">{update.title}</h2>
              {update.tags && update.tags.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {update.tags.slice(0, 6).map((tag) => (
                    <span key={tag} className="rounded bg-gray-700 px-2 py-1 text-xs text-gray-200">
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </Link>
          ))}
        </div>
      </article>
    </div>
  )
}
