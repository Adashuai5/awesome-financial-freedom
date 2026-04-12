#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const readFile = (filePath) =>
  fs.readFileSync(path.join(rootDir, filePath), 'utf8')

const headingMapping = {
  'Project Navigation': '项目导航',
  'What is this?': '这是什么？',
  'How to Use': '如何使用',
  'AI-Executable Workflows': 'AI 可执行工作流',
  'Knowledge Structure': '知识结构',
  'Target Audience': '目标用户',
  'Why This Exists': '为什么要做这个？',
}

function extractHeadings(content) {
  const lines = content.split(/\r?\n/)
  return lines
    .map((line) => {
      const match = line.match(/^(#{2,})\s*(.+)$/)
      if (!match) return null
      return { level: match[1].length, title: match[2].trim() }
    })
    .filter(Boolean)
}

function findMissingHeadings(englishHeadings, chineseHeadings) {
  const chineseTitles = chineseHeadings.map((h) => h.title)
  return englishHeadings
    .filter((h) => headingMapping[h.title])
    .filter((h) => !chineseTitles.includes(headingMapping[h.title]))
    .map((h) => `${h.title} -> ${headingMapping[h.title]}`)
}

function compareStructures(englishHeadings, chineseHeadings) {
  const errors = []
  if (englishHeadings.length !== chineseHeadings.length) {
    errors.push(
      `章节数量不一致：英文 ${englishHeadings.length}，中文 ${chineseHeadings.length}`,
    )
  }

  const missing = findMissingHeadings(englishHeadings, chineseHeadings)
  if (missing.length) {
    errors.push(`中文 README 缺少以下映射章节：\n${missing.join('\n')}`)
  }

  return errors
}

function run() {
  const english = readFile('README.md')
  const chinese = readFile('README.zh-CN.md')

  const englishHeadings = extractHeadings(english)
  const chineseHeadings = extractHeadings(chinese)

  const errors = compareStructures(englishHeadings, chineseHeadings)

  if (errors.length) {
    console.error('README 同步检查失败：')
    errors.forEach((error) => console.error(`- ${error}`))
    process.exitCode = 1
    return
  }

  console.log('README.md 与 README.zh-CN.md 结构同步检查通过。')
}

run()
