#!/usr/bin/env node

import fs from 'fs'
import path from 'path'

/**
 * 生成代理任务文件 (Markdown + YAML frontmatter)
 * 支持可选输出路径：`node scripts/generateTask.js ./task.md`
 */

const task = {
  id: `task-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-001`,
  title: '财务自由知识库更新任务',
  steps: [
    { step: 1, description: '解释复利计算器的使用场景。' },
    { step: 2, description: '计算本金20000元，年利率6%，15年后的本息和。' },
  ],
}

function escapeYamlString(value) {
  return `"${String(value).replace(/"/g, '\\"')}"`
}

function buildYamlFrontmatter(task) {
  const lines = [
    '---',
    `id: ${escapeYamlString(task.id)}`,
    `title: ${escapeYamlString(task.title)}`,
    'steps:',
  ]

  task.steps.forEach((s) => {
    lines.push(`  - step: ${s.step}`)
    lines.push(`    description: ${escapeYamlString(s.description)}`)
  })

  lines.push('---')
  return lines.join('\n')
}

const yamlFrontmatter = buildYamlFrontmatter(task)
const markdownContent = `${yamlFrontmatter}\n\n# 任务说明\n\n请执行上述步骤并返回结果。\n`
const outputFile = process.argv[2]

if (outputFile) {
  const outputPath = path.resolve(process.cwd(), outputFile)
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, markdownContent, 'utf8')
  console.log(`已生成任务文件：${outputPath}`)
} else {
  console.log(markdownContent)
}
