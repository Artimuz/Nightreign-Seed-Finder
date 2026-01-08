import './globals.css'
import type { Metadata } from 'next'
import { Header } from '@/components/ui/Header'
import { Footer } from '@/components/ui/Footer'
import { GlobalBackground } from '@/components/backgrounds/GlobalBackground'
import { GlobalUpdateProvider } from '@/components/providers/GlobalUpdateProvider'
import { PwaServiceWorkerRegister } from '@/components/PwaServiceWorkerRegister'
import { pagesIcoUrl } from '@/lib/pagesAssets'

export const metadata: Metadata = {
  title: 'Nightreign Seed Finder',
  description: 'Mobile-friendly seed finder for Nightreign',
  keywords: 'nightreign, seed finder, game seeds, map builder',
  authors: [{ name: 'Nightreign Seed Finder Team' }],
  robots: 'index, follow',
  manifest: process.env.NODE_ENV === 'production' ? undefined : '/manifest.webmanifest',
  icons: {
    icon: pagesIcoUrl('/favicon.ico')
  },
  themeColor: '#000000',
  other: {
    'google-adsense-account': 'ca-pub-3952409900980393',
  },
  openGraph: {
    title: 'Nightreign Seed Finder',
    description: 'Find optimal game seeds for Nightreign',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased overflow-x-hidden">
        <GlobalUpdateProvider>
          <PwaServiceWorkerRegister />
          <GlobalBackground />
          <Header />
          <main className="min-h-screen relative">
            {children}
          </main>
          <Footer />
        </GlobalUpdateProvider>
      </body>
    </html>
  )
}