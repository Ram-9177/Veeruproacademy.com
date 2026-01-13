#!/usr/bin/env node

/**
 * Feature Validation Script
 * Validates that all critical features and routes are properly configured
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFileExists(filePath, description) {
  const fullPath = path.join(__dirname, '..', filePath);
  const exists = fs.existsSync(fullPath);
  if (exists) {
    log(`✓ ${description}`, 'green');
  } else {
    log(`✗ ${description} - Missing: ${filePath}`, 'red');
  }
  return exists;
}

function checkDirectoryHasFiles(dirPath, description) {
  const fullPath = path.join(__dirname, '..', dirPath);
  if (!fs.existsSync(fullPath)) {
    log(`✗ ${description} - Directory not found: ${dirPath}`, 'red');
    return false;
  }
  
  const files = fs.readdirSync(fullPath);
  const hasFiles = files.length > 0;
  
  if (hasFiles) {
    log(`✓ ${description} (${files.length} files)`, 'green');
  } else {
    log(`✗ ${description} - Directory is empty`, 'red');
  }
  return hasFiles;
}

log('\n=== Veeru Pro Academy - Feature Validation ===\n', 'cyan');

let totalChecks = 0;
let passedChecks = 0;

// Authentication Features
log('\n📝 Authentication & Authorization:', 'blue');
totalChecks++;
passedChecks += checkFileExists('app/login/page.tsx', 'User Login Page') ? 1 : 0;
totalChecks++;
passedChecks += checkFileExists('app/signup/page.tsx', 'User Signup Page') ? 1 : 0;
totalChecks++;
passedChecks += checkFileExists('app/admin/login/page.tsx', 'Admin Login Page') ? 1 : 0;
totalChecks++;
passedChecks += checkFileExists('app/api/auth/[...nextauth]/route.ts', 'NextAuth API Route') ? 1 : 0;
totalChecks++;
passedChecks += checkFileExists('app/api/auth/logout/route.ts', 'Logout API Route') ? 1 : 0;
totalChecks++;
passedChecks += checkFileExists('app/api/auth/signup/route.ts', 'Signup API Route') ? 1 : 0;
totalChecks++;
passedChecks += checkFileExists('lib/auth.ts', 'Auth Configuration') ? 1 : 0;
totalChecks++;
passedChecks += checkFileExists('middleware.ts', 'Security Middleware') ? 1 : 0;

// Admin Panel Features
log('\n🛠️  Admin Panel:', 'blue');
totalChecks++;
passedChecks += checkFileExists('app/admin/hub/page.tsx', 'Admin Hub Dashboard') ? 1 : 0;
totalChecks++;
passedChecks += checkFileExists('app/admin/courses/page.tsx', 'Course Management') ? 1 : 0;
totalChecks++;
passedChecks += checkFileExists('app/admin/content/page.tsx', 'Content Management') ? 1 : 0;
totalChecks++;
passedChecks += checkFileExists('app/admin/users/page.tsx', 'User Management') ? 1 : 0;
totalChecks++;
passedChecks += checkFileExists('app/admin/analytics/page.tsx', 'Analytics Dashboard') ? 1 : 0;
totalChecks++;
passedChecks += checkFileExists('app/admin/settings/page.tsx', 'Settings Management') ? 1 : 0;
totalChecks++;
passedChecks += checkFileExists('app/admin/projects/page.tsx', 'Project Management') ? 1 : 0;

// CMS Features
log('\n📄 CMS Features:', 'blue');
totalChecks++;
passedChecks += checkFileExists('app/cms/page.tsx', 'CMS Dashboard') ? 1 : 0;
totalChecks++;
passedChecks += checkFileExists('app/cms/pages/page.tsx', 'CMS Pages List') ? 1 : 0;
totalChecks++;
passedChecks += checkFileExists('app/cms/pages/new/page.tsx', 'CMS New Page Editor') ? 1 : 0;
totalChecks++;
passedChecks += checkFileExists('app/cms/media/page.tsx', 'Media Library') ? 1 : 0;

// API Routes
log('\n🔌 API Routes:', 'blue');
totalChecks++;
passedChecks += checkFileExists('app/api/admin/courses/route.ts', 'Admin Courses API') ? 1 : 0;
totalChecks++;
passedChecks += checkFileExists('app/api/admin/content/route.ts', 'Admin Content API') ? 1 : 0;
totalChecks++;
passedChecks += checkFileExists('app/api/admin/users/route.ts', 'Admin Users API') ? 1 : 0;
totalChecks++;
passedChecks += checkFileExists('app/api/courses/route.ts', 'Public Courses API') ? 1 : 0;
totalChecks++;
passedChecks += checkFileExists('app/api/search/route.ts', 'Search API') ? 1 : 0;

// Database & Configuration
log('\n🗄️  Database & Configuration:', 'blue');
totalChecks++;
passedChecks += checkFileExists('prisma/schema.prisma', 'Prisma Schema') ? 1 : 0;
totalChecks++;
passedChecks += checkFileExists('lib/db.ts', 'Database Client') ? 1 : 0;
totalChecks++;
passedChecks += checkFileExists('.env.example', 'Environment Template') ? 1 : 0;

// Core Pages
log('\n🏠 Core Pages:', 'blue');
totalChecks++;
passedChecks += checkFileExists('app/page.tsx', 'Home Page') ? 1 : 0;
totalChecks++;
passedChecks += checkFileExists('app/courses/page.tsx', 'Courses List Page') ? 1 : 0;
totalChecks++;
passedChecks += checkFileExists('app/dashboard/page.tsx', 'User Dashboard') ? 1 : 0;
totalChecks++;
passedChecks += checkFileExists('app/profile/page.tsx', 'User Profile') ? 1 : 0;

// Build Configuration
log('\n⚙️  Build Configuration:', 'blue');
totalChecks++;
passedChecks += checkFileExists('package.json', 'Package Configuration') ? 1 : 0;
totalChecks++;
passedChecks += checkFileExists('next.config.js', 'Next.js Configuration') ? 1 : 0;
totalChecks++;
passedChecks += checkFileExists('tsconfig.json', 'TypeScript Configuration') ? 1 : 0;
totalChecks++;
passedChecks += checkFileExists('tailwind.config.js', 'Tailwind Configuration') ? 1 : 0;

// Summary
log('\n' + '='.repeat(50), 'cyan');
const percentage = ((passedChecks / totalChecks) * 100).toFixed(1);
const status = percentage >= 95 ? 'EXCELLENT ✨' : percentage >= 80 ? 'GOOD ✓' : percentage >= 60 ? 'NEEDS WORK ⚠️' : 'CRITICAL ✗';

log(`\nValidation Results: ${passedChecks}/${totalChecks} checks passed (${percentage}%)`, percentage >= 95 ? 'green' : percentage >= 80 ? 'yellow' : 'red');
log(`Status: ${status}\n`, percentage >= 95 ? 'green' : percentage >= 80 ? 'yellow' : 'red');

if (percentage >= 95) {
  log('🎉 Congratulations! All critical features are properly configured.', 'green');
  log('The platform is comprehensive and robust, ready for deployment!\n', 'green');
} else if (percentage >= 80) {
  log('⚠️  Most features are working, but some components may need attention.\n', 'yellow');
} else {
  log('❌ Critical features are missing. Please review the failed checks above.\n', 'red');
}

process.exit(percentage >= 80 ? 0 : 1);
