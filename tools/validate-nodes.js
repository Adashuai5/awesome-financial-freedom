import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const nodesRoot = path.resolve(__dirname, '../knowledge/nodes')

function fail(message) {
  console.error('Validation failed:', message)
  process.exitCode = 1
}

function validateNode(node, file) {
  const required = [
    'id',
    'title',
    'chapter',
    'tags',
    'question_patterns',
    'answer',
    'action_item',
    'related_nodes',
    'source',
  ]

  for (const key of required) {
    if (!(key in node)) {
      fail(`${file} missing required field: ${key}`)
      return false
    }
  }

  if (
    !Array.isArray(node.tags) ||
    node.tags.some((t) => typeof t !== 'string')
  ) {
    fail(`${file} tags must be an array of strings`)
    return false
  }

  if (
    !Array.isArray(node.question_patterns) ||
    node.question_patterns.some((t) => typeof t !== 'string')
  ) {
    fail(`${file} question_patterns must be an array of strings`)
    return false
  }

  const answer = node.answer
  if (typeof answer !== 'object' || answer === null) {
    fail(`${file} answer must be an object`)
    return false
  }

  const answerRequired = [
    'summary',
    'core_concept',
    'formula',
    'example',
    'limitations',
  ]
  for (const key of answerRequired) {
    if (!(key in answer)) {
      fail(`${file} answer missing required field: ${key}`)
      return false
    }
  }

  const example = answer.example
  const exampleRequired = ['scenario', 'calculation', 'explanation']
  for (const key of exampleRequired) {
    if (!(key in example)) {
      fail(`${file} answer.example missing required field: ${key}`)
      return false
    }
  }

  if (
    !Array.isArray(answer.limitations) ||
    answer.limitations.some((t) => typeof t !== 'string')
  ) {
    fail(`${file} answer.limitations must be an array of strings`)
    return false
  }

  if (
    !Array.isArray(node.related_nodes) ||
    node.related_nodes.some((t) => typeof t !== 'string')
  ) {
    fail(`${file} related_nodes must be an array of strings`)
    return false
  }

  if (typeof node.source !== 'object' || node.source === null) {
    fail(`${file} source must be an object`)
    return false
  }

  if (
    !Array.isArray(node.source.books) ||
    node.source.books.some((t) => typeof t !== 'string')
  ) {
    fail(`${file} source.books must be an array of strings`)
    return false
  }

  return true
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((dirent) => {
    const fullPath = path.join(dir, dirent.name)
    if (dirent.isDirectory()) return walk(fullPath)
    if (dirent.isFile() && fullPath.endsWith('.json')) return fullPath
    return []
  })
}

const files = walk(nodesRoot)
let passed = true

files.forEach((file) => {
  const node = JSON.parse(fs.readFileSync(file, 'utf-8'))
  if (!validateNode(node, path.relative(process.cwd(), file))) {
    passed = false
  }
})

if (!passed) {
  process.exitCode = 1
} else {
  console.log(`Validated ${files.length} knowledge nodes successfully.`)
}
