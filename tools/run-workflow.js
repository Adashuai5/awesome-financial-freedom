#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

function parseSimpleYaml(content) {
  const lines = content.split(/\r?\n/)
  const result = {}
  const stack = [result]
  const indentStack = [0]

  for (const rawLine of lines) {
    const line = rawLine.replace(/\t/g, '  ')
    if (!line.trim() || line.trim().startsWith('#')) continue

    const indent = line.match(/^ */)[0].length
    const trimmed = line.trim()

    while (indent < indentStack[indentStack.length - 1]) {
      stack.pop()
      indentStack.pop()
    }

    const parent = stack[stack.length - 1]

    if (trimmed.startsWith('- ')) {
      const item = trimmed.slice(2).trim()
      if (!Array.isArray(parent)) {
        throw new Error(
          'Invalid YAML structure: list item without array parent',
        )
      }
      if (item.includes(': ')) {
        const [key, value] = item.split(': ').map((s) => s.trim())
        const obj = { [key]: parseValue(value) }
        parent.push(obj)
        stack.push(obj)
        indentStack.push(indent + 2)
      } else {
        parent.push(parseValue(item))
      }
    } else if (trimmed.endsWith(':')) {
      const key = trimmed.slice(0, -1).trim()
      const obj = {}
      parent[key] = obj
      stack.push(obj)
      indentStack.push(indent + 2)
    } else if (trimmed.includes(': ')) {
      const [key, value] = trimmed.split(': ').map((s) => s.trim())
      if (Array.isArray(parent)) {
        parent.push({ [key]: parseValue(value) })
      } else {
        parent[key] = parseValue(value)
      }
    }
  }

  return result
}

function parseValue(value) {
  if (value === 'true') return true
  if (value === 'false') return false
  if (!isNaN(Number(value))) return Number(value)
  return value
}

function simulateStep(step, state) {
  console.log(`\n执行步骤：${step.id} - ${step.name}`)
  console.log(`类型：${step.type}`)

  switch (step.type) {
    case 'prompt':
      console.log(`使用模板：${step.prompt_id}`)
      state.output = state.output || {}
      state.output[step.id] = { simulated: `Prompt ${step.prompt_id} executed` }
      break
    case 'calculator':
      console.log(`调用计算器：${step.calculator_id}`)
      state.output = state.output || {}
      state.output[step.id] = {
        simulated: `Calculator ${step.calculator_id} result`,
      }
      break
    case 'api_call':
      console.log('模拟 API 调用')
      state.output = state.output || {}
      state.output[step.id] = { simulated: 'API call result' }
      break
    case 'condition':
      console.log('模拟条件判断')
      state.output = state.output || {}
      state.output[step.id] = { simulated: 'Condition evaluated' }
      break
    default:
      console.warn(`未知步骤类型：${step.type}`)
  }

  state.last_step = step.id
  return state
}

function runWorkflow(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const workflow = parseSimpleYaml(content)
  console.log(`\n加载工作流：${workflow.name}`)
  console.log(`描述：${workflow.description}`)

  const steps = workflow.steps || []
  const state = { output: {}, input: workflow.input || {} }

  for (const step of steps) {
    try {
      simulateStep(step, state)
    } catch (error) {
      console.error(`步骤失败：${step.id} - ${error.message}`)
      if (step.on_error === 'abort') {
        console.error('流程终止')
        break
      }
    }
  }

  console.log('\n工作流执行模拟完成。输出示例：')
  console.log(JSON.stringify(state.output, null, 2))
}

if (require.main === module) {
  const workflowFile = process.argv[2]
  if (!workflowFile) {
    console.error(
      '用法：node tools/run-workflow.js workflows/<workflow-file>.yaml',
    )
    process.exit(1)
  }
  const resolved = path.resolve(process.cwd(), workflowFile)
  runWorkflow(resolved)
}
