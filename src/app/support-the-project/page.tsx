import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { pagesPngUrl, pagesWebpUrl } from '@/lib/pagesAssets'

export const metadata: Metadata = {
  title: 'Support the Project',
  description: 'Help keep Nightreign Seed Finder sustainable as it grows and continues to receive updates.',
}

const kofiUrl = 'https://ko-fi.com/nightreignseedfinder'

export default function SupportTheProjectPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 pb-24 pt-28 text-gray-100">
      <article className="rounded-xl border border-gray-600/40 bg-black/85 p-6 backdrop-blur-sm sm:p-10">
        <header className="text-center">
          <h1 className="text-3xl font-semibold">Support Nightreign Seed Finder</h1>
          <p className="mt-3 text-gray-300">
            If you enjoy the tool and want to help keep it running as it grows, this is the best way.
          </p>
        </header>

        <div className="mt-8 text-gray-300">
          <div className="grid gap-6 sm:grid-cols-[260px_1fr] sm:items-start">
            <div className="overflow-hidden rounded-xl border border-gray-600/40 bg-black/20">
              <Image
                src={pagesWebpUrl('/Images/support/remember-to-feed-your-local-revenant.webp')}
                alt="Remember to feed your local revenant"
                width={520}
                height={520}
                className="h-auto w-full"
                unoptimized
              />
            </div>

            <div className="space-y-5 sm:pt-8">
              <p>
                As the site keeps growing and receiving continuous updates, I created a Ko-fi page to help cover ongoing costs and keep the
                project sustainable.
              </p>
              <p>
                If you want to contribute to the longevity of the project, you can support it through Ko-fi. Any help makes a difference
                and helps me keep improving the site.
              </p>
              <p>
                I&apos;ll be honest: right now I don&apos;t have any special rewards for supporters beyond my eternal gratitude. But I promise I&apos;m
                thinking about ways to give something back in the future.
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              href={kofiUrl}
              prefetch={false}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-gray-500/60 bg-gray-700/40 px-5 py-3 font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:border-blue-400/80 hover:bg-gray-600/50"
            >
              <span className="flex items-center gap-2">
                <Image src={pagesPngUrl('/Images/support/KoFiIcon.png')} alt="Ko-fi" width={18} height={18} unoptimized />
                <span>Support on Ko-fi</span>
              </span>
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}
