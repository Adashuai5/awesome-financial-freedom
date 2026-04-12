#!/usr/bin/env node

/**
 * 生成代理任务文件 (Markdown + YAML frontmatter)
 * 当前为演示版本，后续可扩展为根据变更节点动态生成步骤。
 */

const fs = require('fs')
const path = require('path')

// 静态演示任务
const task = {
  id: `task-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-001`,
  title: '财务自由知识库更新任务',
  steps: [
    { step: 1, description: '解释复利计算器的使用场景。' },
    { step: 2, description: '计算本金20000元，年利率6%，15年后的本息和。' },
  ],
}

// 生成 Markdown 内容
const yamlFrontmatter = `---
id: "${task.id}"
title: "${task.title}"
steps:
${task.steps.map((s) => `  - step: ${s.step}\n    description: "${s.description}"`).join('\n')}
---`

const markdownContent = `${yamlFrontmatter}

# 任务说明

请执行上述步骤并返回结果。
`

// 输出到 stdout，供 CI 重定向到文件
console.log(markdownContent)
