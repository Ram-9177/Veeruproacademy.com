/**
 * EDUCATION PLATFORM - COMPONENT TEMPLATES
 * Ready-to-use HTML/JSX components following the design system
 */

// ============================================================================
// 1. NAVIGATION COMPONENTS
// ============================================================================

/**
 * STICKY NAVBAR WITH LOGO + MENU + AUTH
 */
export const NavbarTemplate = `
<nav class="sticky top-0 z-40 bg-white border-b border-gray-200 backdrop-blur-sm bg-white/95">
  <div class="container-lg mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      
      <!-- Logo -->
      <div class="flex items-center gap-2">
        <div class="w-10 h-10 bg-gradient-to-br from-indigo-600 to-teal-500 rounded-lg flex items-center justify-center shadow-md">
          <span class="text-white font-bold text-lg">📚</span>
        </div>
        <span class="hidden sm:inline font-display text-xl font-bold text-gray-900">
          EduPlatform
        </span>
      </div>
      
      <!-- Menu (Desktop) -->
      <div class="hidden md:flex items-center gap-8">
        <a href="/courses" class="text-sm font-medium text-gray-700 hover:text-indigo-600 transition duration-200">
          Courses
        </a>
        <a href="/dashboard" class="text-sm font-medium text-gray-700 hover:text-indigo-600 transition duration-200">
          Dashboard
        </a>
        <a href="/community" class="text-sm font-medium text-gray-700 hover:text-indigo-600 transition duration-200">
          Community
        </a>
      </div>
      
      <!-- Auth Buttons -->
      <div class="flex items-center gap-3">
        <button class="hidden sm:inline btn-ghost btn-sm">
          Sign In
        </button>
        <button class="btn-primary btn-sm">
          Get Started
        </button>
        
        <!-- Mobile Menu Button -->
        <button class="md:hidden btn-icon">
          ☰
        </button>
      </div>
    </div>
  </div>
</nav>
`;

// ============================================================================
// 2. HERO SECTIONS
// ============================================================================

/**
 * GRADIENT HERO WITH CTA
 */
export const HeroTemplate = `
<section class="relative overflow-hidden gradient-hero py-20 sm:py-32 lg:py-40">
  
  <!-- Decorative Elements -->
  <div class="absolute inset-0 overflow-hidden">
    <div class="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
    <div class="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
  </div>
  
  <!-- Content -->
  <div class="relative container-lg mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      
      <!-- Left: Text -->
      <div class="space-y-8">
        <div class="space-y-4">
          <div class="inline-block px-4 py-2 rounded-full bg-white/20 border border-white/40">
            <span class="text-xs font-bold text-white">🎓 Learn Something New</span>
          </div>
          <h1 class="display-lg text-white">
            Master Skills Online
          </h1>
          <p class="text-xl text-white/90 max-w-md">
            Learn from industry experts at your own pace. Start free today.
          </p>
        </div>
        
        <!-- CTA Buttons -->
        <div class="flex gap-4">
          <button class="btn-primary bg-white text-indigo-600 hover:shadow-lg hover:scale-105">
            Explore Courses
          </button>
          <button class="px-8 py-3 border-2 border-white text-white rounded-lg font-bold transition duration-200 hover:bg-white/10">
            Watch Demo
          </button>
        </div>
      </div>
      
      <!-- Right: Visual -->
      <div class="relative h-96 gradient-card rounded-3xl border border-white/20 shadow-2xl flex items-center justify-center">
        <div class="text-6xl">📱</div>
      </div>
    </div>
  </div>
</section>
`;

// ============================================================================
// 3. COURSE CARDS
// ============================================================================

/**
 * COURSE CARD WITH IMAGE, INFO, AND ENROLLMENT
 */
export const CourseCardTemplate = `
<div class="group relative overflow-hidden card card-hover rounded-2xl">
  
  <!-- Image Container -->
  <div class="relative h-48 overflow-hidden gradient-card">
    <img src="/placeholder-course.jpg" alt="Course Title"
      class="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
    <div class="gradient-overlay absolute inset-0"></div>
    
    <!-- Badge -->
    <div class="absolute top-4 right-4">
      <span class="badge-info bg-white/90">
        Featured
      </span>
    </div>
  </div>
  
  <!-- Content -->
  <div class="p-6 space-y-4">
    <div class="space-y-2">
      <h3 class="heading-3 text-gray-900 line-clamp-2">
        Introduction to Web Development
      </h3>
      <p class="body-sm text-gray-600 line-clamp-2">
        Learn HTML, CSS, and JavaScript from scratch
      </p>
    </div>
    
    <!-- Meta -->
    <div class="flex items-center justify-between text-xs text-gray-600 gap-4">
      <span class="flex items-center gap-1">📊 12 Lessons</span>
      <span class="flex items-center gap-1">⏱️ 8 weeks</span>
    </div>
    
    <!-- Footer -->
    <div class="pt-4 border-t border-gray-200 flex items-center justify-between">
      <div class="flex -space-x-2">
        <img src="/avatar-1.jpg" alt="Teacher" class="w-8 h-8 rounded-full border-2 border-white" />
      </div>
      <button class="btn-primary btn-sm">
        Enroll
      </button>
    </div>
  </div>
</div>
`;

/**
 * LESSON CARD (COMPACT)
 */
export const LessonCardTemplate = `
<div class="group relative overflow-hidden card rounded-xl cursor-pointer transition duration-200 hover:shadow-md">
  
  <div class="p-4 space-y-3">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div>
        <span class="badge-info bg-indigo-100 text-indigo-700">
          Lesson 1
        </span>
      </div>
      <span class="text-2xl group-hover:scale-110 transition duration-200">▶️</span>
    </div>
    
    <!-- Title -->
    <h4 class="heading-3 text-gray-900">
      Getting Started Basics
    </h4>
    
    <!-- Meta -->
    <div class="flex items-center gap-4 text-xs text-gray-600">
      <span>⏱️ 45 min</span>
      <span>📝 3 exercises</span>
    </div>
    
    <!-- Progress -->
    <div class="w-full h-2 progress-bar">
      <div class="progress-fill" style="width: 75%;"></div>
    </div>
  </div>
</div>
`;

// ============================================================================
// 4. DASHBOARD COMPONENTS
// ============================================================================

/**
 * STAT CARD (For Dashboard)
 */
export const StatCardTemplate = `
<div class="card rounded-xl p-6 space-y-3">
  <div class="flex items-center justify-between">
    <span class="label text-gray-600">Hours Learning</span>
    <span class="text-2xl">⏱️</span>
  </div>
  <div class="text-3xl font-bold text-gray-900">24.5</div>
  <div class="text-xs text-emerald-600 font-semibold">+2.5 this week</div>
</div>
`;

/**
 * COURSE PROGRESS CARD (For Dashboard)
 */
export const ProgressCardTemplate = `
<div class="card card-hover rounded-xl overflow-hidden">
  <div class="h-32 gradient-card"></div>
  <div class="p-6 space-y-4">
    <h3 class="heading-3 text-gray-900">
      React Fundamentals
    </h3>
    <div class="space-y-2">
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Progress</span>
        <span class="font-semibold text-gray-900">65%</span>
      </div>
      <div class="w-full progress-bar">
        <div class="progress-fill" style="width: 65%;"></div>
      </div>
    </div>
    <div class="flex items-center justify-between pt-4 border-t border-gray-200">
      <span class="text-xs text-gray-600">Module 4 of 6</span>
      <button class="btn-primary btn-sm">
        Continue
      </button>
    </div>
  </div>
</div>
`;

/**
 * ACHIEVEMENT BADGE
 */
export const AchievementBadgeTemplate = `
<div class="relative w-32 h-40">
  <div class="absolute inset-0 bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl border-4 border-amber-300 shadow-lg hover:shadow-xl transition duration-300 flex flex-col items-center justify-center p-4 text-center space-y-2">
    <div class="text-4xl">🏆</div>
    <div>
      <div class="text-xs font-bold text-amber-900">Quick Learner</div>
      <div class="text-[10px] text-amber-700">Unlocked</div>
    </div>
  </div>
</div>
`;

// ============================================================================
// 5. FORM COMPONENTS
// ============================================================================

/**
 * INPUT FIELD
 */
export const InputFieldTemplate = `
<div class="space-y-2">
  <label class="label text-gray-900">Email Address</label>
  <input type="email" placeholder="your@email.com"
    class="input" />
</div>
`;

/**
 * TEXTAREA
 */
export const TextareaTemplate = `
<div class="space-y-2">
  <label class="label text-gray-900">Message</label>
  <textarea placeholder="Type your message here..."
    class="textarea h-32" rows="4"></textarea>
</div>
`;

/**
 * SELECT DROPDOWN
 */
export const SelectTemplate = `
<div class="space-y-2">
  <label class="label text-gray-900">Difficulty Level</label>
  <select class="select">
    <option disabled selected>Choose a level...</option>
    <option>Beginner</option>
    <option>Intermediate</option>
    <option>Advanced</option>
  </select>
</div>
`;

// ============================================================================
// 6. MODAL COMPONENTS
// ============================================================================

/**
 * MODAL DIALOG
 */
export const ModalTemplate = `
<div class="modal-overlay">
  <div class="modal-content">
    
    <!-- Header -->
    <div class="modal-header">
      <h3 class="heading-2 text-gray-900">Confirm Action</h3>
      <button class="btn-icon">✕</button>
    </div>
    
    <!-- Body -->
    <div class="modal-body">
      <p class="body-md text-gray-700">
        Are you sure you want to proceed with this action?
      </p>
    </div>
    
    <!-- Footer -->
    <div class="modal-footer">
      <button class="flex-1 btn-secondary btn-sm">
        Cancel
      </button>
      <button class="flex-1 btn-primary btn-sm">
        Confirm
      </button>
    </div>
  </div>
</div>
`;

// ============================================================================
// 7. FILTER & NAVIGATION PILLS
// ============================================================================

/**
 * CATEGORY FILTER PILLS
 */
export const FilterPillsTemplate = `
<div class="flex flex-wrap gap-3 pb-8 border-b border-gray-200">
  <button class="pill-active">All Courses</button>
  <button class="pill">Web Development</button>
  <button class="pill">Mobile App</button>
  <button class="pill">Data Science</button>
  <button class="pill">Design</button>
</div>
`;

// ============================================================================
// 8. FOOTER COMPONENTS
// ============================================================================

/**
 * MAIN FOOTER
 */
export const FooterTemplate = `
<footer class="bg-gray-900 text-white py-16">
  <div class="container-lg mx-auto px-4 sm:px-6 lg:px-8">
    
    <!-- Main Grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
      
      <!-- Brand -->
      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-teal-500 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold">📚</span>
          </div>
          <span class="font-display text-lg font-bold">EduPlatform</span>
        </div>
        <p class="body-sm text-gray-400">
          Empowering learners worldwide with quality education.
        </p>
      </div>
      
      <!-- Links Column 1 -->
      <div class="space-y-3">
        <h4 class="font-semibold text-white">Explore</h4>
        <ul class="space-y-2 text-sm text-gray-400">
          <li><a href="#" class="hover:text-white transition">Courses</a></li>
          <li><a href="#" class="hover:text-white transition">Categories</a></li>
          <li><a href="#" class="hover:text-white transition">Instructors</a></li>
        </ul>
      </div>
      
      <!-- Links Column 2 -->
      <div class="space-y-3">
        <h4 class="font-semibold text-white">Company</h4>
        <ul class="space-y-2 text-sm text-gray-400">
          <li><a href="#" class="hover:text-white transition">About</a></li>
          <li><a href="#" class="hover:text-white transition">Blog</a></li>
          <li><a href="#" class="hover:text-white transition">Careers</a></li>
        </ul>
      </div>
      
      <!-- Links Column 3 -->
      <div class="space-y-3">
        <h4 class="font-semibold text-white">Support</h4>
        <ul class="space-y-2 text-sm text-gray-400">
          <li><a href="#" class="hover:text-white transition">Help Center</a></li>
          <li><a href="#" class="hover:text-white transition">Contact</a></li>
          <li><a href="#" class="hover:text-white transition">Privacy</a></li>
        </ul>
      </div>
    </div>
    
    <!-- Bottom Bar -->
    <div class="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p class="text-sm text-gray-400">
        © 2025 EduPlatform. All rights reserved.
      </p>
      <div class="flex gap-4">
        <a href="#" class="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition">
          f
        </a>
        <a href="#" class="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition">
          𝕏
        </a>
      </div>
    </div>
  </div>
</footer>
`;

// ============================================================================
// 9. BADGES & TAGS
// ============================================================================

/**
 * STATUS BADGES
 */
export const BadgeTemplate = `
<div class="flex flex-wrap gap-4">
  <span class="badge-success">✓ Completed</span>
  <span class="badge-warning">⏳ In Progress</span>
  <span class="badge-error">✕ Not Started</span>
  <span class="badge-info">ℹ️ New</span>
</div>
`;

/**
 * DIFFICULTY BADGES
 */
export const DifficultyBadgeTemplate = `
<div class="flex flex-wrap gap-3">
  <span class="badge-beginner">Beginner</span>
  <span class="badge-intermediate">Intermediate</span>
  <span class="badge-advanced">Advanced</span>
</div>
`;

// ============================================================================
// 10. PROGRESS INDICATORS
// ============================================================================

/**
 * LINEAR PROGRESS BAR
 */
export const ProgressBarTemplate = `
<div class="space-y-2">
  <div class="flex items-center justify-between">
    <span class="label text-gray-900">Course Progress</span>
    <span class="text-xs text-gray-600">65%</span>
  </div>
  <div class="w-full progress-bar">
    <div class="progress-fill" style="width: 65%;"></div>
  </div>
</div>
`;

/**
 * CIRCULAR PROGRESS (SVG)
 */
export const ProgressRingTemplate = `
<div class="relative w-24 h-24">
  <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="45" stroke="#E5E7EB" stroke-width="8" fill="none" />
    <circle cx="50" cy="50" r="45" stroke="#4F46E5" stroke-width="8" fill="none"
      stroke-dasharray="212" stroke-dashoffset="53" stroke-linecap="round" />
  </svg>
  <div class="absolute inset-0 flex items-center justify-center">
    <div class="text-center">
      <div class="text-2xl font-bold text-gray-900">75%</div>
      <div class="text-xs text-gray-600">Complete</div>
    </div>
  </div>
</div>
`;

// ============================================================================
// EXPORT ALL TEMPLATES
// ============================================================================

export const EducationPlatformTemplates = {
  NavbarTemplate,
  HeroTemplate,
  CourseCardTemplate,
  LessonCardTemplate,
  StatCardTemplate,
  ProgressCardTemplate,
  AchievementBadgeTemplate,
  InputFieldTemplate,
  TextareaTemplate,
  SelectTemplate,
  ModalTemplate,
  FilterPillsTemplate,
  FooterTemplate,
  BadgeTemplate,
  DifficultyBadgeTemplate,
  ProgressBarTemplate,
  ProgressRingTemplate,
};
