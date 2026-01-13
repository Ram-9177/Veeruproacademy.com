'use client'
import Link from 'next/link'
import { Github, Instagram, Linkedin, Twitter, Mail } from 'lucide-react'
import { VeeruProLogo } from './VeeruProLogo'

const defaultFooterLinks = [
  {
    title: 'Learn',
    links: [
      { label: 'Courses', href: '/courses' },
      { label: 'Tutorials', href: '/tutorials' }
    ]
  },
  {
    title: 'Build',
    links: [
      { label: 'Templates', href: '/cms#templates' },
      { label: 'Premium Assets', href: '/assets#premium' },
      { label: 'Open Source', href: '/projects#opensource' }
    ]
  },
  {
    title: 'Practice',
    links: [
      { label: 'Sandbox', href: '/sandbox' },
      { label: 'Editor Docs', href: '/sandbox#docs' }
    ]
  },
  {
    title: 'Support',
    links: [
      { label: 'Admin Help', href: '/admin-help' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' }
    ]
  }
]

const socials = [
  { href: 'https://twitter.com', icon: Twitter, label: 'Twitter / X', color: 'hover:bg-teal-500' },
  { href: 'https://www.instagram.com', icon: Instagram, label: 'Instagram', color: 'hover:bg-coral-500' },
  { href: 'https://www.linkedin.com', icon: Linkedin, label: 'LinkedIn', color: 'hover:bg-primary-500' },
  { href: 'https://github.com', icon: Github, label: 'GitHub', color: 'hover:bg-gray-700' },
  { href: 'mailto:hello@veerupro.ac', icon: Mail, label: 'Email', color: 'hover:bg-sunny-500' }
]

/* eslint-disable react/no-unescaped-entities */
export function Footer() {
  return (
    <footer className="bg-[#282A35]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          {/* Brand Column */}
          <div className="space-y-4">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-3 group">
              <VeeruProLogo 
                width={32} 
                height={32} 
                className="transition-transform duration-300 group-hover:scale-110" 
              />
              <span className="text-xl font-bold text-white group-hover:text-[#04AA6D] transition-colors">
                Veeru's Pro Academy
              </span>
            </Link>
            
            <p className="text-sm text-gray-300 leading-relaxed">
              Empowering developers through hands-on learning and real-world projects.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socials.map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center bg-[#04AA6D] text-white hover:bg-[#059862] transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Link Groups */}
          {defaultFooterLinks.map((column: { title: string; links: { label: string; href: string }[] }) => (
            <div key={column.title} className="space-y-3">
              <h4 className="text-base font-bold text-white">
                {column.title}
              </h4>
              <ul className="space-y-2">
                {column.links.map(link => (
                  <li key={link.href}>
                    <Link 
                      href={link.href} 
                      className="text-sm text-gray-300 hover:text-[#04AA6D] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-300">
              © 2025 Veeru&apos;s Pro Academy. All rights reserved.
            </p>
            
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="text-gray-300 hover:text-[#04AA6D] transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-300 hover:text-[#04AA6D] transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
