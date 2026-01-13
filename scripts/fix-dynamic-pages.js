#!/usr/bin/env node

import fs from 'fs'
import path from 'path'

// List of admin pages that need dynamic export
const adminPages = [
  'app/admin/page.tsx',
  'app/admin/hub/page.tsx',
  'app/admin/users/page.tsx',
  'app/admin/courses/page.tsx',
  'app/admin/courses/new/page.tsx',
  'app/admin/projects/page.tsx',
  'app/admin/projects/new/page.tsx',
  'app/admin/projects/unlocks/page.tsx',
  'app/admin/content/page.tsx',
  'app/admin/content/new/page.tsx',
  'app/admin/sandbox/page.tsx',
  'app/admin/sandbox/new/page.tsx',
  'app/admin/analytics/page.tsx',
  'app/admin/settings/page.tsx',
  'app/admin/realtime/page.tsx',
  'app/admin/navbar/page.tsx',
  'app/admin/lessons/page.tsx',
  'app/admin/lessons/new/page.tsx',
  'app/admin/audit/page.tsx',
  'app/admin/dashboard/page.tsx',
  'app/admin/payment-requests/page.tsx',
  'app/admin/testimonials/page.tsx',
  'app/cms/page.tsx',
  'app/cms/pages/page.tsx',
  'app/cms/pages/new/page.tsx',
  'app/cms/media/page.tsx'
]

function addDynamicExport(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`)
    return
  }

  const content = fs.readFileSync(filePath, 'utf8')
  
  // Check if already has dynamic export
  if (content.includes('export const dynamic')) {
    console.log(`✅ Already has dynamic export: ${filePath}`)
    return
  }

  // Find the first export default function line
  const lines = content.split('\n')
  let insertIndex = -1
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('export default') && (lines[i].includes('function') || lines[i].includes('async function'))) {
      insertIndex = i
      break
    }
  }

  if (insertIndex === -1) {
    console.log(`⚠️  Could not find export default function in: ${filePath}`)
    return
  }

  // Insert dynamic export before the function
  lines.splice(insertIndex, 0, '', 'export const dynamic = \'force-dynamic\'')
  
  const newContent = lines.join('\n')
  fs.writeFileSync(filePath, newContent)
  console.log(`✅ Added dynamic export to: ${filePath}`)
}

console.log('🔧 Adding dynamic exports to admin pages...')

adminPages.forEach(addDynamicExport)

console.log('✅ Dynamic export fixes completed!')