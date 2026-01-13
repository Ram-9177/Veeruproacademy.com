import { createRequire } from 'module'
import fs from 'fs'
import path from 'path'

const require = createRequire(import.meta.url)
const src = require.resolve('axe-core/axe.min.js')
const dest = path.join(process.cwd(), 'tests', 'assets', 'axe.min.js')

fs.mkdirSync(path.dirname(dest), { recursive: true })
const content = fs.readFileSync(src, 'utf8')
fs.writeFileSync(dest, content, 'utf8')
console.log('wrote', dest)
