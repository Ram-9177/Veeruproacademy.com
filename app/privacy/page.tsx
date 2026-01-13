import Link from 'next/link'
import { Shield, Eye, Lock, UserCheck, Database, Globe } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy - Veeru\'s Pro Academy',
  description: 'Learn how we protect and handle your personal information'
}

export default function PrivacyPage() {
  const sections = [
    {
      icon: Eye,
      title: 'Information We Collect',
      content: [
        'Account information (name, email, profile details)',
        'Learning activity and progress data',
        'Device and browser information',
        'Cookies and usage analytics'
      ]
    },
    {
      icon: Lock,
      title: 'How We Use Your Information',
      content: [
        'Provide and improve our educational services',
        'Personalize your learning experience',
        'Communicate important updates',
        'Analyze platform usage and performance'
      ]
    },
    {
      icon: Shield,
      title: 'Data Protection',
      content: [
        'Encrypted data transmission (HTTPS/TLS)',
        'Secure password hashing with bcrypt',
        'Regular security audits and updates',
        'Limited access to authorized personnel only'
      ]
    },
    {
      icon: UserCheck,
      title: 'Your Rights',
      content: [
        'Access your personal data at any time',
        'Request data correction or deletion',
        'Opt-out of marketing communications',
        'Export your learning data'
      ]
    },
    {
      icon: Database,
      title: 'Data Storage',
      content: [
        'Data stored in secure cloud infrastructure',
        'Regular automated backups',
        'Data retained as long as your account is active',
        'Deleted data removed within 30 days'
      ]
    },
    {
      icon: Globe,
      title: 'Third-Party Services',
      content: [
        'Analytics tools for platform improvement',
        'Payment processors for secure transactions',
        'Email service providers for communications',
        'All third parties comply with data protection laws'
      ]
    }
  ]

  return (
    <main className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="w3-section bg-blue-600">
        <div className="w3-container text-center text-white">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-semibold mb-6">
            <Shield className="w-4 h-4" />
            Privacy Policy
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your Privacy Matters
          </h1>
          <p className="text-xl text-white/90">
            We are committed to protecting your personal information
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
                At Veeru&apos;s Pro Academy, we respect your privacy and are committed to protecting your personal data. 
                This privacy policy explains how we collect, use, and safeguard your information when you use our platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Sections */}
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

      {/* Contact Section */}
      <section className="w3-section bg-blue-600">
        <div className="w3-container text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Questions About Privacy?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            If you have any questions about our privacy policy, please don&apos;t hesitate to contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="btn btn-primary"
            >
              Contact Us
            </Link>
            <Link
              href="/terms"
              className="btn btn-outline"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="w3-section bg-gray-900">
        <div className="w3-container">
          <div className="max-w-4xl mx-auto">
            <div className="w3-card">
              <h3 className="text-xl font-bold text-white mb-4">Cookies Policy</h3>
              <p className="text-gray-300 mb-4">
                We use cookies and similar technologies to enhance your experience. You can manage cookie preferences in your browser settings.
              </p>
              <h3 className="text-xl font-bold text-white mb-4 mt-6">Children&apos;s Privacy</h3>
              <p className="text-gray-300 mb-4">
                Our services are intended for users 13 years and older. We do not knowingly collect information from children under 13.
              </p>
              <h3 className="text-xl font-bold text-white mb-4 mt-6">Changes to This Policy</h3>
              <p className="text-gray-300">
                We may update this privacy policy from time to time. We will notify you of any significant changes via email or platform notification.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
