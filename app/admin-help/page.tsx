'use client'

import {
  Mail,
  Shield,
  UploadCloud,
  CreditCard,
  Settings,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Clock,
  Zap,
  HelpCircle,
  Play
} from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-gray-200 rounded overflow-hidden bg-white hover:shadow-md transition-shadow">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-bold text-gray-900">{question}</span>
        {isOpen ? (
          <ChevronDown className="h-5 w-5 text-[#04AA6D]" />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 border-t border-gray-200 bg-[#f1f1f1]">
          <p className="text-gray-900 leading-relaxed mt-3">{answer}</p>
        </div>
      )}
    </div>
  )
}

export default function AdminHelpPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* W3Schools-Style Hero */}
      <div className="bg-gradient-to-r from-[#04AA6D] to-[#059862] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-2 rounded bg-white/20 backdrop-blur-sm mb-6">
              <span className="text-sm font-bold text-white">💡 Help Center</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              How Can We Help You?
            </h1>
            <p className="text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
              Find answers to common questions, learn about our processes, and get the support you need to succeed.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Links Bar */}
      <div className="bg-[#282A35] text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <a href="#getting-started" className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded transition-colors">
              <Zap className="w-4 h-4" />
              Getting Started
            </a>
            <a href="#payment" className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded transition-colors">
              <CreditCard className="w-4 h-4" />
              Payment
            </a>
            <a href="#access" className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded transition-colors">
              <Shield className="w-4 h-4" />
              Access
            </a>
            <a href="#support" className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded transition-colors">
              <MessageSquare className="w-4 h-4" />
              Support
            </a>
            <a href="#faqs" className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded transition-colors">
              <HelpCircle className="w-4 h-4" />
              FAQs
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        
        {/* Announcement Banner */}
        <div className="mb-12 rounded border-2 border-[#04AA6D] bg-[#f1f1f1] p-6 shadow-md">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#04AA6D] flex-shrink-0">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold text-gray-900 mb-2">🎉 New: Instant UPI verification now available!</p>
              <p className="text-gray-700">Students can now get immediate access after payment confirmation.</p>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <section id="getting-started" className="mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 pb-4 border-b-2 border-gray-200">
            🚀 Getting Started
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="border border-gray-200 rounded bg-white p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#04AA6D] rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Complete Payment</h3>
              <p className="text-gray-700 leading-relaxed">
                Choose your course or project, make a secure UPI payment, and upload your payment proof.
              </p>
            </div>

            <div className="border border-gray-200 rounded bg-white p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#04AA6D] rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Get Verified</h3>
              <p className="text-gray-700 leading-relaxed">
                Our system verifies your payment within 5 minutes. You&apos;ll receive an email confirmation.
              </p>
            </div>

            <div className="border border-gray-200 rounded bg-white p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#04AA6D] rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Learn Now</h3>
              <p className="text-gray-700 leading-relaxed">
                Access the sandbox, download assets, and begin your learning journey immediately.
              </p>
            </div>
          </div>
        </section>

        {/* Payment Process */}
        <section id="payment" className="mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 pb-4 border-b-2 border-gray-200">
            💳 Payment & Verification
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border-2 border-[#04AA6D] rounded bg-[#f1f1f1] p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-8 h-8 text-[#04AA6D]" />
                <h3 className="text-2xl font-bold text-gray-900">Instant Verification</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#04AA6D] mt-1 flex-shrink-0" />
                  <span className="text-gray-900">Upload payment screenshot immediately after transaction</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#04AA6D] mt-1 flex-shrink-0" />
                  <span className="text-gray-900">AI-powered verification completes in under 5 minutes</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#04AA6D] mt-1 flex-shrink-0" />
                  <span className="text-gray-900">Get sandbox access and download links instantly</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#04AA6D] mt-1 flex-shrink-0" />
                  <span className="text-gray-900">No more waiting for manual approval</span>
                </li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded bg-white p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-gray-700" />
                <h3 className="text-2xl font-bold text-gray-900">Security First</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#04AA6D] mt-1 flex-shrink-0" />
                  <span className="text-gray-900">All payments verified against transaction IDs</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#04AA6D] mt-1 flex-shrink-0" />
                  <span className="text-gray-900">Bank-grade security for all financial data</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#04AA6D] mt-1 flex-shrink-0" />
                  <span className="text-gray-900">GDPR compliant data handling</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#04AA6D] mt-1 flex-shrink-0" />
                  <span className="text-gray-900">24/7 monitoring for suspicious activity</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Access Management */}
        <section id="access" className="mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 pb-4 border-b-2 border-gray-200">
            🛡️ Access Management
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded bg-white p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#04AA6D] rounded flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Access Requests</h3>
              <p className="text-gray-700 mb-4">Premium content & sandbox seats</p>
              <ul className="space-y-2 text-sm text-gray-700 mb-4">
                <li>• Approve UPI payments within 12 hours</li>
                <li>• Share Drive folder link after validation</li>
                <li>• Update status sheet for progress tracking</li>
              </ul>
              <Link
                href="/courses"
                className="inline-block w-full text-center px-4 py-2 bg-gray-100 hover:bg-[#04AA6D] hover:text-white text-gray-900 font-bold rounded transition-colors"
              >
                View Guidelines
              </Link>
            </div>

            <div className="border border-gray-200 rounded bg-white p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#FFF4A3] rounded flex items-center justify-center mb-4">
                <UploadCloud className="w-8 h-8 text-[#282A35]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Asset Delivery</h3>
              <p className="text-gray-700 mb-4">Organized Google Drive folders</p>
              <ul className="space-y-2 text-sm text-gray-700 mb-4">
                <li>• Folder per course with version tags</li>
                <li>• README with validation steps</li>
                <li>• Admin CMS manages lesson updates</li>
              </ul>
              <Link
                href="/projects"
                className="inline-block w-full text-center px-4 py-2 bg-gray-100 hover:bg-[#04AA6D] hover:text-white text-gray-900 font-bold rounded transition-colors"
              >
                Browse Assets
              </Link>
            </div>

            <div className="border border-gray-200 rounded bg-white p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#FFC0C7] rounded flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-[#282A35]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Contact Support</h3>
              <p className="text-gray-700 mb-4">Reach the right person instantly</p>
              <div className="space-y-2 text-sm mb-4">
                <div className="p-2 bg-[#f1f1f1] rounded">
                  <span className="font-bold">Payments:</span> billing@veerupro.ac
                </div>
                <div className="p-2 bg-[#f1f1f1] rounded">
                  <span className="font-bold">Content:</span> content@veerupro.ac
                </div>
                <div className="p-2 bg-[#f1f1f1] rounded">
                  <span className="font-bold">Sandbox:</span> sandbox@veerupro.ac
                </div>
              </div>
              <Link
                href="mailto:support@veerupro.ac"
                className="inline-flex items-center justify-center w-full px-4 py-2 bg-[#04AA6D] hover:bg-[#059862] text-white font-bold rounded transition-colors"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Team
              </Link>
            </div>
          </div>
        </section>

        {/* Content Management */}
        <section id="content" className="mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 pb-4 border-b-2 border-gray-200">
            ⚙️ Content Management
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-gray-200 rounded bg-white p-6">
              <div className="flex items-center gap-3 mb-4">
                <Settings className="w-8 h-8 text-[#04AA6D]" />
                <h3 className="text-2xl font-bold text-gray-900">Admin CMS (Database)</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Our database-backed CMS makes updates simple, auditable, and consistent.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Real-time content editing</li>
                <li>• Publish/draft controls</li>
                <li>• Version history and rollbacks</li>
                <li>• Role-based access control</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded bg-white p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-8 h-8 text-[#04AA6D]" />
                <h3 className="text-2xl font-bold text-gray-900">Update Schedule</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Regular content updates keep your learning materials current and relevant.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Weekly content reviews</li>
                <li>• Monthly feature updates</li>
                <li>• Quarterly curriculum refresh</li>
                <li>• Student feedback integration</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section id="faqs" className="mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 pb-4 border-b-2 border-gray-200">
            ❓ Frequently Asked Questions
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-4">
            <FAQItem
              question="How long does payment verification take?"
              answer="With our new instant verification system, most payments are confirmed within 5 minutes. During peak hours, it may take up to 2 hours. You&apos;ll receive an email confirmation once verified."
            />
            <FAQItem
              question="What if my payment proof is rejected?"
              answer="If your payment proof is unclear or doesn&apos;t match our records, you&apos;ll receive a notification with specific instructions on what we need. Common issues include cropped screenshots or low-quality images."
            />
            <FAQItem
              question="Can I access the sandbox before payment?"
              answer="The sandbox is available for free exploration, but premium features and guided projects require enrollment. You can try basic HTML/CSS/JS without any commitment."
            />
            <FAQItem
              question="How do I update my course materials?"
              answer="All course materials are automatically updated through our CMS. You&apos;ll see a notification badge when new content is available. Premium students get priority access to new features."
            />
            <FAQItem
              question="What payment methods do you accept?"
              answer="We currently accept UPI payments for instant verification. We&apos;re working on adding more payment options including cards and digital wallets."
            />
            <FAQItem
              question="How do I get my certificate?"
              answer="Certificates are automatically generated when you complete all course modules and pass the final assessment. You can download them from your dashboard."
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-[#04AA6D] to-[#059862] rounded-xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Building?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already creating amazing projects with Veeru&apos;s Pro Academy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/courses"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#04AA6D] hover:bg-gray-100 font-bold text-lg rounded transition-colors shadow-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Learn Now
            </Link>
            <Link
              href="mailto:support@veerupro.ac"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white hover:bg-white/10 text-white font-bold text-lg rounded transition-colors"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Contact Support
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
