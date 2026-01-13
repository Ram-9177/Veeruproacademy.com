'use client'

import { Mail, ArrowRight } from 'lucide-react'

export function Newsletter() {
  return (
    <section className="w3-section bg-gray-800">
      <div className="w3-container">
        <div className="max-w-4xl mx-auto">
          <div className="w3-card p-12 text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-900 rounded-xl mx-auto mb-6">
              <Mail className="w-8 h-8 text-blue-400" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Stay Updated with Latest Courses
            </h2>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Get notified about new courses, exclusive content, and special offers. 
              Join our community of learners.
            </p>

            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="form-control flex-1"
                required
              />
              <button
                type="submit"
                className="btn btn-primary group flex items-center justify-center gap-2"
              >
                Subscribe
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <p className="text-sm text-gray-400 mt-4">
              No spam, unsubscribe at any time. We respect your privacy.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}