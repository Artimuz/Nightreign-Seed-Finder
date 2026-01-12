import Link from 'next/link'
import { MapSelectionCards } from '@/components/cards/MapSelectionCards'
import { HomeAutoUpdateModalTrigger } from '@/components/HomeAutoUpdateModalTrigger'

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 pb-24 pt-28 text-gray-100">
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-semibold">Nightreign Seed Finder</h1>
        <p className="mt-6 text-gray-300 leading-snug sm:leading-normal">
          Nightreign Seed Finder is a tool to simplify navigation throughout map patterns and help players optimize in-game routes.
        </p>
        <p className="mt-5 text-gray-300 leading-snug sm:leading-normal">
          Learn the workflow in <Link className="underline" href="/how-to-use" prefetch={false}>How to Use</Link>, or check common questions in{' '}
          <Link className="underline" href="/faq" prefetch={false}>FAQ</Link>.
        </p>
      </header>

      <section className="mx-auto mt-0 w-full max-w-7xl md:mt-[4.5rem]">
        <MapSelectionCards />
      </section>

      <HomeAutoUpdateModalTrigger />
    </div>
  )
}
