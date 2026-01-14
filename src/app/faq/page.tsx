import type { Metadata } from 'next'
import { DecoratedArticle } from '@/components'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about Nightreign Seed Finder.',
}

type FaqItem = {
  question: string
  answer: string
}

const faqItems: FaqItem[] = [
  {
    question: 'Can the app tell if the Nightlord will be the Everdark version during Deep of Night?',
    answer: 'No. This information does not affect the map pattern, and the game only reveals this at the very end.',
  },
  {
    question: 'Can the app predict the Mid-Day Circle position or where certain events will spawn?',
    answer: 'No. These elements are completely random and there is no reliable way to predict them.',
  },
  {
    question: 'If the app shows the wrong map, how can I report it?',
    answer:
      'In the bottom-right corner of the footer, there is a “Bug Report” button. It opens a short form where you can describe your case.',
  },
  {
    question: 'Can you implement a way to identify a map pattern using only a screenshot?',
    answer:
      'This is technically possible, but it would significantly increase computational cost, be prone to errors, and overall be less reliable than manually identifying 2–5 structures on the map.',
  },
]

export default function FaqPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 pb-24 pt-28 text-gray-100">
      <DecoratedArticle>
        <header>
          <h1 className="text-3xl font-semibold">FAQ</h1>
          <p className="mt-3 text-gray-300">
            Answers to common questions about Nightreign Seed Finder.
          </p>
        </header>

        <div className="mt-8 space-y-6">
          {faqItems.map((item) => (
            <section key={item.question} className="rounded-lg border border-gray-600/40 bg-black/20 p-5">
              <h2 className="text-lg font-semibold">{item.question}</h2>
              <p className="mt-2 text-gray-300">{item.answer}</p>
            </section>
          ))}
        </div>
      </DecoratedArticle>
    </div>
  )
}
