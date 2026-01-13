import './globals.css'
import type { Metadata, Viewport } from 'next'
import { siteConfig } from '@/config/site'
import { SimpleNavbar } from '@/app/components/SimpleNavbar'
import { SkipLink } from '@/app/components/SkipLink'
import { extensionGuardInlineScript } from '@/lib/browser-extension-guard'
import { Providers } from './providers'
import { ToastContainer } from '@/components/ui/ToastContainer'
import { SonnerToaster } from '@/components/ui/SonnerToaster'
import ScrollToTop from '@/app/components/ScrollToTop'
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next"

export const runtime = 'nodejs'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'hsl(var(--neutral-subtle))' },
    { media: '(prefers-color-scheme: dark)', color: 'hsl(var(--background))' },
  ],
}

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  keywords: [
  "Veeru's Pro Academy",
    'Online Courses',
    'E-learning',
    'Education',
    'Learning Platform',
  ],
  authors: [
  { name: "Veeru's Pro Academy", url: siteConfig.url },
  ],
  creator: "Veeru's Pro Academy Team",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      { url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.links.twitter,
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: [
      { url: '/favicon.svg', sizes: '180x180', type: 'image/svg+xml' },
    ],
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: extensionGuardInlineScript }}
        />
      </head>
      <body className="min-h-screen font-sans antialiased bg-gray-900 text-white">
        <Providers>
          <SkipLink />
          <ScrollToTop />
          <SimpleNavbar />
          <main id="main-content" tabIndex={-1} className="bg-gray-900">
            {children}
            <Analytics />
            <SpeedInsights />
          </main>
          <ToastContainer />
          <SonnerToaster />
        </Providers>
      </body>
    </html>
  )
}
