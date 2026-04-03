import type { Metadata, Viewport } from 'next'
import './globals.css'
import ServiceWorker from '@/components/ServiceWorker'
import ThemeProvider from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: 'Skin App',
  description: 'Personalized skincare recommendations for Indian skin',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Skin App',
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: 'website',
    title: 'Skin App',
    description: 'Personalized skincare for Indian skin — free, AI-powered',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1a1a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Skin App" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <ThemeProvider>
          <ServiceWorker />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}