import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { preloadCriticalImages } from '@/lib/utils/imagePreloader'
import '@/styles/background-filters.css'
import '@/styles/card-scale-controllers.css'
import { GlobalBackground } from '@/components/backgrounds/GlobalBackground'
import SessionProvider from '@/components/providers/SessionProvider'
import Footer from '@/components/ui/Footer'
import { PerformanceProvider } from '@/components/providers/PerformanceProvider'
import { VersionProvider } from '@/components/providers/VersionProvider'
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
        <PerformanceProvider>
          <VersionProvider>
            <GlobalBackground />
            <SessionProvider>
              {children}
              <Footer />
            </SessionProvider>
          </VersionProvider>
        </PerformanceProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                setTimeout(() => {
                  const criticalImages = [
                    '/Images/buildingIcons/empty.webp',
                    '/Images/buildingIcons/church.webp',
                    '/Images/buildingIcons/fort.webp',
                    '/Images/mapTypes/map_icon/normalIcon.webp',
                    '/Images/Title_n_.webp'
                  ];
                  criticalImages.forEach(src => {
                    const link = document.createElement('link');
                    link.rel = 'prefetch';
                    link.as = 'image';
                    link.href = src;
                    document.head.appendChild(link);
                  });
                }, 1000);
              }
            `,
          }}
        />
      </body>
    </html>
  )
}