'use client'

import { Users, Award, BookOpen, Heart, Zap, Target, Globe, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

/* eslint-disable react/no-unescaped-entities */
export default function AboutPage() {
  const stats = [
    { number: '50K+', label: 'Students Taught', icon: Users },
    { number: '200+', label: 'Courses Created', icon: BookOpen },
    { number: '95%', label: 'Success Rate', icon: Award },
    { number: '24/7', label: 'Support Available', icon: Heart }
  ]

  const team = [
    {
      name: 'Veeru Kumar',
      role: 'Founder & Lead Instructor',
      image: '/api/placeholder/300/300',
      bio: 'Full-stack developer with 8+ years of experience in web development and education.',
      skills: ['React', 'Node.js', 'Python', 'AI/ML']
    },
    {
      name: 'Sarah Johnson',
      role: 'Senior Developer & Mentor',
      image: '/api/placeholder/300/300',
      bio: 'Former Google engineer passionate about teaching modern web technologies.',
      skills: ['TypeScript', 'Next.js', 'Cloud', 'DevOps']
    },
    {
      name: 'Alex Chen',
      role: 'UI/UX Design Lead',
      image: '/api/placeholder/300/300',
      bio: 'Design expert focused on creating beautiful and intuitive learning experiences.',
      skills: ['Figma', 'Design Systems', 'User Research', 'Prototyping']
    }
  ]

  const values = [
    {
      icon: Target,
      title: 'Mission-Driven',
      description: 'Empowering students with practical skills that land jobs in the tech industry.'
    },
    {
      icon: Zap,
      title: 'Innovation First',
      description: 'Using cutting-edge teaching methods and the latest technologies in our curriculum.'
    },
    {
      icon: Globe,
      title: 'Global Community',
      description: 'Building a worldwide network of developers who support and learn from each other.'
    },
    {
      icon: Heart,
      title: 'Student Success',
      description: 'Every decision we make is focused on helping our students achieve their goals.'
    }
  ]

  return (
    <main className="min-h-screen bg-gray-900">{/* Same theme as home page */}
      {/* Hero Section - W3Schools Style */}
      <section className="w3-section bg-blue-600">
        <div className="w3-container text-center text-white">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-semibold mb-6">
            <Heart className="w-4 h-4" />
            Our Story
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            About VeeruPro
          </h1>
          <p className="text-2xl md:text-3xl font-semibold text-white/90 mb-8">
            Transforming Lives Through Code
          </p>

          {/* Description */}
          <p className="text-xl text-white/80 mb-12 leading-relaxed max-w-4xl mx-auto">
            We're on a mission to make quality programming education accessible to everyone. 
            From complete beginners to advanced developers, we provide the tools, knowledge, 
            and community support needed to succeed in the tech industry.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.number}</div>
                  <div className="text-white/80 text-sm">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Mission Section - W3Schools Style */}
      <section className="w3-section bg-gray-800">
        <div className="w3-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Our Mission & Values
            </h2>
            <p className="text-xl max-w-3xl mx-auto text-gray-300">
              We believe that everyone deserves access to quality education and the opportunity 
              to build a successful career in technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div
                  key={index}
                  className="w3-card p-8 text-center hover:border-blue-500 transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white">
                    {value.title}
                  </h3>
                  <p className="leading-relaxed text-gray-400">
                    {value.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Section - W3Schools Style */}
      <section className="w3-section bg-gray-900">
        <div className="w3-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Meet Our Team
            </h2>
            <p className="text-xl max-w-3xl mx-auto text-gray-300">
              Passionate educators and industry experts dedicated to your success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="w3-card p-8 text-center hover:border-blue-500 transition-all duration-300"
              >
                <div className="w-32 h-32 bg-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-bold text-white">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">
                  {member.name}
                </h3>
                <p className="text-blue-400 font-semibold mb-4">
                  {member.role}
                </p>
                <p className="mb-6 leading-relaxed text-gray-400">
                  {member.bio}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {member.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-3 py-1 bg-blue-900 text-blue-300 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section - W3Schools Style */}
      <section className="w3-section bg-gray-800">
        <div className="w3-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
                Our Story
              </h2>
              <div className="space-y-6 text-lg text-gray-300">
                <p>
                  VeeruPro Academy started in 2020 with a simple vision: make quality programming 
                  education accessible to everyone, regardless of their background or location.
                </p>
                <p>
                  What began as a small online tutoring service has grown into a comprehensive 
                  learning platform serving over 50,000 students worldwide. We've helped thousands 
                  of students land their dream jobs at top tech companies.
                </p>
                <p>
                  Today, we continue to innovate in education technology, creating interactive 
                  learning experiences that make complex programming concepts easy to understand 
                  and apply in real-world scenarios.
                </p>
              </div>
              <div className="mt-8">
                <Link
                  href="/courses"
                  className="btn btn-primary text-lg px-8 py-4 inline-flex items-center gap-3"
                >
                  <BookOpen className="w-6 h-6" />
                  Learn Now
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="w3-card p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                    <span className="text-xl font-semibold text-white">
                      Industry-Relevant Curriculum
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                    <span className="text-xl font-semibold text-white">
                      Hands-on Project Experience
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                    <span className="text-xl font-semibold text-white">
                      Career Support & Mentorship
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                    <span className="text-xl font-semibold text-white">
                      Lifetime Learning Community
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - W3Schools Style */}
      <section className="w3-section bg-gray-900">
        <div className="w3-container">
          <div className="w3-card bg-blue-600 p-12 text-white text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Start Your Journey?
              </h2>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Join thousands of students who have transformed their careers with VeeruPro Academy. 
                Your future in tech starts here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/courses"
                  className="btn bg-white text-blue-600 hover:bg-gray-100 font-bold text-lg px-10 py-4"
                >
                  Browse Courses
                </Link>
                <Link
                  href="/contact"
                  className="btn btn-outline border-white text-white hover:bg-white/10 font-bold text-lg px-10 py-4"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}