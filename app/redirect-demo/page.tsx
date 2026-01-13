'use client'

import Link from 'next/link'
import { redirectScenarios } from '@/lib/redirect-utils'
import { ArrowRight, Home, User, Shield, BookOpen, CreditCard } from 'lucide-react'

export default function RedirectDemoPage() {
  const examples = [
    {
      title: 'After Login',
      description: 'Redirect to dashboard after successful login',
      url: redirectScenarios.afterLogin(),
      icon: <User className="w-5 h-5" />
    },
    {
      title: 'After Admin Login',
      description: 'Redirect to admin panel after admin login',
      url: redirectScenarios.afterAdminLogin(),
      icon: <Shield className="w-5 h-5" />
    },
    {
      title: 'After Logout',
      description: 'Redirect to login page after logout',
      url: redirectScenarios.afterLogout(),
      icon: <ArrowRight className="w-5 h-5" />
    },
    {
      title: 'After Course Enrollment',
      description: 'Redirect to course page after enrollment',
      url: redirectScenarios.afterEnrollment('javascript-mastery'),
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      title: 'After Payment',
      description: 'Redirect after successful payment',
      url: redirectScenarios.afterPayment('/dashboard', 'Payment completed successfully!'),
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      title: 'Manual Redirect',
      description: 'Manual redirect (no auto-redirect)',
      url: redirectScenarios.manual('/courses', 'Choose your action'),
      icon: <Home className="w-5 h-5" />
    },
    {
      title: 'Quick Redirect',
      description: 'Fast redirect (1 second)',
      url: redirectScenarios.quick('/projects', 'Quick redirect to projects'),
      icon: <ArrowRight className="w-5 h-5" />
    },
    {
      title: 'Slow Redirect',
      description: 'Slow redirect (5 seconds)',
      url: redirectScenarios.slow('/about', 'Taking you to about page'),
      icon: <ArrowRight className="w-5 h-5" />
    }
  ]

  return (
    <div className="min-h-screen py-16" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Redirect System Demo</h1>
            <p className="text-gray-400 text-lg">
              Test different redirect scenarios with custom messages and timing
            </p>
          </div>

          {/* Examples Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {examples.map((example, index) => (
              <Link
                key={index}
                href={example.url}
                className="group bg-gray-900/50 backdrop-blur-md border border-gray-700 rounded-2xl p-6 hover:bg-gray-800/50 hover:border-purple-500/30 transition-all duration-200 hover:scale-105"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    {example.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-2 group-hover:text-purple-400 transition-colors">
                      {example.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3">
                      {example.description}
                    </p>
                    <div className="text-xs text-purple-400 font-mono bg-purple-500/10 px-3 py-1 rounded-lg">
                      {example.url.length > 60 ? `${example.url.substring(0, 60)}...` : example.url}
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>

          {/* Usage Instructions */}
          <div className="bg-gray-900/50 backdrop-blur-md border border-gray-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">How to Use</h2>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">1</div>
                <div>
                  <strong className="text-white">Import the utilities:</strong>
                  <code className="block mt-1 text-sm bg-gray-800 px-3 py-2 rounded-lg text-purple-400">
                    import {`{ redirectScenarios }`} from &apos;@/lib/redirect-utils&apos;
                  </code>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">2</div>
                <div>
                  <strong className="text-white">Use in your components:</strong>
                  <code className="block mt-1 text-sm bg-gray-800 px-3 py-2 rounded-lg text-purple-400">
                    window.location.href = redirectScenarios.afterLogin()
                  </code>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">3</div>
                <div>
                  <strong className="text-white">Customize messages and timing:</strong>
                  <code className="block mt-1 text-sm bg-gray-800 px-3 py-2 rounded-lg text-purple-400">
                    redirectScenarios.quick(&apos;/dashboard&apos;, &apos;Custom message&apos;)
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-200 font-medium"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}