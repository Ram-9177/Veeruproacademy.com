import Link from 'next/link'
import { BookOpen, MessageCircle, FileText, Video, Mail, Search } from 'lucide-react'

export const metadata = {
  title: 'Help Center - Veeru\'s Pro Academy',
  description: 'Find answers to your questions and get help with our learning platform'
}

export default function HelpPage() {
  const helpCategories = [
    {
      title: 'Getting Started',
      icon: BookOpen,
      description: 'Learn the basics of using the platform',
      articles: [
        { title: 'How to create an account', href: '#create-account' },
        { title: 'Enrolling in your first course', href: '#enroll-course' },
        { title: 'Navigating the dashboard', href: '#dashboard' },
        { title: 'Setting up your profile', href: '#profile-setup' }
      ]
    },
    {
      title: 'Courses & Learning',
      icon: Video,
      description: 'Everything about courses and lessons',
      articles: [
        { title: 'How to access course materials', href: '#course-materials' },
        { title: 'Tracking your progress', href: '#progress-tracking' },
        { title: 'Completing lessons', href: '#complete-lessons' },
        { title: 'Getting certificates', href: '#certificates' }
      ]
    },
    {
      title: 'Account & Billing',
      icon: FileText,
      description: 'Manage your account and subscriptions',
      articles: [
        { title: 'Updating account information', href: '#update-account' },
        { title: 'Payment methods', href: '#payment-methods' },
        { title: 'Refund policy', href: '#refunds' },
        { title: 'Subscription management', href: '#subscriptions' }
      ]
    },
    {
      title: 'Technical Support',
      icon: MessageCircle,
      description: 'Troubleshooting and technical issues',
      articles: [
        { title: 'Common login issues', href: '#login-issues' },
        { title: 'Video playback problems', href: '#video-issues' },
        { title: 'Browser compatibility', href: '#browser-support' },
        { title: 'Mobile app support', href: '#mobile-support' }
      ]
    }
  ]

  return (
    <main className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="w3-section bg-blue-600">
        <div className="w3-container text-center text-white">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-semibold mb-6">
            <BookOpen className="w-4 h-4" />
            Help Center
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            How Can We Help You?
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Find answers to your questions and get the support you need
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for help articles..."
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="w3-section bg-gray-900">
        <div className="w3-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {helpCategories.map((category) => {
              const Icon = category.icon
              return (
                <div key={category.title} className="w3-card hover:border-blue-500 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-white mb-2">{category.title}</h2>
                      <p className="text-gray-400 mb-4">{category.description}</p>
                      <ul className="space-y-2">
                        {category.articles.map((article) => (
                          <li key={article.title}>
                            <a
                              href={article.href}
                              className="text-blue-400 hover:text-blue-300 transition-colors text-sm flex items-center gap-2"
                            >
                              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                              {article.title}
                            </a>
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
      </section>

      {/* Contact Support */}
      <section className="w3-section bg-blue-600">
        <div className="w3-container text-center text-white">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm flex items-center justify-center rounded-2xl mx-auto mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Can&apos;t find what you&apos;re looking for? Our support team is here to help you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="btn btn-primary"
            >
              Contact Support
            </Link>
            <Link
              href="/dashboard"
              className="btn btn-outline"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="w3-section bg-gray-900">
        <div className="w3-container">
          <div className="w3-card">
            <h3 className="text-xl font-bold text-white mb-6">Popular Resources</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/courses" className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                <h4 className="font-semibold text-white mb-2">Browse Courses</h4>
                <p className="text-sm text-gray-400">Explore all available courses</p>
              </Link>
              <Link href="/dashboard" className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                <h4 className="font-semibold text-white mb-2">My Dashboard</h4>
                <p className="text-sm text-gray-400">View your learning progress</p>
              </Link>
              <Link href="/profile" className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                <h4 className="font-semibold text-white mb-2">Account Settings</h4>
                <p className="text-sm text-gray-400">Manage your profile</p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
