import type { Metadata } from 'next'
import { DecoratedArticle, PageNavButtons } from '@/components'

export const metadata: Metadata = {
  title: 'Legal',
  description: 'Legal information, disclaimers, and content takedown policy.',
}

const contactEmail = 'ALANRODROOGS@GMAIL.COM'

export default function LegalPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 pb-24 pt-28 text-gray-100">
      <DecoratedArticle>
        <header>
          <h1 className="text-3xl font-semibold">Legal & Disclaimer</h1>
        </header>

        <div className="mt-8 space-y-6 text-gray-300">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-100">Fan project</h2>
            <p>
              Nightreign Seed Finder is a fan-made project. It is not affiliated with or endorsed by FromSoftware, Bandai Namco, or
              any other rights holder.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-100">Trademarks & copyrights</h2>
            <p>
              All trademarks, logos, and copyrighted materials referenced on this website are the property of their respective
              owners. They are used for identification and informational purposes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-100">Content takedown</h2>
            <p>
              If you are a rights holder and believe any content hosted on this website infringes your rights, please contact us at{' '}
              <span className="font-medium text-gray-100">{contactEmail}</span> with a clear description of the material and the
              relevant URLs. We will review and, when appropriate, remove the content.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-100">No warranties</h2>
            <p>
              The website is provided on an “as-is” basis. We do not guarantee accuracy, availability, or fitness for a particular
              purpose.
            </p>
          </section>
        </div>

        <PageNavButtons
          title="Related pages"
          links={[
            { href: '/legal', label: 'Legal & Disclaimer' },
            { href: '/terms', label: 'Terms of Service' },
            { href: '/privacy-policy', label: 'Privacy Policy' },
          ]}
        />
      </DecoratedArticle>
    </div>
  )
}
