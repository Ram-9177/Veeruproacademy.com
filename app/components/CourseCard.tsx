import { Course } from '@/app/types/course'
import { cn } from '@/lib/utils'
import { Clock, BookOpen, Star, Award, Zap } from 'lucide-react'
import Link from 'next/link'

type Props = {
  course: Course
  accent?: boolean
}

export function CourseCard({ course, accent }: Props) {
  const isHighlighted = course.highlight || accent
  const isFree = !course.price || course.price === 0
  const hasDiscount = course.originalPrice && course.price && course.price < course.originalPrice

  return (
    <article className={cn(
      "group relative flex flex-col overflow-hidden rounded-3xl transition-all duration-300 w-full max-w-[320px] sm:max-w-none",
      "bg-white/5 border border-white/10 p-6 hover:bg-white/10 hover:scale-105 backdrop-blur-sm",
      isHighlighted && "ring-2 ring-blue-400/50 bg-blue-500/10"
    )}>
      {/* Highlight Badge */}
      {isHighlighted && (
        <div className="absolute -top-2 -right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
          <Star className="w-3 h-3 fill-current" />
          Popular
        </div>
      )}

      {/* Free Badge */}
      {isFree && (
        <div className="absolute top-4 left-4 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
          FREE
        </div>
      )}

      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute top-4 right-4 bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
          {Math.round(((course.originalPrice! - course.price!) / course.originalPrice!) * 100)}% OFF
        </div>
      )}

      {/* Course Thumbnail/Icon */}
      <div className="mb-6 relative">
        <div className="w-full h-48 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
          <span className="text-6xl">
            {course.language === 'JavaScript' ? '🟨' : 
             course.language === 'Python' ? '🐍' : 
             course.language === 'TypeScript' ? '🔷' : 
             course.language === 'UI/UX' ? '🎨' : 
             course.language === 'Data' ? '📊' : 
             course.language === 'AI' ? '🤖' : '📚'}
          </span>
        </div>
        
        {/* Level and Language Tags */}
        <div className="flex items-center gap-2 mb-3">
          <span className={cn(
            "px-2 py-1 text-xs rounded-full font-medium",
            course.level === 'Beginner' && "bg-green-500/20 text-green-300",
            course.level === 'Intermediate' && "bg-yellow-500/20 text-yellow-300",
            course.level === 'Advanced' && "bg-red-500/20 text-red-300"
          )}>
            {course.level}
          </span>
          {course.language && (
            <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full font-medium">
              {course.language}
            </span>
          )}
        </div>
      </div>

      {/* Course Info */}
      <div className="flex-1">
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
          {course.title}
        </h3>
        <p className="text-white/70 text-sm line-clamp-3 mb-4 leading-relaxed">
          {course.description}
        </p>

        {/* Course Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Clock className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <BookOpen className="w-4 h-4" />
            <span>{course.lessons} lessons</span>
          </div>
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Award className="w-4 h-4" />
            <span>{course.projects} projects</span>
          </div>
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Zap className="w-4 h-4" />
            <span>Certificate</span>
          </div>
        </div>

        {/* Tools/Technologies */}
        {course.tools && course.tools.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {course.tools.slice(0, 3).map((tool, index) => (
                <span key={index} className="px-2 py-1 bg-white/5 text-white/60 rounded text-xs">
                  {tool}
                </span>
              ))}
              {course.tools.length > 3 && (
                <span className="px-2 py-1 bg-white/5 text-white/60 rounded text-xs">
                  +{course.tools.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {course.tags && course.tags.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-1">
              {course.tags.slice(0, 2).map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pricing and CTA */}
      <div className="mt-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="text-right">
            {isFree ? (
              <div className="text-2xl font-bold text-green-400">Free</div>
            ) : (
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  ₹{course.price?.toLocaleString()}
                </div>
                {hasDiscount && (
                  <div className="text-sm text-white/40 line-through">
                    ₹{course.originalPrice?.toLocaleString()}
                  </div>
                )}
              </div>
            )}
          </div>
          {course.instructor && (
            <div className="text-left">
              <div className="text-xs text-white/60">Instructor</div>
              <div className="text-sm font-medium text-white">{course.instructor.name}</div>
            </div>
          )}
        </div>

        <Link 
          href={`/courses/${course.slug}`}
          className={cn(
            "block w-full text-center py-3 rounded-lg font-semibold transition-all duration-300",
            "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 hover:shadow-lg hover:shadow-blue-600/25",
            isHighlighted && "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          )}
        >
          {isFree ? 'Start Learning' : 'Learn Now'}
        </Link>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl" />
    </article>
  )
}