import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '@/styles/background-filters.css'
import '@/styles/card-scale-controllers.css'
import { GlobalBackground } from '@/components/backgrounds/GlobalBackground'
import SessionProvider from '@/components/providers/SessionProvider'
import UserCounter from '@/components/ui/UserCounter'
import Footer from '@/components/ui/Footer'
const inter = Inter({ subsets: ['latin'] })
export const metadata: Metadata = {
  title: 'Nightreign Seed Finder',
  description: 'Find the perfect seeds for your Nightreign adventure',
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <GlobalBackground />
        <SessionProvider>
          {children}
          <UserCounter />
          <Footer />
        </SessionProvider>
      </body>
    </html>
  )
}