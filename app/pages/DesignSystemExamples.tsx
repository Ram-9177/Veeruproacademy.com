/**
 * EDUCATION PLATFORM - EXAMPLE PAGE LAYOUTS
 * Complete page structures using the design system components
 */

// ============================================================================
// 1. HOME PAGE / LANDING PAGE
// ============================================================================

export const HomePage = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EduPlatform - Learn Anything</title>
  <link rel="stylesheet" href="/styles/design-system.css">
</head>
<body>
  <!-- NAVBAR -->
  <nav class="sticky top-0 z-40 bg-white border-b border-gray-200 backdrop-blur-sm bg-white/95">
    <div class="container-lg mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center gap-2">
          <div class="w-10 h-10 bg-gradient-to-br from-indigo-600 to-teal-500 rounded-lg flex items-center justify-center shadow-md">
            <span class="text-white font-bold">📚</span>
          </div>
          <span class="hidden sm:inline font-display text-xl font-bold text-gray-900">
            EduPlatform
          </span>
        </div>
        
        <div class="hidden md:flex items-center gap-8">
          <a href="/courses" class="text-sm font-medium text-gray-700 hover:text-indigo-600 transition duration-200">Courses</a>
          <a href="/dashboard" class="text-sm font-medium text-gray-700 hover:text-indigo-600 transition duration-200">Dashboard</a>
          <a href="/community" class="text-sm font-medium text-gray-700 hover:text-indigo-600 transition duration-200">Community</a>
        </div>
        
        <div class="flex items-center gap-3">
          <button class="hidden sm:inline btn-ghost btn-sm">Sign In</button>
          <button class="btn-primary btn-sm">Get Started</button>
        </div>
      </div>
    </div>
  </nav>

  <!-- HERO SECTION -->
  <section class="relative overflow-hidden gradient-hero py-20 sm:py-32 lg:py-40">
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
    </div>
    
    <div class="relative container-lg mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div class="space-y-8">
          <div class="space-y-4">
            <div class="inline-block px-4 py-2 rounded-full bg-white/20 border border-white/40">
              <span class="text-xs font-bold text-white">🎓 Learn Something New</span>
            </div>
            <h1 class="display-lg text-white">Master Skills Online</h1>
            <p class="text-xl text-white/90 max-w-md">Learn from industry experts at your own pace. Start free today.</p>
          </div>
          
          <div class="flex gap-4">
            <button class="btn-primary bg-white text-indigo-600 hover:shadow-lg">Explore Courses</button>
            <button class="px-8 py-3 border-2 border-white text-white rounded-lg font-bold transition duration-200 hover:bg-white/10">Watch Demo</button>
          </div>
        </div>
        
        <div class="relative h-96 gradient-card rounded-3xl border border-white/20 shadow-2xl flex items-center justify-center">
          <div class="text-6xl">📱</div>
        </div>
      </div>
    </div>
  </section>

  <!-- FEATURED COURSES SECTION -->
  <section class="py-16 sm:py-24">
    <div class="container-lg mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      <div class="space-y-4">
        <h2 class="display-md text-gray-900">Featured Courses</h2>
        <p class="body-lg text-gray-600 max-w-2xl">Handpicked programs designed by industry experts</p>
      </div>
      
      <!-- Filter Pills -->
      <div class="flex flex-wrap gap-3 pb-8 border-b border-gray-200">
        <button class="pill-active">All Courses</button>
        <button class="pill">Web Dev</button>
        <button class="pill">Mobile</button>
        <button class="pill">Design</button>
      </div>
      
      <!-- Course Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <!-- Course Card 1 -->
        <div class="group relative overflow-hidden card card-hover rounded-2xl">
          <div class="relative h-48 overflow-hidden gradient-card">
            <div class="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100"></div>
            <div class="gradient-overlay absolute inset-0"></div>
            <div class="absolute top-4 right-4">
              <span class="badge-info bg-white/90">Featured</span>
            </div>
          </div>
          
          <div class="p-6 space-y-4">
            <div class="space-y-2">
              <h3 class="heading-3 text-gray-900 line-clamp-2">Introduction to Web Development</h3>
              <p class="body-sm text-gray-600 line-clamp-2">Learn HTML, CSS, and JavaScript from scratch</p>
            </div>
            
            <div class="flex items-center justify-between text-xs text-gray-600 gap-4">
              <span>📊 12 Lessons</span>
              <span>⏱️ 8 weeks</span>
            </div>
            
            <div class="pt-4 border-t border-gray-200 flex items-center justify-between">
              <div class="flex -space-x-2">
                <div class="w-8 h-8 rounded-full border-2 border-white bg-indigo-100"></div>
              </div>
              <button class="btn-primary btn-sm">Enroll</button>
            </div>
          </div>
        </div>

        <!-- Course Card 2 -->
        <div class="group relative overflow-hidden card card-hover rounded-2xl">
          <div class="relative h-48 overflow-hidden gradient-card">
            <div class="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-100"></div>
            <div class="gradient-overlay absolute inset-0"></div>
          </div>
          
          <div class="p-6 space-y-4">
            <div class="space-y-2">
              <h3 class="heading-3 text-gray-900 line-clamp-2">React Fundamentals</h3>
              <p class="body-sm text-gray-600 line-clamp-2">Master modern React development patterns</p>
            </div>
            
            <div class="flex items-center justify-between text-xs text-gray-600 gap-4">
              <span>📊 15 Lessons</span>
              <span>⏱️ 6 weeks</span>
            </div>
            
            <div class="pt-4 border-t border-gray-200 flex items-center justify-between">
              <div class="flex -space-x-2">
                <div class="w-8 h-8 rounded-full border-2 border-white bg-emerald-100"></div>
              </div>
              <button class="btn-primary btn-sm">Enroll</button>
            </div>
          </div>
        </div>

        <!-- Course Card 3 -->
        <div class="group relative overflow-hidden card card-hover rounded-2xl">
          <div class="relative h-48 overflow-hidden gradient-card">
            <div class="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100"></div>
            <div class="gradient-overlay absolute inset-0"></div>
          </div>
          
          <div class="p-6 space-y-4">
            <div class="space-y-2">
              <h3 class="heading-3 text-gray-900 line-clamp-2">UI/UX Design Masterclass</h3>
              <p class="body-sm text-gray-600 line-clamp-2">Create beautiful and functional interfaces</p>
            </div>
            
            <div class="flex items-center justify-between text-xs text-gray-600 gap-4">
              <span>📊 18 Lessons</span>
              <span>⏱️ 10 weeks</span>
            </div>
            
            <div class="pt-4 border-t border-gray-200 flex items-center justify-between">
              <div class="flex -space-x-2">
                <div class="w-8 h-8 rounded-full border-2 border-white bg-amber-100"></div>
              </div>
              <button class="btn-primary btn-sm">Enroll</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="bg-gray-900 text-white py-16">
    <div class="container-lg mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-teal-500 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold">📚</span>
            </div>
            <span class="font-display text-lg font-bold">EduPlatform</span>
          </div>
          <p class="body-sm text-gray-400">Empowering learners worldwide</p>
        </div>
        
        <div class="space-y-3">
          <h4 class="font-semibold text-white">Explore</h4>
          <ul class="space-y-2 text-sm text-gray-400">
            <li><a href="#" class="hover:text-white transition">Courses</a></li>
            <li><a href="#" class="hover:text-white transition">Categories</a></li>
          </ul>
        </div>
        
        <div class="space-y-3">
          <h4 class="font-semibold text-white">Company</h4>
          <ul class="space-y-2 text-sm text-gray-400">
            <li><a href="#" class="hover:text-white transition">About</a></li>
            <li><a href="#" class="hover:text-white transition">Blog</a></li>
          </ul>
        </div>
        
        <div class="space-y-3">
          <h4 class="font-semibold text-white">Support</h4>
          <ul class="space-y-2 text-sm text-gray-400">
            <li><a href="#" class="hover:text-white transition">Help</a></li>
            <li><a href="#" class="hover:text-white transition">Contact</a></li>
          </ul>
        </div>
      </div>
      
      <div class="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-sm text-gray-400">© 2025 EduPlatform. All rights reserved.</p>
      </div>
    </div>
  </footer>
</body>
</html>
`;

// ============================================================================
// 2. STUDENT DASHBOARD PAGE
// ============================================================================

export const DashboardPage = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard - EduPlatform</title>
  <link rel="stylesheet" href="/styles/design-system.css">
</head>
<body>
  <!-- NAVBAR (Same as before) -->

  <!-- MAIN CONTENT -->
  <main class="min-h-screen bg-gray-50">
    <div class="container-lg mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <!-- Welcome Header -->
      <div class="space-y-2">
        <h1 class="display-md text-gray-900">Welcome back, Student Name!</h1>
        <p class="body-lg text-gray-600">You have 3 courses in progress</p>
      </div>
      
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <!-- Stat Card 1 -->
        <div class="card rounded-xl p-6 space-y-3">
          <div class="flex items-center justify-between">
            <span class="label text-gray-600">Hours Learning</span>
            <span class="text-2xl">⏱️</span>
          </div>
          <div class="text-3xl font-bold text-gray-900">24.5</div>
          <div class="text-xs text-emerald-600 font-semibold">+2.5 this week</div>
        </div>
        
        <!-- Stat Card 2 -->
        <div class="card rounded-xl p-6 space-y-3">
          <div class="flex items-center justify-between">
            <span class="label text-gray-600">Courses</span>
            <span class="text-2xl">📚</span>
          </div>
          <div class="text-3xl font-bold text-gray-900">3</div>
          <div class="text-xs text-gray-600 font-semibold">In Progress</div>
        </div>
        
        <!-- Stat Card 3 -->
        <div class="card rounded-xl p-6 space-y-3">
          <div class="flex items-center justify-between">
            <span class="label text-gray-600">Certificates</span>
            <span class="text-2xl">🏆</span>
          </div>
          <div class="text-3xl font-bold text-gray-900">2</div>
          <div class="text-xs text-emerald-600 font-semibold">Earned</div>
        </div>
        
        <!-- Stat Card 4 -->
        <div class="card rounded-xl p-6 space-y-3">
          <div class="flex items-center justify-between">
            <span class="label text-gray-600">Streak</span>
            <span class="text-2xl">🔥</span>
          </div>
          <div class="text-3xl font-bold text-gray-900">7</div>
          <div class="text-xs text-gray-600 font-semibold">Days</div>
        </div>
      </div>
      
      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Courses In Progress -->
        <div class="lg:col-span-2 space-y-6">
          <h2 class="heading-1 text-gray-900">Courses in Progress</h2>
          
          <!-- Progress Card 1 -->
          <div class="card card-hover rounded-xl overflow-hidden">
            <div class="h-32 gradient-card"></div>
            <div class="p-6 space-y-4">
              <h3 class="heading-3 text-gray-900">React Fundamentals</h3>
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
                <button class="btn-primary btn-sm">Continue</button>
              </div>
            </div>
          </div>
          
          <!-- Progress Card 2 -->
          <div class="card card-hover rounded-xl overflow-hidden">
            <div class="h-32 bg-gradient-to-br from-emerald-100 to-teal-100"></div>
            <div class="p-6 space-y-4">
              <h3 class="heading-3 text-gray-900">Web Design Essentials</h3>
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Progress</span>
                  <span class="font-semibold text-gray-900">40%</span>
                </div>
                <div class="w-full progress-bar">
                  <div class="progress-fill" style="width: 40%;"></div>
                </div>
              </div>
              <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                <span class="text-xs text-gray-600">Module 2 of 5</span>
                <button class="btn-primary btn-sm">Continue</button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Sidebar: Achievements -->
        <div class="space-y-6">
          <h2 class="heading-1 text-gray-900">Achievements</h2>
          <div class="grid grid-cols-2 gap-4">
            
            <!-- Achievement Badge -->
            <div class="relative w-full aspect-square">
              <div class="absolute inset-0 bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl border-4 border-amber-300 p-4 flex flex-col items-center justify-center text-center space-y-2 hover:shadow-lg transition">
                <div class="text-3xl">🌟</div>
                <div class="text-xs font-bold text-amber-900">Quick<br/>Learner</div>
              </div>
            </div>
            
            <!-- Achievement Badge -->
            <div class="relative w-full aspect-square">
              <div class="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl border-4 border-blue-300 p-4 flex flex-col items-center justify-center text-center space-y-2 hover:shadow-lg transition">
                <div class="text-3xl">🚀</div>
                <div class="text-xs font-bold text-blue-900">Getting<br/>Started</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</body>
</html>
`;

// ============================================================================
// 3. LESSON PAGE WITH SIDEBAR
// ============================================================================

export const LessonPage = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lesson - EduPlatform</title>
  <link rel="stylesheet" href="/styles/design-system.css">
</head>
<body>
  <!-- NAVBAR -->

  <!-- MAIN CONTENT -->
  <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
    
    <!-- Sidebar Navigation -->
    <div class="lg:col-span-1">
      <div class="sticky top-20 card rounded-xl overflow-hidden max-h-[calc(100vh-100px)]">
        
        <!-- Module Header -->
        <div class="p-4 border-b border-gray-200 bg-gray-50">
          <h3 class="text-sm font-bold text-gray-900">Module 3: Advanced Topics</h3>
        </div>
        
        <!-- Lesson List -->
        <div class="overflow-y-auto">
          <div class="space-y-1 p-2">
            
            <!-- Active Lesson -->
            <a href="#" class="px-4 py-3 rounded-lg bg-indigo-100 border-l-4 border-indigo-600 text-indigo-700 font-medium text-sm transition duration-200">
              Lesson 1: Introduction
            </a>
            
            <!-- Completed Lesson -->
            <a href="#" class="px-4 py-3 rounded-lg text-gray-700 text-sm hover:bg-gray-100 transition duration-200 flex items-center gap-2">
              <span class="text-emerald-500">✓</span>
              Lesson 2: Basics
            </a>
            
            <!-- Locked Lesson -->
            <a href="#" class="px-4 py-3 rounded-lg text-gray-400 text-sm cursor-not-allowed flex items-center gap-2">
              <span>🔒</span>
              Lesson 3: Advanced
            </a>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Main Content -->
    <div class="lg:col-span-3 space-y-6">
      
      <!-- Video Player -->
      <div class="bg-black rounded-2xl overflow-hidden shadow-lg aspect-video flex items-center justify-center">
        <div class="flex flex-col items-center gap-4">
          <div class="text-6xl">▶️</div>
          <span class="text-white text-sm font-medium">Video Player Area</span>
        </div>
      </div>
      
      <!-- Lesson Details -->
      <div class="card rounded-xl p-8 space-y-6">
        
        <!-- Title & Meta -->
        <div class="space-y-4">
          <h1 class="heading-1 text-gray-900">Lesson Title: Advanced Concepts</h1>
          <div class="flex items-center gap-4 text-gray-600">
            <span class="text-sm">⏱️ 45 minutes</span>
            <span class="text-sm">📝 3 exercises</span>
            <span class="badge-advanced">Advanced</span>
          </div>
        </div>
        
        <!-- Description -->
        <div class="space-y-4">
          <p class="body-md text-gray-700">
            In this lesson, you'll learn advanced concepts and techniques that will take your skills to the next level.
            We'll cover best practices, performance optimization, and real-world applications.
          </p>
          <ul class="space-y-2 text-gray-700">
            <li class="flex gap-2">
              <span>✓</span>
              <span>Understanding core principles</span>
            </li>
            <li class="flex gap-2">
              <span>✓</span>
              <span>Practical implementation strategies</span>
            </li>
            <li class="flex gap-2">
              <span>✓</span>
              <span>Common pitfalls and solutions</span>
            </li>
          </ul>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex gap-4 pt-4 border-t border-gray-200">
          <button class="btn-primary btn-lg">Next Lesson</button>
          <button class="btn-ghost btn-lg">Download Materials</button>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;

export const EducationPlatformLayouts = {
  HomePage,
  DashboardPage,
  LessonPage,
};
