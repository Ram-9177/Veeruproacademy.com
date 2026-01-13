/**
 * Comprehensive CMS Content Type Definitions for Veeru's Pro Academy
 * All page content should be driven by these types
 */

// ==================== COMMON TYPES ====================

export type CmsImage = {
  url: string
  alt: string
  width?: number
  height?: number
}

export type CmsLink = {
  label: string
  href: string
  icon?: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
}

export type CmsBadge = {
  label: string
  variant?: 'default' | 'success' | 'warning' | 'error'
}

// ==================== HERO SECTION ====================

export type CmsHeroSection = {
  badge?: CmsBadge
  title: string
  titleHighlight?: string
  subtitle?: string
  description: string
  primaryCta: CmsLink
  secondaryCta?: CmsLink
  image?: CmsImage
  stats?: Array<{
    label: string
    value: string
    icon?: string
  }>
  trust?: {
    studentsLabel?: string
    ratingLabel?: string
    avatarInitials?: string[]
    avatarImages?: string[]
    ratingStars?: number
  }
  backgroundVariant?: 'soft' | 'hero' | 'section'
}

// ==================== COURSE TYPES ====================

export type CmsDifficulty = 'Beginner' | 'Intermediate' | 'Advanced'

export type CmsTechStack = {
  name: string
  icon?: string
}

export type CmsCourseCard = {
  id: string
  slug: string
  title: string
  description: string
  image: CmsImage
  difficulty: CmsDifficulty
  duration: string
  price: string
  originalPrice?: string
  rating?: number
  students?: number
  lessons: number
  techStack: CmsTechStack[]
  features: string[]
  badge?: CmsBadge
  isLocked?: boolean
  isPremium?: boolean
  ctaLabel?: string
  ctaLink?: string
}

export type CmsCourseDetail = CmsCourseCard & {
  longDescription: string
  instructor?: {
    name: string
    avatar?: CmsImage
    title?: string
  }
  syllabus?: Array<{
    title: string
    description: string
    lessons: Array<{
      title: string
      duration: string
      isLocked?: boolean
    }>
  }>
  requirements?: string[]
  outcomes?: string[]
  includesAssets?: Array<{
    type: string
    count: string
    description?: string
  }>
  relatedCourses?: string[]
}

// ==================== PROJECT TYPES ====================

export type CmsProjectType = 'Dashboard' | 'Platform' | 'Mobile UI' | 'Website' | 'API'

export type CmsProjectCard = {
  id: string
  slug: string
  title: string
  description: string
  image: CmsImage
  difficulty: CmsDifficulty
  type: CmsProjectType
  price: string
  originalPrice?: string
  techStack: CmsTechStack[]
  features: string[]
  badge?: CmsBadge
  isLocked?: boolean
  assetsLink?: string
  upiPayment?: {
    merchantId: string
    merchantName: string
    note: string
  }
  ctaLabel?: string
  ctaLink?: string
}

export type CmsProjectDetail = CmsProjectCard & {
  longDescription: string
  demoUrl?: string
  repositoryUrl?: string
  documentation?: string
  screenshots?: CmsImage[]
  requirements?: string[]
  features: string[]
  implementation?: Array<{
    title: string
    description: string
    steps?: string[]
  }>
  assetsIncluded?: string[]
}

// ==================== TESTIMONIAL TYPES ====================

export type CmsTestimonial = {
  id: string
  name: string
  role: string
  company?: string
  avatar: CmsImage
  quote: string
  rating?: number
  badge?: CmsBadge
}

// ==================== STATS TYPES ====================

export type CmsStatCard = {
  label: string
  value: string
  description?: string
  icon?: string
  trend?: {
    value: string
    direction: 'up' | 'down'
  }
}

// ==================== FAQ TYPES ====================

export type CmsFaqItem = {
  id: string
  question: string
  answer: string
  category?: string
}

export type CmsFaqSection = {
  title: string
  description?: string
  items: CmsFaqItem[]
}

// ==================== TUTORIAL TYPES ====================

export type CmsTutorial = {
  id: string
  slug: string
  title: string
  description: string
  image: CmsImage
  difficulty: CmsDifficulty
  duration: string
  category: string
  tags: string[]
  author?: {
    name: string
    avatar?: CmsImage
  }
  publishedAt?: string
  content?: string
  videoUrl?: string
  codeSnippets?: Array<{
    title?: string
    language: string
    code: string
  }>
}

// ==================== NEWSLETTER TYPES ====================

export type CmsNewsletter = {
  title: string
  description: string
  placeholder?: string
  ctaLabel?: string
  benefits?: string[]
}

// ==================== PAGE CONTENT TYPES ====================

export type CmsPageContent = {
  slug: string
  title: string
  description?: string
  hero?: CmsHeroSection
  sections: CmsSection[]
}

export type CmsSectionType = 
  | 'hero'
  | 'courseList'
  | 'projectList'
  | 'featureGrid'
  | 'stats'
  | 'testimonials'
  | 'faq'
  | 'cta'
  | 'content'
  | 'sandbox'

export type CmsSection = {
  id: string
  type: CmsSectionType
  title?: string
  subtitle?: string
  description?: string
  backgroundVariant?: 'soft' | 'section' | 'card' | 'none'
  data?: any // Type-specific data based on section type
}

// ==================== HOMEPAGE CONTENT ====================

export type CmsHomePageContent = {
  hero: CmsHeroSection
  sections: {
    features?: {
      title: string
      subtitle?: string
      items: Array<{
        title: string
        description: string
        icon?: string
      }>
    }
    popularCourses?: {
      title: string
      subtitle?: string
      courses: CmsCourseCard[]
      viewAllLink?: string
    }
    projects?: {
      title: string
      subtitle?: string
      projects: CmsProjectCard[]
      viewAllLink?: string
    }
    stats?: {
      title?: string
      items: CmsStatCard[]
    }
    testimonials?: {
      title: string
      subtitle?: string
      items: CmsTestimonial[]
    }
    faq?: CmsFaqSection
    newsletter?: CmsNewsletter
  }
}

// ==================== COURSES PAGE ====================

export type CmsCoursesPageContent = {
  hero: CmsHeroSection
  filters?: {
    difficulty: CmsDifficulty[]
    categories: string[]
    techStack: string[]
  }
  courses: CmsCourseCard[]
}

// ==================== PROJECTS PAGE ====================

export type CmsProjectsPageContent = {
  hero: CmsHeroSection
  filters?: {
    difficulty: CmsDifficulty[]
    types: CmsProjectType[]
    techStack: string[]
  }
  projects: CmsProjectCard[]
}

// ==================== TUTORIALS PAGE ====================

export type CmsTutorialsPageContent = {
  hero: CmsHeroSection
  categories: string[]
  tutorials: CmsTutorial[]
}

// ==================== YOUTUBE EMBED ====================

export type CmsYouTubeVideo = {
  videoId: string
  title?: string
  thumbnail?: string
  autoplay?: boolean
}

// ==================== HELPER TYPES ====================

export type CmsStatus = 'draft' | 'published' | 'archived'

export type CmsMetadata = {
  createdAt: string
  updatedAt: string
  author?: string
  status: CmsStatus
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
    ogImage?: string
  }
}
