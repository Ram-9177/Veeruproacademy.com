/**
 * PublicLayout - Clean header and footer for public pages
 * Single logo, consolidated navigation, one CTA button
 */

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { GraduationCap, Menu, Mail, Github, Twitter, Linkedin } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../../src/components/ui/sheet'

interface PublicLayoutProps {
  children: React.ReactNode
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo - Single, Clean */}
            <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-lg font-bold text-foreground">Veeru&apos;s Pro Academy</span>
                <span className="text-xs text-muted-foreground">Learning Platform</span>
              </div>
            </Link>

            {/* Desktop Navigation - Consolidated */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link href="/" className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-surface/10 rounded-lg transition-colors">Home</Link>
              <Link href="/courses" className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-surface/10 rounded-lg transition-colors">Courses</Link>
              <Link href="/projects" className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-surface/10 rounded-lg transition-colors">Projects</Link>
              <Link href="/my-courses" className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-surface/10 rounded-lg transition-colors">My Courses</Link>
              <Link href="/tutorials" className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-surface/10 rounded-lg transition-colors">Tutorials</Link>
              <Link href="/admin-help" className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-surface/10 rounded-lg transition-colors">Admin Help</Link>
              <Link href="/sandbox" className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-surface/10 rounded-lg transition-colors">Sandbox</Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              <Link href="/courses" className="hidden lg:block">
                <button className="btn btn-primary">Learn Now</button>
              </Link>
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <button className="lg:hidden p-2 hover:bg-surface/15 rounded-lg transition-colors">
                    <Menu className="h-6 w-6 text-foreground" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <GraduationCap className="h-6 w-6 text-primary" />
                      Veeru&apos;s Pro Academy
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-1 mt-8">
                    <Link href="/" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm font-medium text-foreground hover:bg-surface/10 rounded-lg transition-colors">Home</Link>
                    <Link href="/courses" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm font-medium text-foreground hover:bg-surface/10 rounded-lg transition-colors">Courses</Link>
                    <Link href="/projects" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm font-medium text-foreground hover:bg-surface/10 rounded-lg transition-colors">Projects</Link>
                    <Link href="/my-courses" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm font-medium text-foreground hover:bg-surface/10 rounded-lg transition-colors">My Courses</Link>
                    <Link href="/tutorials" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm font-medium text-foreground hover:bg-surface/10 rounded-lg transition-colors">Tutorials</Link>
                    <Link href="/admin-help" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm font-medium text-foreground hover:bg-surface/10 rounded-lg transition-colors">Admin Help</Link>
                    <Link href="/sandbox" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-sm font-medium text-foreground hover:bg-surface/10 rounded-lg transition-colors">Sandbox</Link>
                    <div className="border-t border-border my-4" />
                    <Link href="/courses" onClick={() => setMobileMenuOpen(false)}>
                      <button className="btn btn-primary w-full">Learn Now</button>
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-400px)]">{children}</main>

      {/* Footer - Clean Modern Design */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* About */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold text-white">Veeru&apos;s Pro Academy</span>
                </div>
              </div>
              <p className="text-white/80 leading-relaxed mb-6 text-sm">
                Master modern web development through hands-on projects and expert-led courses.
                Transform your career with practical skills.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-2">
                <a
                  href="#"
                  className="h-9 w-9 rounded-lg bg-surface/10 hover:bg-surface/20 flex items-center justify-center transition-colors"
                >
                  <Twitter className="h-4 w-4 text-white" />
                </a>
                <a
                  href="#"
                  className="h-9 w-9 rounded-lg bg-surface/10 hover:bg-surface/20 flex items-center justify-center transition-colors"
                >
                  <Linkedin className="h-4 w-4 text-white" />
                </a>
                <a
                  href="#"
                  className="h-9 w-9 rounded-lg bg-surface/10 hover:bg-surface/20 flex items-center justify-center transition-colors"
                >
                  <Github className="h-4 w-4 text-white" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-5 text-sm">Platform</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/courses" className="text-white/70 hover:text-white transition-colors text-sm">
                    All Courses
                  </Link>
                </li>
                <li>
                  <Link href="/my-courses" className="text-white/70 hover:text-white transition-colors text-sm">
                    My Courses
                  </Link>
                </li>
                <li>
                  <Link href="/tutorials" className="text-white/70 hover:text-white transition-colors text-sm">
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link href="/sandbox" className="text-white/70 hover:text-white transition-colors text-sm">
                    Sandbox
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white font-semibold mb-5 text-sm">Resources</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/admin-help" className="text-white/70 hover:text-white transition-colors text-sm">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/cms" className="text-white/70 hover:text-white transition-colors text-sm">
                    CMS
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="text-white/70 hover:text-white transition-colors text-sm">
                    Admin
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-5 text-sm">Contact</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:support@veerupro.academy"
                    className="text-white/70 hover:text-white transition-colors flex items-center gap-2 text-sm"
                  >
                    <Mail className="h-4 w-4" />
                    support@veerupro.academy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 mt-12 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-white/70 text-sm">
                &copy; 2025 Veeru&apos;s Pro Academy. All rights reserved.
              </p>
              <div className="flex items-center gap-6 text-sm">
                <a href="#" className="text-white/70 hover:text-white transition-colors">
                  Privacy
                </a>
                <a href="#" className="text-white/70 hover:text-white transition-colors">
                  Terms
                </a>
                <a href="#" className="text-white/70 hover:text-white transition-colors">
                  Refunds
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PublicLayout