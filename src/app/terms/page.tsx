import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms',
  description: 'Terms of service for Nightreign Seed Finder.',
}

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 pb-24 pt-28 text-gray-100">
      <article className="rounded-xl border border-gray-600/40 bg-black/85 p-6 backdrop-blur-sm sm:p-10">
        <header>
          <h1 className="text-3xl font-semibold">Terms of Service</h1>
        </header>

        <div className="mt-8 space-y-6 text-gray-300">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-100">Acceptance</h2>
            <p>By using this website, you agree to these terms. If you do not agree, please do not use the website.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-100">Use of the service</h2>
            <p>
              You may use the website for personal, non-commercial purposes. You agree not to misuse the service, interfere with its
              operation, or attempt to access it through automated means.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-100">Changes</h2>
            <p>
              We may update these terms at any time. Continued use of the website after changes become effective constitutes
              acceptance of the updated terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-100">Limitation of liability</h2>
            <p>
              To the fullest extent permitted by law, we are not liable for any damages arising from the use of the website.
            </p>
          </section>
        </div>
      </article>
    </div>
  )
}
