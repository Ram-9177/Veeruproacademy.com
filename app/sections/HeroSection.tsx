import Link from 'next/link'
import { BookOpen, Users, Award, TrendingUp } from 'lucide-react'

interface HeroStats {
  courses: number
  students: number
  projects: number
}

export function HeroSection({ stats }: { stats?: HeroStats }) {
  const { courses = 0, students = 0, projects = 0 } = stats || {}
  
  return (
    <section className="w3-section bg-gray-900 py-10 md:py-16">
      <div className="w3-container max-w-6xl mx-auto px-6">
        {/* Welcome Message - Centered and Compact */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight max-w-5xl mx-auto">
            Welcome to <span className="text-blue-400">Veeru&apos;s Pro Academy</span>
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-10">
            Master programming with <strong className="text-white">FREE courses</strong> and 
            <strong className="text-blue-400"> premium projects</strong>. 
            Learn coding skills step by step with practical examples.
          </p>

          {/* Key Benefits - Better Spacing */}
          <div className="flex flex-wrap justify-center gap-4 mb-10 text-sm max-w-5xl mx-auto">
            <div className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              <span className="text-white font-semibold">FREE Courses</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              <span className="text-white font-semibold">Premium Projects</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-600 px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              <span className="text-white font-semibold">Special Classes</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
              <span className="text-gray-300">Mobile Friendly</span>
            </div>
          </div>

          {/* Call to Action Buttons - Better Alignment */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 max-w-md mx-auto">
            <Link
              href="/courses"
              className="btn btn-primary text-base px-8 py-4 inline-flex items-center justify-center gap-3 font-semibold flex-1 sm:flex-none"
            >
              <BookOpen className="w-5 h-5" />
              <span>Start Learning FREE</span>
            </Link>
            <Link
              href="/projects"
              className="btn btn-secondary text-base px-8 py-4 inline-flex items-center justify-center gap-3 font-semibold flex-1 sm:flex-none"
            >
              <Award className="w-5 h-5" />
              <span>Buy Premium Projects</span>
            </Link>
          </div>
        </div>

        {/* Quick Stats - Improved Grid Layout */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-16 max-w-4xl mx-auto">
          <div className="text-center group">
            <div className="bg-blue-900 w-20 h-20 lg:w-24 lg:h-24 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-10 h-10 lg:w-12 lg:h-12 text-blue-400" />
            </div>
            <div className="text-3xl lg:text-4xl font-bold text-white mb-2">{courses > 0 ? courses : '50+'}</div>
            <div className="text-sm lg:text-base text-gray-400 font-medium">Programming Courses</div>
          </div>
          <div className="text-center group">
            <div className="bg-green-900 w-20 h-20 lg:w-24 lg:h-24 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-10 h-10 lg:w-12 lg:h-12 text-green-400" />
            </div>
            <div className="text-3xl lg:text-4xl font-bold text-white mb-2">{students > 0 ? `${students}+` : '10K+'}</div>
            <div className="text-sm lg:text-base text-gray-400 font-medium">Happy Students</div>
          </div>
          <div className="text-center group">
            <div className="bg-yellow-900 w-20 h-20 lg:w-24 lg:h-24 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Award className="w-10 h-10 lg:w-12 lg:h-12 text-yellow-400" />
            </div>
            <div className="text-3xl lg:text-4xl font-bold text-white mb-2">{projects > 0 ? projects : '100+'}</div>
            <div className="text-sm lg:text-base text-gray-400 font-medium">Hands-on Projects</div>
          </div>
          <div className="text-center group">
            <div className="bg-purple-900 w-20 h-20 lg:w-24 lg:h-24 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-10 h-10 lg:w-12 lg:h-12 text-purple-400" />
            </div>
            <div className="text-3xl lg:text-4xl font-bold text-white mb-2">95%</div>
            <div className="text-sm lg:text-base text-gray-400 font-medium">Success Rate</div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="max-w-5xl mx-auto">
          <div className="w3-card p-10 lg:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Why Choose Veeru&apos;s Pro Academy?
              </h2>
              <p className="text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Join thousands of students who have transformed their careers with our proven learning approach
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
              <div className="text-center">
                <div className="w-18 h-18 lg:w-20 lg:h-20 bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl lg:text-3xl">📚</span>
                </div>
                <h3 className="text-xl lg:text-2xl font-semibold text-white mb-4">Simple & Clear Learning</h3>
                <p className="text-gray-400 leading-relaxed text-base lg:text-lg">
                  Easy-to-follow tutorials with step-by-step explanations, just like W3Schools and GeeksforGeeks. 
                  No confusing jargon, just clear learning paths.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-18 h-18 lg:w-20 lg:h-20 bg-green-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl lg:text-3xl">💻</span>
                </div>
                <h3 className="text-xl lg:text-2xl font-semibold text-white mb-4">Practical Learning</h3>
                <p className="text-gray-400 leading-relaxed text-base lg:text-lg">
                  Learn by building real projects and applications. Every concept is reinforced with 
                  hands-on coding exercises you can practice immediately.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-18 h-18 lg:w-20 lg:h-20 bg-red-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl lg:text-3xl">🎥</span>
                </div>
                <h3 className="text-xl lg:text-2xl font-semibold text-white mb-4">YouTube Integration</h3>
                <p className="text-gray-400 leading-relaxed text-base lg:text-lg">
                  Watch comprehensive video tutorials on our YouTube channel and follow along with 
                  detailed written guides for complete understanding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}