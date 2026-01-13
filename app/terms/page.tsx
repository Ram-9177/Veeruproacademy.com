import Link from 'next/link'
import { FileText, Users, CreditCard, BookOpen, AlertTriangle, Scale } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service - Veeru\'s Pro Academy',
  description: 'Terms and conditions for using our platform'
}

export default function TermsPage() {
  const sections = [
    {
      icon: Users,
      title: 'User Accounts',
      content: [
        'You must be at least 13 years old to create an account',
        'Provide accurate and complete information',
        'Keep your account credentials secure',
        'You are responsible for all activity under your account',
        'One account per person'
      ]
    },
    {
      icon: BookOpen,
      title: 'Course Content & Access',
      content: [
        'Access granted for personal, non-commercial use',
        'Content may not be redistributed or shared',
        'Course materials remain our intellectual property',
        'We may update course content at any time',
        'Lifetime access to purchased courses (unless specified otherwise)'
      ]
    },
    {
      icon: CreditCard,
      title: 'Payments & Refunds',
      content: [
        'All prices are in the stated currency',
        'Payments processed securely through our partners',
        '30-day money-back guarantee on eligible courses',
        'Refunds processed within 5-10 business days',
        'Some courses may have different refund policies'
      ]
    },
    {
      icon: Scale,
      title: 'Acceptable Use',
      content: [
        'Use the platform in accordance with all applicable laws',
        'No harassment, abuse, or harmful behavior',
        'No spam, phishing, or malicious activities',
        'Respect intellectual property rights',
        'We reserve the right to terminate accounts for violations'
      ]
    },
    {
      icon: AlertTriangle,
      title: 'Disclaimers',
      content: [
        'Platform provided "as is" without warranties',
        'We are not liable for interruptions or data loss',
        'Course outcomes not guaranteed',
        'Third-party links not under our control',
        'Use at your own risk'
      ]
    },
    {
      icon: FileText,
      title: 'Modifications',
      content: [
        'We may update these terms at any time',
        'Continued use constitutes acceptance of changes',
        'Major changes will be communicated via email',
        'Check this page regularly for updates',
        'Last modified date shown at the top'
      ]
    }
  ]

  return (
    <main className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="w3-section bg-blue-600">
        <div className="w3-container text-center text-white">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-semibold mb-6">
            <FileText className="w-4 h-4" />
            Terms of Service
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Terms & Conditions
          </h1>
          <p className="text-xl text-white/90">
            Please read these terms carefully before using our platform
          </p>
          <p className="text-sm text-white/70 mt-4">
            Last updated: January 12, 2026
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="w3-section bg-gray-900">
        <div className="w3-container">
          <div className="max-w-4xl mx-auto">
            <div className="w3-card">
              <p className="text-gray-300 leading-relaxed">
                Welcome to Veeru&apos;s Pro Academy. By accessing or using our platform, you agree to be bound by these Terms of Service. 
                If you do not agree with any part of these terms, you may not use our services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Terms Sections */}
      <section className="w3-section bg-gray-900">
        <div className="w3-container">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <div key={section.title} className="w3-card">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-white mb-3">{section.title}</h2>
                        <ul className="space-y-2">
                          {section.content.map((item, index) => (
                            <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Governing Law */}
      <section className="w3-section bg-gray-900">
        <div className="w3-container">
          <div className="max-w-4xl mx-auto">
            <div className="w3-card">
              <h3 className="text-xl font-bold text-white mb-4">Governing Law</h3>
              <p className="text-gray-300 mb-4">
                These terms shall be governed by and construed in accordance with applicable laws. 
                Any disputes shall be resolved through binding arbitration.
              </p>
              
              <h3 className="text-xl font-bold text-white mb-4 mt-6">Contact Information</h3>
              <p className="text-gray-300 mb-4">
                If you have questions about these terms, please contact our support team.
              </p>

              <h3 className="text-xl font-bold text-white mb-4 mt-6">Severability</h3>
              <p className="text-gray-300">
                If any provision of these terms is found to be unenforceable, the remaining provisions will continue in full force and effect.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="w3-section bg-blue-600">
        <div className="w3-container text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Questions About Terms?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            If you have any questions about our terms of service, we&apos;re here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="btn btn-primary"
            >
              Contact Us
            </Link>
            <Link
              href="/privacy"
              className="btn btn-outline"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
