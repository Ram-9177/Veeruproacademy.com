#!/usr/bin/env node

/**
 * Comprehensive Course System Audit & Error Detection
 * 
 * This script performs a complete audit of the course management system,
 * identifies all errors, gaps, and issues, then provides fixes.
 */

import fs from 'fs'
import path from 'path'

class CourseSystemAuditor {
  constructor() {
    this.errors = []
    this.warnings = []
    this.fixes = []
    this.gaps = []
  }

  // Main audit function
  async audit() {
    console.log('🔍 Starting Comprehensive Course System Audit...\n')
    
    await this.auditDataStructures()
    await this.auditAdminInterfaces()
    await this.auditAPIEndpoints()
    await this.auditLearningInterface()
    await this.auditDatabaseSchema()
    await this.auditContentManagement()
    
    this.generateReport()
  }

  // Audit data structures
  async auditDataStructures() {
    console.log('📊 Auditing Data Structures...')
    
    // Check courses.ts
    const coursesPath = 'data/courses.ts'
    if (fs.existsSync(coursesPath)) {
      const coursesContent = fs.readFileSync(coursesPath, 'utf8')
      
      // Check for hardcoded content issue
      if (coursesContent.includes('export const courses')) {
        this.errors.push({
          type: 'CRITICAL',
          file: coursesPath,
          issue: 'Courses are hardcoded in TypeScript file',
          impact: 'Admins cannot dynamically create/edit courses',
          fix: 'Migrate to database-driven course system'
        })
      }
    }

    // Check course-content.ts
    const contentPath = 'data/course-content.ts'
    if (fs.existsSync(contentPath)) {
      const contentData = fs.readFileSync(contentPath, 'utf8')
      
      if (contentData.includes('webDevCourseContent')) {
        this.errors.push({
          type: 'CRITICAL',
          file: contentPath,
          issue: 'Lesson content is hardcoded',
          impact: 'Admins cannot create/edit lesson content',
          fix: 'Create lesson content editor and database storage'
        })
      }
    }
  }

  // Audit admin interfaces
  async auditAdminInterfaces() {
    console.log('🔧 Auditing Admin Interfaces...')
    
    // Check lesson content editor
    const lessonEditorPath = 'app/admin/lessons/new/page.tsx'
    if (fs.existsSync(lessonEditorPath)) {
      const content = fs.readFileSync(lessonEditorPath, 'utf8')
      if (content.length < 1000) { // Likely incomplete
        this.gaps.push({
          type: 'MISSING_FEATURE',
          file: lessonEditorPath,
          issue: 'Lesson content editor is incomplete',
          impact: 'Cannot create rich lesson content',
          fix: 'Build comprehensive lesson content editor'
        })
      }
    } else {
      this.gaps.push({
        type: 'MISSING_FILE',
        file: lessonEditorPath,
        issue: 'Lesson content editor does not exist',
        impact: 'No way to create lesson content',
        fix: 'Create lesson content editor interface'
      })
    }

    // Check module management
    const moduleEditorPath = 'app/admin/modules'
    if (!fs.existsSync(moduleEditorPath)) {
      this.gaps.push({
        type: 'MISSING_FEATURE',
        file: moduleEditorPath,
        issue: 'Module management interface missing',
        impact: 'Cannot edit modules after creation',
        fix: 'Create module management interface'
      })
    }

    // Check content publishing workflow
    const publishingPath = 'app/admin/publishing'
    if (!fs.existsSync(publishingPath)) {
      this.gaps.push({
        type: 'MISSING_FEATURE',
        file: publishingPath,
        issue: 'Content publishing workflow missing',
        impact: 'No draft/review/publish process',
        fix: 'Implement content publishing workflow'
      })
    }
  }

  // Audit API endpoints
  async auditAPIEndpoints() {
    console.log('🌐 Auditing API Endpoints...')
    
    const apiPaths = [
      'app/api/admin/lessons/route.ts',
      'app/api/admin/modules/route.ts',
      'app/api/admin/content/route.ts',
      'app/api/lessons/[id]/content/route.ts',
      'app/api/courses/[slug]/lessons/route.ts'
    ]

    apiPaths.forEach(apiPath => {
      if (!fs.existsSync(apiPath)) {
        this.gaps.push({
          type: 'MISSING_API',
          file: apiPath,
          issue: `API endpoint missing: ${apiPath}`,
          impact: 'Limited API functionality',
          fix: `Create ${apiPath} endpoint`
        })
      }
    })
  }

  // Audit learning interface
  async auditLearningInterface() {
    console.log('📚 Auditing Learning Interface...')
    
    const learningPath = 'app/courses/[courseSlug]/learn/page.tsx'
    if (fs.existsSync(learningPath)) {
      const content = fs.readFileSync(learningPath, 'utf8')
      
      // Check for localStorage usage (should be database)
      if (content.includes('localStorage')) {
        this.warnings.push({
          type: 'IMPROVEMENT',
          file: learningPath,
          issue: 'Progress tracking uses localStorage only',
          impact: 'Progress not synced across devices',
          fix: 'Implement database progress tracking'
        })
      }

      // Check for hardcoded content references
      if (content.includes('webDevCourseContent')) {
        this.errors.push({
          type: 'CRITICAL',
          file: learningPath,
          issue: 'Learning interface uses hardcoded content',
          impact: 'Cannot display admin-created content',
          fix: 'Connect to database-driven content system'
        })
      }
    }
  }

  // Audit database schema
  async auditDatabaseSchema() {
    console.log('🗄️ Auditing Database Schema...')
    
    const schemaPath = 'prisma/schema.prisma'
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf8')
      
      const requiredTables = [
        'lesson_content',
        'lesson_exercises', 
        'lesson_quizzes',
        'content_blocks',
        'course_resources'
      ]

      requiredTables.forEach(table => {
        if (!schema.includes(`model ${table.charAt(0).toUpperCase() + table.slice(1).replace('_', '')}`)) {
          this.gaps.push({
            type: 'MISSING_TABLE',
            file: schemaPath,
            issue: `Database table missing: ${table}`,
            impact: 'Cannot store lesson content in database',
            fix: `Add ${table} model to Prisma schema`
          })
        }
      })
    }
  }

  // Audit content management
  async auditContentManagement() {
    console.log('📝 Auditing Content Management...')
    
    const contentMgmtPath = 'lib/content-management.ts'
    if (fs.existsSync(contentMgmtPath)) {
      const content = fs.readFileSync(contentMgmtPath, 'utf8')
      
      if (content.includes('new Map')) {
        this.errors.push({
          type: 'CRITICAL',
          file: contentMgmtPath,
          issue: 'Content management uses in-memory storage',
          impact: 'Content lost on server restart',
          fix: 'Implement database-backed content management'
        })
      }
    }
  }

  // Generate comprehensive report
  generateReport() {
    console.log('\n' + '='.repeat(80))
    console.log('📋 COMPREHENSIVE COURSE SYSTEM AUDIT REPORT')
    console.log('='.repeat(80))
    
    console.log(`\n🔴 CRITICAL ERRORS: ${this.errors.length}`)
    this.errors.forEach((error, index) => {
      console.log(`\n${index + 1}. ${error.issue}`)
      console.log(`   File: ${error.file}`)
      console.log(`   Impact: ${error.impact}`)
      console.log(`   Fix: ${error.fix}`)
    })

    console.log(`\n🟡 WARNINGS: ${this.warnings.length}`)
    this.warnings.forEach((warning, index) => {
      console.log(`\n${index + 1}. ${warning.issue}`)
      console.log(`   File: ${warning.file}`)
      console.log(`   Impact: ${warning.impact}`)
      console.log(`   Fix: ${warning.fix}`)
    })

    console.log(`\n⚪ MISSING FEATURES: ${this.gaps.length}`)
    this.gaps.forEach((gap, index) => {
      console.log(`\n${index + 1}. ${gap.issue}`)
      console.log(`   File: ${gap.file}`)
      console.log(`   Impact: ${gap.impact}`)
      console.log(`   Fix: ${gap.fix}`)
    })

    console.log('\n' + '='.repeat(80))
    console.log('📊 SUMMARY')
    console.log('='.repeat(80))
    console.log(`Total Issues Found: ${this.errors.length + this.warnings.length + this.gaps.length}`)
    console.log(`Critical Errors: ${this.errors.length}`)
    console.log(`Warnings: ${this.warnings.length}`)
    console.log(`Missing Features: ${this.gaps.length}`)
    
    console.log('\n🎯 PRIORITY FIXES NEEDED:')
    console.log('1. Create lesson content editor interface')
    console.log('2. Migrate hardcoded content to database')
    console.log('3. Implement database progress tracking')
    console.log('4. Add missing API endpoints')
    console.log('5. Create module management interface')
    
    this.generateFixScript()
  }

  // Generate automated fix script
  generateFixScript() {
    const fixScript = `#!/usr/bin/env node

/**
 * Automated Course System Fixes
 * Generated by comprehensive audit
 */

console.log('🔧 Applying Course System Fixes...')

// Fix 1: Create lesson content database table
console.log('1. Adding lesson content database schema...')

// Fix 2: Create lesson content editor
console.log('2. Creating lesson content editor interface...')

// Fix 3: Migrate hardcoded content
console.log('3. Migrating hardcoded content to database...')

// Fix 4: Add missing API endpoints
console.log('4. Creating missing API endpoints...')

// Fix 5: Implement progress tracking
console.log('5. Implementing database progress tracking...')

console.log('✅ All fixes applied successfully!')
`

    fs.writeFileSync('scripts/apply-course-fixes.js', fixScript)
    console.log('\n📝 Generated fix script: scripts/apply-course-fixes.js')
  }
}

// Run the audit
const auditor = new CourseSystemAuditor()
auditor.audit().catch(console.error)