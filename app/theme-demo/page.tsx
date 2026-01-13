'use client'

/**
 * Theme Demo Page
 * 
 * This page demonstrates the new education theme in action
 * Visit: http://localhost:3000/theme-demo
 */

export default function ThemeDemoPage() {
  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="hero-bg py-24 md:py-32 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 font-semibold text-sm mb-6">
            <span>🎨</span>
            New Theme Demo
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6">
            Welcome to Your New
            <span className="block bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 bg-clip-text text-transparent">
              Education Platform
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            A professional, attractive, and consistent theme designed specifically for educational platforms. 
            Built with modern design principles and accessibility in mind.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="btn-primary px-8 py-4 rounded-xl font-semibold text-lg">
              Get Started
            </button>
            <button className="px-8 py-4 rounded-xl font-semibold text-lg border-2 border-primary-600 text-primary-600 hover:bg-primary-50 transition-all">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Why Choose Our Platform
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to succeed in your learning journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '🎓',
                title: 'Expert Instructors',
                description: 'Learn from industry professionals with years of real-world experience',
                color: 'primary'
              },
              {
                icon: '⚡',
                title: 'Interactive Learning',
                description: 'Hands-on projects and exercises to reinforce your knowledge',
                color: 'secondary'
              },
              {
                icon: '🏆',
                title: 'Certificates',
                description: 'Earn recognized certificates upon course completion',
                color: 'accent'
              },
              {
                icon: '💬',
                title: 'Community Support',
                description: 'Join thousands of learners in our active community',
                color: 'tertiary'
              },
              {
                icon: '📱',
                title: 'Learn Anywhere',
                description: 'Access courses on any device, anytime, anywhere',
                color: 'primary'
              },
              {
                icon: '🎯',
                title: 'Career Growth',
                description: 'Build skills that employers are actively seeking',
                color: 'secondary'
              }
            ].map((feature, index) => (
              <div key={index} className="feature-card">
                <div className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16 md:py-24 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Popular Courses
            </h2>
            <p className="text-lg text-slate-600">
              Learn now with our most popular courses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Web Development Bootcamp',
                category: 'Development',
                duration: '12 weeks',
                students: '2,450',
                rating: '4.9',
                image: 'from-primary-400 to-primary-600'
              },
              {
                title: 'Data Science Fundamentals',
                category: 'Data Science',
                duration: '10 weeks',
                students: '1,890',
                rating: '4.8',
                image: 'from-secondary-400 to-secondary-600'
              },
              {
                title: 'UI/UX Design Masterclass',
                category: 'Design',
                duration: '8 weeks',
                students: '3,120',
                rating: '4.9',
                image: 'from-tertiary-400 to-tertiary-600'
              }
            ].map((course, index) => (
              <div key={index} className="course-card overflow-hidden">
                <div className={`h-48 bg-gradient-to-br ${course.image} flex items-center justify-center`}>
                  <span className="text-6xl">📚</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-700">
                      {course.category}
                    </span>
                    <span className="text-sm text-slate-500">
                      {course.duration}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                    <span>⭐ {course.rating}</span>
                    <span>👥 {course.students} students</span>
                  </div>
                  <button className="btn-primary w-full py-3 rounded-xl font-semibold">
                    Learn Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-lg text-slate-600">
              Join thousands of successful learners worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '50K+', label: 'Active Students', icon: '👨‍🎓' },
              { value: '200+', label: 'Expert Instructors', icon: '👩‍🏫' },
              { value: '500+', label: 'Courses Available', icon: '📚' },
              { value: '95%', label: 'Success Rate', icon: '🎯' }
            ].map((stat, index) => (
              <div key={index} className="text-center p-8 bg-white rounded-2xl border border-slate-200 hover:shadow-lg transition-all">
                <div className="text-4xl mb-4">{stat.icon}</div>
                <div className="text-4xl font-bold text-slate-800 mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              What Our Students Say
            </h2>
            <p className="text-lg text-slate-600">
              Real stories from real students
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Web Developer',
                content: 'This platform transformed my career. The courses are well-structured and the instructors are amazing!',
                avatar: '👩'
              },
              {
                name: 'Michael Chen',
                role: 'Data Scientist',
                content: 'Best investment I\'ve made in my education. The hands-on projects really helped me land my dream job.',
                avatar: '👨'
              },
              {
                name: 'Emily Rodriguez',
                role: 'UX Designer',
                content: 'The community support is incredible. I learned so much from both instructors and fellow students.',
                avatar: '👩'
              }
            ].map((testimonial, index) => (
              <div key={index} className="testimonial-card p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-slate-600">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                <p className="text-slate-600 italic">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="mt-4 text-accent-500">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Learn?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of students already learning on our platform
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-50 transition-all">
              Create Free Account
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all">
              Browse Courses
            </button>
          </div>
        </div>
      </section>

      {/* Color Palette Reference */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Theme Color Palette
            </h2>
            <p className="text-slate-600">
              Professional colors designed for education
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="h-24 bg-primary-600 rounded-xl mb-3 flex items-center justify-center text-white font-bold">
                Primary
              </div>
              <p className="text-sm text-slate-600">Education Blue</p>
              <p className="text-xs text-slate-500">#2563eb</p>
            </div>
            <div className="text-center">
              <div className="h-24 bg-secondary-500 rounded-xl mb-3 flex items-center justify-center text-white font-bold">
                Secondary
              </div>
              <p className="text-sm text-slate-600">Success Green</p>
              <p className="text-xs text-slate-500">#10b981</p>
            </div>
            <div className="text-center">
              <div className="h-24 bg-accent-500 rounded-xl mb-3 flex items-center justify-center text-white font-bold">
                Accent
              </div>
              <p className="text-sm text-slate-600">Energy Orange</p>
              <p className="text-xs text-slate-500">#f59e0b</p>
            </div>
            <div className="text-center">
              <div className="h-24 bg-tertiary-600 rounded-xl mb-3 flex items-center justify-center text-white font-bold">
                Tertiary
              </div>
              <p className="text-sm text-slate-600">Creative Purple</p>
              <p className="text-xs text-slate-500">#8b5cf6</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
