import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-900">{/* Same theme as home page */}
      {/* Hero Section - W3Schools Style */}
      <section className="w3-section bg-blue-600">
        <div className="w3-container text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Have questions about our courses? Need help with your learning journey? 
            We&apos;re here to help you succeed.
          </p>
        </div>
      </section>

      {/* Main Content - W3Schools Style */}
      <section className="w3-section bg-gray-900">
        <div className="w3-container">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-white mb-6">
                  Contact Information
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Email</h3>
                      <p className="text-gray-300">support@veerupro.com</p>
                      <p className="text-gray-400 text-sm">We&apos;ll respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Phone</h3>
                      <p className="text-gray-300">+91 98765 43210</p>
                      <p className="text-gray-400 text-sm">Mon-Fri, 9 AM - 6 PM IST</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Location</h3>
                      <p className="text-gray-300">Bangalore, India</p>
                      <p className="text-gray-400 text-sm">Remote-first learning platform</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Support Hours</h3>
                      <p className="text-gray-300">Monday - Friday: 9 AM - 6 PM IST</p>
                      <p className="text-gray-400 text-sm">Weekend: 10 AM - 4 PM IST</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Quick Links */}
              <div className="w3-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Quick Help
                </h3>
                <div className="space-y-3">
                  <a href="/faq" className="block text-blue-400 hover:text-blue-300 transition-colors">
                    → Frequently Asked Questions
                  </a>
                  <a href="/courses" className="block text-blue-400 hover:text-blue-300 transition-colors">
                    → Browse Our Courses
                  </a>
                  <a href="/dashboard" className="block text-blue-400 hover:text-blue-300 transition-colors">
                    → Access Your Dashboard
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="w3-card p-8">
              <h2 className="text-2xl font-semibold text-white mb-6">
                Send us a Message
              </h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="form-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="form-control"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="form-label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="form-control"
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="form-label">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="form-control"
                  >
                    <option value="">Select a topic</option>
                    <option value="course-inquiry">Course Inquiry</option>
                    <option value="technical-support">Technical Support</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="form-label">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="form-control resize-none"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}