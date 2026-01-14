import type { Metadata } from 'next'
import { DecoratedArticle } from '@/components'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'How to contact the Nightreign Seed Finder author.',
}

const contactEmail = 'ALANRODROOGS@GMAIL.COM'

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 pb-24 pt-28 text-gray-100">
      <DecoratedArticle>
        <header>
          <h1 className="text-3xl font-semibold">Contact</h1>
        </header>

        <div className="mt-8 space-y-5 text-gray-300">
          <p>
            For the most part, you can use the Report button. It also serves as a way to message me.
          </p>
          <p>
            If you need to contact me directly, here is my email:
          </p>
          <p className="rounded-lg border border-gray-600/40 bg-black/20 px-4 py-3 font-medium tracking-wide text-gray-100">
            {contactEmail}
          </p>
        </div>
      </DecoratedArticle>
    </div>
  )
}
