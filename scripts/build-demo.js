#!/usr/bin/env node
/**
 * Build demo for GitHub Pages deployment.
 *
 * Copies demo source files to docs/demo/, rewriting relative paths
 * so they work in the docs/ deployment root.
 *
 * Source:  demo/
 * Dest:    docs/demo/
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const src = path.join(rootDir, 'demo')
const dest = path.join(rootDir, 'docs', 'demo')

// Ensure destination directory exists
fs.mkdirSync(dest, { recursive: true })

// Files to copy from demo/ to docs/demo/
const files = [
  { src: 'index.html', dest: 'index.html', pathRewrite: [['href="style.css"', 'href="../style.css"']] },
  { src: 'style.css',  dest: 'style.css',  pathRewrite: null },
  { src: 'fire-assessment-form.html', dest: 'fire-assessment-form.html', pathRewrite: null },
  { src: 'form-components.js', dest: 'form-components.js', pathRewrite: null },
  { src: 'form-schema.json',  dest: 'form-schema.json',  pathRewrite: null },
]

let copied = 0
for (const { src: srcFile, dest: destFile, pathRewrite } of files) {
  const srcPath = path.join(src, srcFile)
  const destPath = path.join(dest, destFile)

  if (!fs.existsSync(srcPath)) {
    console.error(`  SKIP (not found): ${srcPath}`)
    continue
  }

  let content = fs.readFileSync(srcPath, 'utf8')

  if (pathRewrite) {
    for (const [find, replace] of pathRewrite) {
      content = content.split(find).join(replace)
    }
  }

  fs.writeFileSync(destPath, content, 'utf8')
  console.log(`  ${srcFile} → docs/demo/${destFile}`)
  copied++
}

console.log(`\nDone. ${copied} file(s) copied to docs/demo/`)