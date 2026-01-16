import './globals.css'
import { Suspense } from 'react'
import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Header } from '@/components/ui/Header'
import { Footer } from '@/components/ui/Footer'
import { GlobalBackground } from '@/components/backgrounds/GlobalBackground'
import { GlobalUpdateProvider } from '@/components/providers/GlobalUpdateProvider'
import { PwaServiceWorkerRegister } from '@/components/PwaServiceWorkerRegister'
import { GaPageViewTracker } from '@/components/analytics/GaPageViewTracker'
import { pagesIcoUrl, pagesJpgUrl } from '@/lib/pagesAssets'

export const viewport: Viewport = {
  themeColor: '#000000',
}

export const metadata: Metadata = {
  title: {
    default: 'Nightreign Seed Finder',
    template: '%s | Nightreign Seed Finder',
  },
  description: 'Mobile-friendly seed finder for Nightreign',
  keywords: 'nightreign, seed finder, game seeds, map builder',
  authors: [{ name: 'Nightreign Seed Finder Team' }],
  robots: 'index, follow',
  manifest: process.env.NODE_ENV === 'production' ? undefined : '/manifest.webmanifest',
  icons: {
    icon: pagesIcoUrl('/favicon.ico')
  },
  other: {
    'google-adsense-account': 'ca-pub-3952409900980393',
  },
  openGraph: {
    title: 'Nightreign Seed Finder',
    description: 'Find optimal game seeds for Nightreign',
    type: 'website',
    images: [
      {
        url: pagesJpgUrl('/Images/og/og_main.jpg'),
        width: 1200,
        height: 630,
        alt: 'Nightreign Seed Finder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [pagesJpgUrl('/Images/og/og_main.jpg')],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  return (
    <html lang="en">
      <head>
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3952409900980393"
          strategy="afterInteractive"
        />
        {gaMeasurementId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){window.dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${gaMeasurementId}', { send_page_view: false });`}
            </Script>
          </>
        ) : null}
      </head>
      <body className="antialiased overflow-x-hidden">
        <GlobalUpdateProvider>
          <PwaServiceWorkerRegister />
          <Suspense fallback={null}>
            <GaPageViewTracker />
          </Suspense>
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