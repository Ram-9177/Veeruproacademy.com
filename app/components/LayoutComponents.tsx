'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './Button.tsx';
import { Card } from './Card.tsx';
import { Badge } from './Badge.tsx';
import { Pill } from './UIComponents.tsx';

/* ========== NAVBAR COMPONENT ========== */
interface NavBarProps {
  logo?: string;
  logoText?: string;
  links?: Array<{ label: string; href: string }>;
  onAuthClick?: () => void;
  sticky?: boolean;
}

export const NavBar: React.FC<NavBarProps> = ({
  logo,
  logoText = 'Veeru',
  links = [
    { label: 'Courses', href: '/courses' },
    { label: 'Lessons', href: '/lessons' },
    { label: 'Dashboard', href: '/dashboard' },
  ],
  onAuthClick,
  sticky = true,
}) => {
  return (
    <nav
      className={`${sticky ? 'sticky top-0 z-40' : ''} bg-white border-b border-neutral-200 shadow-sm`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            {logo && <Image src={logo} alt="Logo" className="h-8 w-8" width={32} height={32} />}
            <span className="text-xl font-bold text-indigo-600 group-hover:text-indigo-700 transition-colors">
              {logoText}
            </span>
          </Link>

          {/* Links - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-neutral-700 hover:text-indigo-600 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onAuthClick}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

/* ========== HERO COMPONENT ========== */
interface HeroProps {
  title: string;
  subtitle?: string;
  cta?: { label: string; onClick?: () => void }[];
  bgImage?: string;
}

export const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  cta,
  bgImage,
}) => {
  return (
    <section className="relative overflow-hidden bg-grid-pattern min-h-[600px] flex items-center">
      {bgImage && (
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      )}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="display-xl text-neutral-900 mb-6 animate-slide-in-up">
          {title}
        </h1>
        {subtitle && (
          <p className="body-lg text-neutral-700 mb-8 max-w-2xl mx-auto animate-slide-in-up animation-delay-1">
            {subtitle}
          </p>
        )}
        {cta && (
          <div className="flex flex-wrap items-center justify-center gap-4 animate-slide-in-up animation-delay-2">
            {cta.map((button, idx) => (
              <Button
                key={idx}
                variant={idx === 0 ? 'primary' : 'ghost'}
                size="lg"
                onClick={button.onClick}
              >
                {button.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

/* ========== COURSE GRID COMPONENT ========== */
interface Course {
  title: string;
  description: string;
  image?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  students?: number;
  rating?: number;
  price?: number;
  free?: boolean;
  // eslint-disable-next-line no-unused-vars
  id: string;
}

interface CourseGridProps {
  courses: Course[];
  columns?: 2 | 3 | 4;
}

export const CourseGrid: React.FC<CourseGridProps> = ({
  courses,
  columns = 3,
}) => {
  const colsClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  const difficultyToTone: Record<'beginner' | 'intermediate' | 'advanced', 'green' | 'primary' | 'secondary-2'> = {
    beginner: 'green',
    intermediate: 'primary',
    advanced: 'secondary-2',
  };

  return (
    <section className="section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`grid ${colsClass[columns]} gap-6`}>
          {courses.map((course, idx) => (
            <div
              key={course.id}
              className="animate-fade-in"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <Card variant="default">
                {course.image && (
                  <div className="relative h-48 mb-4 -mx-6 -mt-6 rounded-t-xl overflow-hidden">
                    <Image
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                )}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="heading-3 text-neutral-900 flex-1">
                      {course.title}
                    </h3>
                    {course.difficulty && (
                      <Badge tone={difficultyToTone[course.difficulty]}>
                        {course.difficulty}
                      </Badge>
                    )}
                  </div>
                  <p className="body-sm text-neutral-600">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
                    <div className="flex items-center gap-4 text-xs text-neutral-600">
                      {course.students && <span>{course.students.toLocaleString()} students</span>}
                      {course.rating && <span>⭐ {course.rating}</span>}
                    </div>
                    {course.price !== undefined && (
                      <span className="font-semibold text-indigo-600">
                        {course.free ? 'Free' : `$${course.price}`}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ========== DASHBOARD STATS COMPONENT ========== */
interface Stat {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: number;
  color?: 'indigo' | 'teal' | 'emerald' | 'amber';
}

interface DashboardStatsProps {
  stats: Stat[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const colorClasses = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    teal: 'bg-teal-50 text-teal-600 border-teal-200',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <Card key={idx} className={`border ${colorClasses[stat.color || 'indigo']}`}>
          <div className="space-y-3">
            {stat.icon && <div className="text-2xl">{stat.icon}</div>}
            <div>
              <p className="label text-neutral-600">{stat.label}</p>
              <p className="heading-2 text-neutral-900 mt-1">{stat.value}</p>
            </div>
            {stat.trend !== undefined && (
              <p className={`text-xs font-semibold ${stat.trend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {stat.trend >= 0 ? '↑' : '↓'} {Math.abs(stat.trend)}% from last month
              </p>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

/* ========== LESSON SIDEBAR COMPONENT ========== */
interface Lesson {
  id: string;
  title: string;
  duration?: number;
  completed?: boolean;
  locked?: boolean;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface LessonSidebarProps {
  modules: Module[];
  activeLessonId?: string;
  onLessonClick?: (_lessonId: string) => void;
}

export const LessonSidebar: React.FC<LessonSidebarProps> = ({
  modules,
  activeLessonId,
  onLessonClick,
}) => {
  const [expandedModules, setExpandedModules] = React.useState<Set<string>>(
    new Set(modules.map((m) => m.id))
  );

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    newExpanded.has(moduleId) ? newExpanded.delete(moduleId) : newExpanded.add(moduleId);
    setExpandedModules(newExpanded);
  };

  return (
    <aside className="w-64 bg-neutral-50 border-r border-neutral-200 overflow-y-auto">
      <div className="p-6 space-y-6">
        {modules.map((module) => (
          <div key={module.id}>
            <button
              onClick={() => toggleModule(module.id)}
              className="w-full flex items-center justify-between font-semibold text-neutral-900 hover:text-indigo-600 transition-colors"
            >
              {module.title}
              <span className={`transition-transform ${expandedModules.has(module.id) ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {expandedModules.has(module.id) && (
              <div className="mt-3 space-y-2 pl-4 border-l border-neutral-300">
                {module.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => onLessonClick?.(lesson.id)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-all ${
                      activeLessonId === lesson.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    } ${lesson.locked ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">{lesson.title}</span>
                      {lesson.completed && <span className="text-lg">✓</span>}
                      {lesson.locked && <span className="text-lg">🔒</span>}
                    </div>
                    {lesson.duration && (
                      <span className="text-xs opacity-70">{lesson.duration} min</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

/* ========== FOOTER COMPONENT ========== */
interface FooterProps {
  sections?: Array<{ title: string; links: Array<{ label: string; href: string }> }>;
  socialLinks?: Array<{ icon: string; href: string }>;
}

export const Footer: React.FC<FooterProps> = ({
  sections = [
    {
      title: 'Product',
      links: [
        { label: 'Courses', href: '/courses' },
        { label: 'Pricing', href: '/pricing' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact' },
      ],
    },
  ],
  socialLinks = [
    { icon: '/icons/facebook.svg', href: 'https://facebook.com' },
    { icon: '/icons/twitter.svg', href: 'https://twitter.com' },
    { icon: '/icons/instagram.svg', href: 'https://instagram.com' },
  ],
}) => {
  return (
    <footer className="bg-white border-t border-neutral-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:justify-between">
          {/* Company Info */}
          <div className="mb-8 md:mb-0">
            <div className="mb-4">
              <Image src="/logo.svg" alt="Veeru" width={120} height={40} />
            </div>
            <p className="text-sm text-neutral-600">
              &copy; 2025 Veeru. Learn, grow, succeed.
            </p>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
            {sections.map((section) => (
              <div key={section.title}>
                <h4 className="text-sm font-semibold text-neutral-900 mb-3">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-neutral-700 hover:text-indigo-600 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-8 border-t border-neutral-200 pt-6">
          <div className="flex justify-center gap-4">
            {socialLinks.map((social) => (
              <Link key={social.href} href={social.href} className="text-neutral-600 hover:text-indigo-600 transition-colors">
                <Image src={social.icon} alt="" width={24} height={24} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

/* ========== FILTER PILLS COMPONENT ========== */
interface FilterPillsProps {
  options: Array<{ label: string; value: string }>;
  selectedValues: Set<string>;
  onChange: (_value: string) => void;
}

export const FilterPills: React.FC<FilterPillsProps> = ({
  options,
  selectedValues: _selectedValues,
  onChange,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <Pill
          key={option.value}
          onClick={() => onChange(option.value)}
          className="cursor-pointer"
        >
          {option.label}
        </Pill>
      ))}
    </div>
  );
};
