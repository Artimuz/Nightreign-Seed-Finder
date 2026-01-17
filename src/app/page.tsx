'use client'

import Link from 'next/link'
import { useState } from 'react'
import { MapSelectionCards } from '@/components/cards/MapSelectionCards'
import PreNightlordSelector from '@/components/ui/PreNightlordSelector'
import HomePrefetchAssets from '@/components/HomePrefetchAssets'

export default function HomePage() {
  const [selectedNightlord, setSelectedNightlord] = useState<string>('empty')

  return (
    <div className="mx-auto w-full max-w-7xl px-6 pb-24 pt-28 text-gray-100">
      <HomePrefetchAssets />
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-semibold">Nightreign Seed Finder</h1>
        <p className="mt-6 text-gray-300 leading-snug sm:leading-normal">
          Nightreign Seed Finder is a tool to simplify navigation throughout map patterns and help players optimize in-game routes.
        </p>
        <p className="mt-1 text-gray-300 leading-snug sm:leading-normal">
          Learn the workflow in <Link className="underline" href="/how-to-use" prefetch={false}>How to Use</Link>, or check common questions in{' '}
          <Link className="underline" href="/faq" prefetch={false}>FAQ</Link>.
        </p>
      </header>

      <section className="mx-auto mt-0 w-full max-w-7xl md:mt-[1.5rem]">
        <MapSelectionCards selectedNightlord={selectedNightlord} />
      </section>

      <section className="mx-auto mt-8 w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center justify-center">
          {/* Empty space on the left */}
        </div>
        <div className="flex items-center justify-center">
          <PreNightlordSelector onNightlordChange={setSelectedNightlord} />
        </div>
      </section>

      <div className="h-[32rem]" />

      <nav className="flex justify-center px-6 pb-10">
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-sm text-gray-300">
          <Link className="underline" href="/legal" prefetch={false}>
            Legal
          </Link>
          <span aria-hidden="true">•</span>
          <Link className="underline" href="/privacy-policy" prefetch={false}>
            Privacy Policy
          </Link>
          <span aria-hidden="true">•</span>
          <Link className="underline" href="/terms" prefetch={false}>
            Terms
          </Link>
        </div>
      </nav>
    </div>
  )
}
