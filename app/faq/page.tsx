'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Search, HelpCircle, BookOpen, CreditCard, Users } from 'lucide-react'

const faqCategories = [
  {
    id: 'general',
    title: 'General Questions',
    icon: HelpCircle,
    faqs: [
      {
        question: 'What is Veeru\'s Pro Academy?',
        answer: 'Veeru\'s Pro Academy is a project-based learning platform that helps you master modern tech skills through hands-on projects, real-world applications, and expert mentorship.'
      },
      {
        question: 'How do I get started?',
        answer: 'Simply browse our courses, choose one that interests you, and click "Learn Now". You can start with our free Introduction to Coding course or jump into any paid course that matches your skill level.'
      },
      {
        question: 'Do I need any prior experience?',
        answer: 'Not at all! We have courses for complete beginners as well as advanced developers. Each course clearly indicates its difficulty level and prerequisites.'
      },
      {
        question: 'How long does it take to complete a course?',
        answer: 'Course duration varies from 1 week to 6 weeks depending on the complexity. You can learn at your own pace - all courses include lifetime access.'
      }
    ]
  },
  {
    id: 'courses',
    title: 'Courses & Learning',
    icon: BookOpen,
    faqs: [
      {
        question: 'What programming languages do you teach?',
        answer: 'We cover JavaScript, TypeScript, Python, React, Next.js, Node.js, and more. Our focus is on modern, in-demand technologies used by top companies.'
      },
      {
        question: 'Are the courses updated regularly?',
        answer: 'Yes! We continuously update our courses to reflect the latest industry trends, best practices, and technology updates. You get access to all updates for free.'
      },
      {
        question: 'Can I download course materials?',
        answer: 'Absolutely! All course materials, including videos, code samples, and resources, are available for download so you can learn offline.'
      },
      {
        question: 'Do you provide certificates?',
        answer: 'Yes, you receive a certificate of completion for each course you finish. These certificates can be shared on LinkedIn and added to your portfolio.'
      }
    ]
  },
  {
    id: 'billing',
    title: 'Billing & Payments',
    icon: CreditCard,
    faqs: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept UPI, credit/debit cards, and net banking. All payments are processed securely through our payment partners.'
      },
      {
        question: 'Can I get a refund?',
        answer: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied with a course, contact us within 30 days for a full refund.'
      },
      {
        question: 'Are there any hidden fees?',
        answer: 'No hidden fees! The price you see is the price you pay. Once you purchase a course, you have lifetime access with no recurring charges.'
      },
      {
        question: 'Do you offer discounts?',
        answer: 'Yes! We regularly offer discounts during special events and for students. Follow us on social media or subscribe to our newsletter for discount announcements.'
      }
    ]
  },
  {
    id: 'support',
    title: 'Support & Community',
    icon: Users,
    faqs: [
      {
        question: 'How can I get help if I\'m stuck?',
        answer: 'You can reach out through our contact form, email support@veerupro.com, or join our community Discord server where instructors and fellow students help each other.'
      },
      {
        question: 'Is there a community of learners?',
        answer: 'Yes! We have an active Discord community where students share projects, ask questions, and network with each other. You get access when you enroll in any course.'
      },
      {
        question: 'Do you provide career guidance?',
        answer: 'Absolutely! Our courses include career guidance, portfolio building tips, and interview preparation. We also have mentorship programs for advanced students.'
      },
      {
        question: 'What are your support hours?',
        answer: 'Our support team is available Monday-Friday, 9 AM - 6 PM IST, and weekends 10 AM - 4 PM IST. We typically respond within 24 hours.'
      }
    ]
  }
]

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('general')
  const [openFAQ, setOpenFAQ] = useState<string | null>(null)

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0)

  const toggleFAQ = (categoryId: string, faqIndex: number) => {
    const faqId = `${categoryId}-${faqIndex}`
    setOpenFAQ(openFAQ === faqId ? null : faqId)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Find answers to common questions about our courses, platform, and learning experience.
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {faqCategories.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.title}
                </button>
              )
            })}
          </div>

          {/* FAQs */}
          <div className="space-y-6">
            {(searchTerm ? filteredFAQs : faqCategories.filter(cat => cat.id === activeCategory)).map((category) => (
              <div key={category.id}>
                {searchTerm && (
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <category.icon className="w-5 h-5" />
                    {category.title}
                  </h2>
                )}
                <div className="space-y-3">
                  {category.faqs.map((faq, index) => {
                    const faqId = `${category.id}-${index}`
                    const isOpen = openFAQ === faqId
                    
                    return (
                      <div
                        key={index}
                        className="bg-white/5 rounded-lg border border-white/10 overflow-hidden"
                      >
                        <button
                          onClick={() => toggleFAQ(category.id, index)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/10 transition-colors"
                        >
                          <span className="font-medium text-white pr-4">
                            {faq.question}
                          </span>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-4">
                            <p className="text-gray-300 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-12 text-center bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-2xl p-8 border border-blue-500/20">
            <h3 className="text-2xl font-semibold text-white mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-300 mb-6">
              Can&apos;t find what you&apos;re looking for? Our support team is here to help.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              Contact Support
              <HelpCircle className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}