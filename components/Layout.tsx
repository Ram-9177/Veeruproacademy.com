import Head from 'next/head'
import { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'

type LayoutProps = {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <Header />

      <main id="main-content" role="main" className="min-h-[60vh]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-section">{children}</div>
      </main>

      <Footer />

      <Head>
        <meta name="theme-color" content="#0B3B75" />
      </Head>
    </>
  )
}
